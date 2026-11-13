import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { protect } from '../middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Ensure upload directory exists in server/uploads
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

// Local dev optional public mirror path
const clientPublicUploadsDir = path.join(__dirname, '..', '..', 'client', 'public', 'uploads')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, 'raw-' + uniqueSuffix + ext)
	}
})

const fileFilter = (req, file, cb) => {
	const allowedExt = /\.(jpeg|jpg|png|webp|svg|gif|mp4|webm|ogg|mov)$/i
	const allowedMime = /^(image\/(jpeg|jpg|png|webp|svg\+xml|gif)|video\/(mp4|webm|ogg|quicktime))$/i
	const extOk = allowedExt.test(path.extname(file.originalname).toLowerCase())
	const mimeOk = allowedMime.test(file.mimetype)

	if (extOk || mimeOk) {
		return cb(null, true)
	}
	cb(new Error('Only image (jpg, png, webp, svg) or video (mp4, webm, mov, ogg) files are allowed!'))
}

const upload = multer({
	storage,
	limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video/image
	fileFilter
})

router.post('/', protect, upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'Please upload an image or video file' })
		}

		let finalFilename = req.file.filename
		const originalFilePath = req.file.path
		const isImage = req.file.mimetype.startsWith('image/')
		const isSvgOrGif = req.file.mimetype === 'image/svg+xml' || req.file.mimetype === 'image/gif'

		let base64Url = null

		// If it's a standard image (jpg, png, webp, etc.), compress & convert to webp + base64
		if (isImage && !isSvgOrGif) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
			finalFilename = 'tour-' + uniqueSuffix + '.webp'
			const finalFilePath = path.join(uploadDir, finalFilename)

			try {
				const webpBuffer = await sharp(originalFilePath)
					.rotate() // Automatically orient based on EXIF
					.resize({
						width: 1200,
						height: 1200,
						fit: 'inside',
						withoutEnlargement: true
					})
					.webp({ quality: 80, effort: 4 })
					.toBuffer()

				// Write buffer to local disk for local fallback
				fs.writeFileSync(finalFilePath, webpBuffer)

				// Convert to clean Data URI for database permanence (no more 404 on Render sleep/restarts!)
				base64Url = `data:image/webp;base64,${webpBuffer.toString('base64')}`

				// Remove the original uncompressed file
				try {
					fs.unlinkSync(originalFilePath)
				} catch (_) {}
			} catch (compressionErr) {
				console.error('Sharp compression failed, keeping original file:', compressionErr)
				finalFilename = req.file.filename
			}
		} else if (!isImage) {
			// Video or non-converted file: rename from raw- to tour-
			const newFilename = req.file.filename.replace(/^raw-/, 'tour-')
			const newFilePath = path.join(uploadDir, newFilename)
			try {
				fs.renameSync(originalFilePath, newFilePath)
				finalFilename = newFilename
			} catch (_) {
				finalFilename = req.file.filename
			}
		}

		// Optional: if client public uploads directory exists locally, mirror for convenience
		try {
			if (fs.existsSync(clientPublicUploadsDir)) {
				const sourcePath = path.join(uploadDir, finalFilename)
				const destPath = path.join(clientPublicUploadsDir, finalFilename)
				fs.copyFileSync(sourcePath, destPath)
			}
		} catch (_) {}

		const host = req.get('host') || `localhost:${process.env.PORT || 5000}`
		const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http'
		const fileUrl = `${protocol}://${host}/uploads/${finalFilename}`

		// Use base64Url when available so it permanently saves in TiDB without ephemeral 404s
		const persistentUrl = base64Url || fileUrl

		res.json({
			success: true,
			message: 'Image uploaded and optimized successfully',
			url: persistentUrl,
			relativeUrl: persistentUrl,
			filename: finalFilename
		})
	} catch (error) {
		res.status(500).json({ success: false, message: 'Error uploading image', error: error.message })
	}
})

export default router
