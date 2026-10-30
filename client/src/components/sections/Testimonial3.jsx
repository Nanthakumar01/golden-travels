import React, { useState, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { submitReview } from '@/services/api'
import { IconStar, IconCheckCircle } from '@/components/common/Icons'

const DEFAULT_TESTIMONIALS = [
	{
		name: 'Priya & Rajesh Sharma',
		role: 'Honeymoon in Switzerland & Paris',
		text: '“Our Switzerland & Paris honeymoon planned by Golden Travels was an absolute fairytale! From panoramic Glacier Express tickets to romantic chalet bookings, everything was flawlessly organized with 24/7 WhatsApp concierge.”',
		rating: 5
	},
	{
		name: 'Dr. Anand Ramanathan',
		role: 'Family Trip to Singapore & Bali',
		text: '“Traveling with children and senior parents can be stressful, but Golden Travels made it 100% effortless. Indian meals, private transfers, and handpicked luxury resorts made our vacation memorable and relaxing.”',
		rating: 5
	},
	{
		name: 'Vikram Mehta & Family',
		role: 'Vietnam & Halong Bay Explorer',
		text: '“Booked a 9-day Vietnam package with Golden Travels. The Halong Bay luxury cruise, Ba Na Hills Golden Bridge, and Phu Quoc islands were magical. Authentic Indian meals and dedicated guides made our trip totally seamless!”',
		rating: 5
	}
]

export default function Testimonial3({ testimonialsData, sectionHeader }) {
	const [swiperInstance, setSwiperInstance] = useState(null)
	const [reviews, setReviews] = useState(DEFAULT_TESTIMONIALS)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		role: '',
		rating: 5,
		text: ''
	})
	const [submitting, setSubmitting] = useState(false)
	const [submitSuccess, setSubmitSuccess] = useState(false)
	const [submitError, setSubmitError] = useState('')

	useEffect(() => {
		if (testimonialsData && testimonialsData.length > 0) {
			setReviews(testimonialsData)
		}
	}, [testimonialsData])

	const badgeText = sectionHeader?.badge || 'Client Stories'
	const titleText = sectionHeader?.title || 'What Travelers Say About Us'

	const swiperOptions = {
		modules: [Autoplay, Pagination],
		speed: 1000,
		spaceBetween: 30,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			clickable: true,
		},
		loop: reviews.length > 1
	}

	const handleSubmitReview = async (e) => {
		e.preventDefault()
		if (!formData.name.trim() || !formData.text.trim()) return

		setSubmitting(true)
		setSubmitError('')
		try {
			const res = await submitReview({
				name: formData.name.trim(),
				role: formData.role.trim(),
				rating: Number(formData.rating) || 5,
				text: formData.text.trim()
			})
			const newReview = res?.data || {
				name: formData.name.trim(),
				role: formData.role.trim(),
				rating: Number(formData.rating) || 5,
				text: `“${formData.text.trim()}”`
			}
			setReviews(prev => [newReview, ...prev])
			setSubmitSuccess(true)
			setTimeout(() => {
				setIsModalOpen(false)
				setSubmitSuccess(false)
				setFormData({ name: '', role: '', rating: 5, text: '' })
				if (swiperInstance) {
					swiperInstance.slideTo(0)
				}
			}, 1200)
		} catch (err) {
			setSubmitError(err.message || 'Could not submit review. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<section style={{ padding: '60px 0 55px', backgroundColor: '#f9fafb', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
			<div className="tf-container">
				<div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
					
					{/* Section Header */}
					<div className="scroll-reveal" style={{ marginBottom: '28px' }}>
						<span style={{ color: '#E5A91E', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
							{badgeText}
						</span>
						<h2 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginTop: '6px', marginBottom: '0' }}>
							{titleText}
						</h2>
					</div>

					{/* Testimonials Carousel Wrapper with Left & Right Arrows */}
					<style>{`
						.testi-nav-btn {
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							z-index: 10;
							width: 40px;
							height: 40px;
							border-radius: 50%;
							border: 1.5px solid rgba(229, 169, 30, 0.45);
							background: rgba(229, 169, 30, 0.12);
							color: #E5A91E;
							display: flex;
							align-items: center;
							justify-content: center;
							cursor: pointer;
							font-size: 14px;
							font-weight: 900;
							transition: all 0.2s ease;
							padding: 0;
							margin: 0;
						}
						.testi-nav-prev { left: -16px; }
						.testi-nav-next { right: -16px; }
						.testi-card {
							background-color: #ffffff;
							border-radius: 22px;
							padding: 38px 36px;
							box-shadow: 0 8px 30px rgba(0,0,0,0.06);
							border: 1px solid #f1f5f9;
							position: relative;
						}
						@media (max-width: 768px) {
							.testi-nav-btn {
								display: none;
							}
							.testi-card {
								padding: 24px 18px !important;
								border-radius: 18px !important;
							}
						}
						@media (max-width: 480px) {
							.client-story-modal {
								padding: 22px 18px !important;
								border-radius: 18px !important;
							}
						}
					`}</style>
					<div style={{ position: 'relative' }}>
						
						{/* Left Arrow Button */}
						<button
							type="button"
							onClick={() => swiperInstance?.slidePrev()}
							title="Previous Review"
							aria-label="Previous Review"
							className="testi-nav-btn testi-nav-prev"
							onMouseEnter={(e) => {
								e.currentTarget.style.background = '#E5A91E'
								e.currentTarget.style.color = '#ffffff'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'rgba(229, 169, 30, 0.12)'
								e.currentTarget.style.color = '#E5A91E'
							}}
						>
							❮
						</button>

						{/* Right Arrow Button */}
						<button
							type="button"
							onClick={() => swiperInstance?.slideNext()}
							title="Next Review"
							aria-label="Next Review"
							className="testi-nav-btn testi-nav-next"
							onMouseEnter={(e) => {
								e.currentTarget.style.background = '#E5A91E'
								e.currentTarget.style.color = '#ffffff'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'rgba(229, 169, 30, 0.12)'
								e.currentTarget.style.color = '#E5A91E'
							}}
						>
							❯
						</button>

						<Swiper key={reviews.length} {...swiperOptions} onSwiper={setSwiperInstance} style={{ paddingBottom: '36px' }}>
							{reviews.map((item, idx) => (
								<SwiperSlide key={item.id || idx}>
									<div
										className="card-hover-effect scroll-reveal reveal-scale testi-card"
									>
										{/* Stars */}
										<div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '14px', color: '#F59E0B', fontSize: '18px' }}>
											{'★'.repeat(item.rating || 5)}
										</div>

										{/* Quote Text */}
										<p style={{ fontSize: '16.5px', lineHeight: '1.75', color: '#334155', fontStyle: 'italic', marginBottom: '22px', fontWeight: '500' }}>
											{item.text}
										</p>

										<div style={{ width: '44px', height: '3px', background: 'linear-gradient(90deg, #E5A91E, #FDE047)', margin: '0 auto 16px', borderRadius: '2px' }} />

										{/* Author Info */}
										<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
											{item.name}
										</h3>
										{item.role && (
											<span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '600' }}>
												{item.role}
											</span>
										)}
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					{/* Add Review Button */}
					<div style={{ marginTop: '14px' }}>
						<button
							type="button"
							onClick={() => {
								setSubmitError('')
								setSubmitSuccess(false)
								setIsModalOpen(true)
							}}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								backgroundColor: '#16a34a',
								color: '#ffffff',
								border: 'none',
								padding: '12px 26px',
								borderRadius: '12px',
								fontSize: '14px',
								fontWeight: '700',
								cursor: 'pointer',
								boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
								transition: 'all 0.2s ease'
							}}
						>
							<span>★ Add Review</span>
						</button>
					</div>

				</div>
			</div>

			{/* ADD REVIEW MODAL */}
			{isModalOpen && (
				<div
					onClick={() => setIsModalOpen(false)}
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(15, 23, 42, 0.65)',
						backdropFilter: 'blur(5px)',
						WebkitBackdropFilter: 'blur(5px)',
						zIndex: 99999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '16px'
					}}
				>
					<div
						className="client-story-modal"
						onClick={e => e.stopPropagation()}
						style={{
							backgroundColor: '#ffffff',
							borderRadius: '22px',
							maxWidth: '480px',
							width: '100%',
							padding: '28px 26px',
							boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
							textAlign: 'left',
							position: 'relative'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
							<div>
								<h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
									Share Your Travel Story
								</h3>
								<p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
									Tell us about your holiday experience with Golden Travels
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								aria-label="Close modal"
								style={{
									background: '#f1f5f9',
									border: 'none',
									width: '32px',
									minWidth: '32px',
									maxWidth: '32px',
									height: '32px',
									minHeight: '32px',
									maxHeight: '32px',
									borderRadius: '50%',
									aspectRatio: '1 / 1',
									padding: 0,
									margin: 0,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									flexShrink: 0,
									boxSizing: 'border-box',
									color: '#64748b',
									transition: 'all 0.2s ease',
									lineHeight: 1
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#e2e8f0'
									e.currentTarget.style.color = '#0f172a'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = '#f1f5f9'
									e.currentTarget.style.color = '#64748b'
								}}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>

						{submitSuccess ? (
							<div style={{ padding: '28px 16px', textAlign: 'center' }}>
								<div style={{ fontSize: '42px', marginBottom: '10px' }}>🎉</div>
								<h4 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>
									Thank You for Your Review!
								</h4>
								<p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
									Your story has been added to our Client Stories.
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
								<div>
									<label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
										Your Name *
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Priya & Rajesh"
										value={formData.name}
										onChange={e => setFormData({ ...formData, name: e.target.value })}
										style={{
											width: '100%',
											padding: '10px 14px',
											borderRadius: '10px',
											border: '1px solid #cbd5e1',
											fontSize: '14px',
											color: '#0f172a',
											outline: 'none'
										}}
									/>
								</div>

								<div>
									<label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
										Journey / Trip <span style={{ color: '#94a3b8', fontWeight: '500', textTransform: 'none' }}>(Optional)</span>
									</label>
									<input
										type="text"
										placeholder="e.g. Honeymoon in Switzerland & Paris"
										value={formData.role}
										onChange={e => setFormData({ ...formData, role: e.target.value })}
										style={{
											width: '100%',
											padding: '10px 14px',
											borderRadius: '10px',
											border: '1px solid #cbd5e1',
											fontSize: '14px',
											color: '#0f172a',
											outline: 'none'
										}}
									/>
								</div>

								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
										<label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', margin: 0 }}>
											Star Rating *
										</label>
										<span style={{ fontSize: '12.5px', fontWeight: '800', color: '#b45309', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
											{formData.rating} / 5
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
										{[1, 2, 3, 4, 5].map(star => (
											<button
												key={star}
												type="button"
												onClick={() => setFormData({ ...formData, rating: star })}
												style={{
													flex: 1,
													height: '40px',
													padding: 0,
													background: formData.rating >= star ? '#fef3c7' : '#f8fafc',
													border: formData.rating >= star ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
													borderRadius: '8px',
													fontSize: '20px',
													color: formData.rating >= star ? '#f59e0b' : '#cbd5e1',
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													transition: 'all 0.15s ease'
												}}
											>
												★
											</button>
										))}
									</div>
								</div>

								<div>
									<label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
										Your Review *
									</label>
									<textarea
										rows="4"
										required
										placeholder="Share your experience with Golden Travels..."
										value={formData.text}
										onChange={e => setFormData({ ...formData, text: e.target.value })}
										style={{
											width: '100%',
											padding: '10px 14px',
											borderRadius: '10px',
											border: '1px solid #cbd5e1',
											fontSize: '14px',
											color: '#0f172a',
											resize: 'vertical',
											outline: 'none'
										}}
									/>
								</div>

								{submitError && (
									<div style={{ color: '#dc2626', fontSize: '12.5px', fontWeight: '600' }}>
										{submitError}
									</div>
								)}

								<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										style={{
											padding: '10px 18px',
											backgroundColor: '#f1f5f9',
											color: '#475569',
											border: '1px solid #cbd5e1',
											borderRadius: '10px',
											fontWeight: '700',
											fontSize: '13.5px',
											cursor: 'pointer'
										}}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={submitting}
										style={{
											padding: '10px 22px',
											backgroundColor: '#16a34a',
											color: '#ffffff',
											border: 'none',
											borderRadius: '10px',
											fontWeight: '800',
											fontSize: '13.5px',
											cursor: 'pointer',
											boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
										}}
									>
										{submitting ? 'Submitting...' : 'Submit Review'}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</section>
	)
}
