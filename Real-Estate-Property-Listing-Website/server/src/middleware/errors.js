export const notFound = (_req, res) => res.status(404).json({ message: 'Route not found' })

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500
  let message = err.message
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join('. ') }
  else if (err.name === 'CastError') { status = 404; message = 'Record not found' }
  else if (err.code === 11000) { status = 409; message = 'That value is already in use' }
  else if (err.name === 'ZodError') { status = 400; const i = err.issues[0]; message = i.code === 'invalid_type' ? `Please fill in ${i.path.join('.') || 'all required fields'}` : i.message }
  else if (err.name === 'MulterError') { status = 400; message = err.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5 MB or smaller' : err.message }
  if (status >= 500) { console.error(err); message = 'Something went wrong on our side. Please try again.' }
  res.status(status).json({ message })
}
