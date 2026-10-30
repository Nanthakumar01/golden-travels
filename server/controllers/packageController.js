import { Op } from 'sequelize'
import { Package } from '../models/index.js'
import { packagesData } from '../../client/src/data/packagesData.js'

const getBaseSiteUrl = () => {
	if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
	if (process.env.NODE_ENV === 'production') return 'https://goldentravels.in'
	return 'http://localhost:3000'
}

const buildDefaultGallery = (pkg) => {
	const staticMatch = packagesData.find(p => p.slug === pkg.slug)
	if (staticMatch && Array.isArray(staticMatch.gallery) && staticMatch.gallery.length > 0) {
		return staticMatch.gallery
	}
	return [
		{ src: pkg.image || '/assets/images/tour/1.jpg', title: pkg.shortTitle || pkg.title || 'Tour Highlight' },
		{ src: '/assets/images/tour/2.jpg', title: 'Luxury Resort & Scenic Views' },
		{ src: '/assets/images/tour/3.jpg', title: 'City Highlights & Culture' },
		{ src: '/assets/images/tour/4.jpg', title: 'Panoramic Excursions' },
		{ src: '/assets/images/tour/5.jpg', title: 'Waterfront & Sunsets' },
		{ src: '/assets/images/tour/6.jpg', title: 'Signature Dining & Stays' }
	]
}

let packageDataSynced = false
const ensurePackageGalleriesSeeded = async () => {
	if (packageDataSynced) return
	try {
		const allPackages = await Package.findAll()
		for (const pkg of allPackages) {
			let needsUpdate = false
			const updateFields = {}

			const staticMatch = packagesData.find(p => p.slug === pkg.slug || String(p.id) === String(pkg.id))

			// Check gallery
			const currentGallery = pkg.gallery
			if (!Array.isArray(currentGallery) || currentGallery.length === 0) {
				updateFields.gallery = buildDefaultGallery(pkg)
				needsUpdate = true
			}

			// Check keyInclusions
			const currentKeyInc = pkg.keyInclusions
			if ((!Array.isArray(currentKeyInc) || currentKeyInc.length === 0) && staticMatch && Array.isArray(staticMatch.keyInclusions) && staticMatch.keyInclusions.length > 0) {
				updateFields.keyInclusions = staticMatch.keyInclusions
				needsUpdate = true
			}

			// Check itinerary schedule
			if (staticMatch && Array.isArray(staticMatch.itinerary) && staticMatch.itinerary.length > 0) {
				const currentItin = Array.isArray(pkg.itinerary) ? pkg.itinerary : []
				const hasScheduleInStatic = staticMatch.itinerary.some(item => Array.isArray(item.schedule) && item.schedule.length > 0)
				const hasScheduleInDb = currentItin.some(item => Array.isArray(item.schedule) && item.schedule.length > 0)

				if (hasScheduleInStatic && !hasScheduleInDb) {
					const mergedItin = currentItin.map((dayItem, dIdx) => {
						const staticDay = staticMatch.itinerary[dIdx]
						return {
							...dayItem,
							schedule: (staticDay && Array.isArray(staticDay.schedule) && staticDay.schedule.length > 0)
								? staticDay.schedule
								: (Array.isArray(dayItem.schedule) ? dayItem.schedule : [])
						}
					})
					updateFields.itinerary = mergedItin
					needsUpdate = true
				}
			}

			// Standardize duration if days and nights exist or if duration has typo
			if (pkg.days && pkg.nights !== undefined) {
				const standardDuration = `${pkg.days} Day${pkg.days > 1 ? 's' : ''} | ${pkg.nights} Night${pkg.nights > 1 ? 's' : ''}`
				if (!pkg.duration || pkg.duration !== standardDuration || pkg.duration.includes('..')) {
					updateFields.duration = standardDuration
					needsUpdate = true
				}
			}

			// Check badge: sync from static data if missing, or populate for custom packages
			if ((!pkg.badge || !pkg.badge.trim()) && staticMatch && staticMatch.badge) {
				updateFields.badge = staticMatch.badge
				needsUpdate = true
			} else if ((!pkg.badge || !pkg.badge.trim()) && !staticMatch) {
				updateFields.badge = 'Adventure & Island Gala'
				needsUpdate = true
			}

			if (needsUpdate) {
				await pkg.update(updateFields)
			}
		}
		packageDataSynced = true
	} catch (err) {
		console.error('Error syncing package data/galleries:', err)
	}
}

export const getPackages = async (req, res) => {
	try {
		await ensurePackageGalleriesSeeded()
		const { category, type, persona, search, activeOnly = 'true' } = req.query
		const where = {}

		if (activeOnly === 'true') {
			where.isActive = true
		}

		if (type) {
			where.type = type.toUpperCase()
		}

		if (category && category !== 'all') {
			where.category = category
		}

		if (search) {
			where[Op.or] = [
				{ title: { [Op.like]: `%${search}%` } },
				{ shortTitle: { [Op.like]: `%${search}%` } },
				{ destination: { [Op.like]: `%${search}%` } },
				{ region: { [Op.like]: `%${search}%` } },
				{ cities: { [Op.like]: `%${search}%` } }
			]
		}

		const packages = await Package.findAll({
			where,
			order: [['id', 'ASC']]
		})

		// Optional filter in-memory for persona since it's a JSON array
		let result = packages
		if (persona) {
			result = packages.filter(p => {
				const personas = p.personas || []
				return personas.includes(persona.toLowerCase())
			})
		}

		res.json({
			success: true,
			count: result.length,
			data: result
		})
	} catch (error) {
		console.error('Error fetching packages:', error)
		res.status(500).json({ success: false, message: 'Server error fetching packages', error: error.message })
	}
}

export const getPackageBySlugOrId = async (req, res) => {
	try {
		await ensurePackageGalleriesSeeded()
		const { idOrSlug } = req.params
		let pkg

		if (!isNaN(idOrSlug)) {
			pkg = await Package.findByPk(idOrSlug)
		}

		if (!pkg) {
			pkg = await Package.findOne({
				where: { slug: idOrSlug }
			})
		}

		if (!pkg) {
			return res.status(404).json({ success: false, message: 'Tour package not found' })
		}

		res.json({
			success: true,
			data: pkg
		})
	} catch (error) {
		console.error('Error fetching package:', error)
		res.status(500).json({ success: false, message: 'Server error fetching package', error: error.message })
	}
}

export const createPackage = async (req, res) => {
	try {
		const data = { ...req.body }

		// Generate slug if not provided
		if (!data.slug && data.title) {
			data.slug = data.title
				.toLowerCase()
				.replace(/&/g, '-and-')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '')
		}

		// Ensure uniqueness with ending number: -2, -3, etc.
		if (data.slug) {
			let cleanBase = data.slug.replace(/-\d+$/, '')
			let candidate = data.slug
			let counter = 2
			while (await Package.findOne({ where: { slug: candidate } })) {
				candidate = `${cleanBase}-${counter}`
				counter++
			}
			data.slug = candidate
		}

		// Set canonicalUrl automatically if not provided or standard tour link
		if (!data.canonicalUrl || data.canonicalUrl.startsWith('https://goldentravels.in/tour/') || data.canonicalUrl.startsWith('http://localhost')) {
			data.canonicalUrl = `${getBaseSiteUrl()}/tour/${data.slug}`
		}

		// Auto-compute duration from days and nights
		if (data.days && data.nights !== undefined) {
			const d = parseInt(data.days) || 1
			const n = parseInt(data.nights) || 0
			data.duration = `${d} Day${d > 1 ? 's' : ''} | ${n} Night${n > 1 ? 's' : ''}`
		}

		const newPackage = await Package.create(data)

		res.status(201).json({
			success: true,
			message: 'Tour package created successfully',
			data: newPackage
		})
	} catch (error) {
		console.error('Error creating package:', error)
		res.status(500).json({ success: false, message: 'Server error creating package', error: error.message })
	}
}

export const updatePackage = async (req, res) => {
	try {
		const { id } = req.params
		const pkg = await Package.findByPk(id)

		if (!pkg) {
			return res.status(404).json({ success: false, message: 'Tour package not found' })
		}

		const data = { ...req.body }

		// Generate slug if empty but title provided
		if (!data.slug && data.title) {
			data.slug = data.title
				.toLowerCase()
				.replace(/&/g, '-and-')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '')
		}

		// Ensure uniqueness with ending number: -2, -3, etc.
		if (data.slug) {
			let cleanBase = data.slug.replace(/-\d+$/, '')
			let candidate = data.slug
			let counter = 2
			while (await Package.findOne({ where: { slug: candidate, id: { [Op.ne]: id } } })) {
				candidate = `${cleanBase}-${counter}`
				counter++
			}
			data.slug = candidate
		}

		// Set canonicalUrl automatically if not provided or standard tour link
		if (!data.canonicalUrl || data.canonicalUrl.startsWith('https://goldentravels.in/tour/') || data.canonicalUrl.startsWith('http://localhost')) {
			data.canonicalUrl = `${getBaseSiteUrl()}/tour/${data.slug}`
		}

		// Auto-compute duration from days and nights
		if (data.days && data.nights !== undefined) {
			const d = parseInt(data.days) || 1
			const n = parseInt(data.nights) || 0
			data.duration = `${d} Day${d > 1 ? 's' : ''} | ${n} Night${n > 1 ? 's' : ''}`
		}

		await pkg.update(data)

		res.json({
			success: true,
			message: 'Tour package updated successfully',
			data: pkg
		})
	} catch (error) {
		console.error('Error updating package:', error)
		res.status(500).json({ success: false, message: 'Server error updating package', error: error.message })
	}
}

export const deletePackage = async (req, res) => {
	try {
		const { id } = req.params
		const pkg = await Package.findByPk(id)

		if (!pkg) {
			return res.status(404).json({ success: false, message: 'Tour package not found' })
		}

		await pkg.destroy()

		res.json({
			success: true,
			message: 'Tour package deleted successfully'
		})
	} catch (error) {
		console.error('Error deleting package:', error)
		res.status(500).json({ success: false, message: 'Server error deleting package', error: error.message })
	}
}
