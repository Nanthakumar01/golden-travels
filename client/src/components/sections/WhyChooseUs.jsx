import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { renderFeatureIcon } from '@/components/common/Icons'
import 'swiper/css'

export default function WhyChooseUs({ onOpenInquiry, featuresData, sectionHeader }) {
	const defaultFeatures = [
		{
			icon: 'target',
			title: '100% Customized Trips',
			description: 'Build your dream itinerary tailored to your exact pace, hotel preferences, and activities.'
		},
		{
			icon: 'chat',
			title: '24/7 On-Trip Concierge',
			description: 'Real destination experts supporting you on WhatsApp throughout your journey in real time.'
		},
		{
			icon: 'diamond',
			title: 'Transparent Pricing',
			description: 'All-inclusive packages with flights, 4-Star & 5-Star hotels, meals, and sightseeing. Zero hidden charges.'
		},
		{
			icon: 'passport',
			title: 'Expert Visa Assistance',
			description: 'End-to-end documentation assistance with a proven 99.2% visa approval track record.'
		}
	]

	const features = (featuresData && featuresData.length > 0) ? featuresData : defaultFeatures
	const badgeText = sectionHeader?.badge || 'The Golden Travels Difference'
	const titleText = sectionHeader?.title || 'Why 50,000+ Travelers Choose Us'
	const subtitleText = sectionHeader?.subtitle || 'Experience seamless, royal-grade holiday planning backed by industry-leading reliability'
	const bgImg = sectionHeader?.bg_image || '/assets/images/about-us/about-h4.jpg'

	return (
		<section 
			style={{ 
				position: 'relative',
				padding: '70px 0', 
				backgroundImage: `url("${bgImg}")`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed',
				color: '#ffffff'
			}}
		>
			<div 
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.84) 100%)',
					zIndex: 1
				}}
			/>
			<style>{`
				.why-choose-title {
					font-size: 36px;
				}
				@media (max-width: 768px) {
					.why-choose-title {
						font-size: clamp(24px, 6vw, 30px) !important;
					}
					.why-choose-card {
						padding: 28px 22px !important;
					}
					.why-choose-card h3 {
						font-size: 18px !important;
						margin-bottom: 8px !important;
					}
					.why-choose-card p {
						font-size: 13.5px !important;
						line-height: 1.5 !important;
					}
				}
			`}</style>
			<div className="tf-container relative" style={{ zIndex: 2 }}>
				<div className="wow fadeInUp" style={{ textAlign: 'center', marginBottom: '40px' }}>
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
						<span style={{ color: '#4ade80', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
							{badgeText}
						</span>
					</div>
					<h2 className="why-choose-title" style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', margin: '8px 0', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
						{titleText}
					</h2>
					<p style={{ color: '#cbd5e1', fontSize: '15.5px', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
						{subtitleText}
					</p>
				</div>

				<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
					<Swiper
						modules={[Autoplay]}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true
						}}
						loop={true}
						speed={800}
						slidesPerView={1}
						spaceBetween={16}
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
								slidesPerView: 4,
								spaceBetween: 24
							}
						}}
						style={{ overflow: 'hidden', padding: '10px 4px 20px' }}
					>
						{features.map((item, idx) => (
							<SwiperSlide key={idx}>
								<div
									className="why-choose-card card-hover-effect"
									style={{
										padding: '36px 26px',
										borderRadius: '24px',
										background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
										backdropFilter: 'blur(12px)',
										WebkitBackdropFilter: 'blur(12px)',
										border: '1px solid rgba(255, 255, 255, 0.1)',
										boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
										textAlign: 'left',
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'flex-start'
									}}
								>
									<div
										className="floating-elem"
										style={{
											width: '60px',
											height: '60px',
											borderRadius: '16px',
											background: 'rgba(74, 222, 128, 0.15)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '28px',
											marginBottom: '24px',
											border: '1px solid rgba(74, 222, 128, 0.3)',
											boxShadow: '0 8px 20px rgba(74, 222, 128, 0.15)'
										}}
									>
										{renderFeatureIcon(item.icon, item.title, 32)}
									</div>
									<h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.01em' }}>
										{item.title}
									</h3>
									<p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>
										{item.description}
									</p>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div
					className="scroll-reveal reveal-fade-up stagger-delay-4"
					style={{
						marginTop: '30px',
						textAlign: 'center'
					}}
				>
					<button
						onClick={() => onOpenInquiry("Customized Holiday")}
						className="btn-shine"
						style={{
							backgroundColor: '#16a34a',
							color: '#ffffff',
							padding: '14px 32px',
							borderRadius: '14px',
							border: 'none',
							fontSize: '15px',
							fontWeight: '700',
							cursor: 'pointer',
							boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
						}}
					>
						Start Planning Your Custom Trip →
					</button>
				</div>
			</div>
		</section>
	)
}
