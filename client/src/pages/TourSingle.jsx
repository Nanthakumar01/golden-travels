import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { getPackageBySlug, packagesData } from "@/data/packagesData"
import { fetchPackageByIdOrSlug } from '@/services/api'
import { openInquiryModal } from "@/components/elements/InquiryModal"
import SEO, { getBaseSiteUrl } from "@/components/elements/SEO"
import {
	IconIndiaFlag,
	IconGlobe,
	IconCalendar,
	IconLocation,
	IconCheck,
	IconClose,
	IconMap,
	IconSparkles,
	IconMeal,
	IconSearch,
	IconShield
} from "@/components/common/Icons"

const ensureArray = (val, fallback = []) => {
	if (!val) return fallback
	if (Array.isArray(val)) return val
	if (typeof val === 'string') {
		try {
			const parsed = JSON.parse(val)
			if (Array.isArray(parsed)) return parsed
		} catch {
			return val.split(',').map((s) => s.trim()).filter(Boolean)
		}
	}
	return fallback
}

export default function TourSingle() {
	const { slug } = useParams()
	const [activeTab, setActiveTab] = useState("itinerary")
	const [lightboxIndex, setLightboxIndex] = useState(-1)
	const staticTour = getPackageBySlug(slug)
	const [liveTour, setLiveTour] = useState(null)

	useEffect(() => {
		const loadLive = async () => {
			try {
				const res = await fetchPackageByIdOrSlug(slug)
				if (res && res.success && res.data) {
					setLiveTour(res.data)
				}
			} catch (e) {}
		}
		if (slug) loadLive()
	}, [slug])

	const tour = liveTour || staticTour || {}

	const waLink = `https://wa.me/919003546546?text=${encodeURIComponent(`Hi Golden Travels, I would like to enquire about the ${tour.title} package!`)}`

	const itinerary = ensureArray(tour.itinerary)
	const rawGallery = ensureArray(tour.gallery)
	const baseGallery = rawGallery.length > 0 ? rawGallery : [
		{ src: tour.image || "/assets/images/tour/1.jpg", title: tour.title || "Tour Destination" },
		{ src: "/assets/images/tour/2.jpg", title: "Luxury Resort & Scenic Views" },
		{ src: "/assets/images/tour/3.jpg", title: "City Highlights & Culture" },
		{ src: "/assets/images/tour/4.jpg", title: "Panoramic Excursions" },
		{ src: "/assets/images/tour/5.jpg", title: "Waterfront & Sunsets" },
		{ src: "/assets/images/tour/6.jpg", title: "Signature Dining & Stays" }
	]
	const galleryImages = baseGallery.map((item, idx) => {
		if (typeof item === 'string') {
			return { src: item, title: `${tour.title || 'Tour Highlight'} (${idx + 1})` }
		}
		return {
			src: item.src || item.url || item.image || "/assets/images/tour/1.jpg",
			title: item.title || item.caption || `${tour.title || 'Tour Highlight'} (${idx + 1})`
		}
	})

	const dayImagesList = itinerary.map((item, idx) => ({
		src: item.image || galleryImages[idx % galleryImages.length]?.src || tour.image || "/assets/images/tour/1.jpg",
		title: (item.imageTitle && item.imageTitle.trim())
			? item.imageTitle.trim()
			: (item.title ? `${item.day || `Day ${idx + 1}`}: ${item.title}` : (galleryImages[idx % galleryImages.length]?.title || `Day ${idx + 1}`))
	}))

	const activeLightboxList = dayImagesList.length > 0 ? dayImagesList : galleryImages

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (lightboxIndex < 0) return
			if (e.key === 'Escape') setLightboxIndex(-1)
			if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % activeLightboxList.length)
			if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + activeLightboxList.length) % activeLightboxList.length)
		}
		window.addEventListener('keydown', handleKeyDown)
		if (lightboxIndex >= 0) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [lightboxIndex, activeLightboxList.length])

	const tourSchema = tour.title ? {
		'@context': 'https://schema.org',
		'@type': 'TouristTrip',
		'name': tour.title,
		'description': tour.metaDescription || tour.about || tour.overview || `${tour.title} holiday package by Golden Travels`,
		'image': tour.image,
		'touristType': tour.personas || ['Family', 'Couples', 'Solo'],
		'offers': {
			'@type': 'Offer',
			'priceCurrency': 'INR',
			'price': tour.price ? String(tour.price).replace(/[^0-9]/g, '') : '0',
			'availability': 'https://schema.org/InStock',
			'validFrom': new Date().toISOString().split('T')[0]
		},
		'provider': {
			'@type': 'TravelAgency',
			'name': 'Golden Travels',
			'telephone': '+91 93630 25252'
		}
	} : null

	return (
		<Layout headerStyle={3} footerStyle={1} breadcrumbTitle={tour.shortTitle || tour.title}>
			<SEO
				title={tour.metaTitle || (tour.title ? `${tour.title} | Golden Travels` : undefined)}
				description={tour.metaDescription || tour.about || tour.overview || undefined}
				keywords={tour.metaKeywords || (tour.title ? `${tour.title}, ${tour.destination || ''}, holiday package, golden travels` : undefined)}
				image={tour.image}
				canonical={tour.canonicalUrl || (tour.slug ? `${getBaseSiteUrl()}/tour/${tour.slug}` : undefined)}
				type="product"
				schema={tourSchema}
			/>
			
			<style>{`
				.tour-single-layout {
					display: flex;
					flex-direction: column;
					gap: 28px;
					width: 100%;
				}
				.tour-top-hero-row {
					display: flex;
					align-items: flex-start;
					gap: 28px;
					width: 100%;
				}
				.tour-top-overview-col {
					flex: 1.15;
					min-width: 0;
					display: flex;
					flex-direction: column;
				}
				.tour-top-overview-col .tour-overview-card {
					display: flex;
					flex-direction: column;
					justifyContent: flex-start;
					background-color: #ffffff;
					padding: 28px 30px;
					border-radius: 20px;
					box-shadow: 0 4px 20px rgba(0,0,0,0.04);
					border: 1px solid #e2e8f0;
				}
				.tour-top-booking-col {
					flex: 0.85;
					min-width: 360px;
					max-width: 480px;
					display: flex;
					flex-direction: column;
				}
				.tour-top-booking-col .tour-summary-card {
					height: 100%;
					display: flex;
					flex-direction: column;
					background-color: #ffffff;
					border-radius: 20px;
					box-shadow: 0 8px 30px rgba(0,0,0,0.06);
					border: 1px solid #e2e8f0;
					overflow: hidden;
				}
				.tour-content-col {
					width: 100%;
					min-width: 0;
				}
				.tour-tabs-bar {
					display: flex;
					gap: 10px;
					border-bottom: 2px solid #e2e8f0;
					padding-bottom: 14px;
					margin-bottom: 24px;
					flex-wrap: wrap;
				}
				@media (max-width: 991px) {
					.tour-top-hero-row {
						flex-direction: column-reverse !important;
						gap: 20px;
					}
					.tour-top-overview-col,
					.tour-top-booking-col {
						flex: 1 1 100%;
						max-width: 100%;
						min-width: 0;
					}
					.tour-quick-overview-section {
						display: none !important;
					}
					.tour-tabs-bar {
						overflow-x: auto;
						flex-wrap: nowrap;
						-webkit-overflow-scrolling: touch;
						scrollbar-width: none;
						padding-bottom: 8px;
					}
					.tour-tabs-bar::-webkit-scrollbar {
						display: none;
					}
					.tour-tab-btn {
						white-space: nowrap !important;
						padding: 8px 16px !important;
						font-size: 13px !important;
						flex-shrink: 0;
					}
				}
				.tour-itinerary-flex-row {
					display: flex;
					gap: 22px;
					align-items: stretch;
				}
				.tour-itinerary-text-col {
					flex: 1;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
				}
				.tour-day-photo {
					width: clamp(210px, 22vw, 280px);
					min-width: 200px;
					max-width: 280px;
					align-self: stretch;
					border-radius: 14px;
					overflow: hidden;
					position: relative;
					box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
					border: 1px solid #e2e8f0;
					cursor: pointer;
					flex-shrink: 0;
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}
				.tour-day-photo-img {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					object-fit: cover;
					display: block;
					transition: transform 0.4s ease;
				}
				.tour-day-photo:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 22px rgba(15, 23, 42, 0.16);
				}
				.tour-day-photo:hover .tour-day-photo-img {
					transform: scale(1.08);
				}
				@media (max-width: 768px) {
					.tour-overview-card {
						padding: 20px 18px !important;
						border-radius: 16px !important;
					}
					.tour-summary-card {
						border-radius: 16px !important;
					}
					.tour-content-card {
						padding: 16px 14px !important;
						border-radius: 16px !important;
					}
					.tour-itinerary-item {
						flex-direction: column !important;
						align-items: flex-start !important;
						gap: 12px !important;
						padding-bottom: 22px !important;
					}
					.tour-itinerary-flex-row {
						flex-direction: column-reverse !important;
						gap: 14px !important;
					}
					.tour-day-photo {
						width: 100% !important;
						min-width: 100% !important;
						max-width: 100% !important;
						height: 180px !important;
						min-height: 180px !important;
					}
					.tour-day-badge {
						width: auto !important;
						min-width: 58px !important;
						padding: 4px 12px !important;
						font-size: 11.5px !important;
						border-radius: 8px !important;
						display: inline-block !important;
					}
					.tour-itinerary-body {
						width: 100% !important;
					}
					.tour-inclusions-grid {
						grid-template-columns: 1fr !important;
					}
					.tour-gallery-grid {
						grid-template-columns: repeat(2, 1fr) !important;
						gap: 10px !important;
					}
					.tour-gallery-item {
						height: 120px !important;
						border-radius: 12px !important;
					}
					.tour-single-section {
						padding: 20px 0 40px !important;
					}
				}
				.gt-lightbox-round-btn {
					width: 38px !important;
					height: 38px !important;
					min-width: 38px !important;
					max-width: 38px !important;
					min-height: 38px !important;
					max-height: 38px !important;
					padding: 0 !important;
					border-radius: 50% !important;
					aspect-ratio: 1 / 1 !important;
					box-sizing: border-box !important;
					display: inline-flex !important;
					align-items: center !important;
					justify-content: center !important;
					text-align: center !important;
					flex-shrink: 0 !important;
					line-height: 1 !important;
				}
			`}</style>

			{/* 2. Main Layout: Top Row (Overview Left + Booking Card Right) & Full-Width Itinerary Below */}
			<section className="tour-single-section" style={{ padding: '40px 0 60px', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="tour-single-layout">
						
						{/* Top Row: Destination Overview (Left) & Booking Card (Right) */}
						<div className="tour-top-hero-row">
							
							{/* Left: About Destination Overview */}
							<div className="tour-top-overview-col">
								<div className="tour-overview-card">
									<div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
										<span>Destination Overview</span>
									</div>
									<h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 14px 0', lineHeight: 1.25 }}>
										About {tour.shortTitle || tour.title}
									</h2>
									<div className="tour-about-text" style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.75', whiteSpace: 'pre-line', textAlign: 'justify', textJustify: 'inter-word' }}>
										{tour.about || tour.overview || `${tour.title} is an exquisite holiday experience curated by Golden Travels, featuring hand-picked stays, private transfers, and unforgettable sightseeing attractions.`}
									</div>

									{/* Tour Highlights & Quick Key Features (Desktop only to prevent duplicate clutter on mobile) */}
									<div className="tour-quick-overview-section" style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
										<div style={{ fontSize: '11.5px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
											<IconSparkles size={13} color="#16a34a" />
											<span>Tour Quick Overview</span>
										</div>

										<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
											<div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
												<div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
													<IconLocation size={16} />
												</div>
												<div style={{ minWidth: 0 }}>
													<div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Destination</div>
													<div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tour.destination || tour.region || 'Scenic Destination'}</div>
												</div>
											</div>

											<div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
												<div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
													<IconCalendar size={16} />
												</div>
												<div style={{ minWidth: 0 }}>
													<div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Duration</div>
													<div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: '800' }}>{tour.duration || `${tour.days || 1} Days`}</div>
												</div>
											</div>

											<div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
												<div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
													<IconShield size={16} />
												</div>
												<div style={{ minWidth: 0 }}>
													<div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Package Type</div>
													<div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: '800' }}>{tour.type === 'DOMESTIC' ? 'Domestic Holiday' : 'International Escorted'}</div>
												</div>
											</div>
										</div>

										{/* Key Inclusions Highlights Pills */}
										{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).length > 0 && (
											<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
												{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).map((inc, iIdx) => (
													<span key={iIdx} style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '16px', backgroundColor: '#ecfdf5', color: '#15803d', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconCheck size={11} color="#16a34a" /> {inc}
													</span>
												))}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Right: Tour Booking / Summary Card */}
							<div className="tour-top-booking-col">
								<div className="tour-summary-card">
									<div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
										<img src={tour.image || "/assets/images/tour/1.jpg"} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
										<div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap', zIndex: 2, pointerEvents: 'none' }}>
											<span style={{ backgroundColor: tour.type === 'DOMESTIC' ? '#16a34a' : '#071812', color: tour.type === 'DOMESTIC' ? '#ffffff' : '#FDE047', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '20px', whiteSpace: 'nowrap', border: tour.type === 'DOMESTIC' ? 'none' : '1px solid rgba(253, 224, 71, 0.4)' }}>
												{tour.type === 'DOMESTIC' ? (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconIndiaFlag size={12} /> Domestic
													</span>
												) : (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconGlobe size={12} color="#FDE047" /> International
													</span>
												)}
											</span>
											{tour.badge && (
												<span style={{ marginLeft: 'auto', backgroundColor: '#e0a21b', color: '#1d2a0f', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '5px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
													{tour.badge}
												</span>
											)}
										</div>
									</div>

									<div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
										<div>
											<h3 style={{ fontSize: '19px', fontWeight: '900', color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
												{tour.title}
											</h3>
											
											<div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#475569', fontWeight: '600', marginBottom: '14px', flexWrap: 'wrap' }}>
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
													<IconCalendar size={14} color="#64748b" /> {tour.duration || (tour.days ? `${tour.days} Day${tour.days > 1 ? 's' : ''}${tour.nights !== undefined ? ` | ${tour.nights} Night${tour.nights > 1 ? 's' : ''}` : ''}` : '')}
												</span>
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
													<IconLocation size={14} color="#64748b" /> {tour.destination || tour.region}
												</span>
											</div>

											{/* Key Features Pill Badges */}
											{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).length > 0 && (
												<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
													{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).slice(0, 3).map((item, idx) => (
														<span key={idx} style={{ fontSize: '11.5px', fontWeight: '600', padding: '3px 10px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
															<IconCheck size={11} color="#16a34a" /> {item}
														</span>
													))}
												</div>
											)}

											{/* Icons Row */}
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 4px' }}>
												{[
													{ name: 'Meals', icon: <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 2v7c0 2.2 1.8 4 4 4h1v7h2v-7h1c2.2 0 4-1.8 4-4V2H3zm13 0l-1.5 7h4L17 22"/></svg> },
													{ name: 'Sightseeing', icon: <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> },
													{ name: 'Transport', icon: <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M4 14l-1 4h2l1-4M20 14l1 4h-2l-1-4M8 10h8M6 14h12"/></svg> },
													{ name: 'Stay', icon: <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h6M9 11h6M9 15h6"/></svg> },
													{ name: 'Guide/Assist', icon: <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 12c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg> }
												].map((item, idx) => (
													<div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
														<div>{item.icon}</div>
														<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{item.name}</span>
													</div>
												))}
											</div>
										</div>

										{/* Buttons */}
										<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
											<a href="tel:04222477090" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', border: '2px solid #22c55e', color: '#22c55e', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }} title="Call Office: 0422 2477090">
												<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
											</a>

											<button
												type="button"
												onClick={() => openInquiryModal({
													packageName: tour.title || tour.shortTitle || '',
													duration: tour.duration || '',
													destination: tour.destination || tour.region || tour.cities || ''
												})}
												style={{ flex: 1, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: '#071812', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 14px rgba(7,24,18,0.3)', transition: 'all 0.2s', gap: '8px' }}
											>
												<span>Enquire Now</span>
											</button>

											<a href={waLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#25D366', color: '#ffffff', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }} title="WhatsApp Instant Chat">
												<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
											</a>
										</div>
									</div>
								</div>
							</div>

						</div>

						{/* Full-Width Main Content: Interactive Tabs & Details */}
						<div className="tour-content-col">

							{/* Tab Selection Bar */}
							<div className="tour-tabs-bar">
								<button
									type="button"
									className="tour-tab-btn"
									onClick={() => setActiveTab('itinerary')}
									style={{
										padding: '10px 22px',
										borderRadius: '12px',
										border: 'none',
										backgroundColor: activeTab === 'itinerary' ? '#071812' : '#ffffff',
										color: activeTab === 'itinerary' ? '#FDE047' : '#475569',
										fontWeight: '800',
										fontSize: '14px',
										cursor: 'pointer',
										boxShadow: activeTab === 'itinerary' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
										transition: 'all 0.25s ease'
									}}
								>
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconMap size={15} /> Itinerary ({itinerary.length} Days)
									</span>
								</button>
								<button
									type="button"
									className="tour-tab-btn"
									onClick={() => setActiveTab('experience')}
									style={{
										padding: '10px 22px',
										borderRadius: '12px',
										border: 'none',
										backgroundColor: activeTab === 'experience' ? '#071812' : '#ffffff',
										color: activeTab === 'experience' ? '#FDE047' : '#475569',
										fontWeight: '800',
										fontSize: '14px',
										cursor: 'pointer',
										boxShadow: activeTab === 'experience' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
										transition: 'all 0.25s ease'
									}}
								>
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconSparkles size={15} /> Inclusions &amp; Exclusions
									</span>
								</button>
								<button
									type="button"
									className="tour-tab-btn"
									onClick={() => setActiveTab('info')}
									style={{
										padding: '10px 22px',
										borderRadius: '12px',
										border: 'none',
										backgroundColor: activeTab === 'info' ? '#071812' : '#ffffff',
										color: activeTab === 'info' ? '#FDE047' : '#475569',
										fontWeight: '800',
										fontSize: '14px',
										cursor: 'pointer',
										boxShadow: activeTab === 'info' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
										transition: 'all 0.25s ease'
									}}
								>
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconShield size={15} /> Terms &amp; Conditions
									</span>
								</button>
							</div>

							{activeTab === 'itinerary' && (
								<div>
									{/* TAB 1: ITINERARY */}
									<div className="tour-content-card" style={{ backgroundColor: '#ffffff', padding: '32px 28px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
										<div style={{ marginBottom: '22px' }}>
											<span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Comprehensive Route</span>
											<h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>Detailed Day-Wise Itinerary</h2>
										</div>

										<div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
											{itinerary.map((item, idx) => {
												const dayImage = item.image || galleryImages[idx % galleryImages.length]?.src || tour.image || "/assets/images/tour/1.jpg"
												const dayImageTitle = (item.imageTitle && item.imageTitle.trim())
													? item.imageTitle.trim()
													: (item.title ? `${item.day || `Day ${idx + 1}`}: ${item.title}` : (galleryImages[idx % galleryImages.length]?.title || `Day ${idx + 1}`))

												return (
													<div
														key={idx}
														className="tour-itinerary-item"
														style={{
															display: 'flex',
															gap: '18px',
															alignItems: 'flex-start',
															paddingBottom: '24px',
															borderBottom: idx === itinerary.length - 1 ? 'none' : '1px solid #f1f5f9'
														}}
													>
														<div
															className="tour-day-badge"
															style={{
																width: '68px',
																padding: '8px 0',
																borderRadius: '10px',
																backgroundColor: '#071812',
																color: '#FDE047',
																fontWeight: '900',
																fontSize: '12.5px',
																textAlign: 'center',
																flexShrink: 0,
																boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
															}}
														>
															{item.day}
														</div>
														<div className="tour-itinerary-body" style={{ flex: 1, width: '100%' }}>
															<div className="tour-itinerary-flex-row">
																{/* Left Info: Title, Meals, Location, Description, Schedule (Determines height dynamically) */}
																<div className="tour-itinerary-text-col">
																	<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
																		<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
																			{item.title}
																		</h3>
																		{item.meals && (
																			<span style={{ fontSize: '11.5px', color: '#16a34a', background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px', fontWeight: '700', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
																				<IconMeal size={12} color="#16a34a" /> {item.meals}
																			</span>
																		)}
																	</div>
																	{item.loc && (
																		<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
																			<IconLocation size={12} color="#64748b" /> {item.loc}
																		</span>
																	)}
																	<p className="tour-itinerary-desc" style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.65', margin: '0 0 8px 0', textAlign: 'justify', textJustify: 'inter-word' }}>
																		{item.desc}
																	</p>

																	{/* If day has specific time schedule like Rann Utsav */}
																	{Array.isArray(item.schedule) && item.schedule.filter(Boolean).length > 0 && (
																		<div style={{ marginTop: '10px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #16a34a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
																			{item.schedule.filter(Boolean).map((slot, sIdx) => (
																				<div key={sIdx} style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
																					• {slot}
																				</div>
																			))}
																		</div>
																	)}
																</div>

																{/* Right Day Photo Thumbnail (Dynamically matches text column height) */}
																{dayImage && (
																	<div
																		className="tour-day-photo"
																		onClick={() => setLightboxIndex(idx)}
																		role="button"
																		tabIndex={0}
																		title={`Click to view ${dayImageTitle}`}
																	>
																		<img
																			src={dayImage}
																			alt={dayImageTitle}
																			className="tour-day-photo-img"
																			onError={(e) => {
																				e.currentTarget.src = "/assets/images/tour/tour-details.jpg"
																			}}
																		/>
																		<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '8px 10px', pointerEvents: 'none', zIndex: 2 }}>
																			<span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
																				{dayImageTitle}
																			</span>
																			<span style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#FDE047', fontSize: '10px', padding: '2px 6px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center' }}>
																				<IconSearch size={10} color="#FDE047" />
																			</span>
																		</div>
																	</div>
																)}
															</div>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							)}

							{activeTab === 'experience' && (
								<div>
									{/* TAB 2: INCLUSIONS & EXCLUSIONS */}
									<div className="tour-content-card" style={{ backgroundColor: '#ffffff', padding: '32px 28px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
										<h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Inclusions &amp; Exclusions</h2>
										
										<div className="tour-inclusions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
											
											{/* Inclusions */}
											<div style={{ padding: '22px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
												<h4 style={{ color: '#15803d', fontSize: '16px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
													<IconCheck size={16} color="#15803d" /> What Is Included
												</h4>
												<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#166534', fontWeight: '500' }}>
													{ensureArray(tour.inclusions).map((inc, iIdx) => (
														<li key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
															<IconCheck size={14} color="#16a34a" />
															<span>{inc}</span>
														</li>
													))}
												</ul>
											</div>

											{/* Exclusions */}
											<div style={{ padding: '22px', backgroundColor: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3' }}>
												<h4 style={{ color: '#b91c1c', fontSize: '16px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
													<IconClose size={16} color="#b91c1c" /> Exclusions / Not Included
												</h4>
												<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9f1239', fontWeight: '500' }}>
													{ensureArray(tour.exclusions).map((exc, eIdx) => (
														<li key={eIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
															<IconClose size={14} color="#ef4444" />
															<span>{exc}</span>
														</li>
													))}
												</ul>
											</div>

										</div>
									</div>
								</div>
							)}

							{activeTab === 'info' && (
								<div>
									{/* TAB 3: TERMS & CONDITIONS */}
									<div className="tour-content-card" style={{ backgroundColor: '#ffffff', padding: '32px 28px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
										<div style={{ marginBottom: '18px' }}>
											<span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Policies & Guidelines</span>
											<h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>Terms, Conditions & Special Notes</h2>
										</div>
										
										<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
											{(tour.terms || []).map((term, tIdx) => (
												<div key={tIdx} style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
													{term}
												</div>
											))}
										</div>
									</div>
								</div>
							)}

							{/* Content Ends */}
						</div>
					</div>
				</div>
			</section>

			{/* Tour Photo Lightbox Modal */}
			{lightboxIndex >= 0 && activeLightboxList[lightboxIndex] && (
				<div
					onClick={() => setLightboxIndex(-1)}
					role="dialog"
					aria-modal="true"
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(5, 12, 8, 0.96)',
						backdropFilter: 'blur(16px)',
						WebkitBackdropFilter: 'blur(16px)',
						zIndex: 999999,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						padding: '16px 20px',
						boxSizing: 'border-box'
					}}
				>
					{/* Lightbox Header Bar */}
					<div
						onClick={(e) => e.stopPropagation()}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
							maxWidth: '1200px',
							margin: '0 auto',
							padding: '8px 0',
							color: '#ffffff'
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
							<span style={{
								backgroundColor: 'rgba(229, 169, 30, 0.2)',
								border: '1px solid rgba(229, 169, 30, 0.5)',
								color: '#E5A91E',
								fontSize: '12px',
								fontWeight: '800',
								padding: '4px 12px',
								borderRadius: '20px',
								letterSpacing: '0.05em'
							}}>
								{lightboxIndex + 1} / {activeLightboxList.length}
							</span>
							<h4 style={{
								margin: 0,
								fontSize: '16px',
								fontWeight: '700',
								color: '#ffffff',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								maxWidth: '60vw'
							}}>
								{activeLightboxList[lightboxIndex].title}
							</h4>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							<span style={{ fontSize: '12px', color: '#94a3b8' }} className="d-none d-md-inline">
								Press ESC to close
							</span>
							<button
								type="button"
								className="gt-lightbox-round-btn"
								onClick={() => setLightboxIndex(-1)}
								aria-label="Close photo viewer"
								style={{
									width: '38px',
									height: '38px',
									minWidth: '38px',
									maxWidth: '38px',
									minHeight: '38px',
									maxHeight: '38px',
									padding: 0,
									borderRadius: '50%',
									aspectRatio: '1 / 1',
									backgroundColor: 'rgba(255, 255, 255, 0.14)',
									border: '1px solid rgba(255, 255, 255, 0.25)',
									color: '#ffffff',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									outline: 'none',
									boxSizing: 'border-box'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#E5A91E'
									e.currentTarget.style.borderColor = '#E5A91E'
									e.currentTarget.style.color = '#000000'
									e.currentTarget.style.transform = 'scale(1.08)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'
									e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
									e.currentTarget.style.color = '#ffffff'
									e.currentTarget.style.transform = 'scale(1)'
								}}
							>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
					</div>

					{/* Lightbox Center Image & Arrows */}
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							maxWidth: '1200px',
							margin: '0 auto',
							flex: 1,
							minHeight: 0,
							padding: '10px 0'
						}}
					>
						{/* Prev Arrow */}
						{activeLightboxList.length > 1 && (
							<button
								type="button"
								className="gt-lightbox-round-btn"
								onClick={(e) => {
									e.stopPropagation()
									setLightboxIndex((prev) => (prev - 1 + activeLightboxList.length) % activeLightboxList.length)
								}}
								aria-label="Previous photo"
								style={{
									position: 'absolute',
									left: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '38px',
									height: '38px',
									minWidth: '38px',
									maxWidth: '38px',
									minHeight: '38px',
									maxHeight: '38px',
									padding: 0,
									borderRadius: '50%',
									aspectRatio: '1 / 1',
									backgroundColor: 'rgba(15, 23, 42, 0.85)',
									border: '1px solid rgba(255, 255, 255, 0.25)',
									color: '#ffffff',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									zIndex: 10,
									transition: 'all 0.2s ease',
									outline: 'none',
									boxSizing: 'border-box'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#E5A91E'
									e.currentTarget.style.color = '#000000'
									e.currentTarget.style.borderColor = '#E5A91E'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)'
									e.currentTarget.style.color = '#ffffff'
									e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
								}}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="15 18 9 12 15 6"></polyline>
								</svg>
							</button>
						)}

						{/* Center Big Image */}
						<div
							onClick={(e) => e.stopPropagation()}
							style={{
								position: 'relative',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								maxWidth: '92vw',
								maxHeight: '72vh',
								boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
								borderRadius: '16px',
								overflow: 'hidden',
								border: '1px solid rgba(255, 255, 255, 0.15)'
							}}
						>
							<img
								src={activeLightboxList[lightboxIndex].src}
								alt={activeLightboxList[lightboxIndex].title}
								style={{
									maxWidth: '88vw',
									maxHeight: '68vh',
									width: 'auto',
									height: 'auto',
									objectFit: 'contain',
									display: 'block'
								}}
							/>
						</div>

						{/* Next Arrow */}
						{activeLightboxList.length > 1 && (
							<button
								type="button"
								className="gt-lightbox-round-btn"
								onClick={(e) => {
									e.stopPropagation()
									setLightboxIndex((prev) => (prev + 1) % activeLightboxList.length)
								}}
								aria-label="Next photo"
								style={{
									position: 'absolute',
									right: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '38px',
									height: '38px',
									minWidth: '38px',
									maxWidth: '38px',
									minHeight: '38px',
									maxHeight: '38px',
									padding: 0,
									borderRadius: '50%',
									aspectRatio: '1 / 1',
									backgroundColor: 'rgba(15, 23, 42, 0.85)',
									border: '1px solid rgba(255, 255, 255, 0.25)',
									color: '#ffffff',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									zIndex: 10,
									transition: 'all 0.2s ease',
									outline: 'none',
									boxSizing: 'border-box'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#E5A91E'
									e.currentTarget.style.color = '#000000'
									e.currentTarget.style.borderColor = '#E5A91E'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)'
									e.currentTarget.style.color = '#ffffff'
									e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
								}}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
						)}
					</div>

					{/* Thumbnail Bar */}
					{activeLightboxList.length > 1 && (
						<div
							onClick={(e) => e.stopPropagation()}
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: '10px',
								overflowX: 'auto',
								padding: '8px 4px 4px',
								maxWidth: '90vw',
								margin: '0 auto',
								scrollbarWidth: 'thin'
							}}
						>
							{activeLightboxList.map((tImg, tIdx) => (
								<button
									key={tIdx}
									type="button"
									onClick={() => setLightboxIndex(tIdx)}
									aria-label={`View photo ${tIdx + 1}`}
									style={{
										width: '60px',
										height: '42px',
										padding: 0,
										borderRadius: '8px',
										overflow: 'hidden',
										border: tIdx === lightboxIndex ? '2px solid #E5A91E' : '1px solid rgba(255,255,255,0.2)',
										opacity: tIdx === lightboxIndex ? 1 : 0.5,
										cursor: 'pointer',
										background: 'transparent',
										transition: 'all 0.2s ease',
										transform: tIdx === lightboxIndex ? 'scale(1.08)' : 'scale(1)',
										flexShrink: 0
									}}
								>
									<img
										src={tImg.src}
										alt={tImg.title}
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</Layout>
	)
}
