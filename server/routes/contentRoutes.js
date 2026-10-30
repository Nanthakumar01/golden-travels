import express from 'express'
import {
	getAllContent,
	getSlides,
	createSlide,
	updateSlide,
	deleteSlide,
	getBanners,
	updateBanner,
	getPersonas,
	createPersona,
	updatePersona,
	deletePersona,
	getDestinations,
	createDestination,
	updateDestination,
	deleteDestination,
	getFeatures,
	createFeature,
	updateFeature,
	deleteFeature,
	getTrustStats,
	createTrustStat,
	updateTrustStat,
	deleteTrustStat,
	getTestimonials,
	createTestimonial,
	updateTestimonial,
	deleteTestimonial,
	getFaqs,
	createFaq,
	updateFaq,
	deleteFaq,
	getSections,
	updateSection,
	getBlogs,
	getBlogBySlug,
	createBlog,
	updateBlog,
	deleteBlog,
	getDestinationRegions,
	getDestinationGroups,
	createDestinationRegion,
	updateDestinationRegion,
	deleteDestinationRegion,
	addCountryToRegion,
	deleteCountryFromRegion,
	getPageMetaList,
	getPageMetaByKey,
	updatePageMeta,
	getPartners,
	createPartner,
	updatePartner,
	deletePartner
} from '../controllers/contentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public read routes
router.get('/all', getAllContent)
router.get('/slides', getSlides)
router.get('/banners', getBanners)
router.get('/personas', getPersonas)
router.get('/destinations', getDestinations)
router.get('/destination-regions', getDestinationRegions)
router.get('/destination-groups', getDestinationGroups)
router.get('/features', getFeatures)
router.get('/trust-stats', getTrustStats)
router.get('/testimonials', getTestimonials)
router.get('/faqs', getFaqs)
router.get('/sections', getSections)
router.get('/blogs', getBlogs)
router.get('/blogs/:slug', getBlogBySlug)

// Protected Admin write routes
router.post('/slides', protect, createSlide)
router.put('/slides/:id', protect, updateSlide)
router.delete('/slides/:id', protect, deleteSlide)

router.put('/banners/:id', protect, updateBanner)

router.post('/personas', protect, createPersona)
router.put('/personas/:id', protect, updatePersona)
router.delete('/personas/:id', protect, deletePersona)

router.post('/destinations', protect, createDestination)
router.put('/destinations/:id', protect, updateDestination)
router.delete('/destinations/:id', protect, deleteDestination)

router.post('/destination-regions', protect, createDestinationRegion)
router.put('/destination-regions/:id', protect, updateDestinationRegion)
router.delete('/destination-regions/:id', protect, deleteDestinationRegion)
router.post('/destination-regions/:id/countries', protect, addCountryToRegion)
router.delete('/destination-regions/:id/countries/:countryName', protect, deleteCountryFromRegion)

router.post('/features', protect, createFeature)
router.put('/features/:id', protect, updateFeature)
router.delete('/features/:id', protect, deleteFeature)

router.post('/trust-stats', protect, createTrustStat)
router.put('/trust-stats/:id', protect, updateTrustStat)
router.delete('/trust-stats/:id', protect, deleteTrustStat)

router.post('/testimonials', createTestimonial)
router.put('/testimonials/:id', protect, updateTestimonial)
router.delete('/testimonials/:id', protect, deleteTestimonial)

router.post('/faqs', protect, createFaq)
router.put('/faqs/:id', protect, updateFaq)
router.delete('/faqs/:id', protect, deleteFaq)

router.put('/sections/:sectionKey', protect, updateSection)

router.post('/blogs', protect, createBlog)
router.put('/blogs/:id', protect, updateBlog)
router.delete('/blogs/:id', protect, deleteBlog)

// SEO Page Meta routes
router.get('/seo', getPageMetaList)
router.get('/seo/:pageKey', getPageMetaByKey)
router.put('/seo/:pageKey', protect, updatePageMeta)

// Partners & Marquee routes
router.get('/partners', getPartners)
router.post('/partners', protect, createPartner)
router.put('/partners/:id', protect, updatePartner)
router.delete('/partners/:id', protect, deletePartner)

export default router

