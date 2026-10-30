import {
	sequelize,
	Admin,
	Package,
	Inquiry,
	Slide,
	Banner,
	Persona,
	Destination,
	Feature,
	Testimonial,
	Faq,
	HomeSection,
	TrustStat,
	Blog
} from '../models/index.js'
import { DEFAULT_BLOGS } from '../controllers/contentController.js'
import { packagesData } from '../../client/src/data/packagesData.js'
import dotenv from 'dotenv'

dotenv.config()

export const seedDatabase = async () => {
	try {
		console.log('🌱 Starting database seeding...')
		await sequelize.authenticate()
		await sequelize.sync()

		// 1. Seed Admin
		const adminUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_DEFAULT_USER || 'admin'
		const adminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASS || 'admin123'
		const adminEmail = process.env.ADMIN_EMAIL || 'nanthakumar.sts@gmail.com'

		const existingAdmin = await Admin.findOne({ where: { username: adminUsername } })
		if (!existingAdmin) {
			await Admin.create({
				username: adminUsername,
				email: adminEmail,
				password: adminPass,
				role: 'superadmin'
			})
			console.log(`✅ Default admin created: Username: ${adminUsername} | Password: ${adminPass}`)
		} else {
			existingAdmin.email = adminEmail
			await existingAdmin.save()
			console.log(`ℹ️ Admin user verified: ${adminUsername} (${adminEmail})`)
		}

		// 2. Seed Packages
		const packageCount = await Package.count()
		if (packageCount === 0) {
			console.log(`📦 Seeding ${packagesData.length} tour packages into MySQL golden_travels...`)
			for (const p of packagesData) {
				await Package.create({
					slug: p.slug,
					title: p.title,
					shortTitle: p.shortTitle,
					type: p.type,
					category: p.category || (p.type === 'DOMESTIC' ? 'domestic' : 'international'),
					region: p.region,
					destination: p.destination,
					cities: p.cities,
					duration: p.duration,
					nights: p.nights || 1,
					days: p.days || 1,
					badge: p.badge,
					rating: p.rating || '4.9',
					reviews: p.reviews || '500',
					price: p.type === 'DOMESTIC' ? '₹24,999' : '₹65,000',
					image: p.image,
					gallery: p.gallery || [],
					personas: p.personas || ['couple', 'family'],
					keyInclusions: p.keyInclusions || [],
					tags: p.tags || [],
					about: p.about,
					itinerary: p.itinerary || [],
					inclusions: p.inclusions || [],
					exclusions: p.exclusions || [],
					terms: p.terms || [],
					isActive: true,
					featured: true
				})
			}
			console.log(`✅ Successfully seeded ${packagesData.length} packages!`)
		} else {
			console.log(`ℹ️ Packages already seeded (${packageCount} packages in database).`)
		}

		// 3. Seed Hero Slides
		const slideCount = await Slide.count()
		if (slideCount === 0) {
			await Slide.bulkCreate([
				{
					slideKey: 'europe',
					tab: 'Europe',
					titleLine1: 'Your next story',
					titleHighlight: 'Golden',
					titleLine2: 'starts with a Golden journey',
					text: 'Switzerland to Italy with hotels, transfers and a trip manager on call. Easy for families and first-time travellers.',
					arches: [
						{ src: '/assets/images/tour/tour-details.jpg', label: 'Switzerland' },
						{ src: '/assets/images/tour/2.jpg', label: 'Italy' },
						{ src: '/assets/images/tour/3.jpg', label: 'France' }
					],
					passTag: 'Bestseller · Boarding Pass',
					passTitle: 'Alpine & European Grandeur',
					inquiry: 'Europe Holiday',
					order: 1,
					isActive: true
				},
				{
					slideKey: 'honeymoon',
					tab: 'Honeymoon',
					titleLine1: 'Honeymoons that',
					titleHighlight: 'yours',
					titleLine2: 'feel like yours',
					text: 'Quiet villas, private dinners and beaches with no crowd. Tell us your dates and we build the rest.',
					arches: [
						{ src: '/assets/images/travel-list/5.jpg', label: 'Maldives' },
						{ src: '/assets/images/travel-list/2.jpg', label: 'Bali' },
						{ src: '/assets/images/travel-list/1.jpg', label: 'Thailand' }
					],
					passTag: 'Honeymoon · Boarding Pass',
					passTitle: 'Private Villa & Beach Escape',
					inquiry: 'Honeymoon Package',
					order: 2,
					isActive: true
				},
				{
					slideKey: 'vietnam',
					tab: 'Vietnam',
					titleLine1: 'Experience the beauty of',
					titleHighlight: 'Vietnam',
					titleLine2: 'Vietnam, perfected',
					text: 'Hanoi, Halong Bay luxury overnight cruise, Ba Na Hills Golden Bridge, and Phu Quoc island paradise. Full Indian meals and expert local guides.',
					arches: [
						{ src: '/assets/images/packages/vietnam.jpg', label: 'Halong Bay' },
						{ src: '/assets/images/travel-list/3.jpg', label: 'Golden Bridge' },
						{ src: '/assets/images/tour/3.jpg', label: 'Hoi An' }
					],
					passTag: 'Bestseller · Boarding Pass',
					passTitle: 'Beauty of Vietnam',
					inquiry: 'Vietnam Package',
					order: 3,
					isActive: true
				}
			])
			console.log('✅ Hero slides seeded.')
		}

		// 4. Seed Page Banners
		const bannerCount = await Banner.count()
		if (bannerCount === 0) {
			await Banner.bulkCreate([
				{ pageKey: 'tours', pageName: 'Tour Packages', title: 'Tour Packages', subtitle: 'Handcrafted holiday packages tailored for every travel style', bgImage: '/assets/images/page/breakcrumb.jpg' },
				{ pageKey: 'blog', pageName: 'Travel Journal / Blog', title: 'Travel Stories & Guides', subtitle: 'Insider tips, destination highlights and travel inspiration', bgImage: '/assets/images/page/breakcrumb.jpg' },
				{ pageKey: 'contact', pageName: 'Contact Us', title: 'Get In Touch', subtitle: 'Speak directly with our destination travel specialists', bgImage: '/assets/images/page/breakcrumb.jpg' }
			])
			console.log('✅ Page banners seeded.')
		} else {
			await Banner.destroy({ where: { pageKey: ['about', 'destinations'] } })
		}

		// 5. Seed Personas (Personalized Experience)
		const personaCount = await Persona.count()
		if (personaCount === 0) {
			await Persona.bulkCreate([
				{ id: 'couple', title: 'Couple', subtitle: 'Romantic & Honeymoon', desc: 'Overwater villas, private candlelight dinners & secluded beaches', image: '/assets/images/slide/slide2.jpg', icon: '💑', badge: 'Top Pick', order: 1 },
				{ id: 'family', title: 'Family', subtitle: 'Kids & Comfort Stays', desc: 'Theme parks, spacious luxury suites & curated family excursions', image: '/assets/images/tour/5.jpg', icon: '👨‍👩‍👧‍👦', badge: 'All-Inclusive', order: 2 },
				{ id: 'friends', title: 'Friends', subtitle: 'Adventure & Nightlife', desc: 'Desert safaris, yacht parties, water sports & group thrill trails', image: '/assets/images/tour/3.jpg', icon: '🏄‍♂️', badge: 'Group Deals', order: 3 },
				{ id: 'solo', title: 'Solo', subtitle: 'Explore & Discover', desc: 'Scenic train journeys, heritage walking tours & flexible escapes', image: '/assets/images/tour/4.jpg', icon: '🧭', badge: 'Customizable', order: 4 },
				{ id: 'seniors', title: 'Seniors', subtitle: 'Relaxed & Heritage', desc: 'Gentle pace, spiritual circuits, Indian dining & 24/7 assistance', image: '/assets/images/tour/1.jpg', icon: '🏛️', badge: 'All-Assisted', order: 5 }
			])
			console.log('✅ Personas seeded.')
		}

		// 6. Seed Destinations (Explore The World)
		const destCount = await Destination.count()
		if (destCount === 0) {
			await Destination.bulkCreate([
				// Category 1: Popular Worldwide
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Rann of Kutch (White Desert)', img: '/assets/images/packages/rann-kutch.jpg', link: '/tour/rann-utsav-kutch', tours: '4 Days / 3 Nights', order: 1 },
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Rajasthan Royal Forts', img: '/assets/images/packages/rajasthan-fort.jpg', link: '/tour/rajasthan-royal-heritage', tours: '7 Days / 6 Nights', order: 2 },
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Puri & Konark, Odisha', img: '/assets/images/packages/puri-temple.jpg', link: '/tour/puri-bhubaneswar-heritage', tours: '5 Days / 4 Nights', order: 3 },
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Andaman Islands', img: '/assets/images/packages/andaman-beach.jpg', link: '/tour/andaman-islands-escape', tours: '5 Days / 4 Nights', order: 4 },
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Meghalaya & Kaziranga', img: '/assets/images/packages/northeast-hills.jpg', link: '/tour/north-east-program', tours: '6 Days / 5 Nights', order: 5 },
				{ category: 1, categoryName: 'Popular Worldwide', name: 'Vietnam (Halong & Da Nang)', img: '/assets/images/packages/vietnam.jpg', link: '/tour/vietnam-beauty-of-vietnam', tours: '9 Days / 8 Nights', order: 6 },

				// Category 2: Asia & Exotic Islands
				{ category: 2, categoryName: 'Asia & Exotic Islands', name: 'Taiwan (Taipei & North Coast)', img: '/assets/images/packages/taiwan.jpg', link: '/tour/taiwan-taipei-explorer', tours: '6 Days / 5 Nights', order: 7 },
				{ category: 2, categoryName: 'Asia & Exotic Islands', name: 'Spain (Barcelona & Madrid)', img: '/assets/images/packages/spain.jpg', link: '/tour/spain-barcelona-madrid', tours: '7 Days / 6 Nights', order: 8 },
				{ category: 2, categoryName: 'Asia & Exotic Islands', name: 'South Korea (Seoul & Busan)', img: '/assets/images/packages/south-korea.jpg', link: '/tour/south-korea-seoul-busan', tours: '5 Days / 4 Nights', order: 9 },
				{ category: 2, categoryName: 'Asia & Exotic Islands', name: 'Philippines (Manila & Falls)', img: '/assets/images/packages/philippines.jpg', link: '/tour/philippines-manila-angeles-pagsanjan', tours: '6 Days / 5 Nights', order: 10 },
				{ category: 2, categoryName: 'Asia & Exotic Islands', name: 'Bali Tropical Island', img: '/assets/images/destination/des1.jpg', link: '/tour?search=Bali', tours: '19 Tours', order: 11 },

				// Category 3: Scenic Peaks & Valleys
				{ category: 3, categoryName: 'Scenic Peaks & Valleys', name: 'Swiss Interlaken', img: '/assets/images/explore/9.jpg', link: '/tour?search=Switzerland', tours: '18 Tours', order: 12 },
				{ category: 3, categoryName: 'Scenic Peaks & Valleys', name: 'Kashmir Valley', img: '/assets/images/destination/des3.jpg', link: '/tour?search=Kashmir', tours: '21 Tours', order: 13 },
				{ category: 3, categoryName: 'Scenic Peaks & Valleys', name: 'Canadian Rockies', img: '/assets/images/explore/10.jpg', link: '/tour', tours: '10 Tours', order: 14 },
				{ category: 3, categoryName: 'Scenic Peaks & Valleys', name: 'Norwegian Fjords', img: '/assets/images/destination/list3.jpg', link: '/tour', tours: '8 Tours', order: 15 },

				// Category 4: Historic & Cultural
				{ category: 4, categoryName: 'Historic & Cultural', name: 'Santorini, Greece', img: '/assets/images/destination/des5.jpg', link: '/tour', tours: '15 Tours', order: 16 },
				{ category: 4, categoryName: 'Historic & Cultural', name: 'London, UK', img: '/assets/images/destination/img2.jpg', link: '/tour', tours: '17 Tours', order: 17 },
				{ category: 4, categoryName: 'Historic & Cultural', name: 'Venice Canals, Italy', img: '/assets/images/destination/list5.jpg', link: '/tour', tours: '13 Tours', order: 18 },
				{ category: 4, categoryName: 'Historic & Cultural', name: 'Eiffel Tower, Paris', img: '/assets/images/destination/des2.jpg', link: '/tour', tours: '24 Tours', order: 19 }
			])
			console.log('✅ Destinations seeded.')
		}

		// 7. Seed Features (Why Choose Us)
		const featureCount = await Feature.count()
		if (featureCount === 0) {
			await Feature.bulkCreate([
				{ icon: '🎯', title: '100% Customized Trips', description: 'Build your dream itinerary tailored to your exact pace, hotel preferences, and activities.', order: 1 },
				{ icon: '💬', title: '24/7 On-Trip Concierge', description: 'Real destination experts supporting you on WhatsApp throughout your journey in real time.', order: 2 },
				{ icon: '💎', title: 'Transparent Pricing', description: 'All-inclusive packages with flights, 4★/5★ hotels, meals, and sightseeing. Zero hidden charges.', order: 3 },
				{ icon: '🛂', title: 'Expert Visa Assistance', description: 'End-to-end documentation assistance with a proven 99.2% visa approval track record.', order: 4 }
			])
			console.log('✅ Why Choose Us features seeded.')
		}

		// 7b. Seed Trust Stats
		const trustStatCount = await TrustStat.count()
		if (trustStatCount === 0) {
			await TrustStat.bulkCreate([
				{ icon: '🏆', number: '25+', label: 'Years of Excellence', desc: 'Serving travelers since 1999', order: 1 },
				{ icon: '✈️', number: '50,000+', label: 'Happy Travelers', desc: 'Delighted families & explorers', order: 2 },
				{ icon: '🌍', number: '150+', label: 'Global Destinations', desc: 'Covering 6 continents', order: 3 },
				{ icon: '⭐', number: '4.9 / 5', label: 'Google Rating', desc: 'Based on 4,800+ real reviews', order: 4 }
			])
			console.log('✅ Trust stats seeded.')
		}

		// 8. Seed Testimonials (Client Stories)
		const testCount = await Testimonial.count()
		if (testCount === 0) {
			await Testimonial.bulkCreate([
				{
					name: 'Priya & Rajesh Sharma',
					role: 'Honeymoon in Switzerland & Paris',
					text: '“Our Switzerland & Paris honeymoon planned by Golden Travels was an absolute fairytale! From panoramic Glacier Express tickets to romantic chalet bookings, everything was flawlessly organized with 24/7 WhatsApp concierge.”',
					rating: 5,
					order: 1
				},
				{
					name: 'Dr. Anand Ramanathan',
					role: 'Family Trip to Singapore & Bali',
					text: '“Traveling with children and senior parents can be stressful, but Golden Travels made it 100% effortless. Indian meals, private transfers, and handpicked luxury resorts made our vacation memorable and relaxing.”',
					rating: 5,
					order: 2
				},
				{
					name: 'Vikram Mehta & Family',
					role: 'Vietnam & Halong Bay Explorer',
					text: '“Booked a 9-day Vietnam package with Golden Travels. The Halong Bay luxury cruise, Ba Na Hills Golden Bridge, and Phu Quoc islands were magical. Authentic Indian meals and dedicated guides made our trip totally seamless!”',
					rating: 5,
					order: 3
				}
			])
			console.log('✅ Client stories seeded.')
		}

		// 9. Seed FAQs
		const faqCount = await Faq.count()
		if (faqCount === 0) {
			await Faq.bulkCreate([
				{ question: 'Can I customize my tour package according to my dates and budget?', answer: 'Absolutely! Every itinerary at Golden Travels is 100% customizable. You can adjust the number of days, hotel category (4★/5★), sightseeing activities, private transfers, and meal plans according to your exact preference.', order: 1 },
				{ question: 'How does Golden Travels assist with visas and documentation?', answer: 'Our dedicated visa concierge team provides end-to-end documentation assistance, appointment scheduling, cover letter drafting, and biometric guidance with an industry-leading 99.2% approval success rate.', order: 2 },
				{ question: 'What kind of support is provided while traveling on the trip?', answer: 'You will have access to a 24/7 dedicated on-trip concierge manager on WhatsApp and phone. From flight updates to local driver coordination and emergency assistance, our team is always just a text away.', order: 3 },
				{ question: 'What are the payment terms and refund policies?', answer: 'We offer flexible payment milestone plans with transparent pricing. You can book your package with an initial deposit, and the balance can be paid in convenient installments before departure. Zero hidden charges guaranteed.', order: 4 }
			])
			console.log('✅ FAQs seeded.')
		}

		// 10. Seed Home Sections
		const sectionCount = await HomeSection.count()
		if (sectionCount === 0) {
			await HomeSection.bulkCreate([
				{ sectionKey: 'persona', sectionName: 'Personalized Experience', badge: 'Personalized Experience', title: "Who's Travelling With You?", subtitle: 'Choose your travel persona below to instantly view handcrafted holiday packages tailored for your style', bgImage: '/assets/images/page/breakcrumb.jpg' },
				{ sectionKey: 'exclusive_packages', sectionName: 'Exclusive Packages', badge: 'Handcrafted Itineraries', title: 'Exclusive Tour Packages', subtitle: 'Curated international & domestic holiday journeys with transparent pricing & guaranteed departures', bgImage: '' },
				{ sectionKey: 'explore_world', sectionName: 'Explore The World', badge: 'Explore The World', title: 'Top Trending Destinations', subtitle: 'Handpicked wonder spots across the globe curated for memorable experiences', bgImage: '' },
				{ sectionKey: 'why_choose_us', sectionName: 'Why Choose Us', badge: 'The Golden Travels Difference', title: 'Why 50,000+ Travelers Choose Us', subtitle: 'Experience seamless, royal-grade holiday planning backed by industry-leading reliability', bgImage: '/assets/images/about-us/about-h4.jpg' },
				{ sectionKey: 'client_stories', sectionName: 'Client Stories', badge: 'Client Stories', title: 'What Travelers Say About Us', subtitle: 'Genuine experiences from travelers who explored the world with Golden Travels', bgImage: '' },
				{ sectionKey: 'faq', sectionName: 'Frequently Asked Questions', badge: 'Got Questions?', title: 'Frequently Asked Questions', subtitle: 'Quick answers to everything you need to know about planning your holiday with us', bgImage: '' }
			])
			console.log('✅ Section headers seeded.')
		}

		// 11. Seed Sample Inquiries if empty
		const inquiryCount = await Inquiry.count()
		if (inquiryCount === 0) {
			await Inquiry.bulkCreate([
				{
					name: 'Karthik Subramanian',
					phone: '+91 98401 23456',
					email: 'karthik.subbu@gmail.com',
					destination: 'Vietnam',
					packageName: 'Beauty of Vietnam - Hanoi, Halong & Da Nang',
					duration: '9 Days | 8 Nights',
					travelDate: '9 Days | 8 Nights',
					travelers: '2',
					month: 'November 2026',
					message: 'Looking for a private luxury couple package with Indian vegetarian meals on Halong cruise.',
					status: 'new',
					source: 'Tour Package Inquiry'
				},
				{
					name: 'Priya & Ramesh',
					phone: '+91 99441 87654',
					email: 'priya.ramesh@yahoo.com',
					destination: 'South Korea',
					packageName: 'South Korea Explorer (Seoul & Busan)',
					duration: '7 Days | 6 Nights',
					travelDate: '7 Days | 6 Nights',
					travelers: '4',
					month: 'December 2026',
					message: 'Family trip with 2 kids. Need 4-star central hotels and KTX bullet train tickets included.',
					status: 'contacted',
					source: 'Contact Page'
				},
				{
					name: 'Dr. Anand Kumar',
					phone: '+91 94432 11223',
					email: 'anand.ent@gmail.com',
					destination: 'Rann of Kutch, Gujarat',
					packageName: 'Rann Utsav — The Tent City, Dhordo (Kutch)',
					duration: '4 Days | 3 Nights',
					travelDate: '4 Days | 3 Nights',
					travelers: '2',
					month: 'October 2026',
					message: 'Please send complete quotation for Rann Utsav White Rann Tent City package.',
					status: 'in-progress',
					source: 'Tour Package Inquiry'
				}
			])
			console.log('✅ Sample inquiries seeded for demonstration.')
		}

		// 12. Seed Blogs if empty
		const blogCount = await Blog.count()
		if (blogCount === 0) {
			await Blog.bulkCreate(DEFAULT_BLOGS)
			console.log('✅ Blogs seeded.')
		}

		console.log('🎉 Database seeding completed successfully!')
	} catch (error) {
		console.error('❌ Seeding failed:', error)
	}
}

// Run if called directly
if (process.argv[1]?.endsWith('seed.js')) {
	seedDatabase().then(() => {
		process.exit(0)
	})
}
