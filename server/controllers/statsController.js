import { Op } from 'sequelize'
import { Package, Inquiry, Blog, Slide, Banner } from '../models/index.js'

export const getDashboardStats = async (req, res) => {
	try {
		const totalPackages = await Package.count()
		const domesticPackages = await Package.count({ where: { type: 'DOMESTIC' } })
		const internationalPackages = await Package.count({ where: { type: 'INTERNATIONAL' } })
		const activePackages = await Package.count({ where: { isActive: true } })

		const totalInquiries = await Inquiry.count()
		const newInquiries = await Inquiry.count({ where: { status: 'new' } })
		const contactedInquiries = await Inquiry.count({ where: { status: 'contacted' } })
		const convertedInquiries = await Inquiry.count({ where: { status: 'converted' } })

		// Today's inquiries
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const todayInquiries = await Inquiry.count({
			where: {
				createdAt: { [Op.gte]: today }
			}
		})

		const recentInquiries = await Inquiry.findAll({
			limit: 5,
			order: [['createdAt', 'DESC']]
		})

		// Blogs stats
		const totalBlogs = await Blog.count().catch(() => 0)
		const activeBlogs = await Blog.count({ where: { isActive: true } }).catch(() => 0)

		// Sliders & Banners stats
		const totalSlides = await Slide.count().catch(() => 0)
		const activeSlides = await Slide.count({ where: { isActive: true } }).catch(() => 0)
		const totalBanners = await Banner.count().catch(() => 0)

		res.json({
			success: true,
			data: {
				packages: {
					total: totalPackages,
					domestic: domesticPackages,
					international: internationalPackages,
					active: activePackages
				},
				inquiries: {
					total: totalInquiries,
					new: newInquiries,
					contacted: contactedInquiries,
					converted: convertedInquiries,
					today: todayInquiries
				},
				blogs: {
					total: totalBlogs,
					active: activeBlogs
				},
				sliders: {
					totalSlides,
					activeSlides,
					totalBanners,
					total: totalSlides + totalBanners
				},
				recentInquiries
			}
		})
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		res.status(500).json({ success: false, message: 'Server error fetching stats', error: error.message })
	}
}
