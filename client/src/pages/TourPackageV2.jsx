import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import CtaBanner from '@/components/sections/CtaBanner'
import { packagesData, matchesSearchQuery } from '@/data/packagesData'
import { fetchPackages } from '@/services/api'
import { openInquiryModal } from '@/components/elements/InquiryModal'
import SEO from '@/components/elements/SEO'
import { IconIndiaFlag, IconGlobe, IconLocation, IconCalendar } from '@/components/common/Icons'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

export { packagesData, matchesSearchQuery }

const ChevronLeftIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="15 18 9 12 15 6" />
	</svg>
)

const ChevronRightIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="9 18 15 12 9 6" />
	</svg>
)

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

export default function TourPackageV2() {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchQuery = (searchParams.get('search') || '').trim()
	const [activeFilter, setActiveFilter] = useState("domestic")
	const [liveList, setLiveList] = useState(packagesData)

	useEffect(() => {
		const loadPackages = async () => {
			try {
				const res = await fetchPackages({ activeOnly: 'true' })
				if (res && res.success && res.data && res.data.length > 0) {
					const mapped = res.data.map((pkg) => ({
						...pkg,
						keyInclusions: ensureArray(pkg.keyInclusions || pkg.inclusions),
						personas: ensureArray(pkg.personas, ['couple', 'family']),
						gallery: ensureArray(pkg.gallery),
						itinerary: ensureArray(pkg.itinerary)
					}))
					setLiveList(mapped)
				}
			} catch (err) {
				// Fallback to static packagesData
			}
		}
		loadPackages()
	}, [])

	const swiperRef = useRef(null)

	const categories = [
		{ id: "domestic", label: "Domestic" },
		{ id: "international", label: "International" }
	]

	const filteredPackages = searchQuery
		? liveList.filter(pkg => matchesSearchQuery(pkg, searchQuery))
		: activeFilter === "international"
			? liveList.filter(pkg => pkg.type === "INTERNATIONAL")
			: liveList.filter(pkg => pkg.type === "DOMESTIC")

	return (
		<Layout
			headerStyle={3}
			footerStyle={1}
			pageKey="tours"
			breadcrumbTitle={searchQuery ? `Search: ${searchQuery}` : "Tour Packages"}
			breadcrumbSubtitle="Handcrafted holiday packages tailored for every travel style"
		>
			<SEO pageKey="tours" />
			<section className="tour-list-section">
				<style>{`
					.tour-list-section {
						padding: 48px 0 65px;
						background-color: #f8fafc;
						font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
					}
					.tour-header {
						text-align: center;
						margin-bottom: 32px;
						padding: 0 16px;
					}
					.tour-badge-top {
						color: #16a34a;
						font-size: 12.5px;
						font-weight: 800;
						text-transform: uppercase;
						letter-spacing: 0.12em;
						display: inline-block;
						margin-bottom: 8px;
						background: #ecfdf5;
						padding: 4px 14px;
						border-radius: 20px;
						border: 1px solid #bbf7d0;
					}
					.tour-title-main {
						font-size: clamp(26px, 4.5vw, 38px);
						font-weight: 900;
						color: #0f172a;
						margin: 0 0 10px 0;
						letter-spacing: -0.02em;
						line-height: 1.2;
					}
					.tour-sub-desc {
						color: #64748b;
						font-size: clamp(14px, 2vw, 16px);
						max-width: 620px;
						margin: 0 auto;
						line-height: 1.6;
					}

					/* Controls Bar: Center Tabs and Side < > Carousel Circles */
					.tour-controls-bar {
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 38px;
						padding: 4px 16px;
					}
					.tour-filter-bar {
						display: inline-flex;
						align-items: center;
						justify-content: center;
						gap: 12px;
						flex-wrap: wrap;
					}
					.tour-filter-btn {
						padding: 11px 32px !important;
						border-radius: 30px !important;
						font-size: 15px !important;
						font-weight: 800 !important;
						letter-spacing: 0.02em !important;
						border: 2px solid #e2e8f0 !important;
						background: #ffffff !important;
						color: #475569 !important;
						cursor: pointer !important;
						white-space: nowrap !important;
						transition: all 0.25s ease !important;
						box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
					}
					.tour-filter-btn:hover {
						color: #16a34a !important;
						border-color: #86efac !important;
					}
					.tour-filter-btn.active {
						background: #16a34a !important;
						color: #ffffff !important;
						border-color: #16a34a !important;
						box-shadow: 0 4px 14px rgba(22, 163, 74, 0.28) !important;
					}

					/* Horizontal Slider Navigation Controls (Perfect Circles with bold symbols) */
					.tour-nav-btns {
						position: absolute;
						right: 16px;
						top: 50%;
						transform: translateY(-50%);
						display: inline-flex;
						align-items: center;
						gap: 10px;
					}
					.tour-nav-btn {
						width: 46px !important;
						height: 46px !important;
						min-width: 46px !important;
						max-width: 46px !important;
						min-height: 46px !important;
						max-height: 46px !important;
						padding: 0 !important;
						margin: 0 !important;
						border-radius: 50% !important;
						border: 2px solid #16a34a !important;
						background: #ffffff !important;
						color: #16a34a !important;
						display: inline-flex !important;
						align-items: center !important;
						justify-content: center !important;
						cursor: pointer !important;
						flex-shrink: 0 !important;
						box-shadow: 0 4px 12px rgba(22, 163, 74, 0.12) !important;
						transition: all 0.25s ease !important;
						box-sizing: border-box !important;
					}
					.tour-nav-btn svg {
						width: 20px !important;
						height: 20px !important;
						stroke: #16a34a !important;
						stroke-width: 2.5px !important;
						display: block !important;
						fill: none !important;
						transition: stroke 0.2s ease, transform 0.2s ease !important;
						pointer-events: none !important;
					}
					.tour-nav-btn:hover {
						background: #16a34a !important;
						border-color: #16a34a !important;
						color: #ffffff !important;
						transform: translateY(-2px) !important;
						box-shadow: 0 8px 18px rgba(22, 163, 74, 0.28) !important;
					}
					.tour-nav-btn:hover svg {
						stroke: #ffffff !important;
					}
					@media (max-width: 768px) {
						.tour-controls-bar {
							flex-direction: column;
							gap: 18px;
						}
						.tour-nav-btns {
							position: static;
							transform: none;
						}
					}

					/* Swiper Custom Styling & Cute Dot Pagination (Image 4 Fix) */
					.tour-swiper-wrap {
						position: relative;
						padding: 4px 0 20px;
					}
					.tour-swiper {
						padding: 10px 16px 54px !important;
					}
					.tour-swiper .swiper-pagination {
						bottom: 8px !important;
						display: flex !important;
						align-items: center !important;
						justify-content: center !important;
						gap: 4px !important;
					}
					.tour-swiper .swiper-pagination-bullet {
						width: 8px !important;
						height: 8px !important;
						min-width: 8px !important;
						min-height: 8px !important;
						border-radius: 50% !important;
						background: #cbd5e1 !important;
						opacity: 1 !important;
						margin: 0 6px !important;
						padding: 0 !important;
						border: none !important;
						box-shadow: none !important;
						transition: all 0.25s ease !important;
						box-sizing: border-box !important;
					}
					.tour-swiper .swiper-pagination-bullet::before {
						display: none !important;
						content: none !important;
					}
					/* Active bullet: cute round green dot centered inside 22px green circle */
					.tour-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active {
						width: 8px !important;
						height: 8px !important;
						min-width: 8px !important;
						min-height: 8px !important;
						border-radius: 50% !important;
						background: #16a34a !important;
						position: relative !important;
						margin: 0 12px !important;
					}
					.tour-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active::before {
						display: block !important;
						content: "" !important;
						width: 22px !important;
						height: 22px !important;
						border-radius: 50% !important;
						border: 1.5px solid #16a34a !important;
						position: absolute !important;
						top: 50% !important;
						left: 50% !important;
						transform: translate(-50%, -50%) !important;
						box-sizing: border-box !important;
						pointer-events: none !important;
					}

					/* Card Styling */
					.tour-card {
						background: #ffffff;
						border-radius: 20px;
						overflow: hidden;
						box-shadow: 0 6px 22px rgba(15, 23, 42, 0.06);
						border: 1px solid #e2e8f0;
						display: flex;
						flex-direction: column;
						transition: transform 0.3s ease, box-shadow 0.3s ease;
					}
					.tour-card:hover {
						transform: translateY(-6px);
						box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
					}
					.tour-photo-wrap {
						position: relative;
						height: 220px;
						overflow: hidden;
						background-color: #0f172a;
						display: block;
						text-decoration: none;
					}
					.tour-photo-img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						display: block;
						transition: transform 0.6s ease;
					}
					.tour-card:hover .tour-photo-img {
						transform: scale(1.06);
					}
					.tour-badges-wrap {
						position: absolute;
						top: 14px;
						left: 14px;
						right: 14px;
						z-index: 2;
						display: flex;
						justifyContent: space-between;
						align-items: flex-start;
						gap: 8px;
						flex-wrap: wrap;
						pointer-events: none;
					}
					.tour-tag-left {
						background: #16a34a;
						color: #ffffff;
						font-weight: 800;
						font-size: 11px;
						letter-spacing: 0.05em;
						text-transform: uppercase;
						padding: 4px 11px;
						border-radius: 20px;
						box-shadow: 0 2px 6px rgba(0,0,0,0.25);
						white-space: nowrap;
					}
					.tour-tag-left.tag-intl {
						background: #0f172a;
						color: #fde047;
						border: 1px solid rgba(253, 224, 71, 0.4);
					}
					.tour-tag-right {
						margin-left: auto;
						background: #E0A21B;
						color: #1d2a0f;
						font-weight: 800;
						font-size: 11px;
						padding: 4px 11px;
						border-radius: 20px;
						box-shadow: 0 2px 6px rgba(0,0,0,0.25);
						white-space: nowrap;
					}
					@media (max-width: 640px) {
						.tour-badges-wrap {
							top: 10px;
							left: 10px;
							right: 10px;
							gap: 6px;
						}
						.tour-tag-left,
						.tour-tag-right {
							font-size: 10px;
							padding: 3px 9px;
						}
					}
					.tour-photo-caption {
						position: absolute;
						inset: 0;
						background: linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(15,23,42,0.85) 100%);
						display: flex;
						align-items: flex-end;
						padding: 12px 16px;
						color: #ffffff;
						font-size: 13px;
						font-weight: 700;
					}

					.tour-card-body {
						padding: 20px 20px 18px;
						display: flex;
						flex-direction: column;
						flex: 1;
					}
					.tour-card-title {
						font-size: 18px;
						font-weight: 800;
						color: #0f172a;
						margin: 0 0 10px 0;
						line-height: 1.35;
					}
					.tour-card-title a {
						color: #0f172a;
						text-decoration: none;
						transition: color 0.2s;
					}
					.tour-card-title a:hover {
						color: #16a34a;
					}

					.tour-meta-row {
						display: inline-flex;
						align-items: center;
						gap: 8px;
						padding: 5px 12px;
						border-radius: 20px;
						background-color: #f1f5f9;
						color: #334155;
						font-size: 12px;
						font-weight: 700;
						margin-bottom: 14px;
						width: fit-content;
						flex-wrap: wrap;
					}

					.tour-inc-list {
						list-style: none;
						padding: 0;
						margin: 0 0 18px 0;
						display: flex;
						flex-direction: column;
						gap: 7px;
						font-size: 12.5px;
						color: #475569;
					}
					.tour-inc-list li {
						display: flex;
						align-items: flex-start;
						gap: 6px;
						line-height: 1.4;
					}
					.tour-inc-list svg {
						color: #16a34a;
						flex-shrink: 0;
						margin-top: 2px;
					}

					.tour-divider {
						border-top: 1px dashed #e2e8f0;
						margin: auto 0 16px 0;
					}

					.tour-card-actions {
						display: flex;
						align-items: center;
						gap: 10px;
					}
					.tour-btn-call {
						width: 44px;
						height: 44px;
						border-radius: 12px;
						border: 1.5px solid #cbd5e1;
						background: #ffffff;
						color: #16a34a;
						display: flex;
						align-items: center;
						justify-content: center;
						text-decoration: none;
						flex-shrink: 0;
						transition: all 0.2s;
					}
					.tour-btn-call:hover {
						background: #ecfdf5;
						border-color: #16a34a;
					}
					.tour-btn-view {
						flex: 1;
						height: 44px;
						border-radius: 12px;
						background: #16a34a;
						color: #ffffff;
						font-weight: 800;
						font-size: 14px;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 6px;
						text-decoration: none;
						box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
						transition: all 0.2s;
					}
					.tour-btn-view:hover {
						background: #15803d;
						transform: translateY(-1px);
					}
					.tour-btn-wa {
						width: 44px;
						height: 44px;
						border-radius: 12px;
						background: #25D366;
						color: #ffffff;
						display: flex;
						align-items: center;
						justify-content: center;
						text-decoration: none;
						flex-shrink: 0;
						transition: all 0.2s;
					}
					.tour-btn-wa:hover {
						background: #1eb954;
						transform: translateY(-1px);
					}
				`}</style>

				<div className="tf-container">
					{/* Header */}
					<div className="tour-header">
						<span className="tour-badge-top">Curated Domestic & International</span>
						<h1 className="tour-title-main">
							{searchQuery ? `Search Results for "${searchQuery}"` : "Explore Curated Tour Packages"}
						</h1>
						<p className="tour-sub-desc">
							Handcrafted domestic holidays and premier international getaways with 4/5 stays, guided sightseeing, private transfers, and 24/7 dedicated assistance.
						</p>
					</div>

					{/* Controls Bar: Category Tabs on Left & < > Arrows on Right */}
					<div className="tour-controls-bar">
						{searchQuery ? (
							<div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
								<span style={{ fontSize: '15px', color: '#334155', fontWeight: '600' }}>
									Found <strong style={{ color: '#16a34a' }}>{filteredPackages.length} tour{filteredPackages.length === 1 ? '' : 's'}</strong> matching "{searchQuery}"
								</span>
								<button
									onClick={() => setSearchParams({})}
									style={{ padding: '6px 16px', fontSize: '13px', fontWeight: '700', backgroundColor: '#ffffff', color: '#0f172a', border: '1.5px solid #cbd5e1', borderRadius: '20px', cursor: 'pointer' }}
								>
									Clear Search ✕
								</button>
							</div>
						) : (
							<div className="tour-filter-bar" role="tablist">
								{categories.map((cat) => (
									<button
										key={cat.id}
										type="button"
										className={`tour-filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
										onClick={() => setActiveFilter(cat.id)}
									>
										{cat.label} ({liveList.filter(p => cat.id === 'international' ? p.type === 'INTERNATIONAL' : p.type === 'DOMESTIC').length})
									</button>
								))}
							</div>
						)}

						{/* < and > Horizontal Slider Navigation Controls */}
						{filteredPackages.length > 0 && (
							<div className="tour-nav-btns">
								<button
									type="button"
									className="tour-nav-btn"
									onClick={() => swiperRef.current?.slidePrev()}
									aria-label="Previous tour package"
									title="Previous"
								>
									<ChevronLeftIcon />
								</button>
								<button
									type="button"
									className="tour-nav-btn"
									onClick={() => swiperRef.current?.slideNext()}
									aria-label="Next tour package"
									title="Next"
								>
									<ChevronRightIcon />
								</button>
							</div>
						)}
					</div>

					{/* Sideways Horizontal Swiper Carousel with 4-second auto-slide */}
					{filteredPackages.length > 0 ? (
						<div className="tour-swiper-wrap">
							<Swiper
								key={`${activeFilter}-${searchQuery}-${filteredPackages.length}`}
								onSwiper={(swiper) => {
									swiperRef.current = swiper
								}}
								className="tour-swiper"
								modules={[Autoplay, Pagination]}
								autoplay={{
									delay: 4000,
									disableOnInteraction: false,
									pauseOnMouseEnter: true
								}}
								loop={filteredPackages.length > 3}
								grabCursor={true}
								speed={750}
								pagination={{ clickable: true }}
								slidesPerView={1}
								spaceBetween={20}
								breakpoints={{
									0: {
										slidesPerView: 1,
										spaceBetween: 16
									},
									640: {
										slidesPerView: 2,
										spaceBetween: 20
									},
									1024: {
										slidesPerView: 3,
										spaceBetween: 24
									},
									1440: {
										slidesPerView: 3,
										spaceBetween: 28
									}
								}}
							>
								{filteredPackages.map((tour) => {
									const tourLink = `/tour/${tour.slug}`

									return (
										<SwiperSlide key={tour.id} style={{ height: 'auto', display: 'flex' }}>
											<article className="tour-card" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
												{/* Photo with badging */}
												<Link href={tourLink} className="tour-photo-wrap">
													<img
														src={tour.image}
														alt={tour.title}
														className="tour-photo-img"
														loading="lazy"
														decoding="async"
														onError={(e) => {
															e.currentTarget.src = "/assets/images/tour/tour-details.jpg"
														}}
													/>
													<div className="tour-badges-wrap">
														<span className={`tour-tag-left ${tour.type === 'INTERNATIONAL' ? 'tag-intl' : ''}`}>
															{tour.type === 'INTERNATIONAL' ? (
																<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
																	<IconGlobe size={12} color="#ffffff" /> International
																</span>
															) : (
																<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
																	<IconIndiaFlag size={12} /> Domestic
																</span>
															)}
														</span>
														{tour.badge && <span className="tour-tag-right">{tour.badge}</span>}
													</div>
													<div className="tour-photo-caption">
														<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
															<IconLocation size={12} color="#ffffff" /> {tour.destination || tour.region}
														</span>
													</div>
												</Link>

												{/* Body */}
												<div className="tour-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
													<h2 className="tour-card-title">
														<Link href={tourLink}>{tour.shortTitle || tour.title}</Link>
													</h2>

													<div className="tour-meta-row">
														<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
															<IconCalendar size={13} color="#64748b" /> {tour.duration || (tour.days ? `${tour.days} Day${tour.days > 1 ? 's' : ''}${tour.nights !== undefined ? ` | ${tour.nights} Night${tour.nights > 1 ? 's' : ''}` : ''}` : '')}
														</span>
														<span style={{ color: '#cbd5e1' }}>•</span>
														<span>{tour.destination || tour.cities}</span>
													</div>

													{((Array.isArray(tour.keyInclusions) && tour.keyInclusions.filter(Boolean).length > 0) || (Array.isArray(tour.inclusions) && tour.inclusions.filter(Boolean).length > 0)) && (
														<ul className="tour-inc-list">
															{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).slice(0, 3).map((item, idx) => (
																<li key={idx}>
																	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
																	<span>{item}</span>
																</li>
															))}
														</ul>
													)}

													<div className="tour-divider" style={{ marginTop: 'auto' }} />

													{/* Action Buttons */}
													<div className="tour-card-actions">
														<a href="tel:04222477090" className="tour-btn-call" title="Call office: 0422 2477090" aria-label="Call office">
															<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
														</a>

														<Link href={tourLink} className="tour-btn-view">
															View Details →
														</Link>

														<button
															type="button"
															onClick={() => openInquiryModal({
																packageName: tour.title || tour.shortTitle || '',
																duration: tour.duration || '',
																destination: tour.destination || tour.region || tour.cities || ''
															})}
															style={{
																height: '44px',
																padding: '0 16px',
																borderRadius: '12px',
																background: '#0f172a',
																color: '#fde047',
																border: 'none',
																fontWeight: '800',
																fontSize: '13.5px',
																cursor: 'pointer',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																flexShrink: 0,
																transition: 'all 0.2s'
															}}
															title="Enquire Now"
														>
															Enquire
														</button>
													</div>
												</div>
											</article>
										</SwiperSlide>
									)
								})}
							</Swiper>
						</div>
					) : (
						<div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
							<h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>No Packages Found</h3>
							<p style={{ color: '#64748b', fontSize: '15px' }}>Try switching categories or clearing your search term.</p>
						</div>
					)}

				</div>
			</section>

			<CtaBanner />
		</Layout>
	)
}
