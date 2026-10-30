import React, { useState, useEffect } from 'react'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { fetchBlogs } from '@/services/api'
import SEO from '@/components/elements/SEO'
import { IconCalendar } from '@/components/common/Icons'

export const defaultArticles = [
	{
		id: 1,
		slug: "the-ultimate-switzerland-alps-itinerary-for-indian-travelers",
		title: "The Ultimate Switzerland & Alps Itinerary for Indian Travelers",
		excerpt: "From scenic Swiss panoramic trains to snow-clad peaks in Jungfraujoch and Lucerne boat cruises, here is how to experience Europe's crown jewel seamlessly.",
		heading: "1. The Magic of Swiss Travel Pass & Alpine Peaks",
		category: "Europe",
		date: "Oct 05, 2026",
		readTime: "6 min read",
		image: "/assets/images/slide/slide3.jpg",
		author: "Europe Specialist"
	},
	{
		id: 2,
		slug: "maldives-all-inclusive-vs-half-board-expert-guide-from-coimbatore",
		title: "Maldives All-Inclusive vs Half-Board: Expert Guide from Coimbatore",
		excerpt: "Planning your honeymoon or private villa escape? Discover the key differences between meal plans, transfer speedboats, and seaplanes in the Maldives.",
		heading: "1. All-Inclusive vs Half-Board & Island Transfers",
		category: "Honeymoon",
		date: "Sep 28, 2026",
		readTime: "5 min read",
		image: "/assets/images/slide/slide1.jpg",
		author: "Island Curator"
	},
	{
		id: 3,
		slug: "top-7-romantic-international-honeymoon-destinations-for-2026",
		title: "Top 7 Romantic International Honeymoon Destinations for 2026",
		excerpt: "Looking for privacy, infinity pools, and candlelit dinners by the ocean? Explore our top handpicked honeymoon destinations curated for newly-wed couples.",
		heading: "1. Romantic Island Villas & European Fairytales",
		category: "Honeymoon",
		date: "Sep 20, 2026",
		readTime: "7 min read",
		image: "/assets/images/tour/3.jpg",
		author: "Luxury Advisor"
	},
	{
		id: 4,
		slug: "how-to-secure-schengen-visa-with-ease-essential-checklist",
		title: "How to Secure Schengen Visa with Ease: Essential Checklist",
		excerpt: "A complete step-by-step guide on documents, appointment slots, travel insurance, and itinerary planning for travelers applying from South India.",
		heading: "1. Core Documentation Checklist & Appointment Slots",
		category: "Visa Guide",
		date: "Sep 15, 2026",
		readTime: "8 min read",
		image: "/assets/images/tour/1.jpg",
		author: "Visa Concierge"
	},
	{
		id: 5,
		slug: "bali-beyond-the-beaches-cultural-luxury-escapes-in-ubud",
		title: "Bali Beyond the Beaches: Cultural & Luxury Escapes in Ubud",
		excerpt: "Immerse in lush rice terraces, private forest pool villas, and spiritual temple ceremonies across the magical heart of Bali.",
		heading: "1. Tegalalang Rice Terraces & Boutique Stays in Ubud",
		category: "Asia",
		date: "Sep 10, 2026",
		readTime: "5 min read",
		image: "/assets/images/tour/4.jpg",
		author: "Asia Planner"
	},
	{
		id: 6,
		slug: "vietnam-essentials-halong-bay-cruises-ba-na-hills-phu-quoc-beaches",
		title: "Vietnam Essentials: Halong Bay Cruises, Ba Na Hills & Phu Quoc Beaches",
		excerpt: "A complete 9-day traveler guide covering Hanoi heritage, Halong Bay overnight cruises, Golden Bridge in Danang, and tropical Phu Quoc adventures.",
		heading: "1. Halong Bay Cruises & Ba Na Hills Highlights",
		category: "Asia",
		date: "Sep 02, 2026",
		readTime: "6 min read",
		image: "/assets/images/packages/vietnam.jpg",
		author: "International Lead"
	}
]

export default function Blog() {
	const [articles, setArticles] = useState(defaultArticles)

	useEffect(() => {
		fetchBlogs().then(res => {
			if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
				setArticles(res.data)
			}
		})
	}, [])

	return (
		<Layout
			headerStyle={3}
			footerStyle={1}
			pageKey="blog"
			breadcrumbTitle="Travel Stories & Guides"
			breadcrumbSubtitle="Insider tips, destination highlights and travel inspiration"
		>
			<SEO pageKey="blog" />
			{/* 1. Header */}
			<section style={{ padding: '60px 0 60px', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ textAlign: 'center', marginBottom: '40px' }}>
						<div className="col-lg-12">
							<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
								Inspiration &amp; Advice
							</span>
							<h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0' }}>
								Golden Travels Vacation Journal
							</h2>
							<p style={{ color: '#64748b', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
								Expert destination insights, visa tips, and curated holiday guides to help you plan your next dream vacation.
							</p>
						</div>
					</div>

					{/* Articles Grid */}
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
						{articles.map((article) => {
							const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
							return (
								<div
									key={article.id || slug}
									style={{
										backgroundColor: '#ffffff',
										borderRadius: '20px',
										overflow: 'hidden',
										boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
										border: '1px solid #e2e8f0',
										display: 'flex',
										flexDirection: 'column',
										transition: 'transform 0.3s ease, box-shadow 0.3s ease'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-6px)'
										e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0)'
										e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.06)'
									}}
								>
									{/* Image or Video */}
									<div style={{ height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
										{/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(article.image || '') ? (
											<video
												src={article.image}
												muted
												loop
												autoPlay
												playsInline
												controls
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										) : (
											<img
												src={article.image}
												alt={article.title}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										)}
										<span
											style={{
												position: 'absolute',
												top: '16px',
												left: '16px',
												backgroundColor: '#16a34a',
												color: '#ffffff',
												padding: '4px 12px',
												borderRadius: '20px',
												fontSize: '11px',
												fontWeight: '800',
												textTransform: 'uppercase',
												letterSpacing: '0.05em'
											}}
										>
											{article.category}
										</span>
									</div>

									{/* Content */}
									<div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
										<div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
												<IconCalendar size={13} color="#94a3b8" /> {article.date}
											</span>
											<span>•</span>
											<span>{article.readTime}</span>
										</div>

										<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', lineHeight: 1.4, margin: '0 0 10px 0' }}>
											{article.title}
										</h3>

										<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0', flex: 1 }}>
											{article.excerpt}
										</p>

										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
											<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
												{article.author || 'Golden Travels'}
											</span>
											<Link
												href={`/blog/${slug}`}
												style={{
													color: '#16a34a',
													fontSize: '14px',
													fontWeight: '800',
													textDecoration: 'none',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '4px'
												}}
											>
												Read More ➔
											</Link>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>
		</Layout>
	)
}

