import mongoose from 'mongoose'
// Every document serialises with `id` (string) instead of `_id`/`__v`, and never leaks secrets.
mongoose.plugin((schema) => {
  schema.set('toJSON', { virtuals: true, versionKey: false, transform: (_d, r) => { r.id = String(r._id); delete r._id; delete r.passwordHash; delete r.resetTokenHash; delete r.resetExpires; return r } })
})
