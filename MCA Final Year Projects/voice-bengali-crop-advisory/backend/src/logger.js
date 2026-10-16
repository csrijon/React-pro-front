// Minimal request logger. We only log method, path, status and duration —
// never the question text or any personal data.
export function requestLogger() {
  return (req, res, next) => {
    const start = process.hrtime.bigint()
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`)
    })
    next()
  }
}
