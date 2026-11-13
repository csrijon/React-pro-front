/** Returns the URL only if it is plain http(s); anything else (javascript:, data:, ...) becomes undefined. */
export function safeHttpUrl(value) {
  try {
    const u = new URL(String(value))
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : undefined
  } catch {
    return undefined
  }
}
