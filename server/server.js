import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { testConnection } from './config/db.js'
import { syncDb, Package, Blog, PageMeta } from './models/index.js'
import { seedDatabase } from './seed/seed.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import packageRoutes from './routes/packageRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import contentRoutes from './routes/contentRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Enable trust proxy for production behind Nginx/Apache/Cloudflare/cPanel
app.set('trust proxy', 1)

// Bulletproof Production CORS
app.use(cors({
	origin: true, // Dynamically allow incoming origin
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma']
}))

// Additional manual CORS headers to guarantee Apache / reverse-proxy never strips CORS
app.use((req, res, next) => {
	const origin = req.headers.origin
	if (origin) {
		res.header('Access-Control-Allow-Origin', origin)
		res.header('Access-Control-Allow-Credentials', 'true')
		res.header('Vary', 'Origin')
	} else {
		res.header('Access-Control-Allow-Origin', '*')
	}
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma')
	res.header('Access-Control-Max-Age', '86400')
	
	if (req.method === 'OPTIONS') {
		return res.sendStatus(204)
	}
	next()
})

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// Static file serving for uploads with cross-origin headers
const uploadDir = path.join(__dirname, 'uploads')
app.use('/uploads', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
	res.header('Cross-Origin-Resource-Policy', 'cross-origin')
	next()
}, express.static(uploadDir))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/content', contentRoutes)

// Health Check
app.get('/api/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date(),
		database: process.env.DB_NAME || 'golden_travels',
		service: 'Golden Travels Backend API'
	})
})

// Dynamic Robots.txt for Search Engines
const handleRobotsTxt = (req, res) => {
	const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
	res.type('text/plain')
	res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`)
}
app.get('/robots.txt', handleRobotsTxt)
app.get('/api/robots.txt', handleRobotsTxt)

// Dynamic XML Sitemap for Googlebot & Bingbot
const handleSitemapXml = async (req, res) => {
	try {
		const baseUrl = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
		const today = new Date().toISOString().split('T')[0]

		// 1. Static Pages from PageMeta
		let staticUrls = []
		try {
			const pageMetas = await PageMeta.findAll({ attributes: ['route', 'updatedAt'] })
			staticUrls = pageMetas.map(p => ({
				loc: `${baseUrl}${p.route ? (p.route.startsWith('/') ? p.route : '/' + p.route) : '/'}`,
				lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today,
				changefreq: p.route === '/' ? 'daily' : 'weekly',
				priority: p.route === '/' ? '1.0' : '0.8'
			}))
		} catch (err) {
			console.warn('PageMeta sitemap fetch fallback:', err.message)
		}

		if (staticUrls.length === 0) {
			const defaults = ['/', '/tour', '/destinations', '/blog', '/contact-us', '/about-us']
			staticUrls = defaults.map(route => ({
				loc: `${baseUrl}${route}`,
				lastmod: today,
				changefreq: route === '/' ? 'daily' : 'weekly',
				priority: route === '/' ? '1.0' : '0.8'
			}))
		}

		// 2. Active Tour Packages
		let packageUrls = []
		try {
			const packages = await Package.findAll({
				where: { isActive: true },
				attributes: ['slug', 'id', 'updatedAt']
			})
			packageUrls = packages.map(pkg => ({
				loc: `${baseUrl}/tour/${pkg.slug || pkg.id}`,
				lastmod: pkg.updatedAt ? new Date(pkg.updatedAt).toISOString().split('T')[0] : today,
				changefreq: 'weekly',
				priority: '0.9'
			}))
		} catch (err) {
			console.warn('Package sitemap fetch fallback:', err.message)
		}

		// 3. Active Blogs
		let blogUrls = []
		try {
			const blogs = await Blog.findAll({
				where: { isActive: true },
				attributes: ['slug', 'id', 'updatedAt']
			})
			blogUrls = blogs.map(blog => ({
				loc: `${baseUrl}/blog/${blog.slug || blog.id}`,
				lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : today,
				changefreq: 'monthly',
				priority: '0.7'
			}))
		} catch (err) {
			console.warn('Blog sitemap fetch fallback:', err.message)
		}

		const allUrls = [...staticUrls, ...packageUrls, ...blogUrls]

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

		res.header('Content-Type', 'application/xml')
		res.send(xml)
	} catch (error) {
		console.error('Error generating sitemap:', error)
		res.status(500).send('Error generating sitemap')
	}
}
app.get('/sitemap.xml', handleSitemapXml)
app.get('/api/sitemap.xml', handleSitemapXml)

// Error handler
app.use((err, req, res, next) => {
	console.error('Unhandled server error:', err)
	res.status(500).json({
		success: false,
		message: err.message || 'Internal server error'
	})
})

// Start Server & Connect to MySQL
const startServer = async () => {
	const isConnected = await testConnection()
	if (isConnected) {
		await syncDb()
		// Auto seed on initial startup
		await seedDatabase()
	}

	app.listen(PORT, () => {
		console.log(`🚀 Golden Travels Server running at: http://localhost:${PORT}`)
		console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`)
	})
}

startServer()
