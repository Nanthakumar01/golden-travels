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

		// If it's a standard image (jpg, png, webp, etc.), compress & convert to webp
		if (isImage && !isSvgOrGif) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
			finalFilename = 'tour-' + uniqueSuffix + '.webp'
			const finalFilePath = path.join(uploadDir, finalFilename)

			try {
				await sharp(originalFilePath)
					.rotate() // Automatically orient based on EXIF
					.resize({
						width: 1920,
						height: 1920,
						fit: 'inside',
						withoutEnlargement: true
					})
					.webp({ quality: 82, effort: 4 })
					.toFile(finalFilePath)

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

		res.json({
			success: true,
			message: 'Image uploaded and optimized successfully',
			url: fileUrl,
			relativeUrl: `/uploads/${finalFilename}`,
			filename: finalFilename
		})
	} catch (error) {
		res.status(500).json({ success: false, message: 'Error uploading image', error: error.message })
	}
})

export default router
