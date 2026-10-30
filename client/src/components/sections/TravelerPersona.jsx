import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function TravelerPersona({ activePersona, onSelectPersona, onOpenInquiry, personasData, sectionHeader }) {
	const navigate = useNavigate()
	const [hoveredId, setHoveredId] = useState(null)

	const handlePersonaClick = (persona) => {
		const target = persona.slug
			? (persona.slug.startsWith('/') ? persona.slug : `/tour/${persona.slug}`)
			: (persona.link && persona.link !== '/tour' && persona.link !== '#' ? persona.link : '')

		if (target) {
			navigate(target)
		} else if (onSelectPersona) {
			onSelectPersona(persona)
		}
	}

	const defaultPersonas = [
		{
			id: 'couple',
			title: 'Couple',
			subtitle: 'Romantic & Honeymoon',
			desc: 'Overwater villas, private candlelight dinners & secluded beaches',
			image: '/assets/images/slide/slide2.jpg',
			icon: 'ðŸ’',
			badge: 'Top Pick'
		},
		{
			id: 'family',
			title: 'Family',
			subtitle: 'Kids & Comfort Stays',
			desc: 'Theme parks, spacious luxury suites & curated family excursions',
			image: '/assets/images/tour/5.jpg',
			icon: 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦',
			badge: 'All-Inclusive'
		},
		{
			id: 'friends',
			title: 'Friends',
			subtitle: 'Adventure & Nightlife',
			desc: 'Desert safaris, yacht parties, water sports & group thrill trails',
			image: '/assets/images/tour/3.jpg',
			icon: 'ðŸ„â€â™‚ï¸',
			badge: 'Group Deals'
		},
		{
			id: 'solo',
			title: 'Solo',
			subtitle: 'Explore & Discover',
			desc: 'Scenic train journeys, heritage walking tours & flexible escapes',
			image: '/assets/images/tour/4.jpg',
			icon: 'ðŸ§­',
			badge: 'Customizable'
		},
		{
			id: 'seniors',
			title: 'Seniors',
			subtitle: 'Relaxed & Heritage',
			desc: 'Gentle pace, spiritual circuits, Indian dining & 24/7 assistance',
			image: '/assets/images/tour/1.jpg',
			icon: 'ðŸ›ï¸',
			badge: 'All-Assisted'
		}
	]

	const activePersonasList = (personasData && personasData.length > 0) ? personasData : defaultPersonas
	const badgeText = sectionHeader?.badge || 'Personalized Experience'
	const titleText = sectionHeader?.title || "Who's Travelling With You?"
	const subtitleText = sectionHeader?.subtitle || 'Choose your travel persona below to instantly view handcrafted holiday packages tailored for your style'
	const bgImg = sectionHeader?.bgImage || '/assets/images/page/breakcrumb.jpg'

	return (
		<section
			className="relative overflow-hidden"
			style={{
				position: 'relative',
				padding: '70px 0 65px',
				backgroundImage: `url("${bgImg}")`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed',
				color: '#ffffff'
			}}
		>
			{/* Soft dark travel overlay for readability */}
			<div 
				style={{ 
					position: 'absolute', 
					inset: 0, 
					background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.84) 100%)', 
					zIndex: 1 
				}}
			/>
			
			<style>{`
				.persona-title-heading {
					font-size: 34px;
				}
				.persona-swiper .swiper-wrapper {
					align-items: center;
				}
				@media (min-width: 992px) {
					.persona-swiper.center-slides .swiper-wrapper {
						justify-content: center !important;
					}
				}
				@media (max-width: 768px) {
					.persona-title-heading {
						font-size: 26px !important;
					}
					.persona-head-text {
						font-size: 14px !important;
					}
					.persona-inner-title {
						font-size: 16px !important;
					}
					.persona-inner-sub {
						font-size: 11px !important;
					}
				}
			`}</style>
			
			<div className="tf-container relative" style={{ zIndex: 2 }}>
				{/* Section Heading */}
				<div className="wow fadeInUp" style={{ textAlign: 'center', marginBottom: '36px' }}>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px',
							padding: '5px 18px',
							borderRadius: '30px',
							background: 'rgba(74, 222, 128, 0.15)',
							border: '1px solid rgba(74, 222, 128, 0.35)',
							marginBottom: '12px',
							backdropFilter: 'blur(8px)',
							WebkitBackdropFilter: 'blur(8px)'
						}}
					>
						<span
							style={{
								color: '#4ade80',
								fontSize: '12px',
								fontWeight: '800',
								letterSpacing: '0.12em',
								textTransform: 'uppercase'
							}}
						>
							{badgeText}
						</span>
					</div>

					<h2 className="persona-title-heading" style={{ fontSize: '34px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
						{titleText}
					</h2>
					<p className="persona-head-text" style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '620px', margin: '0 auto', fontWeight: '500' }}>
						{subtitleText}
					</p>
				</div>

				{/* Persona circles */}
				<div style={{ maxWidth: '1120px', margin: '0 auto' }}>
					{(() => {
						const count = activePersonasList.length
						const shouldCenterDesktop = count <= 4
						// Enable loop and autoplay whenever more than 1 item, so mobile continuously auto-scrolls
						const shouldAutoplay = count > 1

						return (
							<Swiper
								modules={[Autoplay]}
								autoplay={shouldAutoplay ? {
									delay: 2500,
									disableOnInteraction: false,
									pauseOnMouseEnter: true
								} : false}
								loop={shouldAutoplay}
								speed={800}
								slidesPerView={2}
								spaceBetween={14}
								breakpoints={{
									0: {
										slidesPerView: 2,
										spaceBetween: 14
									},
									576: {
										slidesPerView: 2.5,
										spaceBetween: 16
									},
									768: {
										slidesPerView: Math.min(3.5, count),
										spaceBetween: 18
									},
									1024: {
										slidesPerView: Math.min(5, count),
										spaceBetween: 20
									}
								}}
								className={`persona-swiper ${shouldCenterDesktop ? 'center-slides' : ''}`}
								style={{ overflow: 'hidden', padding: '20px 20px 28px' }}
							>
						{activePersonasList.map((persona, index) => {
							const isSelected = activePersona === persona.id
							const isHovered = hoveredId === persona.id

							return (
								<SwiperSlide key={persona.id}>
									<div className="wow fadeInUp" data-wow-delay={`0.${index + 1}s`} style={{ padding: '8px 4px' }}>
										{/* OUTER: ring + shadow + scale (no overflow hidden here) */}
										<div
											onClick={() => handlePersonaClick(persona)}
											onMouseEnter={() => setHoveredId(persona.id)}
											onMouseLeave={() => setHoveredId(null)}
											style={{
												position: 'relative',
												width: '100%',
												aspectRatio: '1 / 1',
												borderRadius: '50%',
												cursor: 'pointer',
												transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
												transform: isSelected ? 'scale(1.04)' : isHovered ? 'scale(1.02)' : 'scale(1)',
												boxShadow: isSelected
													? '0 0 0 3px #16a34a, 0 0 0 8px rgba(22, 163, 74, 0.25), 0 16px 32px rgba(0, 0, 0, 0.5)'
													: isHovered
														? '0 0 0 3px rgba(74, 222, 128, 0.7), 0 12px 28px rgba(0, 0, 0, 0.4)'
														: '0 6px 20px rgba(0, 0, 0, 0.35)',
												border: '2px solid rgba(255, 255, 255, 0.25)'
											}}
										>
											{/* INNER: clips image + overlay into a perfect circle */}
											<div
												style={{
													position: 'absolute',
													inset: 0,
													borderRadius: '50%',
													overflow: 'hidden',
													isolation: 'isolate'
												}}
											>
												<img
													src={persona.image}
													alt={persona.title}
													draggable={false}
													style={{
														position: 'absolute',
														inset: 0,
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														objectPosition: 'center',
														display: 'block'
													}}
												/>

												{/* Dark overlay */}
												<div
													style={{
														position: 'absolute',
														inset: 0,
														background: isSelected
															? 'linear-gradient(0deg, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0.4) 100%)'
															: 'linear-gradient(0deg, rgba(2, 6, 23, 0.75) 0%, rgba(2, 6, 23, 0.2) 100%)',
														transition: 'background 0.3s ease'
													}}
												/>

												{/* Text */}
												<div
													style={{
														position: 'absolute',
														inset: 0,
														padding: '16px',
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'center',
														alignItems: 'center',
														textAlign: 'center',
														zIndex: 2
													}}
												>
													<h3
														className="persona-inner-title"
														style={{
															fontSize: '20px',
															fontWeight: '900',
															color: '#ffffff',
															margin: '0 0 4px 0'
														}}
													>
														{persona.title}
													</h3>
													<p
														className="persona-inner-sub"
														style={{
															fontSize: '12px',
															color: '#cbd5e1',
															margin: 0,
															lineHeight: '1.3',
															fontWeight: '600'
														}}
													>
														{persona.subtitle}
													</p>
												</div>
											</div>
										</div>
									</div>
								</SwiperSlide>
							)
						})}
					</Swiper>
						)
					})()}
				</div>
			</div>
		</section>
	)
}
