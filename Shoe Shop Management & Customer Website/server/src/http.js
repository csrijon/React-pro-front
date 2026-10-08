const { z } = require('zod');

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Parse + validate; throws a 400 with per-field messages.
function parse(schema, data) {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  const fields = {};
  for (const issue of r.error.issues) {
    const key = issue.path.join('.') || '_';
    if (!fields[key]) fields[key] = issue.message;
  }
  throw new HttpError(400, Object.values(fields)[0] || 'Invalid input', fields);
}

function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, fields: err.details });
  }
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' });
  if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large (max 5 MB)' });
  if (err && err.name === 'MulterError') return res.status(400).json({ error: err.message });
  // PostgreSQL integrity errors: 23505 unique, 23503 foreign key, 23502/23514 not-null / check.
  if (err && err.code === '23505') return res.status(409).json({ error: 'A record with the same unique value already exists' });
  if (err && err.code === '23503') return res.status(409).json({ error: 'This record is still in use by other records' });
  if (err && (err.code === '23502' || err.code === '23514')) return res.status(400).json({ error: 'Database constraint failed' });
  console.error('[error]', req.method, req.originalUrl, err);
  res.status(500).json({ error: 'Something went wrong on the server' });
}

const id = z.coerce.number().int().positive();
module.exports = { HttpError, parse, errorHandler, z, id };
