import sequelize from '../config/db.js'
import Admin from './Admin.js'
import Package from './Package.js'
import Inquiry from './Inquiry.js'
import Slide from './Slide.js'
import Banner from './Banner.js'
import Persona from './Persona.js'
import Destination from './Destination.js'
import Feature from './Feature.js'
import Testimonial from './Testimonial.js'
import Faq from './Faq.js'
import HomeSection from './HomeSection.js'
import TrustStat from './TrustStat.js'
import Blog from './Blog.js'
import DestinationRegion from './DestinationRegion.js'
import PageMeta from './PageMeta.js'
import Partner from './Partner.js'

export {
	sequelize,
	Admin,
	Package,
	Inquiry,
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
	Partner
}

export const syncDb = async (force = false) => {
	try {
		// Clean up duplicate indexes created by previous sync({ alter: true }) runs
		for (const table of ['admins', 'packages']) {
			try {
				const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${table}\``)
				const duplicateKeys = [
					...new Set(
						indexes
							.map(idx => idx.Key_name)
							.filter(name => /_\d+$/.test(name))
					)
				]
				for (const keyName of duplicateKeys) {
					await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${keyName}\``)
				}
			} catch (_) {
				// Table may not exist yet on first run
			}
		}

		await sequelize.sync({ force })

		// Ensure new columns exist on inquiries table
		await sequelize.query('ALTER TABLE `inquiries` ADD COLUMN `packageName` VARCHAR(200) NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `inquiries` ADD COLUMN `duration` VARCHAR(80) NULL').catch(() => {})

		// Ensure SEO columns exist on packages table
		await sequelize.query('ALTER TABLE `packages` ADD COLUMN `metaTitle` VARCHAR(255) NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `packages` ADD COLUMN `metaDescription` TEXT NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `packages` ADD COLUMN `metaKeywords` TEXT NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `packages` ADD COLUMN `canonicalUrl` VARCHAR(255) NULL').catch(() => {})

		// Ensure SEO columns exist on blogs table
		await sequelize.query('ALTER TABLE `blogs` ADD COLUMN `metaTitle` VARCHAR(255) NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `blogs` ADD COLUMN `metaDescription` TEXT NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `blogs` ADD COLUMN `metaKeywords` TEXT NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `blogs` ADD COLUMN `canonicalUrl` VARCHAR(255) NULL').catch(() => {})
		await sequelize.query('ALTER TABLE `blogs` ADD COLUMN `sections` JSON NULL').catch(() => {})

		// Ensure canonicalUrl exists on page_meta table
		await sequelize.query('ALTER TABLE `page_meta` ADD COLUMN `canonicalUrl` VARCHAR(255) NULL').catch(() => {})

		// Ensure showInCtaBanner exists on slides table
		await sequelize.query('ALTER TABLE `slides` ADD COLUMN `showInCtaBanner` TINYINT(1) DEFAULT 0').catch(() => {})

		// Ensure showInExplore exists on packages table
		await sequelize.query('ALTER TABLE `packages` ADD COLUMN `showInExplore` TINYINT(1) DEFAULT 1').catch(() => {})

		// Auto-populate canonicalUrl for all existing packages & blogs
		await sequelize.query("UPDATE `packages` SET `canonicalUrl` = CONCAT('https://goldentravels.in/tour/', `slug`) WHERE (`canonicalUrl` IS NULL OR `canonicalUrl` = '') AND `slug` IS NOT NULL").catch(() => {})
		await sequelize.query("UPDATE `blogs` SET `canonicalUrl` = CONCAT('https://goldentravels.in/blog/', `slug`) WHERE (`canonicalUrl` IS NULL OR `canonicalUrl` = '') AND `slug` IS NOT NULL").catch(() => {})

		// Populate full canonicalUrl for standard static pages in page_meta
		await sequelize.query("UPDATE `page_meta` SET `canonicalUrl` = 'https://goldentravels.in/' WHERE `pageKey` = 'home' AND (`canonicalUrl` IS NULL OR `canonicalUrl` = '' OR `canonicalUrl` = '/')").catch(() => {})
		await sequelize.query("UPDATE `page_meta` SET `canonicalUrl` = 'https://goldentravels.in/tour' WHERE `pageKey` = 'tours' AND (`canonicalUrl` IS NULL OR `canonicalUrl` = '' OR `canonicalUrl` = '/tour')").catch(() => {})
		await sequelize.query("UPDATE `page_meta` SET `canonicalUrl` = 'https://goldentravels.in/blog' WHERE `pageKey` = 'blog' AND (`canonicalUrl` IS NULL OR `canonicalUrl` = '' OR `canonicalUrl` = '/blog')").catch(() => {})
		await sequelize.query("UPDATE `page_meta` SET `canonicalUrl` = 'https://goldentravels.in/contact-us' WHERE `pageKey` = 'contact' AND (`canonicalUrl` IS NULL OR `canonicalUrl` = '' OR `canonicalUrl` = '/contact-us')").catch(() => {})
		await sequelize.query("UPDATE `page_meta` SET `canonicalUrl` = 'https://goldentravels.in/about-us' WHERE `pageKey` = 'about' AND (`canonicalUrl` IS NULL OR `canonicalUrl` = '' OR `canonicalUrl` = '/about-us')").catch(() => {})

		// Seed initial PageMeta records if empty
		const metaCount = await PageMeta.count().catch(() => 0)
		if (metaCount === 0) {
			await PageMeta.bulkCreate([
				{
					pageKey: 'home',
					pageName: 'Home Page',
					route: '/',
					metaTitle: 'Golden Travels - Luxury Tours, International Holidays & Custom Packages',
					metaDescription: 'Discover handcrafted luxury holidays, international tour packages & incredible India journeys with 24/7 on-trip concierge, 4★/5★ hotels, and seamless visa assistance.',
					metaKeywords: 'golden travels, luxury holidays, international tour packages, travel agency coimbatore, customize holiday packages, family vacation packages',
					ogImage: '/assets/images/slide/slide1.jpg',
					canonicalUrl: 'https://goldentravels.in/'
				},
				{
					pageKey: 'tours',
					pageName: 'Tour Packages Directory',
					route: '/tour',
					metaTitle: 'Explore All Tour Packages | International & Domestic Holidays | Golden Travels',
					metaDescription: 'Browse our complete collection of curated holiday packages. Europe alpine tours, Southeast Asia beach escapes, and royal India circuits tailored for you.',
					metaKeywords: 'holiday tour packages, international tour packages, domestic tour packages, cheap luxury tours, travel itineraries',
					ogImage: '/assets/images/page/breakcrumb.jpg',
					canonicalUrl: 'https://goldentravels.in/tour'
				},
				{
					pageKey: 'destinations',
					pageName: 'Destinations Directory',
					route: '/destinations',
					metaTitle: 'Worldwide Destinations Directory | Countries & States | Golden Travels',
					metaDescription: 'Explore all continents, worldwide countries, and Indian states serviced by Golden Travels. Handcrafted itineraries and instant customized holiday inquiries.',
					metaKeywords: 'world destinations, travel places, europe destinations, asia holiday countries, travel guide',
					ogImage: '/assets/images/page/breakcrumb.jpg',
					canonicalUrl: 'https://goldentravels.in/destinations'
				},
				{
					pageKey: 'blog',
					pageName: 'Travel Stories & Guides',
					route: '/blog',
					metaTitle: 'Travel Journal & Holiday Guides | Expert Tips | Golden Travels',
					metaDescription: 'Expert travel guides, visa checklists, packing advice, and romantic holiday inspiration written by our destination specialists.',
					metaKeywords: 'travel blog, schengen visa guide, honeymoon destinations 2026, travel tips, holiday guides',
					ogImage: '/assets/images/tour/1.jpg',
					canonicalUrl: 'https://goldentravels.in/blog'
				},
				{
					pageKey: 'contact',
					pageName: 'Contact Us',
					route: '/contact-us',
					metaTitle: 'Contact Golden Travels | 24/7 Luxury Travel Concierge & Booking',
					metaDescription: 'Get in touch with Golden Travels specialists in Coimbatore. Call, WhatsApp, or request an instant callback to plan your dream vacation.',
					metaKeywords: 'golden travels contact, travel agency phone number, holiday booking inquiry, tour concierge coimbatore',
					ogImage: '/assets/images/page/breakcrumb.jpg',
					canonicalUrl: 'https://goldentravels.in/contact-us'
				},
				{
					pageKey: 'about',
					pageName: 'About Us / Concierge',
					route: '/about-us',
					metaTitle: 'About Golden Travels | 25+ Years of Luxury Holiday Excellence',
					metaDescription: 'Learn about Golden Travels, serving 50,000+ happy travelers since 1999 with 100% customized itineraries, transparent pricing, and 99.2% visa success rate.',
					metaKeywords: 'about golden travels, best travel agency, luxury holiday planner, reliable tour operators',
					ogImage: '/assets/images/about-us/about-h4.jpg',
					canonicalUrl: 'https://goldentravels.in/about-us'
				}
			]).catch(() => {})
			console.log('✅ Default SEO Page Meta records seeded successfully')
		}

		// Seed initial Partner records if empty
		const partnerCount = await Partner.count().catch(() => 0)
		if (partnerCount === 0) {
			await Partner.bulkCreate([
				{ name: 'Emirates', tagline: 'FLY BETTER', iconType: 'plane', order: 1, isActive: true },
				{ name: 'Singapore Airlines', tagline: 'A GREAT WAY TO FLY', iconType: 'plane', order: 2, isActive: true },
				{ name: 'Qatar Airways', tagline: "WORLD'S BEST AIRLINE", iconType: 'globe', order: 3, isActive: true },
				{ name: 'Marriott Bonvoy', tagline: 'LUXURY HOTELS & RESORTS', iconType: 'hotel', order: 4, isActive: true },
				{ name: 'Swiss Travel System', tagline: 'SWISS PANORAMIC TRAINS', iconType: 'train', order: 5, isActive: true },
				{ name: 'Taj Hotels & Palaces', tagline: 'ICONIC ROYAL LUXURY', iconType: 'building', order: 6, isActive: true },
				{ name: 'Etihad Airways', tagline: 'CHOOSE WELL', iconType: 'plane', order: 7, isActive: true },
				{ name: 'Star Alliance', tagline: 'GLOBAL NETWORK', iconType: 'star', order: 8, isActive: true }
			]).catch(() => {})
			console.log('✅ Default Partner badges seeded successfully')
		}

		console.log('✅ All Database models synchronized with MySQL successfully')
	} catch (error) {
		console.error('❌ Error synchronizing database models:', error)
	}
}
