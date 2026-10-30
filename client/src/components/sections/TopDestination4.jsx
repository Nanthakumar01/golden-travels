import React, { useState, useRef } from "react";
import Link from '@/components/elements/Link'
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import { packagesData as staticPackages } from '@/data/packagesData'
import { IconCompass, IconPlane, IconIndiaFlag, IconLocation } from '@/components/common/Icons'

export default function TopDestination4({ packagesData, destinationsData, sectionHeader }) {
	const [isTab, setIsTab] = useState(1)
	const tabsRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	const swiperRef = useRef(null)

	const handleMouseDown = (e) => {
		if (!tabsRef.current) return
		setIsDragging(true)
		setStartX(e.pageX - tabsRef.current.offsetLeft)
		setScrollLeft(tabsRef.current.scrollLeft)
	}

	const handleMouseMove = (e) => {
		if (!isDragging || !tabsRef.current) return
		e.preventDefault()
		const x = e.pageX - tabsRef.current.offsetLeft
		const walk = (x - startX) * 1.5
		tabsRef.current.scrollLeft = scrollLeft - walk
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	// 1. Gather real packages (from API or fallback to verified static packages)
	const rawPackages = (packagesData && packagesData.length > 0) ? packagesData : staticPackages

	// 2. Filter active packages where showInExplore !== false (no dummy destinations)
	const eligiblePackages = (rawPackages || []).filter(p => {
		const isHidden = p.showInExplore === false || p.showInExplore === 0 || p.showInExplore === '0'
		const isInactive = p.isActive === false || p.isActive === 0 || p.isActive === '0'
		return !isHidden && !isInactive
	})

	const formatPackageToCard = (pkg) => {
		const targetLink = pkg.slug ? `/tour/${pkg.slug}` : (pkg.link || '/tour')
		const image = pkg.image || (pkg.gallery && pkg.gallery[0] ? (pkg.gallery[0].src || pkg.gallery[0]) : '/assets/images/packages/vietnam.jpg')
		const title = pkg.shortTitle || pkg.title || 'Tour Destination'
		const duration = pkg.duration || (pkg.days ? `${pkg.days} Days / ${pkg.nights || (pkg.days - 1)} Nights` : 'Curated Tour')
		const places = pkg.cities || pkg.destination || pkg.region || ''
		const type = (pkg.type || '').toUpperCase()

		return {
			id: pkg.id || pkg.slug,
			name: title,
			img: image,
			packageSlug: pkg.slug,
			link: targetLink,
			tours: duration,
			places: places,
			type: type
		}
	}

	const tabData = {
		1: eligiblePackages.map(formatPackageToCard),
		2: eligiblePackages.filter(p => (p.type || '').toUpperCase() === 'INTERNATIONAL').map(formatPackageToCard),
		3: eligiblePackages.filter(p => (p.type || '').toUpperCase() === 'DOMESTIC').map(formatPackageToCard),
	}

	const currentList = tabData[isTab] || []

	const badgeText = sectionHeader?.badge || 'Explore The World'
	const titleText = sectionHeader?.title || 'Top Trending Destinations'

	return (
		<section className="top-destination bg-1">
			<style>{`
				.tab-top-destination-wrap {
					position: relative;
					width: 100%;
					margin-bottom: 24px;
				}
				.tab-top-destination {
					display: flex !important;
					flex-wrap: nowrap !important;
					overflow-x: auto !important;
					-webkit-overflow-scrolling: touch;
					scrollbar-width: none;
					padding: 6px 2px 14px 2px;
					gap: 10px;
					margin-bottom: 0 !important;
					scroll-behavior: smooth;
					user-select: none;
					cursor: grab;
				}
				.tab-top-destination:active {
					cursor: grabbing;
				}
				.tab-top-destination::-webkit-scrollbar {
					display: none;
				}
				.tab-top-destination .nav-item {
					flex-shrink: 0;
					margin-right: 0 !important;
				}
				.tab-top-destination .nav-item .nav-link {
					white-space: nowrap !important;
					display: inline-flex !important;
					align-items: center !important;
					gap: 8px !important;
					padding: 8px 18px !important;
					font-size: 13.5px !important;
					font-weight: 700 !important;
					border-radius: 50px !important;
					background: #ffffff !important;
					border: 1.5px solid #e2e8f0 !important;
					color: #334155 !important;
					box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
					cursor: pointer;
					transition: all 0.2s ease !important;
				}
				.tab-top-destination .nav-item .nav-link:hover {
					border-color: #16a34a !important;
					color: #16a34a !important;
					transform: translateY(-1px);
				}
				.tab-top-destination .nav-item .nav-link.active {
					background: #16a34a !important;
					color: #ffffff !important;
					border-color: #16a34a !important;
					box-shadow: 0 4px 14px rgba(22,163,74,0.25) !important;
				}
				.tab-top-destination .nav-item .nav-link i {
					font-size: 18px !important;
					color: #16a34a !important;
					margin-right: 4px !important;
					transition: color 0.2s ease !important;
				}
				.tab-top-destination .nav-item .nav-link.active i {
					color: #ffffff !important;
				}
				.dest-nav-btn {
					width: 42px !important;
					height: 42px !important;
					min-width: 42px !important;
					padding: 0 !important;
					border-radius: 50% !important;
					border: 1.5px solid #e2e8f0 !important;
					background: #ffffff !important;
					color: #1e293b !important;
					display: inline-flex !important;
					align-items: center !important;
					justify-content: center !important;
					cursor: pointer !important;
					transition: all 0.2s ease !important;
					box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
				}
				.dest-nav-btn:hover {
					background: #16a34a !important;
					border-color: #16a34a !important;
					color: #ffffff !important;
					transform: translateY(-2px);
					box-shadow: 0 6px 16px rgba(22,163,74,0.25) !important;
				}
				@media (max-width: 767px) {
					.tab-top-destination .nav-item .nav-link {
						padding: 7px 14px !important;
						font-size: 12.5px !important;
					}
					.tab-top-destination .nav-item .nav-link i {
						font-size: 16px !important;
						margin-right: 4px !important;
					}
					.dest-nav-btn {
						width: 36px !important;
						height: 36px !important;
						min-width: 36px !important;
					}
				}
			`}</style>
			<div className="tf-container">
				<div className="row align-items-end mb-24">
					<div className="col-8 col-md-9 mb-10">
						<span className="sub-title-heading text-main font-yes fs-28-46 wow fadeInUp animated" data-wow-delay="0.1s">
							{badgeText}
						</span>
						<h2 className="title-heading wow fadeInUp animated" data-wow-delay="0.1s" style={{ margin: 0 }}>
							Top Trending <span className="text-gray font-yes">Destinations</span>
						</h2>
					</div>
					<div className="col-4 col-md-3 text-end mb-10 d-flex justify-content-end align-items-center gap-2">
						<button 
							type="button" 
							className="dest-nav-btn dest-prev" 
							onClick={() => swiperRef.current?.slidePrev()} 
							aria-label="Previous Destinations"
							title="Previous Destinations"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="15 18 9 12 15 6" />
							</svg>
						</button>
						<button 
							type="button" 
							className="dest-nav-btn dest-next" 
							onClick={() => swiperRef.current?.slideNext()} 
							aria-label="Next Destinations"
							title="Next Destinations"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="tab-top-destination-wrap">
							<ul
								ref={tabsRef}
								className="nav tab-top-destination mb-43"
								id="pills-tab"
								role="tablist"
								onMouseDown={handleMouseDown}
								onMouseMove={handleMouseMove}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseUp}
							>
								<li className="nav-item" onClick={() => setIsTab(1)}>
									<button className={isTab === 1 ? "nav-link active" : "nav-link"} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconCompass size={15} color={isTab === 1 ? '#ffffff' : '#64748b'} />
										<span>All Destinations ({tabData[1]?.length || 0})</span>
									</button>
								</li>
								<li className="nav-item" onClick={() => setIsTab(2)}>
									<button className={isTab === 2 ? "nav-link active" : "nav-link"} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconPlane size={15} color={isTab === 2 ? '#ffffff' : '#64748b'} />
										<span>International ({tabData[2]?.length || 0})</span>
									</button>
								</li>
								<li className="nav-item" onClick={() => setIsTab(3)}>
									<button className={isTab === 3 ? "nav-link active" : "nav-link"} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
										<IconIndiaFlag size={15} />
										<span>Domestic (India) ({tabData[3]?.length || 0})</span>
									</button>
								</li>
							</ul>
						</div>
						<div className="tab-content" id="pills-tabContent">
							<div className="tab-pane fade show active">
								{currentList.length === 0 ? (
									<div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
										<p style={{ margin: 0, fontWeight: '700', color: '#64748b', fontSize: '15px' }}>
											No tour packages configured for this category yet.
										</p>
									</div>
								) : (
								<Swiper
									key={isTab}
									onSwiper={(swiper) => { swiperRef.current = swiper }}
									modules={[Autoplay]}
									autoplay={{
										delay: 3000,
										disableOnInteraction: false,
										pauseOnMouseEnter: true
									}}
									loop={currentList.length > 5}
									speed={800}
									slidesPerView={1}
									spaceBetween={14}
									breakpoints={{
										0: {
											slidesPerView: 1,
											spaceBetween: 14
										},
										480: {
											slidesPerView: 1,
											spaceBetween: 16
										},
										640: {
											slidesPerView: 2.3,
											spaceBetween: 16
										},
										768: {
											slidesPerView: 3.2,
											spaceBetween: 18
										},
										1024: {
											slidesPerView: 4.2,
											spaceBetween: 18
										},
										1280: {
											slidesPerView: 5,
											spaceBetween: 20
										}
									}}
									className="explore-destination-swiper"
									style={{ overflow: 'hidden', padding: '6px 4px 16px' }}
								>
									{currentList.map((item, index) => {
										const targetLink = item.packageSlug ? `/tour/${item.packageSlug}` : (item.link || '/tour')
										return (
											<SwiperSlide key={item.id || index} style={{ height: 'auto', display: 'flex' }}>
												<div
													className="destination-style1 card-hover-effect"
													style={{
														borderRadius: '16px',
														padding: '12px',
														background: '#ffffff',
														boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
														width: '100%',
														height: '100%',
														display: 'flex',
														flexDirection: 'column',
														boxSizing: 'border-box'
													}}
												>
													<Link
														href={targetLink}
														className="destination-card-link image mb-10 relative card-image-wrap"
														style={{
															borderRadius: '14px',
															overflow: 'hidden',
															display: 'block',
															height: '180px',
															flexShrink: 0,
															position: 'relative'
														}}
													>
														<img
															src={item.img}
															alt={item.name}
															loading="lazy"
															decoding="async"
															style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
															onError={e => { e.target.src = '/assets/images/packages/vietnam.jpg' }}
														/>
														<img src="/assets/images/explore/mask-des.png" alt="Overlay" className="mask-ab" />
														{item.type && (
															<span style={{
																position: 'absolute',
																top: '10px',
																left: '10px',
																background: item.type === 'DOMESTIC' ? 'rgba(22,163,74,0.9)' : 'rgba(37,99,235,0.9)',
																color: '#fff',
																fontSize: '10px',
																fontWeight: '800',
																padding: '2px 8px',
																borderRadius: '12px',
																zIndex: 3,
																letterSpacing: '0.04em'
															}}>
																{item.type === 'DOMESTIC' ? 'DOMESTIC' : 'INTL'}
															</span>
														)}
													</Link>

													<h6
														className="destination-title tittle center"
														style={{
															fontSize: '15px',
															fontWeight: '800',
															marginTop: '6px',
															marginBottom: '2px',
															textAlign: 'center',
															height: '42px',
															minHeight: '42px',
															lineHeight: '1.38',
															display: '-webkit-box',
															WebkitLineClamp: 2,
															WebkitBoxOrient: 'vertical',
															overflow: 'hidden',
															padding: '0 4px'
														}}
														title={item.name}
													>
														<Link href={targetLink} style={{ color: '#0f172a' }}>{item.name}</Link>
													</h6>

													<div
														style={{
															height: '20px',
															minHeight: '20px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															fontSize: '11px',
															color: '#64748b',
															margin: '2px 0 6px',
															padding: '0 4px',
															overflow: 'hidden'
														}}
														title={item.places || ''}
													>
														{item.places ? (
															<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '3px', maxWidth: '100%' }}>
																<IconLocation size={12} color="#16a34a" /> {item.places}
															</span>
														) : (
															<span style={{ visibility: 'hidden' }}>-</span>
														)}
													</div>

													<p
														style={{
															textAlign: 'center',
															fontSize: '12.5px',
															color: '#16a34a',
															fontWeight: '800',
															marginTop: 'auto',
															paddingTop: '6px',
															marginBottom: 0,
															whiteSpace: 'nowrap'
														}}
													>
														{item.tours || 'Curated Tour'}
													</p>
												</div>
											</SwiperSlide>
										)
									})}
								</Swiper>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
