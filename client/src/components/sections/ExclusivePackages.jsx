import React, { useState, useEffect, useRef } from 'react'
import Link from '@/components/elements/Link'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { packagesData } from '@/data/packagesData'
import { fetchPackages } from '@/services/api'

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

export const PACKAGES = packagesData.map((pkg) => ({
	id: pkg.id,
	slug: pkg.slug,
	title: pkg.shortTitle || pkg.title,
	destination: pkg.destination,
	duration: pkg.duration,
	image: pkg.image,
	badge: pkg.badge,
	type: pkg.type,
	personas: ensureArray(pkg.personas, ['couple', 'family']),
	category: pkg.category,
	inclusions: ensureArray(pkg.keyInclusions || pkg.inclusions).slice(0, 4)
}))

const TABS = [
	{ id: 'domestic', label: 'Domestic' },
	{ id: 'international', label: 'International' }
]

/* small inline icons (no emoji, so no encoding problems) */
const Icon = ({ children, size = 16, fill = 'none' }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		{children}
	</svg>
)
const PinIcon = () => (
	<Icon size={14}>
		<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
		<circle cx="12" cy="10" r="2.5" />
	</Icon>
)
const ClockIcon = () => (
	<Icon size={15}>
		<circle cx="12" cy="12" r="9" />
		<polyline points="12 7 12 12 15.5 14" />
	</Icon>
)
const CheckIcon = () => (
	<Icon size={14}>
		<polyline points="20 6 9 17 4 12" />
	</Icon>
)
const PhoneIcon = () => (
	<Icon size={18}>
		<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
	</Icon>
)
const ChatIcon = () => (
	<Icon size={18}>
		<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1 1 21 11.5z" />
	</Icon>
)
const ArrowIcon = () => (
	<Icon size={15}>
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12 5 19 12 12 19" />
	</Icon>
)
const ChevronLeftIcon = () => (
	<Icon size={18}>
		<polyline points="15 18 9 12 15 6" />
	</Icon>
)
const ChevronRightIcon = () => (
	<Icon size={18}>
		<polyline points="9 18 15 12 9 6" />
	</Icon>
)
const StarIcon = () => (
	<svg width="13" height="13" viewBox="0 0 24 24" fill="#E0A21B" aria-hidden="true">
		<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
	</svg>
)

export default function ExclusivePackages({ activePersona, onOpenInquiry, sectionHeader }) {
	const [selectedCategory, setSelectedCategory] = useState('domestic')
	const [allPackages, setAllPackages] = useState(PACKAGES)
	const swiperRef = useRef(null)

	useEffect(() => {
		const loadLivePackages = async () => {
			try {
				const res = await fetchPackages({ activeOnly: 'true' })
				if (res && res.success && res.data && res.data.length > 0) {
					const mapped = res.data.map((pkg) => ({
						id: pkg.id,
						slug: pkg.slug,
						title: pkg.shortTitle || pkg.title,
						destination: pkg.destination,
						duration: pkg.duration,
						image: pkg.image || '/assets/images/tour/1.jpg',
						badge: pkg.badge,
						type: pkg.type,
						showInExclusive: pkg.showInExclusive,
						personas: ensureArray(pkg.personas, ['couple', 'family']),
						category: pkg.category,
						inclusions: ensureArray(pkg.keyInclusions || pkg.inclusions).slice(0, 4)
					}))
					setAllPackages(mapped)
				}
			} catch (err) {
				// Seamless fallback to static PACKAGES
			}
		}
		loadLivePackages()
	}, [])

	// Filter by category (Domestic / International) and showInExclusive flag
	const categoryList = allPackages
		.filter((p) => p.showInExclusive !== false && p.showInExclusive !== 0 && p.showInExclusive !== '0')
		.filter((p) =>
			selectedCategory === 'international'
				? p.type === 'INTERNATIONAL'
				: p.type === 'DOMESTIC'
		)

	let list = categoryList.length > 0 ? [...categoryList] : [...allPackages]
	if (activePersona) {
		list.sort((a, b) => {
			const aMatch = (a.personas || []).includes(activePersona) ? 0 : 1
			const bMatch = (b.personas || []).includes(activePersona) ? 0 : 1
			return aMatch - bMatch
		})
	}

	return (
		<section className="xp">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=DM+Sans:wght@400;500;700&display=swap');

				.xp{--page:#f6f3ea;--olive:#3A5A20;--olive-dk:#1d2a0f;--gold:#E0A21B;--gold-dk:#8a6420;--line:#e6dfc9;
					background:var(--page);padding:72px 0 76px;font-family:'DM Sans',sans-serif;color:var(--olive-dk);overflow:hidden}

				.xp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:34px}
				.xp-eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--gold-dk);font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
				.xp-eyebrow::before{content:'';width:34px;height:2px;background:var(--gold)}
				.xp-title{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(26px,3.8vw,44px);letter-spacing:-.03em;line-height:1.1;margin:12px 0 10px;color:var(--olive-dk);max-width:640px}
				.xp-title b{color:var(--olive);font-weight:800}
				.xp-sub{margin:0;color:#5d6652;font-size:15.5px;line-height:1.6;max-width:560px}
				.xp-for{display:inline-block;margin-top:12px;padding:5px 12px;border-radius:20px;background:#e6eed9;color:var(--olive);font-size:12.5px;font-weight:700;text-transform:capitalize}

				.xp-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
				.xp-tabs{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding:6px;border-radius:50px;background:#ebe5d1;-webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:100%}
				.xp-tabs::-webkit-scrollbar{display:none}
				.xp-tab{white-space:nowrap;flex-shrink:0;padding:9px 18px !important;border:none !important;border-radius:50px !important;background:transparent !important;color:#4a5440 !important;font:600 13.5px 'DM Sans',sans-serif !important;cursor:pointer;transition:background .25s,color .25s;line-height:1.2 !important;height:auto !important;min-width:0 !important}
				.xp-tab:hover{color:var(--olive-dk) !important}
				.xp-tab.on{background:var(--olive) !important;color:#fff !important;box-shadow:0 6px 16px rgba(58,90,32,.3)}
				.xp-tab:focus-visible{outline:2px solid var(--olive);outline-offset:2px}

				.xp-nav-btns{display:inline-flex;align-items:center;gap:8px}
				.xp-nav-btn{width:42px !important;height:42px !important;min-width:42px !important;padding:0 !important;border-radius:50% !important;border:1.5px solid var(--line) !important;background:#fff !important;color:var(--olive-dk) !important;display:inline-flex !important;align-items:center;justify-content:center;cursor:pointer;transition:all .2s ease;box-shadow:0 4px 12px rgba(58,90,32,.08)}
				.xp-nav-btn:hover{background:var(--olive) !important;border-color:var(--olive) !important;color:#fff !important;transform:translateY(-2px)}

				.xp-slider-wrap{position:relative;padding:4px 0 10px}
				.xp-swiper{overflow:hidden !important;padding:12px 4px 54px !important;margin:-12px -4px 0}
				.xp-swiper .swiper-wrapper{align-items:stretch}
				.xp-swiper .swiper-slide{height:auto !important;display:flex !important}
				.xp-swiper .swiper-pagination{bottom:8px !important;left:0 !important;right:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;gap:10px !important}
				.xp-swiper .swiper-pagination-bullet{width:10px !important;height:10px !important;border-radius:999px !important;background:#cfc6ab !important; border:none !important;opacity:1 !important;margin:0 !important;padding:0 !important;transition:all .25s ease !important}
				.xp-swiper .swiper-pagination-bullet::before,.xp-swiper .swiper-pagination-bullet::after{content:none !important;display:none !important}
				.xp-swiper .swiper-pagination-bullet-active{width:28px !important;height:10px !important;border-radius:999px !important;background:var(--olive) !important;box-shadow:0 2px 8px rgba(58,90,32,.3) !important}

				/* boarding-pass card */
				.xp-card{position:relative;display:flex;flex-direction:column;width:100%;height:100%;background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 10px 28px rgba(58,90,32,.08);transition:transform .35s ease,box-shadow .35s ease;animation:xpUp .6s ease both}
				.xp-card:hover{transform:translateY(-8px);box-shadow:0 22px 44px rgba(58,90,32,.18)}

				.xp-photo{position:relative;height:218px;background:linear-gradient(135deg,#3A5A20,#1d2a0f);overflow:hidden}
				.xp-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s ease}
				.xp-card:hover .xp-photo img{transform:scale(1.07)}
				.xp-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,24,8,.28) 0%,transparent 35%,rgba(14,24,8,.78) 100%)}
				.xp-badge{position:absolute;top:14px;left:14px;z-index:2;background:var(--gold);color:var(--olive-dk);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:5px 12px;border-radius:20px}
				.xp-rate{position:absolute;top:14px;right:14px;z-index:2;display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.95);color:var(--olive-dk);font-size:12.5px;font-weight:700;padding:5px 10px;border-radius:20px}
				.xp-rate small{font-weight:500;color:#6b7461;font-size:11.5px}
				.xp-dest{position:absolute;left:16px;bottom:14px;z-index:2;display:inline-flex;align-items:center;gap:6px;color:#fff;font-size:14px;font-weight:700}

				.xp-body{padding:20px 22px 18px;text-align:left}
				.xp-name{font-family:'Bricolage Grotesque',sans-serif;font-size:21px;font-weight:800;line-height:1.2;letter-spacing:-.01em;margin:0 0 12px;min-height:50px}
				.xp-name a{color:var(--olive-dk) !important;text-decoration:none !important}
				.xp-name a:hover{color:var(--olive) !important}
				.xp-dur{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:20px;background:#f2eedd;color:#5b5326;font-size:13px;font-weight:700;margin-bottom:16px}
				.xp-inc{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:9px 12px}
				.xp-inc li{display:flex;align-items:flex-start;gap:7px;font-size:13px;line-height:1.35;color:#454d3b;font-weight:500}
				.xp-inc li svg{flex-shrink:0;margin-top:1px;color:var(--olive)}

				/* perforation with side notches */
				.xp-perf{position:relative;height:0;border-top:2px dashed var(--line);margin:0 22px}
				.xp-perf::before,.xp-perf::after{content:'';position:absolute;top:-12px;width:22px;height:22px;border-radius:50%;background:var(--page);border:1px solid var(--line)}
				.xp-perf::before{left:-34px}.xp-perf::after{right:-34px}

				.xp-stub{padding:18px 22px 22px;margin-top:auto}

				.xp-actions{display:flex;align-items:center;gap:8px}
				.xp-ico{flex-shrink:0;width:40px !important;height:42px !important;min-width:40px !important;padding:0 !important;display:inline-flex !important;align-items:center;justify-content:center;border-radius:12px !important;border:1.5px solid var(--line) !important;background:#fff !important;color:var(--olive) !important;cursor:pointer;transition:all .2s;text-decoration:none !important}
				.xp-ico:hover{background:var(--olive) !important;border-color:var(--olive) !important;color:#fff !important}
				.xp-view{flex:1;height:42px;display:inline-flex !important;align-items:center;justify-content:center;gap:5px;border-radius:12px;background:var(--olive) !important;color:#fff !important;font-size:13px !important;font-weight:700;text-decoration:none !important;box-shadow:0 6px 14px rgba(58,90,32,.22);transition:transform .2s,background .2s;white-space:nowrap !important;padding:0 8px !important;min-width:0 !important}
				.xp-view:hover{background:var(--olive-dk) !important;transform:translateY(-2px)}
				.xp-view svg{color:var(--gold);transition:transform .2s;flex-shrink:0}
				.xp-view:hover svg{transform:translateX(3px)}
				.xp-chat{background:var(--gold) !important;border-color:var(--gold) !important;color:var(--olive-dk) !important}
				.xp-chat:hover{background:#c98f12 !important;border-color:#c98f12 !important;color:var(--olive-dk) !important}

				@keyframes xpUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
				@media (max-width:1199px){
					.xp-stub{padding:14px 16px 18px !important}
					.xp-body{padding:16px 18px 14px !important}
					.xp-name{font-size:18.5px !important;min-height:46px !important}
					.xp-actions{gap:6px !important}
					.xp-view{font-size:12.5px !important;padding:0 6px !important}
				}
				@media (max-width:640px){
					.xp{padding:48px 0 52px}
					.xp-head{margin-bottom:24px}
					.xp-inc{grid-template-columns:1fr}
					.xp-name{min-height:auto;font-size:18px}
				}
				@media (prefers-reduced-motion:reduce){
					.xp-card{animation:none}
					.xp-card,.xp-photo img{transition:none}
				}
			`}</style>

			<div className="tf-container">
				<div className="xp-head">
					<div>
						{/* Golden Leisure Division Badge */}
						<div style={{ display: 'inline-flex', alignItems: 'center', background: '#ffffff', padding: '8px 24px', borderRadius: '40px', border: '1.5px solid #e2e8f0', boxShadow: '0 3px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
							<img src="/assets/images/logo/golden-leisure-logo.png" alt="Golden Leisure" style={{ height: '44px', width: 'auto', objectFit: 'contain', display: 'block' }} />
						</div>

						<div>
							<span className="xp-eyebrow">{sectionHeader?.badge || 'Exclusive Tour Packages'}</span>
						</div>
						<h2 className="xp-title">
							{sectionHeader?.title ? (
								sectionHeader.title
							) : (
								<>Curated packages for <b>unforgettable holidays</b></>
							)}
						</h2>
						<p className="xp-sub">
							{sectionHeader?.subtitle || 'Verified 4★/5★ hotels, sightseeing, expert assistance and the flexibility to customize every day.'}
						</p>
					</div>

					<div className="xp-controls">
						<div className="xp-tabs" role="tablist" aria-label="Filter packages">
							{TABS.map((t) => (
								<button
									key={t.id}
									type="button"
									role="tab"
									aria-selected={selectedCategory === t.id}
									className={`xp-tab ${selectedCategory === t.id ? 'on' : ''}`}
									onClick={() => setSelectedCategory(t.id)}
								>
									{t.label}
								</button>
							))}
						</div>

						<div className="xp-nav-btns">
							<button
								type="button"
								className="xp-nav-btn"
								onClick={() => swiperRef.current?.slidePrev()}
								aria-label="Previous package"
								title="Previous"
							>
								<ChevronLeftIcon />
							</button>
							<button
								type="button"
								className="xp-nav-btn"
								onClick={() => swiperRef.current?.slideNext()}
								aria-label="Next package"
								title="Next"
							>
								<ChevronRightIcon />
							</button>
						</div>
					</div>
				</div>

				{/* Auto-Scrolling Horizontal Carousel */}
				<div className="xp-slider-wrap">
					<Swiper
						key={`${selectedCategory}-${activePersona || 'any'}-${list.length}`}
						onSwiper={(swiper) => {
							swiperRef.current = swiper
						}}
						className="xp-swiper"
						modules={[Autoplay, Pagination]}
						autoplay={{
							delay: 2800,
							disableOnInteraction: false,
							pauseOnMouseEnter: true
						}}
						loop={list.length > 3}
						grabCursor={true}
						speed={850}
						pagination={{ clickable: true }}
						slidesPerView={1}
						spaceBetween={20}
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
								slidesPerView: 2,
								spaceBetween: 18
							},
							768: {
								slidesPerView: 2.2,
								spaceBetween: 18
							},
							1024: {
								slidesPerView: 3,
								spaceBetween: 18
							},
							1280: {
								slidesPerView: 3,
								spaceBetween: 24
							}
						}}
					>
						{list.map((pkg) => {
							const tourLink = pkg.slug ? `/tour/${pkg.slug}` : '/tour/north-east-program'
							return (
								<SwiperSlide key={pkg.id}>
									<article className="xp-card">
										<Link href={tourLink} className="xp-photo" style={{ textDecoration: 'none', display: 'block' }}>
											<img
												src={pkg.image}
												alt={pkg.title}
												loading="lazy"
												decoding="async"
												onError={(e) => {
													e.currentTarget.style.display = 'none'
												}}
											/>
											<span className="xp-badge">{pkg.badge}</span>
											<span className="xp-dest">
												<PinIcon />
												{pkg.destination}
											</span>
										</Link>

										<div className="xp-body">
											<h3 className="xp-name">
												<Link href={tourLink}>{pkg.title}</Link>
											</h3>
											<span className="xp-dur">
												<ClockIcon />
												{pkg.duration || (pkg.days ? `${pkg.days} Day${pkg.days > 1 ? 's' : ''}${pkg.nights !== undefined ? ` | ${pkg.nights} Night${pkg.nights > 1 ? 's' : ''}` : ''}` : '')}
											</span>
											<ul className="xp-inc">
												{((pkg.keyInclusions?.filter(Boolean)?.length ? pkg.keyInclusions.filter(Boolean) : pkg.inclusions?.filter(Boolean)) || []).slice(0, 4).map((item, idx) => (
													<li key={idx}>
														<CheckIcon />
														{item}
													</li>
												))}
											</ul>
										</div>

										<div className="xp-perf" aria-hidden="true" />

										<div className="xp-stub">
											<div className="xp-actions">
												<a href="tel:04222477090" className="xp-ico" title="Call office: 0422 2477090" aria-label="Call office">
													<PhoneIcon />
												</a>
												<Link href={tourLink} className="xp-view">
													View Details <ArrowIcon />
												</Link>
												<button
													type="button"
													className="xp-chat"
													title="Enquire about this package"
													aria-label={`Enquire about ${pkg.title}`}
													onClick={() => onOpenInquiry && onOpenInquiry({
														packageName: pkg.title,
														duration: pkg.duration,
														destination: pkg.destination
													})}
													style={{
														height: '42px',
														padding: '0 12px',
														borderRadius: '12px',
														border: '1.5px solid #E0A21B',
														background: '#E0A21B',
														color: '#1d2a0f',
														fontWeight: '800',
														fontSize: '13px',
														cursor: 'pointer',
														display: 'inline-flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: '5px',
														flexShrink: 0,
														whiteSpace: 'nowrap',
														transition: 'all 0.2s'
													}}
												>
													<ChatIcon />
													<span>Enquire</span>
												</button>
											</div>
										</div>
									</article>
								</SwiperSlide>
							)
						})}
					</Swiper>
				</div>
			</div>
		</section>
	)
}