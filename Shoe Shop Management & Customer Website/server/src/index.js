const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { errorHandler } = require('./http');
const { attachUser } = require('./auth');

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (config.isProd) app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' }, contentSecurityPolicy: { directives: { 'default-src': ["'self'"], 'img-src': ["'self'", 'data:', 'https:'], 'style-src': ["'self'", "'unsafe-inline'"], 'script-src': ["'self'"] } } }));
  app.use(express.json({ limit: '200kb' }));

  app.use('/uploads', express.static(config.uploadDir, { maxAge: '7d', index: false, dotfiles: 'deny' }));

  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'private, no-store'); res.vary('Cookie'); next(); });
  app.use('/api', attachUser);
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api', require('./routes/public'));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // Serve the built SPA with history fallback so refreshing any URL keeps the user on that page.
  if (fs.existsSync(path.join(config.clientDist, 'index.html'))) {
    app.use(express.static(config.clientDist, { index: false, maxAge: '1h' }));
    app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(path.join(config.clientDist, 'index.html')) : next()));
  }
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  require('./seed').run()
    .then(() => createApp().listen(config.port, () => console.log(`Shoe shop server listening on http://localhost:${config.port}`)))
    .catch((err) => { console.error('FATAL: could not start (is DATABASE_URL correct and the database reachable?)\n', err.message); process.exit(1); });
}
module.exports = { createApp };
