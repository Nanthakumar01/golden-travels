import React, { useState, useEffect } from 'react'
import { fetchSlides } from '@/services/api'

const DEFAULT_CARDS = [
	{ src: '/assets/images/tour/1.jpg', label: 'Switzerland', cls: 'a' },
	{ src: '/assets/images/tour/4.jpg', label: 'Bali', cls: 'b' },
	{ src: '/assets/images/packages/vietnam.jpg', label: 'Vietnam', cls: 'c' }
]

const PERKS = ['100% tailored itineraries', 'Premium handpicked stays', '24/7 priority concierge']

export default function CtaBanner({ slidesData }) {
	const [slides, setSlides] = useState(slidesData || [])

	useEffect(() => {
		if (slidesData && slidesData.length > 0) {
			setSlides(slidesData)
		} else {
			fetchSlides().then(res => {
				if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
					setSlides(res.data)
				}
			}).catch(() => {})
		}
	}, [slidesData])

	// Find the slide that was marked for CTA banner, or fallback to the first slide with arches
	const activeSlide = slides.find(s => s.showInCtaBanner) || slides.find(s => Array.isArray(s.arches) && s.arches.length >= 3) || slides[0]

	const cards = (activeSlide && Array.isArray(activeSlide.arches) && activeSlide.arches.length >= 3)
		? [
			{ src: activeSlide.arches[0]?.src || DEFAULT_CARDS[0].src, label: activeSlide.arches[0]?.label || 'Switzerland', cls: 'a' },
			{ src: activeSlide.arches[1]?.src || DEFAULT_CARDS[1].src, label: activeSlide.arches[1]?.label || 'Bali', cls: 'b' },
			{ src: activeSlide.arches[2]?.src || DEFAULT_CARDS[2].src, label: activeSlide.arches[2]?.label || 'Vietnam', cls: 'c' }
		]
		: DEFAULT_CARDS

	return (
		<section className="cb">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=DM+Sans:wght@400;500;700&display=swap');

				.cb{--olive:#3A5A20;--deep:#182e0e;--gold:#E0A21B;--gold-glow:#f59e0b;--ink:#1d2a0f;background:#f6f3ea;padding:60px 0 72px;font-family:'DM Sans',sans-serif}
				
				/* Panel styled precisely according to the Golden Travels brand logo */
				.cb-panel{position:relative;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:30px;overflow:hidden;border-radius:34px;padding:56px 56px 56px 60px;color:#fff;
					background:
						radial-gradient(circle at 88% 18%,rgba(245,158,11,.38) 0%,transparent 42%),
						radial-gradient(circle at 6% 90%,rgba(224,162,27,.26) 0%,transparent 46%),
						radial-gradient(circle at 50% 50%,rgba(58,90,32,.32) 0%,transparent 65%),
						linear-gradient(135deg,var(--deep) 0%,#264316 48%,var(--olive) 100%);
					border:1.5px solid rgba(224,162,27,.35);
					box-shadow:0 26px 56px rgba(24,46,14,.32), inset 0 1px 0 rgba(255,255,255,.14)}
				
				.cb-panel::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.5px);background-size:26px 26px;z-index:1}

				/* Golden Travels Logo Brand Elements in background */
				.cb-brand-glow{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:34px;z-index:1}
				.cb-orbit-svg{position:absolute;right:-5%;top:-10%;width:85%;height:120%;pointer-events:none}
				.cb-logo-mark{position:absolute;right:-25px;bottom:-25px;width:320px;height:320px;opacity:.09;filter:brightness(2.2) contrast(1.1);pointer-events:none;border-radius:50%}

				.cb-copy{position:relative;z-index:2}
				.cb-eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--gold);font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
				.cb-eyebrow::before{content:'';width:34px;height:2px;background:var(--gold)}
				.cb-title{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(32px,4.4vw,56px);line-height:1.02;letter-spacing:-.03em;margin:16px 0 22px;color:#fff}
				.cb-title b{color:var(--gold);font-weight:800}
				.cb-perks{list-style:none;margin:0 0 32px;padding:0;display:flex;flex-direction:column;gap:11px}
				.cb-perks li{display:flex;align-items:center;gap:11px;font-size:16.5px;font-weight:500;color:#e6ecd9}
				.cb-perks svg{flex-shrink:0;color:var(--gold)}

				.cb-btns{display:flex;flex-wrap:wrap;gap:14px;align-items:center}
				.cb-wa{display:inline-flex !important;align-items:center;gap:10px;padding:16px 28px;border-radius:50px;background:var(--gold) !important;color:var(--ink) !important;font-size:16px;font-weight:800;text-decoration:none !important;box-shadow:0 12px 28px rgba(224,162,27,.34);transition:transform .2s,background .2s}
				.cb-wa:hover{transform:translateY(-3px);background:#f0b52e !important}
				.cb-call{display:inline-flex !important;align-items:center;gap:9px;padding:14px 24px;border-radius:50px;border:1.5px solid rgba(255,255,255,.4);color:#fff !important;font-size:15px;font-weight:700;text-decoration:none !important;transition:background .2s,border-color .2s}
				.cb-call:hover{background:rgba(255,255,255,.12);border-color:#fff}
				.cb-btns a:focus-visible{outline:3px solid #fff;outline-offset:3px}
				.cb-hours{margin:18px 0 0;font-size:13.5px;color:#b9c7a6}

				/* postcard cluster */
				.cb-art{position:relative;z-index:2;height:400px}
				.cb-card{position:absolute;width:210px;padding:10px 10px 0;background:#fff;border-radius:6px;box-shadow:0 18px 36px rgba(0,0,0,.4);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
				.cb-card img{display:block;width:100%;height:200px;object-fit:cover;border-radius:3px;background:#2a4217}
				.cb-card span{display:block;padding:11px 0 13px;text-align:center;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:16px;color:var(--ink)}
				.cb-card.a{left:2%;top:4%;transform:rotate(-7deg);z-index:1}
				.cb-card.b{right:2%;top:22%;transform:rotate(5deg);z-index:2}
				.cb-card.c{left:24%;bottom:0;transform:rotate(-2deg);z-index:3}
				.cb-art:hover .cb-card.a{transform:rotate(-10deg) translate(-8px,-6px)}
				.cb-art:hover .cb-card.b{transform:rotate(8deg) translate(8px,-4px)}
				.cb-art:hover .cb-card.c{transform:rotate(0) translateY(-8px)}

				@media (max-width:991px){
					.cb-panel{grid-template-columns:1fr;padding:44px 28px 36px;gap:34px}
					.cb-art{height:340px;max-width:460px;width:100%;margin:0 auto}
					.cb-card{width:170px}
					.cb-card img{height:150px}
				}
				@media (max-width:480px){
					.cb-btns a{width:100%;justify-content:center}
					.cb-card{width:140px}
					.cb-card img{height:120px}
					.cb-art{height:300px}
				}
				@media (prefers-reduced-motion:reduce){
					.cb-card{transition:none}
				}
			`}</style>

			<div className="tf-container">
				<div className="cb-panel">
					{/* Brand Logo Orbit Arcs and Watermark in background */}
					<div className="cb-brand-glow" aria-hidden="true">
						<svg className="cb-orbit-svg" viewBox="0 0 600 400" fill="none">
							<ellipse cx="420" cy="200" rx="260" ry="140" stroke="rgba(224, 162, 27, 0.22)" strokeWidth="2" transform="rotate(-22 420 200)" />
							<ellipse cx="420" cy="200" rx="220" ry="110" stroke="rgba(245, 158, 11, 0.16)" strokeWidth="1.5" strokeDasharray="6 6" transform="rotate(28 420 200)" />
						</svg>
						<img src="/assets/images/logo/golden-travels-logo.png" alt="" className="cb-logo-mark" />
					</div>

					<div className="cb-copy">
						<span className="cb-eyebrow">The Golden Standard</span>
						<h2 className="cb-title">
							Experience the world with <b>Golden Travels</b>
						</h2>

						<ul className="cb-perks">
							{PERKS.map((p) => (
								<li key={p}>
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
										<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
										<polyline points="22 4 12 14.01 9 11.01" />
									</svg>
									{p}
								</li>
							))}
						</ul>

						<div className="cb-btns">
							<a href="https://wa.me/919003546546" target="_blank" rel="noopener noreferrer" className="cb-wa">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
								</svg>
								Plan my trip on WhatsApp
							</a>
							<a href="tel:04222477090" className="cb-call">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
								</svg>
								0422 2477090
							</a>
						</div>
						<p className="cb-hours">Open Mon to Sat, 10:00 AM to 07:00 PM</p>
					</div>

					<div className="cb-art" aria-hidden="true">
						{cards.map((c, idx) => (
							<figure key={c.label + idx} className={`cb-card ${c.cls}`} style={{ margin: 0 }}>
								<img src={c.src} alt={c.label} loading="lazy" />
								<span>{c.label}</span>
							</figure>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}