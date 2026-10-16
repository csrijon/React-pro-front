const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { db } = require('../db');
const { HttpError, parse, z } = require('../http');
const { signSession, clearSession, requireAuth, requireCustomer, publicUser, loadUser } = require('../auth');

const router = express.Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

const mobile = z.string().trim().regex(/^\+?\d{10,13}$/, 'Enter a valid mobile number (10 digits)');
const password = z.string().min(8, 'Password must be at least 8 characters').max(100);
const optionalEmail = z.preprocess((v) => (v === '' ? undefined : v), z.string().trim().email('Enter a valid email').max(120).optional());
const optionalText = (max) => z.preprocess((v) => (v === '' ? undefined : v), z.string().trim().max(max).optional());

// Registration collects basic details (name, address, mobile, password) and an account type.
// "CUSTOMER" is a plain retail shopper; "SHOP_OWNER" additionally provides shop details and is
// the only type eligible for wholesale access. The role is validated here, never trusted from
// the browser, so a client cannot grant itself shop-owner privileges by editing a hidden field.
const registerSchema = z.object({
  accountType: z.enum(['CUSTOMER', 'SHOP_OWNER'], { error: 'Choose an account type' }).default('SHOP_OWNER'),
  name: z.string().trim().min(2, 'Your name is required').max(120),
  mobile,
  password,
  email: optionalEmail,
  address: optionalText(400),
  shopName: z.string().trim().max(120).optional(),
  shopAddress: z.string().trim().max(400).optional(),
}).superRefine((v, ctx) => {
  if (v.accountType === 'SHOP_OWNER' && (v.shopName || '').trim().length < 2) {
    ctx.addIssue({ code: 'custom', path: ['shopName'], message: 'Shop name is required' });
  }
});

router.post('/register', limiter, async (req, res) => {
  const d = parse(registerSchema, req.body);
  const mob = d.mobile.replace(/^\+?91(?=\d{10}$)/, '');
  if (await db.get('SELECT 1 FROM users WHERE username = ?', mob)) {
    throw new HttpError(409, 'An account with this mobile number already exists. Please log in.');
  }
  const hash = bcrypt.hashSync(d.password, 12);
  const isShop = d.accountType === 'SHOP_OWNER';
  const shopName = isShop ? d.shopName.trim() : null;
  const address = isShop ? (d.shopAddress || d.address || null) : (d.address || null);
  const userId = await db.transaction(async () => {
    const uid = await db.insert("INSERT INTO users (username, password_hash, role) VALUES (?,?, 'CUSTOMER')", mob, hash);
    const cid = await db.insert('INSERT INTO customers (user_id, account_type, shop_name, owner_name, mobile, email, address) VALUES (?,?,?,?,?,?,?)',
      uid, d.accountType, shopName, d.name, mob, d.email ?? null, address);
    await db.run("INSERT INTO customer_approvals (customer_id, status, note) VALUES (?, 'PENDING', ?)", cid, isShop ? 'Registered as shop owner' : 'Registered as customer');
    return uid;
  });
  signSession(res, userId);
  res.status(201).json({ user: await publicUser(await loadUser(userId)) });
});

const loginSchema = z.object({ username: z.string().trim().min(1, 'Enter your mobile number or username').max(100), password: z.string().min(1, 'Enter your password').max(100) });
// Constant-time-ish: always run a bcrypt compare even when the user does not exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

router.post('/login', limiter, async (req, res) => {
  const d = parse(loginSchema, req.body);
  const ident = d.username.replace(/^\+?91(?=\d{10}$)/, '');
  const u = await db.get('SELECT id, password_hash FROM users WHERE username = ?', ident);
  const ok = bcrypt.compareSync(d.password, u ? u.password_hash : DUMMY_HASH);
  if (!u || !ok) throw new HttpError(401, 'Incorrect mobile number/username or password');
  signSession(res, u.id);
  res.json({ user: await publicUser(await loadUser(u.id)) });
});

router.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

router.get('/me', async (req, res) => res.json({ user: await publicUser(req.user) }));

const profileSchema = z.object({
  shopName: z.string().trim().max(120).optional(),
  ownerName: z.string().trim().min(2, 'Your name is required').max(120),
  email: optionalEmail,
  address: optionalText(400),
});
router.put('/profile', requireCustomer, async (req, res) => {
  const d = parse(profileSchema, req.body);
  const isShop = req.user.account_type === 'SHOP_OWNER';
  if (isShop && (d.shopName || '').trim().length < 2) throw new HttpError(400, 'Shop name is required', { shopName: 'Shop name is required' });
  await db.run('UPDATE customers SET shop_name=?, owner_name=?, email=?, address=? WHERE id=?',
    isShop ? d.shopName.trim() : null, d.ownerName, d.email ?? null, d.address ?? null, req.user.customer_id);
  res.json({ user: await publicUser(await loadUser(req.user.id)) });
});

const passwordSchema = z.object({ currentPassword: z.string().min(1, 'Enter your current password'), newPassword: password });
router.put('/password', requireAuth, limiter, async (req, res) => {
  const d = parse(passwordSchema, req.body);
  const row = await db.get('SELECT password_hash FROM users WHERE id = ?', req.user.id);
  if (!bcrypt.compareSync(d.currentPassword, row.password_hash)) throw new HttpError(400, 'Current password is incorrect');
  await db.run('UPDATE users SET password_hash = ? WHERE id = ?', bcrypt.hashSync(d.newPassword, 12), req.user.id);
  res.json({ ok: true });
});

module.exports = router;
