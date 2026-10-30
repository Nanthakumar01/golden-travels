import React, { useState, useEffect } from "react"
import { fetchPartners } from "@/services/api"

const DEFAULT_PARTNERS = [
	{ id: 1, name: 'Emirates', tagline: 'FLY BETTER', iconType: 'plane', isActive: true },
	{ id: 2, name: 'Singapore Airlines', tagline: 'A GREAT WAY TO FLY', iconType: '🗼', isActive: true },
	{ id: 3, name: 'Marriott Bonvoy', tagline: 'LUXURY HOTELS & RESORTS', iconType: 'hotel', isActive: true },
	{ id: 4, name: 'Swiss Travel System', tagline: 'SWISS PANORAMIC TRAINS', iconType: 'train', isActive: true }
]

export default function BrandLogoSlider() {
	const [partnerList, setPartnerList] = useState(DEFAULT_PARTNERS)
	const [loaded, setLoaded] = useState(false)
	const [hiddenByAdmin, setHiddenByAdmin] = useState(false)

	useEffect(() => {
		fetchPartners()
			.then((res) => {
				if (res && res.success && Array.isArray(res.data)) {
					const activePartners = res.data.filter(p => p.isActive !== false)
					if (res.data.length > 0 && activePartners.length === 0) {
						// Admin explicitly hid all partners in database
						setHiddenByAdmin(true)
						setPartnerList([])
					} else if (activePartners.length > 0) {
						setPartnerList(activePartners)
					}
				}
			})
			.catch(() => {
				// API offline or unreachable -> use default luxury partners fallback
				setPartnerList(DEFAULT_PARTNERS)
			})
			.finally(() => {
				setLoaded(true)
			})
	}, [])

	// If admin explicitly turned off all partners in database, render nothing
	if (hiddenByAdmin || !partnerList || partnerList.length === 0) {
		return null
	}

	const renderIcon = (partner) => {
		if (partner.imageUrl) {
			return (
				<img
					src={partner.imageUrl}
					alt={partner.name}
					style={{ width: "22px", height: "22px", objectFit: "contain" }}
				/>
			)
		}
		const val = (partner.iconType || '').trim()

		// Airplane / Flight
		if (['✈️', '🛫', '🛬', '🛩️', 'plane', 'flight', 'airline'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
				</svg>
			)
		}

		// Hotel / Bed
		if (['🏨', '🛏️', '🏩', 'hotel', 'resort', 'stay'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
				</svg>
			)
		}

		// Train / Rail
		if (['🚆', '🚄', '🚅', '🚇', 'train', 'rail'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
				</svg>
			)
		}

		// Globe / Network / World
		if (['🌐', '🌍', '🌎', '🌏', 'globe', 'world'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
				</svg>
			)
		}

		// Palace / Building / Heritage
		if (['🏛️', '🏢', '🏰', '🏯', 'building', 'palace'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
				</svg>
			)
		}

		// Star / Luxury
		if (['⭐', '🌟', '✨', 'star'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
				</svg>
			)
		}

		// Crown / Royal
		if (['👑', 'crown', 'royal'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
				</svg>
			)
		}

		// Diamond
		if (['💎', 'diamond', 'jewel'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 10v6.68L5.44 10H11zm2 0h5.56L13 16.68V10zm3.88-2l-1.5-3h2.7l1.5 3h-2.7zM4.92 8l1.5-3H9.12l-1.5 3H4.92z"/>
				</svg>
			)
		}

		// Cruise Ship
		if (['🛳️', '🚢', '🛥️', '⛵', 'ship', 'cruise', 'boat'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.47L20 11V6c0-1.1-.9-2-2-2h-3V1h-2v3h-2V1H9v3H6c-1.1 0-2 .9-2 2v5l-1.28.27c-.26.05-.48.23-.6.47s-.14.52-.06.78L3.95 19zM6 6h12v5H6V6z"/>
				</svg>
			)
		}

		// Palm Island
		if (['🌴', '🏖️', '🏝️', 'palm', 'beach', 'island'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M13 16.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3-2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm1.5-4.5C17.5 7.5 15 5.5 12 5.5S6.5 7.5 6.5 10c0 1.93 1.57 3.5 3.5 3.5h4c1.93 0 3.5-1.57 3.5-3.5zm-5.5-8C7.5 2 3.5 5 3.5 9c0 1.5.6 2.8 1.5 3.8-.3-1-.5-2.1-.5-3.3C4.5 6 7 3.5 10 3.5c.7 0 1.4.1 2 .4-.7-1.1-1.3-1.9-2-1.9zm4 0c-.7 0-1.3.8-2 1.9.6-.3 1.3-.4 2-.4 3 0 5.5 2.5 5.5 6 0 1.2-.2 2.3-.5 3.3.9-1 1.5-2.3 1.5-3.8 0-4-4-7-6.5-7z"/>
				</svg>
			)
		}

		// Tower / Monument / Landmark (Tokyo tower, Eiffel tower, etc.)
		if (['🗼', '🗽', '🗿', 'tower', 'monument', 'landmark'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2l-1.5 5.5h3L12 2zm-1.8 7l-1 5h5.6l-1-5h-3.6zm-1.6 7l-2 6h2.5l.6-2.5h4.6l.6 2.5h2.5l-2-6H8.6z"/>
				</svg>
			)
		}

		// Calendar / Booking / Dates
		if (['📅', '🗓️', '📆', 'calendar', 'date', 'booking'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
				</svg>
			)
		}

		// Compass / Navigation / Explore
		if (['🧭', 'compass', 'navigation'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 5.81l-2 6.19 6.19-2-2-6.19zM12 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
				</svg>
			)
		}

		// Fallback emoji - rendered in pure white silhouette for a unified luxury green & white theme!
		return (
			<span
				style={{
					fontSize: '20px',
					lineHeight: 1,
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					filter: 'brightness(0) invert(1)',
					opacity: 0.95
				}}
			>
				{val || '✈️'}
			</span>
		)
	}

	// If 1, 2, or 3 partners: display static centered without continuous ticker scrolling
	// If 4 or more: display continuous marquee ticker scroll
	const shouldScroll = partnerList.length >= 4

	// Build a sequence with enough items (at least 12-16 items) so that half the track easily fills any wide screen!
	let singleSequence = []
	if (shouldScroll) {
		const repeatCount = Math.max(2, Math.ceil(12 / partnerList.length))
		for (let i = 0; i < repeatCount; i++) {
			singleSequence = singleSequence.concat(partnerList)
		}
	} else {
		singleSequence = partnerList
	}

	// Two identical halves for a 100% seamless, gapless, infinite marquee loop
	const displayItems = shouldScroll ? [...singleSequence, ...singleSequence] : singleSequence

	return (
		<section className="brand-logo-widget" style={{ padding: '36px 0 28px', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
			<div className="tf-container">
				<div className="row">
					<div className="col-lg-12">
						<div style={{ textAlign: 'center', marginBottom: '14px' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8' }}>
								Our Trusted Airline &amp; Luxury Hospitality Partners
							</span>
						</div>

						<div className={`brand-partner-slider-container ${shouldScroll ? 'is-marquee' : 'is-static'}`}>
							<style>{`
								.brand-partner-slider-container {
									position: relative;
									width: 100%;
									overflow: hidden;
									padding: 12px 0 18px;
								}

								.brand-partner-slider-container.is-marquee {
									mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
									-webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
								}

								.brand-marquee-track {
									display: flex;
									align-items: center;
									gap: 18px;
									width: max-content;
									animation: brandMarqueeContinuous 32s linear infinite;
									will-change: transform;
								}

								.brand-static-track {
									display: flex;
									align-items: center;
									justify-content: center;
									flex-wrap: wrap;
									gap: 18px;
									width: 100%;
									max-width: 1200px;
									margin: 0 auto;
								}

								.brand-marquee-track:hover {
									animation-play-state: paused;
								}

								@keyframes brandMarqueeContinuous {
									0% {
										transform: translateX(0);
									}
									100% {
										transform: translateX(-50%);
									}
								}

								.partner-brand-badge {
									display: inline-flex;
									align-items: center;
									gap: 12px;
									padding: 12px 20px;
									border-radius: 14px;
									background: #ffffff;
									border: 1px solid rgba(229, 169, 30, 0.28);
									box-shadow: 0 4px 14px rgba(0,0,0,0.04);
									transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
									cursor: default;
									user-select: none;
									flex-shrink: 0;
									white-space: nowrap;
								}

								.partner-brand-badge:hover {
									transform: translateY(-3px);
									border-color: #E5A91E;
									box-shadow: 0 8px 24px rgba(229, 169, 30, 0.2);
								}

								.partner-badge-icon {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 38px;
									height: 38px;
									border-radius: 10px;
									background: #0f4c28;
									color: #ffffff;
									flex-shrink: 0;
									box-shadow: 0 4px 10px rgba(15, 76, 40, 0.25);
								}

								.partner-badge-info {
									display: flex;
									flex-direction: column;
									text-align: left;
								}

								.partner-badge-name {
									font-weight: 800;
									font-size: 14px;
									color: #0f172a;
									line-height: 1.2;
									margin: 0;
								}

								.partner-badge-tagline {
									font-size: 10px;
									font-weight: 800;
									letter-spacing: 0.08em;
									color: #d97706;
									text-transform: uppercase;
									margin: 2px 0 0;
									line-height: 1.2;
								}

								@media (max-width: 991px) {
									.brand-static-track {
										gap: 14px;
									}
									.brand-marquee-track {
										gap: 14px;
										animation-duration: 26s;
									}
									.partner-brand-badge {
										padding: 10px 16px;
									}
								}

								@media (max-width: 640px) {
									.brand-static-track {
										gap: 10px;
										padding: 0 8px;
									}
									.brand-marquee-track {
										gap: 12px;
										animation-duration: 20s;
									}
									.partner-brand-badge {
										padding: 8px 14px;
									}
									.partner-badge-icon {
										width: 32px;
										height: 32px;
									}
									.partner-badge-name {
										font-size: 13px;
									}
									.partner-badge-tagline {
										font-size: 9px;
									}
								}
							`}</style>

							<div className={shouldScroll ? "brand-marquee-track" : "brand-static-track"}>
								{displayItems.map((partner, index) => (
									<div key={`${partner.id || partner.name}-${index}`} className="partner-brand-badge">
										<div className="partner-badge-icon">
											{renderIcon(partner)}
										</div>
										<div className="partner-badge-info">
											<span className="partner-badge-name">{partner.name}</span>
											<span className="partner-badge-tagline">{partner.tagline}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
