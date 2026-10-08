// Sets (or creates) the admin login in the database that DATABASE_URL points to.
// Usage:  ADMIN_USERNAME=9876543210 ADMIN_PASSWORD='a-strong-password' npm run set-admin
// Credentials come from the environment only, so nothing secret is ever written to the code or to git.
const bcrypt = require('bcryptjs');
const { db, init, close } = require('./db');

async function main() {
  const username = (process.env.ADMIN_USERNAME || '').trim();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!/^[\w.@-]{3,40}$/.test(username)) throw new Error('ADMIN_USERNAME must be 3-40 characters: letters, numbers and . _ - @');
  if (password.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters');

  await init();
  const hash = bcrypt.hashSync(password, 12);
  await db.transaction(async () => {
    const clash = await db.get("SELECT id, role FROM users WHERE username = ? AND role <> 'ADMIN'", username);
    if (clash) throw new Error(`"${username}" is already used by a customer account. Choose a different username.`);
    const admin = await db.get("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY id LIMIT 1");
    if (admin) {
      await db.run('UPDATE users SET username = ?, password_hash = ? WHERE id = ?', username, hash, admin.id);
      console.log(`Updated the admin login. Username is now "${username}".`);
    } else {
      await db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'ADMIN')", username, hash);
      console.log(`Created the admin login "${username}".`);
    }
  });
}

main()
  .catch((err) => { console.error('Failed:', err.message); process.exitCode = 1; })
  .finally(() => close());
