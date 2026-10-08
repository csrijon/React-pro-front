const jwt = require('jsonwebtoken');
const config = require('./config');
const { db, wholesaleEnabled } = require('./db');
const { HttpError } = require('./http');

function signSession(res, userId) {
  const token = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: `${config.sessionDays}d` });
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProd,
    maxAge: config.sessionDays * 86400 * 1000,
    path: '/',
  });
}
function clearSession(res) {
  res.clearCookie(config.cookieName, { httpOnly: true, sameSite: 'lax', secure: config.isProd, path: '/' });
}

function readCookie(req, name) {
  const h = req.headers.cookie;
  if (!h) return null;
  for (const part of h.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

const loadUser = (id) => db.get(`
  SELECT u.id, u.username, u.role,
         c.id AS customer_id, c.shop_name, c.owner_name, c.mobile, c.email, c.address, c.status, c.created_at AS registered_at
  FROM users u LEFT JOIN customers c ON c.user_id = u.id WHERE u.id = ?`, id);

// Loads the current user fresh from the DB on every request, so status changes
// (suspend/reject) take effect immediately instead of when a token expires.
async function attachUser(req, _res, next) {
  req.user = null;
  const token = readCookie(req, config.cookieName);
  if (token) {
    try {
      const { sub } = jwt.verify(token, config.jwtSecret);
      req.user = (await loadUser(sub)) || null;
    } catch (err) {
      if (err.name !== 'JsonWebTokenError' && err.name !== 'TokenExpiredError' && err.name !== 'NotBeforeError') return next(err); // DB problem
      /* invalid/expired token => anonymous */
    }
  }
  next();
}

function requireAuth(req, _res, next) {
  if (!req.user) throw new HttpError(401, 'Please log in to continue');
  next();
}
function requireAdmin(req, _res, next) {
  if (!req.user) throw new HttpError(401, 'Please log in to continue');
  if (req.user.role !== 'ADMIN') throw new HttpError(403, 'Admin access required');
  next();
}
function requireCustomer(req, _res, next) {
  if (!req.user) throw new HttpError(401, 'Please log in to continue');
  if (req.user.role !== 'CUSTOMER') throw new HttpError(403, 'Customer access required');
  next();
}

// The single source of truth for wholesale price visibility.
async function canSeeWholesale(req) {
  const u = req.user;
  if (!u) return false;
  if (u.role === 'ADMIN') return true;
  return u.role === 'CUSTOMER' && u.status === 'APPROVED' && (await wholesaleEnabled());
}

async function publicUser(u) {
  if (!u) return null;
  if (u.role === 'ADMIN') return { id: u.id, role: 'ADMIN', username: u.username };
  return {
    id: u.id,
    role: 'CUSTOMER',
    customerId: u.customer_id,
    shopName: u.shop_name,
    ownerName: u.owner_name,
    mobile: u.mobile,
    email: u.email,
    address: u.address,
    status: u.status,
    registeredAt: u.registered_at,
    wholesaleAccess: u.status === 'APPROVED' && (await wholesaleEnabled()),
  };
}

module.exports = { signSession, clearSession, attachUser, requireAuth, requireAdmin, requireCustomer, canSeeWholesale, publicUser, loadUser };
