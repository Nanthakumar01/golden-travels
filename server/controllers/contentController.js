import { Op } from 'sequelize'
import {
	Slide,
	Banner,
	Persona,
	Destination,
	DestinationRegion,
	Feature,
	Testimonial,
	Faq,
	HomeSection,
	TrustStat,
	Blog,
	PageMeta,
	Partner,
	Package
} from '../models/index.js'

const getBaseSiteUrl = () => {
	if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
	if (process.env.NODE_ENV === 'production') return 'https://goldentravels.in'
	return 'http://localhost:3000'
}

const DEFAULT_TRUST_STATS = [
	{ icon: '🏆', number: '25+', label: 'Years of Excellence', desc: 'Serving travelers since 1999', order: 1 },
	{ icon: '✈️', number: '50,000+', label: 'Happy Travelers', desc: 'Delighted families & explorers', order: 2 },
	{ icon: '🌍', number: '150+', label: 'Global Destinations', desc: 'Covering 6 continents', order: 3 },
	{ icon: '⭐', number: '4.9 / 5', label: 'Google Rating', desc: 'Based on 4,800+ real reviews', order: 4 }
]

export const DEFAULT_BLOGS = [
	{
		slug: 'the-ultimate-switzerland-alps-itinerary-for-indian-travelers',
		title: 'The Ultimate Switzerland & Alps Itinerary for Indian Travelers',
		metaTitle: 'Ultimate Switzerland Alps Itinerary for Indian Travelers | Golden Travels',
		metaDescription: 'Complete guide to exploring Switzerland with the Swiss Travel Pass, Jungfraujoch Top of Europe, Mount Titlis, and scenic panoramic trains.',
		metaKeywords: 'switzerland itinerary, swiss travel pass guide, jungfraujoch trip, switzerland for indian travelers, swiss holiday guide',
		excerpt: "From scenic Swiss panoramic trains to snow-clad peaks in Jungfraujoch and Lucerne boat cruises, here is how to experience Europe's crown jewel seamlessly.",
		heading: '1. The Magic of Swiss Travel Pass & Alpine Peaks',
		category: 'Europe',
		date: 'Oct 05, 2026',
		readTime: '6 min read',
		image: '/assets/images/slide/slide3.jpg',
		author: 'Europe Specialist',
		content: `Switzerland is a dream destination for many Indian travelers, offering a perfect blend of breathtaking landscapes, luxurious experiences, and seamless travel infrastructure. Whether you're planning a romantic honeymoon or a memorable family vacation, understanding how to navigate the Swiss Alps is crucial for a perfect trip.

The secret to exploring Switzerland effortlessly is the Swiss Travel Pass. It grants you unlimited access to the country's extensive network of trains, buses, and boats. The panoramic train journeys, such as the Glacier Express and Bernina Express, are experiences in themselves, offering front-row seats to nature's greatest shows.

No Swiss itinerary is complete without visiting the Top of Europe—Jungfraujoch. Standing at 3,454 meters above sea level, the journey involves a spectacular cogwheel train ride through the Eiger mountain. For a different but equally stunning experience, Mount Titlis offers the world's first revolving cable car and an exciting cliff walk.`,
		order: 1,
		isActive: true
	},
	{
		slug: 'maldives-all-inclusive-vs-half-board-expert-guide-from-coimbatore',
		title: 'Maldives All-Inclusive vs Half-Board: Expert Guide from Coimbatore',
		metaTitle: 'Maldives All-Inclusive vs Half-Board Guide for Honeymooners | Golden Travels',
		metaDescription: 'Compare Maldives meal plans, seaplane vs speedboat transfers, and private overwater villa inclusions before booking your island getaway.',
		metaKeywords: 'maldives all inclusive vs half board, maldives honeymoon guide, maldives transfer cost, water villa package maldives',
		excerpt: 'Planning your honeymoon or private villa escape? Discover the key differences between meal plans, transfer speedboats, and seaplanes in the Maldives.',
		heading: '1. All-Inclusive vs Half-Board & Island Transfers',
		category: 'Honeymoon',
		date: 'Sep 28, 2026',
		readTime: '5 min read',
		image: '/assets/images/slide/slide1.jpg',
		author: 'Island Curator',
		content: `Choosing the right meal plan and island transfer in the Maldives can make all the difference between a stress-free luxury escape and unexpected resort bills. Since every resort sits on its own private coral island, all dining and activities happen within your resort.

Half-Board includes daily breakfast and dinner, making it ideal for light daytime eaters. However, All-Inclusive covers breakfast, lunch, dinner, unlimited beverages, and often sunset cruises or snorkeling gear—giving couples complete peace of mind.

Resorts in North and South Malé Atolls are easily reached within 20 to 45 minutes by luxury speedboat, whereas remote atolls offer iconic 35-minute scenic seaplane flights over turquoise lagoons.`,
		order: 2,
		isActive: true
	},
	{
		slug: 'top-7-romantic-international-honeymoon-destinations-for-2026',
		title: 'Top 7 Romantic International Honeymoon Destinations for 2026',
		metaTitle: 'Top 7 Romantic International Honeymoon Destinations 2026 | Golden Travels',
		metaDescription: 'Discover the most romantic destinations for couples: private Bali pool villas, Maldives overwater escapes, Swiss Alps lakes, and Mediterranean sunsets.',
		metaKeywords: 'best honeymoon destinations 2026, romantic international holidays, luxury honeymoon trips, couple vacation packages',
		excerpt: 'Looking for privacy, infinity pools, and candlelit dinners by the ocean? Explore our top handpicked honeymoon destinations curated for newly-wed couples.',
		heading: '1. Romantic Island Villas & European Fairytales',
		category: 'Honeymoon',
		date: 'Sep 20, 2026',
		readTime: '7 min read',
		image: '/assets/images/tour/3.jpg',
		author: 'Luxury Advisor',
		content: `Your honeymoon is the first chapter of a lifetime of adventures together. At Golden Travels, we curate private, unhurried itineraries designed exclusively for couples seeking romance, comfort, and unforgettable backdrops.

From Bali's Ubud rainforest infinity pools and Nusa Dua beaches to Maldives overwater bungalows, private villa stays with floating breakfasts and candlelit beachside dining remain top favorites.

For couples who love scenic train rides, cobblestoned towns, and alpine lakes, combining Switzerland's Interlaken and Lucerne with Paris creates the ultimate romantic European journey.`,
		order: 3,
		isActive: true
	},
	{
		slug: 'how-to-secure-schengen-visa-with-ease-essential-checklist',
		title: 'How to Secure Schengen Visa with Ease: Essential Checklist',
		metaTitle: 'How to Secure Schengen Visa with Ease: 2026 Document Checklist | Golden Travels',
		metaDescription: 'Step-by-step checklist for South Indian travelers applying for Schengen visas: cover letter, appointment booking, insurance and hotel vouchers.',
		metaKeywords: 'schengen visa checklist, europe visa from south india, schengen visa appointment tips, visa assistance coimbatore',
		excerpt: 'A complete step-by-step guide on documents, appointment slots, travel insurance, and itinerary planning for travelers applying from South India.',
		heading: '1. Core Documentation Checklist & Appointment Slots',
		category: 'Visa Guide',
		date: 'Sep 15, 2026',
		readTime: '8 min read',
		image: '/assets/images/tour/1.jpg',
		author: 'Visa Concierge',
		content: `Applying for a Schengen visa to explore 29 European countries doesn't have to feel overwhelming. With proper documentation and timely appointment booking, Indian travelers can achieve a smooth approval process.

Ensure your passport has at least 6 months validity beyond your return date, along with 6 months of stamped bank statements, 3 years of ITR acknowledgments, employment/business proof, and Schengen-compliant travel insurance covering at least €30,000.

Embassies look for a clear, well-structured cover letter paired with confirmed hotel vouchers, internal train/flight bookings, and return air tickets—all of which our Coimbatore visa concierge team prepares end-to-end.`,
		order: 4,
		isActive: true
	},
	{
		slug: 'bali-beyond-the-beaches-cultural-luxury-escapes-in-ubud',
		title: 'Bali Beyond the Beaches: Cultural & Luxury Escapes in Ubud',
		metaTitle: 'Bali Beyond the Beaches: Cultural & Luxury Escapes in Ubud | Golden Travels',
		metaDescription: 'Explore emerald rice terraces, private forest pool villas, holy spring water temples and luxury wellness retreats in Ubud, Bali.',
		metaKeywords: 'ubud bali guide, luxury villas ubud, bali cultural tours, bali honeymoon tips, best places in bali',
		excerpt: 'Immerse in lush rice terraces, private forest pool villas, and spiritual temple ceremonies across the magical heart of Bali.',
		heading: '1. Tegalalang Rice Terraces & Boutique Stays in Ubud',
		category: 'Asia',
		date: 'Sep 10, 2026',
		readTime: '5 min read',
		image: '/assets/images/tour/4.jpg',
		author: 'Asia Planner',
		content: `While Southern Bali is famous for its golden sunset beaches and cliffside clubs in Uluwatu and Seminyak, the true cultural soul of the island beats in the emerald highlands of Ubud.

Wake up early to stroll through misty UNESCO-recognized rice paddies, visit waterfalls tucked inside tropical valleys, and enjoy panoramic jungle swings overlooking the Ayung River gorge.

Pair 3 nights in a private heated pool villa in Ubud with 3 nights by the beach in Nusa Dua or Seminyak for the best of both worlds.`,
		order: 5,
		isActive: true
	},
	{
		slug: 'vietnam-essentials-halong-bay-cruises-ba-na-hills-phu-quoc-beaches',
		title: 'Vietnam Essentials: Halong Bay Cruises, Ba Na Hills & Phu Quoc Beaches',
		metaTitle: 'Vietnam Travel Guide: Halong Bay, Ba Na Hills & Phu Quoc | Golden Travels',
		metaDescription: 'Essential travel tips for visiting Vietnam: overnight Halong Bay cruises, walking the Golden Bridge in Da Nang, and tropical relaxation in Phu Quoc.',
		metaKeywords: 'vietnam travel guide, halong bay cruise tips, ba na hills da nang, phu quoc island guide, vietnam tour itinerary',
		excerpt: 'A complete 9-day traveler guide covering Hanoi heritage, Halong Bay overnight cruises, Golden Bridge in Danang, and tropical Phu Quoc adventures.',
		heading: '1. Halong Bay Cruises & Ba Na Hills Highlights',
		category: 'Asia',
		date: 'Sep 02, 2026',
		readTime: '6 min read',
		image: '/assets/images/packages/vietnam.jpg',
		author: 'International Lead',
		content: `Vietnam has rapidly become one of the most loved international destinations for Indian families and couples thanks to its dramatic karst landscapes, French-colonial heritage, and warm hospitality.

Begin in Hanoi's Old Quarter before boarding a 5-star overnight cruise across the emerald waters of Halong Bay. Next, fly to Da Nang to walk across the iconic Golden Bridge at Ba Na Hills and explore lantern-lit Hoi An.

Wrap up your holiday in Phu Quoc with the world's longest over-sea cable car ride to Hon Thom Island, VinWonders theme park, and Grand World's Venice-style canal shows.`,
		order: 6,
		isActive: true
	}
]

const ensureTrustStatsSeeded = async () => {
	await TrustStat.sync()
	const count = await TrustStat.count()
	if (count === 0) {
		await TrustStat.bulkCreate(DEFAULT_TRUST_STATS)
	}
}

const ensureBlogsSeeded = async () => {
	try {
		await Blog.sync({ alter: true })
		const count = await Blog.count()
		if (count === 0) {
			await Blog.bulkCreate(DEFAULT_BLOGS)
		} else {
			for (const def of DEFAULT_BLOGS) {
				const b = await Blog.findOne({ where: { slug: def.slug } })
				if (b && !b.heading) {
					await b.update({ heading: def.heading })
				}
			}
		}
	} catch (err) {
		console.error('Error syncing blogs:', err)
	}
}

export const DEFAULT_DESTINATION_REGIONS = [
	{
		group: 'International',
		slug: 'north-america',
		name: 'North America',
		order: 1,
		countries: [
			'Antigua and Barbuda', 'Barbados', 'Belize',
			'Canada', 'Costa Rica', 'Cuba',
			'Dominica', 'Dominican Republic', 'El Salvador',
			'Grenada', 'Guatemala', 'Haiti',
			'Honduras', 'Jamaica', 'Mexico',
			'Nicaragua', 'Panama', 'Saint Kitts and Nevis',
			'Saint Lucia', 'Saint Vincent and the Grenadines', 'The Bahamas',
			'United States', 'West Indies'
		]
	},
	{
		group: 'International',
		slug: 'south-america',
		name: 'South America',
		order: 2,
		countries: [
			'Argentina', 'Bolivia', 'Brazil',
			'Chile', 'Colombia', 'Ecuador',
			'Guyana', 'Paraguay', 'Peru',
			'Suriname', 'Trinidad and Tobago', 'Uruguay',
			'Venezuela'
		]
	},
	{
		group: 'International',
		slug: 'europe',
		name: 'Europe',
		order: 3,
		countries: [
			'Albania', 'Andorra', 'Austria',
			'Belarus', 'Belgium', 'Bosnia and Herzegovina',
			'Bulgaria', 'Croatia', 'Cyprus',
			'Czechia', 'Denmark', 'England',
			'Estonia', 'Finland', 'France',
			'Georgia', 'Germany', 'Greece',
			'Hungary', 'Iceland', 'Ireland',
			'Italy', 'Latvia', 'Liechtenstein',
			'Lithuania', 'Luxembourg', 'Malta',
			'Moldova', 'Monaco', 'Montenegro',
			'Netherlands', 'North Macedonia', 'Northern Ireland',
			'Norway', 'Poland', 'Portugal',
			'Republic Of Ireland', 'Romania', 'San Marino',
			'Scotland', 'Serbia', 'Slovakia',
			'Slovenia', 'Spain', 'Sweden',
			'Switzerland', 'Turkey', 'Ukraine',
			'United Kingdom (UK)', 'Vatican', 'Wales'
		]
	},
	{
		group: 'International',
		slug: 'africa',
		name: 'Africa',
		order: 4,
		countries: [
			'Algeria', 'Angola', 'Benin',
			'Botswana', 'Burkina Faso', 'Burundi',
			'Cabo Verde', 'Cameroon', 'Central African Republic',
			'Chad', 'Comoros', 'Congo',
			'Djibouti', 'Egypt', 'Equatorial Guinea',
			'Eritrea', 'Eswatini', 'Ethiopia',
			'Gabon', 'Gambia', 'Ghana',
			'Guinea', 'Guinea Bissau', 'Ivory Coast',
			'Kenya', 'Lesotho', 'Liberia',
			'Libya', 'Madagascar', 'Malawi',
			'Mali', 'Mauritania', 'Mauritius',
			'Mozambique', 'Morocco', 'Namibia',
			'Niger', 'Nigeria', 'Rwanda',
			'Sao Tome And Príncipe', 'Senegal', 'Sierra Leone',
			'Somalia', 'South Africa', 'South Sudan',
			'Sudan', 'Tanzania', 'Togo',
			'Tunisia', 'Uganda', 'Zambia',
			'Zimbabwe'
		]
	},
	{
		group: 'International',
		slug: 'asia',
		name: 'Asia',
		order: 5,
		countries: [
			'Afghanistan', 'Armenia', 'Azerbaijan',
			'Bahrain', 'Bangladesh', 'Bhutan',
			'Brunei', 'Cambodia', 'China',
			'East Timor', 'Indonesia', 'Iran',
			'Iraq', 'Israel', 'Japan',
			'Jordan', 'Kazakhstan', 'North Korea',
			'South Korea', 'Kuwait', 'Kyrgyzstan',
			'Laos', 'Lebanon', 'Malaysia',
			'Maldives', 'Mongolia', 'Myanmar',
			'Nepal', 'Oman', 'Pakistan',
			'Palestine', 'Philippines', 'Qatar',
			'Russia', 'Saudi Arabia', 'Seychelles',
			'Singapore', 'Sri Lanka', 'Syria',
			'Taiwan', 'Tajikistan', 'Thailand',
			'Turkmenistan', 'U.A.E', 'Uzbekistan',
			'Vietnam', 'Yemen'
		]
	},
	{
		group: 'International',
		slug: 'oceania',
		name: 'Oceani',
		order: 6,
		countries: [
			'Australia', 'Fiji', 'Kiribati',
			'Marshall Islands', 'Micronesia', 'Nauru',
			'New Zealand', 'Palau', 'Papua New Guinea',
			'Samoa', 'Solomon Islands', 'Tonga',
			'Tuvalu', 'Vanuatu'
		]
	},
	{
		group: 'International',
		slug: 'antarctica',
		name: 'Antarctica',
		order: 7,
		countries: [
			'Antarctica'
		]
	},
	{
		group: 'India',
		slug: 'east-northeast-india',
		name: 'East & North East India',
		order: 8,
		countries: [
			'Arunachal Pradesh', 'Assam', 'Bihar',
			'Jharkhand', 'Manipur', 'Meghalaya',
			'Mizoram', 'Nagaland', 'Odisha',
			'Sikkim', 'Tripura', 'West Bengal'
		]
	},
	{
		group: 'India',
		slug: 'west-central-india',
		name: 'West & Central India',
		order: 9,
		countries: [
			'Chhattisgarh', 'Goa', 'Gujarat',
			'Madhya Pradesh', 'Maharashtra', 'Rajasthan'
		]
	},
	{
		group: 'India',
		slug: 'north-india',
		name: 'North India',
		order: 10,
		countries: [
			'Delhi (National Capital Territory)', 'Haryana', 'Himachal Pradesh',
			'Jammu and Kashmir', 'Punjab', 'Rajasthan',
			'Uttar Pradesh', 'Uttarakhand'
		]
	},
	{
		group: 'India',
		slug: 'south-india',
		name: 'South India',
		order: 11,
		countries: [
			'Andhra Pradesh', 'Karnataka', 'Kerala',
			'Tamil Nadu', 'Telangana'
		]
	},
	{
		group: 'India',
		slug: 'union-territories',
		name: 'Union Territories',
		order: 12,
		countries: [
			'Andaman and Nicobar Island', 'Chandigarh',
			'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
			'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
			'Puducherry'
		]
	}
]

export const ensureDestinationRegionsSeeded = async () => {
	try {
		await DestinationRegion.sync({ alter: true })
		const count = await DestinationRegion.count()
		if (count === 0) {
			await DestinationRegion.bulkCreate(DEFAULT_DESTINATION_REGIONS)
		}
	} catch (err) {
		console.error('Error seeding destination regions:', err)
	}
}

// ================= GET ALL CONTENT (Single fast bundle) =================
export const getAllContent = async (req, res) => {
	try {
		await Promise.all([ensureTrustStatsSeeded(), ensureBlogsSeeded(), ensureDestinationRegionsSeeded()])
		const [slides, banners, personas, destinations, destinationRegions, features, testimonials, faqs, sections, trustStats, blogs, packages] = await Promise.all([
			Slide.findAll({ where: { isActive: true }, order: [['order', 'ASC']] }),
			Banner.findAll({ where: { isActive: true, pageKey: ['tours', 'blog', 'contact'] } }),
			Persona.findAll({ where: { isActive: true }, order: [['createdAt', 'ASC']] }),
			Destination.findAll({ where: { isActive: true }, order: [['order', 'ASC']] }),
			DestinationRegion.findAll({ where: { isActive: true }, order: [['order', 'ASC'], ['id', 'ASC']] }),
			Feature.findAll({ where: { isActive: true }, order: [['order', 'ASC'], ['id', 'ASC']] }),
			Testimonial.findAll({ where: { isActive: true }, order: [['order', 'ASC']] }),
			Faq.findAll({ where: { isActive: true }, order: [['order', 'ASC']] }),
			HomeSection.findAll({ where: { isActive: true } }),
			TrustStat.findAll({ where: { isActive: true }, order: [['order', 'ASC'], ['id', 'ASC']] }),
			Blog.findAll({ where: { isActive: true }, order: [['order', 'ASC'], ['id', 'ASC']] }),
			Package.findAll({ where: { isActive: true }, order: [['id', 'DESC']] })
		])

		const destinationGroups = [
			{
				group: 'International',
				regions: destinationRegions
					.filter(r => r.group === 'International')
					.map(r => ({
						id: r.slug,
						dbId: r.id,
						name: r.name,
						countries: Array.isArray(r.countries) ? r.countries : []
					}))
			},
			{
				group: 'India',
				regions: destinationRegions
					.filter(r => r.group === 'India')
					.map(r => ({
						id: r.slug,
						dbId: r.id,
						name: r.name,
						countries: Array.isArray(r.countries) ? r.countries : []
					}))
			}
		]

		res.json({
			success: true,
			data: {
				slides,
				banners,
				personas,
				destinations,
				destinationRegions,
				destinationGroups,
				features,
				trustStats,
				testimonials,
				faqs,
				blogs,
				packages,
				sections: sections.reduce((acc, s) => {
					acc[s.sectionKey] = s
					return acc
				}, {})
			}
		})
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= HERO SLIDES =================
export const getSlides = async (req, res) => {
	try {
		const slides = await Slide.findAll({ order: [['order', 'ASC']] })
		res.json({ success: true, data: slides })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createSlide = async (req, res) => {
	try {
		const slide = await Slide.create(req.body)
		res.status(201).json({ success: true, data: slide })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateSlide = async (req, res) => {
	try {
		const slide = await Slide.findByPk(req.params.id)
		if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' })
		if (req.body.showInCtaBanner === true) {
			await Slide.update({ showInCtaBanner: false }, { where: {} })
		}
		await slide.update(req.body)
		res.json({ success: true, data: slide })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteSlide = async (req, res) => {
	try {
		const slide = await Slide.findByPk(req.params.id)
		if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' })
		await slide.destroy()
		res.json({ success: true, message: 'Slide deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= PAGE BANNERS =================
export const getBanners = async (req, res) => {
	try {
		const banners = await Banner.findAll({
			where: { pageKey: ['tours', 'blog', 'contact'] }
		})
		res.json({ success: true, data: banners })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const updateBanner = async (req, res) => {
	try {
		const banner = await Banner.findByPk(req.params.id)
		if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' })
		await banner.update(req.body)
		res.json({ success: true, data: banner })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

// ================= PERSONAS =================
export const getPersonas = async (req, res) => {
	try {
		const personas = await Persona.findAll({ order: [['createdAt', 'ASC']] })
		res.json({ success: true, data: personas })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createPersona = async (req, res) => {
	try {
		const id = req.body.id || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '_') : `persona_${Date.now()}`)
		const persona = await Persona.create({
			id,
			title: req.body.title,
			subtitle: req.body.subtitle || '',
			image: req.body.image,
			link: req.body.link || (req.body.slug ? (req.body.slug.startsWith('/') ? req.body.slug : `/tour/${req.body.slug}`) : '/tour'),
			slug: req.body.slug || null
		})
		res.status(201).json({ success: true, data: persona })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updatePersona = async (req, res) => {
	try {
		const persona = await Persona.findByPk(req.params.id)
		if (!persona) return res.status(404).json({ success: false, message: 'Persona not found' })
		await persona.update(req.body)
		res.json({ success: true, data: persona })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deletePersona = async (req, res) => {
	try {
		const persona = await Persona.findByPk(req.params.id)
		if (!persona) return res.status(404).json({ success: false, message: 'Persona not found' })
		await persona.destroy()
		res.json({ success: true, message: 'Persona deleted successfully' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= DESTINATIONS =================
export const getDestinations = async (req, res) => {
	try {
		const destinations = await Destination.findAll({ order: [['category', 'ASC'], ['order', 'ASC']] })
		res.json({ success: true, data: destinations })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createDestination = async (req, res) => {
	try {
		const dest = await Destination.create(req.body)
		res.status(201).json({ success: true, data: dest })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateDestination = async (req, res) => {
	try {
		const dest = await Destination.findByPk(req.params.id)
		if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' })
		await dest.update(req.body)
		res.json({ success: true, data: dest })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteDestination = async (req, res) => {
	try {
		const dest = await Destination.findByPk(req.params.id)
		if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' })
		await dest.destroy()
		res.json({ success: true, message: 'Destination deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= DESTINATION REGIONS & COUNTRIES (Hierarchy Manager) =================
export const getDestinationRegions = async (req, res) => {
	try {
		await ensureDestinationRegionsSeeded()
		const regions = await DestinationRegion.findAll({
			order: [['order', 'ASC'], ['id', 'ASC']]
		})
		res.json({ success: true, data: regions })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const getDestinationGroups = async (req, res) => {
	try {
		await ensureDestinationRegionsSeeded()
		const regions = await DestinationRegion.findAll({
			where: { isActive: true },
			order: [['order', 'ASC'], ['id', 'ASC']]
		})
		const groups = [
			{
				group: 'International',
				regions: regions
					.filter(r => r.group === 'International')
					.map(r => ({
						id: r.slug,
						dbId: r.id,
						name: r.name,
						countries: Array.isArray(r.countries) ? r.countries : []
					}))
			},
			{
				group: 'India',
				regions: regions
					.filter(r => r.group === 'India')
					.map(r => ({
						id: r.slug,
						dbId: r.id,
						name: r.name,
						countries: Array.isArray(r.countries) ? r.countries : []
					}))
			}
		]
		res.json({ success: true, data: groups })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

const normalizeCountryItem = (item, defaultSlug = null) => {
	if (!item) return null
	if (typeof item === 'object') {
		const name = String(item.name || '').trim()
		if (!name) return null
		const slug = item.slug ? String(item.slug).trim() : (defaultSlug ? String(defaultSlug).trim() : null)
		return { name, slug: slug || null }
	}
	const str = String(item).trim()
	if (!str) return null
	return defaultSlug ? { name: str, slug: String(defaultSlug).trim() } : { name: str, slug: null }
}

export const createDestinationRegion = async (req, res) => {
	try {
		await ensureDestinationRegionsSeeded()
		const { group, name, slug, countries, order } = req.body
		if (!name || !name.trim()) {
			return res.status(400).json({ success: false, message: 'Region name is required' })
		}
		const autoSlug = (slug && slug.trim())
			? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
			: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

		let countriesArr = []
		if (Array.isArray(countries)) {
			countriesArr = countries.map(c => normalizeCountryItem(c)).filter(Boolean)
		} else if (typeof countries === 'string' && countries.trim()) {
			countriesArr = countries.split(',').map(s => normalizeCountryItem(s)).filter(Boolean)
		}

		const count = await DestinationRegion.count()
		const region = await DestinationRegion.create({
			group: group === 'India' || group === 'Domestic' ? 'India' : 'International',
			name: name.trim(),
			slug: autoSlug || `region-${Date.now()}`,
			countries: countriesArr,
			order: order ?? (count + 1),
			isActive: true
		})
		res.status(201).json({ success: true, data: region })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateDestinationRegion = async (req, res) => {
	try {
		const region = await DestinationRegion.findByPk(req.params.id)
		if (!region) return res.status(404).json({ success: false, message: 'Region not found' })

		const payload = { ...req.body }
		if (payload.group && (payload.group === 'Domestic' || payload.group === 'India')) {
			payload.group = 'India'
		}
		if (payload.countries !== undefined) {
			if (Array.isArray(payload.countries)) {
				payload.countries = payload.countries.map(c => normalizeCountryItem(c)).filter(Boolean)
			} else if (typeof payload.countries === 'string') {
				payload.countries = payload.countries.split(',').map(s => normalizeCountryItem(s)).filter(Boolean)
			}
		}

		await region.update(payload)
		res.json({ success: true, data: region })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteDestinationRegion = async (req, res) => {
	try {
		const region = await DestinationRegion.findByPk(req.params.id)
		if (!region) return res.status(404).json({ success: false, message: 'Region not found' })
		await region.destroy()
		res.json({ success: true, message: 'Region deleted successfully' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const addCountryToRegion = async (req, res) => {
	try {
		const region = await DestinationRegion.findByPk(req.params.id)
		if (!region) return res.status(404).json({ success: false, message: 'Region not found' })

		const { country, countries, slug } = req.body
		const existing = Array.isArray(region.countries) ? [...region.countries] : []
		const toAdd = []

		if (country) {
			if (typeof country === 'object' && country !== null) {
				const norm = normalizeCountryItem(country, slug)
				if (norm) toAdd.push(norm)
			} else if (typeof country === 'string') {
				const parts = country.split(',').map(s => s.trim()).filter(Boolean)
				for (const part of parts) {
					toAdd.push(normalizeCountryItem(part, slug))
				}
			}
		}
		if (Array.isArray(countries)) {
			for (const c of countries) {
				const norm = normalizeCountryItem(c)
				if (norm) toAdd.push(norm)
			}
		}

		for (const item of toAdd) {
			if (!item || !item.name) continue
			const existingIdx = existing.findIndex(c => {
				const cName = typeof c === 'object' && c ? c.name : c
				return String(cName || '').trim().toLowerCase() === item.name.toLowerCase()
			})
			if (existingIdx >= 0) {
				existing[existingIdx] = item
			} else {
				existing.push(item)
			}
		}

		await region.update({ countries: existing })
		res.json({ success: true, data: region })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteCountryFromRegion = async (req, res) => {
	try {
		const region = await DestinationRegion.findByPk(req.params.id)
		if (!region) return res.status(404).json({ success: false, message: 'Region not found' })

		const target = decodeURIComponent(req.params.countryName || req.body.country || '').trim().toLowerCase()
		const existing = Array.isArray(region.countries) ? [...region.countries] : []
		const updated = existing.filter(c => {
			const cName = typeof c === 'object' && c ? c.name : c
			return String(cName || '').trim().toLowerCase() !== target
		})

		await region.update({ countries: updated })
		res.json({ success: true, data: region })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

// ================= FEATURES (Why Choose Us / Trust Pillars) =================
export const getFeatures = async (req, res) => {
	try {
		const features = await Feature.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] })
		res.json({ success: true, data: features })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createFeature = async (req, res) => {
	try {
		const count = await Feature.count()
		const feature = await Feature.create({
			icon: req.body.icon || '🎯',
			title: req.body.title,
			description: req.body.description,
			order: req.body.order ?? (count + 1),
			isActive: req.body.isActive ?? true
		})
		res.status(201).json({ success: true, data: feature })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateFeature = async (req, res) => {
	try {
		const feature = await Feature.findByPk(req.params.id)
		if (!feature) return res.status(404).json({ success: false, message: 'Feature not found' })
		await feature.update(req.body)
		res.json({ success: true, data: feature })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteFeature = async (req, res) => {
	try {
		const feature = await Feature.findByPk(req.params.id)
		if (!feature) return res.status(404).json({ success: false, message: 'Feature not found' })
		await feature.destroy()
		res.json({ success: true, message: 'Feature deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= TRUST STATS (Years, Travelers, Destinations, Rating) =================
export const getTrustStats = async (req, res) => {
	try {
		await ensureTrustStatsSeeded()
		const stats = await TrustStat.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] })
		res.json({ success: true, data: stats })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createTrustStat = async (req, res) => {
	try {
		await ensureTrustStatsSeeded()
		const count = await TrustStat.count()
		const stat = await TrustStat.create({
			icon: req.body.icon || '🏆',
			number: req.body.number,
			label: req.body.label,
			desc: req.body.desc || '',
			order: req.body.order ?? (count + 1),
			isActive: req.body.isActive ?? true
		})
		res.status(201).json({ success: true, data: stat })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateTrustStat = async (req, res) => {
	try {
		const stat = await TrustStat.findByPk(req.params.id)
		if (!stat) return res.status(404).json({ success: false, message: 'Trust stat not found' })
		await stat.update(req.body)
		res.json({ success: true, data: stat })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteTrustStat = async (req, res) => {
	try {
		const stat = await TrustStat.findByPk(req.params.id)
		if (!stat) return res.status(404).json({ success: false, message: 'Trust stat not found' })
		await stat.destroy()
		res.json({ success: true, message: 'Trust stat deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= TESTIMONIALS (Client Stories) =================
export const getTestimonials = async (req, res) => {
	try {
		const list = await Testimonial.findAll({ order: [['order', 'ASC']] })
		res.json({ success: true, data: list })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createTestimonial = async (req, res) => {
	try {
		const name = (req.body.name || '').trim()
		const rawText = (req.body.text || '').trim()
		if (!name || !rawText) {
			return res.status(400).json({ success: false, message: 'Customer name and review text are required' })
		}
		const count = await Testimonial.count()
		const formattedText = (rawText.startsWith('“') || rawText.startsWith('"')) ? rawText : `“${rawText}”`
		const item = await Testimonial.create({
			name: name,
			role: req.body.role ? req.body.role.trim() : '',
			text: formattedText,
			rating: Number(req.body.rating) || 5,
			order: req.body.order ?? (count + 1),
			isActive: true
		})
		res.status(201).json({ success: true, data: item })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateTestimonial = async (req, res) => {
	try {
		const item = await Testimonial.findByPk(req.params.id)
		if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' })
		await item.update(req.body)
		res.json({ success: true, data: item })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteTestimonial = async (req, res) => {
	try {
		const item = await Testimonial.findByPk(req.params.id)
		if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' })
		await item.destroy()
		res.json({ success: true, message: 'Testimonial deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= FAQS =================
export const getFaqs = async (req, res) => {
	try {
		const faqs = await Faq.findAll({ order: [['order', 'ASC']] })
		res.json({ success: true, data: faqs })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createFaq = async (req, res) => {
	try {
		const faq = await Faq.create(req.body)
		res.status(201).json({ success: true, data: faq })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateFaq = async (req, res) => {
	try {
		const faq = await Faq.findByPk(req.params.id)
		if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' })
		await faq.update(req.body)
		res.json({ success: true, data: faq })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteFaq = async (req, res) => {
	try {
		const faq = await Faq.findByPk(req.params.id)
		if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' })
		await faq.destroy()
		res.json({ success: true, message: 'FAQ deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= SECTIONS HEADERS =================
export const getSections = async (req, res) => {
	try {
		const sections = await HomeSection.findAll()
		res.json({ success: true, data: sections })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const updateSection = async (req, res) => {
	try {
		const section = await HomeSection.findByPk(req.params.sectionKey)
		if (!section) return res.status(404).json({ success: false, message: 'Section not found' })
		await section.update(req.body)
		res.json({ success: true, data: section })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

// ================= BLOGS =================
export const getBlogs = async (req, res) => {
	try {
		await ensureBlogsSeeded()
		const blogs = await Blog.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] })
		res.json({ success: true, data: blogs })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const getBlogBySlug = async (req, res) => {
	try {
		await ensureBlogsSeeded()
		const blog = await Blog.findOne({ where: { slug: req.params.slug } })
		if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
		res.json({ success: true, data: blog })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createBlog = async (req, res) => {
	try {
		await ensureBlogsSeeded()
		const payload = { ...req.body }
		if (!payload.slug && payload.title) {
			payload.slug = payload.title
				.toLowerCase()
				.replace(/&/g, '-and-')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '')
		}
		// Ensure unique slug with ending number if duplicate
		if (payload.slug) {
			let cleanBase = payload.slug.replace(/-\d+$/, '')
			let candidate = payload.slug
			let counter = 2
			while (await Blog.findOne({ where: { slug: candidate } })) {
				candidate = `${cleanBase}-${counter}`
				counter++
			}
			payload.slug = candidate
		}
		// Set default canonicalUrl if not provided or standard blog link
		if (!payload.canonicalUrl || payload.canonicalUrl.startsWith('https://goldentravels.in/blog/') || payload.canonicalUrl.startsWith('http://localhost')) {
			payload.canonicalUrl = `${getBaseSiteUrl()}/blog/${payload.slug}`
		}
		const blog = await Blog.create(payload)
		res.status(201).json({ success: true, data: blog })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updateBlog = async (req, res) => {
	try {
		const blog = await Blog.findByPk(req.params.id)
		if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
		const payload = { ...req.body }
		if (payload.title && !payload.slug) {
			payload.slug = payload.title
				.toLowerCase()
				.replace(/&/g, '-and-')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '')
		}
		// Ensure unique slug with ending number if duplicate across other blogs
		if (payload.slug) {
			let cleanBase = payload.slug.replace(/-\d+$/, '')
			let candidate = payload.slug
			let counter = 2
			while (await Blog.findOne({ where: { slug: candidate, id: { [Op.ne]: req.params.id } } })) {
				candidate = `${cleanBase}-${counter}`
				counter++
			}
			payload.slug = candidate
		}
		// Set default canonicalUrl if not provided or standard blog link
		if (!payload.canonicalUrl || payload.canonicalUrl.startsWith('https://goldentravels.in/blog/') || payload.canonicalUrl.startsWith('http://localhost')) {
			payload.canonicalUrl = `${getBaseSiteUrl()}/blog/${payload.slug}`
		}
		await blog.update(payload)
		res.json({ success: true, data: blog })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deleteBlog = async (req, res) => {
	try {
		const blog = await Blog.findByPk(req.params.id)
		if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
		await blog.destroy()
		res.json({ success: true, message: 'Blog deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// ================= SEO & PAGE META CONTROLLER =================
export const getPageMetaList = async (req, res) => {
	try {
		const list = await PageMeta.findAll({ order: [['pageKey', 'ASC']] })
		res.json({ success: true, data: list })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const getPageMetaByKey = async (req, res) => {
	try {
		const meta = await PageMeta.findByPk(req.params.pageKey)
		if (!meta) return res.status(404).json({ success: false, message: 'Page meta not found' })
		res.json({ success: true, data: meta })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const updatePageMeta = async (req, res) => {
	try {
		let meta = await PageMeta.findByPk(req.params.pageKey)
		if (!meta) {
			meta = await PageMeta.create({
				pageKey: req.params.pageKey,
				pageName: req.body.pageName || req.params.pageKey,
				route: req.body.route || '/',
				...req.body
			})
		} else {
			await meta.update(req.body)
		}
		res.json({ success: true, data: meta })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

// ================= PARTNERS & AIRLINES / HOTELS MARQUEE =================
export const getPartners = async (req, res) => {
	try {
		const where = req.query.all === 'true' ? {} : { isActive: true }
		const partners = await Partner.findAll({ where, order: [['order', 'ASC'], ['id', 'ASC']] })
		res.json({ success: true, data: partners })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const createPartner = async (req, res) => {
	try {
		const partner = await Partner.create(req.body)
		res.status(201).json({ success: true, data: partner })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const updatePartner = async (req, res) => {
	try {
		const partner = await Partner.findByPk(req.params.id)
		if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' })
		await partner.update(req.body)
		res.json({ success: true, data: partner })
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

export const deletePartner = async (req, res) => {
	try {
		const partner = await Partner.findByPk(req.params.id)
		if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' })
		await partner.destroy()
		res.json({ success: true, message: 'Partner deleted successfully' })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}



