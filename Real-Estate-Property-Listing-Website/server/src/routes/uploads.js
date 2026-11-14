import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { env } from '../config/env.js'
import { HttpError, wrap } from '../utils/asyncHandler.js'

export const uploadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
const upload = multer({
  storage: multer.diskStorage({ destination: uploadDir, filename: (_q, f, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXT[f.mimetype]}`) }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_q, f, cb) => (EXT[f.mimetype] ? cb(null, true) : cb(new HttpError(400, 'Only JPG, PNG or WebP images are allowed'))),
})

const r = Router()
r.post('/', upload.array('images', 8), wrap(async (req, res) => {
  if (!req.files?.length) throw new HttpError(400, 'No images received')
  const base = (env.publicUrl || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
  res.status(201).json({ urls: req.files.map((f) => `${base}/uploads/${f.filename}`) })
}))
export default r
