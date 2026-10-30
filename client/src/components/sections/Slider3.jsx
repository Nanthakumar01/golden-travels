import React, { useState, useCallback, useRef } from 'react'

const DURATION = 6000 // ms per slide

const SLIDES = [
	{
		id: 'europe',
		tab: 'Europe',
		title: [
			'Your next story',
			<>starts with a <em>Golden</em> journey</>
		],
		text: 'Switzerland to Italy with hotels, transfers and a trip manager on call. Easy for families and first-time travellers.',
		arches: [
			{ src: '/assets/images/tour/tour-details.jpg', label: 'Switzerland' },
			{ src: '/assets/images/tour/2.jpg', label: 'Italy' },
			{ src: '/assets/images/tour/3.jpg', label: 'France' }
		],
		pass: {
			tag: 'Bestseller · Boarding Pass',
			title: 'Alpine & European Grandeur'
		},
		inquiry: 'Europe Holiday'
	},
	{
		id: 'honeymoon',
		tab: 'Honeymoon',
		title: [
			'Honeymoons that',
			<>feel like <em>yours</em></>
		],
		text: 'Quiet villas, private dinners and beaches with no crowd. Tell us your dates and we build the rest.',
		arches: [
			{ src: '/assets/images/travel-list/5.jpg', label: 'Maldives' },
			{ src: '/assets/images/travel-list/2.jpg', label: 'Bali' },
			{ src: '/assets/images/travel-list/1.jpg', label: 'Thailand' }
		],
		pass: {
			tag: 'Honeymoon · Boarding Pass',
			title: 'Private Villa & Beach Escape'
		},
		inquiry: 'Honeymoon Package'
	},
	{
		id: 'vietnam',
		tab: 'Vietnam',
		title: [
			'Experience the beauty of',
			<><em>Vietnam</em>, perfected</>
		],
		text: 'Hanoi, Halong Bay luxury overnight cruise, Ba Na Hills Golden Bridge, and Phu Quoc island paradise. Full Indian meals and expert local guides.',
		arches: [
			{ src: '/assets/images/packages/vietnam.jpg', label: 'Halong Bay' },
			{ src: '/assets/images/travel-list/3.jpg', label: 'Golden Bridge' },
			{ src: '/assets/images/tour/3.jpg', label: 'Hoi An' }
		],
		pass: {
			tag: 'Bestseller · Boarding Pass',
			title: 'Beauty of Vietnam'
		},
		inquiry: 'Vietnam Package'
	}
]

const pad = (n) => String(n).padStart(2, '0')

const Svg = ({ children, size = 18, fill = 'none' }) => (
	<svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		{children}
	</svg>
)
const ArrowRight = () => <Svg><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
const ArrowLeft = () => <Svg><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
const ArrowDown = () => <Svg size={16}><path d="M12 5v14M6 13l6 6 6-6" /></Svg>
const Pin = () => <Svg size={20}><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
const Plane = () => <Svg size={22}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></Svg>
const Star = () => <Svg size={13} fill="currentColor"><polygon points="12 2 15 9 22 9.3 16.5 14 18.2 21 12 17.3 5.8 21 7.5 14 2 9.3 9 9" /></Svg>

export default function Slider3({ onOpenInquiry, slidesData }) {
	const currentSlides = (slidesData && slidesData.length > 0)
		? slidesData.map(s => {
			let arches = s.arches
			if (typeof arches === 'string') {
				try { arches = JSON.parse(arches) } catch { arches = [] }
			}
			if (!Array.isArray(arches) || arches.length === 0) {
				arches = [
					{ src: '/assets/images/tour/tour-details.jpg', label: s.tab || 'Destination' },
					{ src: '/assets/images/tour/2.jpg', label: 'Explore' },
					{ src: '/assets/images/tour/3.jpg', label: 'Discover' }
				]
			}
			return {
				id: s.slideKey || s.id,
				tab: s.tab,
				eyebrowBadge: s.eyebrowBadge || 'Bespoke Luxury Holidays',
				featuredLabel: s.featuredLabel || 'Featured destination',
				title: [
					s.titleLine1 || '',
					<>{s.titleHighlight ? <em>{s.titleHighlight} </em> : null}{s.titleLine2 || ''}</>
				],
				text: s.text || '',
				arches,
				pass: {
					tag: s.passTag || 'Bestseller · Boarding Pass',
					title: s.passTitle || s.tab
				},
				inquiry: s.inquiry || `${s.tab} Holiday`
			}
		})
		: SLIDES

	const [st, setSt] = useState({ active: 0, prev: -1 })
	const { active, prev } = st
	const total = currentSlides.length
	const rootRef = useRef(null)
	const raf = useRef(0)

	const go = useCallback((i) => {
		setSt((s) => {
			const a = (i + total) % total
			return a === s.active ? s : { active: a, prev: s.active }
		})
	}, [total])
	const next = useCallback(() => {
		setSt((s) => ({ active: (s.active + 1) % total, prev: s.active }))
	}, [total])

	// soft mouse parallax for the floating cards
	const onMove = (e) => {
		const el = rootRef.current
		if (!el) return
		const r = el.getBoundingClientRect()
		const x = ((e.clientX - r.left) / r.width - 0.5) * 2
		const y = ((e.clientY - r.top) / r.height - 0.5) * 2
		cancelAnimationFrame(raf.current)
		raf.current = requestAnimationFrame(() => {
			el.style.setProperty('--mx', x.toFixed(3))
			el.style.setProperty('--my', y.toFixed(3))
		})
	}
	const onLeave = () => {
		const el = rootRef.current
		if (!el) return
		cancelAnimationFrame(raf.current)
		el.style.setProperty('--mx', 0)
		el.style.setProperty('--my', 0)
	}

	return (
		<section
			ref={rootRef}
			className="hs"
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			aria-roledescription="carousel"
			aria-label="Featured holidays"
		>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,500;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');

				.hs{
					--ink:#111111;--muted:#5b6460;
					--green:#16a34a;--green-dark:#0f7a37;--green-soft:#ecfaf1;
					--gold:#f7a500;--gold-deep:#d98a00;--gold-soft:#fff6dd;
					--line:rgba(17,17,17,.1);--mx:0;--my:0;
					position:relative;overflow:hidden;isolation:isolate;background:#fff;color:var(--ink);
					font-family:'DM Sans',sans-serif;padding:44px 0 40px;
				}
				.hs *{box-sizing:border-box}

				/* backdrop: soft green wash behind the stage, gold glow top-left, fading dot grid */
				.hs-bg{position:absolute;inset:0;z-index:0;pointer-events:none;
					background:
						radial-gradient(52% 70% at 80% 42%,var(--green-soft) 0%,rgba(236,250,241,0) 70%),
						radial-gradient(30% 40% at 4% 8%,var(--gold-soft) 0%,rgba(255,246,221,0) 70%)}
				.hs-bg::after{content:'';position:absolute;inset:0;opacity:.7;
					background:radial-gradient(rgba(17,17,17,.09) 1px,transparent 1.3px) 0 0/28px 28px;
					-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 45%,#000 100%);
					mask-image:linear-gradient(90deg,transparent 0%,#000 45%,#000 100%)}

				.hs-wrap{position:relative;z-index:2;width:100%;max-width:1540px;margin:0 auto;padding:0 clamp(16px, 3.2vw, 40px)}
				.hs-slides{display:grid}

				/* all slides share one grid cell, so the section never changes height */
				.hs-slide{grid-area:1/1;position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.06fr);gap:clamp(36px, 4.5vw, 72px);align-items:center;min-height:580px;
					visibility:hidden;z-index:1;transition:visibility 0s linear 1.25s}
				.hs-slide.on{visibility:visible;z-index:2;transition:none}

				/* outlined destination word behind everything */
				.hs-ghost{position:absolute;left:-6px;bottom:-30px;z-index:0;pointer-events:none;user-select:none;white-space:nowrap;
					font-family:'Playfair Display',serif;font-weight:800;text-transform:uppercase;letter-spacing:-.02em;line-height:.8;
					font-size:clamp(90px,11.5vw,200px);color:transparent;-webkit-text-stroke:1.5px rgba(247,165,0,.3);
					opacity:0;transition:opacity .4s ease}
				.hs-slide.on .hs-ghost{opacity:1;transition:none;animation:hsGhost 1.4s cubic-bezier(.2,.8,.2,1) .3s backwards}

				/* ---------- copy ---------- */
				.hs-copy{position:relative;z-index:1;opacity:0;transition:opacity .35s ease}
				.hs-slide.on .hs-copy{opacity:1;transition:none}
				.hs-slide.on .hs-in{animation:hsUp .9s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--i,0) * 90ms + 380ms)}

				.hs-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:9px 18px 9px 14px;margin-bottom:26px;border-radius:40px;
					border:1px solid rgba(247,165,0,.5);background:#fffaf0;color:var(--ink);
					font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
				.hs-eyebrow i{width:8px;height:8px;border-radius:50%;background:var(--gold);animation:hsPulse 2.2s ease-out infinite}

				.hs-title{margin:0 0 22px;font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.015em;line-height:1.08;font-size:clamp(40px,4.7vw,62px)}
				.hs-line{display:block;overflow:hidden;padding-bottom:.16em;margin-bottom:-.16em}
				.hs-line > span{display:block}
				.hs-slide.on .hs-line > span{animation:hsLine 1.05s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--i,0) * 120ms + 420ms)}
				.hs-title em{font-style:italic;font-weight:600;padding-right:.08em;
					background:linear-gradient(100deg,var(--gold) 0%,var(--gold-deep) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:var(--gold)}

				.hs-sub{margin:0 0 34px;max-width:560px;font-size:17px;line-height:1.75;color:var(--muted)}

				.hs-btns{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:0}
				.hs-btn{font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;border:none;transition:transform .3s ease,box-shadow .3s ease,background .3s ease,color .3s ease}
				.hs-btn:focus-visible,.hs-tab:focus-visible,.hs-arrow:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
				.hs-btn.primary{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:14px;padding:17px 24px 17px 28px;border-radius:16px;color:#fff;
					background:linear-gradient(135deg,var(--green) 0%,var(--green-dark) 100%);
					box-shadow:0 16px 30px -12px rgba(15,122,55,.7),inset 0 1px 0 rgba(255,255,255,.2)}
				.hs-btn.primary::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;transform:skewX(-20deg);
					background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transition:left .8s ease}
				.hs-btn.primary:hover{transform:translateY(-3px);box-shadow:0 22px 36px -14px rgba(15,122,55,.8),inset 0 1px 0 rgba(255,255,255,.2)}
				.hs-btn.primary:hover::after{left:130%}
				.hs-btn.primary .ar{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.2);transition:transform .3s ease}
				.hs-btn.primary:hover .ar{transform:translateX(4px)}
				.hs-btn.ghost{position:relative;display:inline-flex;align-items:center;gap:12px;padding:15px 6px;background:none;color:var(--ink)}
				.hs-btn.ghost .dn{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);color:var(--green);background:#fff;transition:transform .3s ease,background .3s ease,color .3s ease,border-color .3s ease}
				.hs-btn.ghost::after{content:'';position:absolute;left:6px;right:6px;bottom:8px;height:2px;border-radius:2px;background:var(--gold);transform:scaleX(.3);transform-origin:left;transition:transform .4s ease}
				.hs-btn.ghost:hover::after{transform:scaleX(1)}
				.hs-btn.ghost:hover .dn{transform:translateY(3px);background:var(--green);color:#fff;border-color:var(--green)}

				/* ---------- stage ---------- */
				.hs-stage{position:relative;z-index:1;height:540px}
				.hs-px{position:absolute;will-change:transform;
					transform:translate3d(calc(var(--mx) * var(--d,10) * 1px),calc(var(--my) * var(--d,10) * 1px),0);
					transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .4s ease}
				.hs-px.fade{opacity:0}
				.hs-slide.on .hs-px.fade{opacity:1;transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .01s}
				.px-main{top:0;right:0;bottom:34px;left:30px}
				.px-a{right:-18px;top:34px}
				.px-b{right:46px;bottom:-12px}
				.px-info{left:-34px;bottom:-8px;z-index:4}

				.hs-main{position:absolute;inset:0;filter:drop-shadow(0 34px 36px rgba(17,24,20,.22))}
				.hs-clip{position:absolute;inset:0;overflow:hidden;border-radius:32px;background:#dfe8e2;clip-path:inset(0 0 0 100% round 32px)}
				.hs-slide.prev .hs-clip{clip-path:inset(0 0 0 0 round 32px)}
				.hs-slide.on .hs-clip{animation:hsWipe 1.2s cubic-bezier(.77,0,.18,1) .05s both}
				.hs-clip img{display:block;width:100%;height:100%;object-fit:cover}
				.hs-slide.on .hs-clip img{animation:hsKen 1.9s cubic-bezier(.2,.7,.2,1) .05s backwards}
				.hs-clip::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(10,20,15,.55) 0%,rgba(10,20,15,0) 38%,rgba(10,20,15,.18) 100%)}
				.hs-loc{position:absolute;z-index:2;left:30px;top:28px;color:#fff}
				.hs-loc small{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;opacity:.92}
				.hs-loc small i{display:block;width:30px;height:2px;border-radius:2px;background:var(--gold)}
				.hs-loc strong{display:flex;align-items:center;gap:8px;margin-top:10px;font-family:'Playfair Display',serif;font-size:38px;line-height:1.1;font-weight:700;text-shadow:0 2px 18px rgba(0,0,0,.3)}
				.hs-loc strong svg{color:var(--gold);flex:none}

				.hs-mini{position:relative;overflow:hidden;width:var(--w);height:var(--h);border-radius:26px;border:6px solid #fff;background:#dfe8e2;
					transform:rotate(var(--r));box-shadow:0 24px 40px -16px rgba(17,24,20,.5)}
				.hs-slide.on .hs-mini{animation:hsPop .95s cubic-bezier(.2,.8,.2,1) var(--dl) backwards,hsFloat 7s ease-in-out calc(var(--dl) + 1s) infinite alternate}
				.hs-mini img{display:block;width:100%;height:100%;object-fit:cover}
				.hs-mini span{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);padding:4px 11px;border-radius:20px;white-space:nowrap;
					background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:10.5px;font-weight:700;letter-spacing:.03em}

				.hs-info{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;align-items:center;width:290px;padding:14px 18px;border-radius:22px;
					background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.95);
					box-shadow:0 30px 56px -22px rgba(17,24,20,.45),0 0 0 1px rgba(17,17,17,.05)}
				.hs-slide.on .hs-info{animation:hsUp .95s cubic-bezier(.2,.8,.2,1) .8s backwards}
				.hs-info-ico{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:var(--gold-soft);color:var(--gold-deep);border:1px solid rgba(247,165,0,.35)}
				.hs-info small{display:block;font-size:9.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-deep)}
				.hs-info h4{margin:3px 0 0;font-family:'Playfair Display',serif;font-size:18.5px;line-height:1.2;font-weight:700;color:var(--ink)}

				/* ---------- navigation ---------- */
				.hs-nav{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:60px}
				.hs-tabs{display:flex;gap:12px;min-width:0;overflow-x:auto;padding:6px 4px 10px;margin:-6px -4px -10px;scrollbar-width:none}
				.hs-tabs::-webkit-scrollbar{display:none}
				.hs-tab{position:relative;overflow:hidden;flex:none;display:flex;align-items:center;gap:12px;padding:8px 24px 11px 8px;border-radius:60px;cursor:pointer;
					background:#fff;border:1px solid var(--line);color:var(--ink);text-align:left;font-family:inherit;
					transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,transform .3s ease}
				.hs-tab:hover{transform:translateY(-2px);box-shadow:0 14px 26px -16px rgba(17,24,20,.4)}
				.hs-tab.on{background:var(--green-soft);border-color:rgba(22,163,74,.5);box-shadow:0 16px 30px -18px rgba(15,122,55,.6)}
				.hs-thumb{flex:none;width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid #fff;box-shadow:0 0 0 1.5px var(--line);background:#dfe8e2;transition:box-shadow .3s ease}
				.hs-tab.on .hs-thumb{box-shadow:0 0 0 2px var(--gold)}
				.hs-thumb img{display:block;width:100%;height:100%;object-fit:cover}
				.hs-tab-t{display:block;font-size:14.5px;font-weight:700;line-height:1.2;white-space:nowrap}
				.hs-tab.on .hs-tab-t{color:var(--green-dark)}
				.hs-tab-s{display:block;margin-top:2px;font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--muted)}
				.hs-bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:transparent;overflow:hidden}
				.hs-fill{position:absolute;inset:0;background:linear-gradient(90deg,var(--gold),var(--green));transform:scaleX(0);transform-origin:left}
				.hs-tab.on .hs-fill{animation:hsFill ${DURATION}ms linear forwards}
				.hs:hover .hs-fill,.hs:focus-within .hs-fill{animation-play-state:paused}
				.hs-ctl{flex:none;display:flex;align-items:center;gap:12px}
				.hs-count{margin-right:6px;font-family:'Playfair Display',serif;font-size:15px;color:var(--muted);white-space:nowrap}
				.hs-count b{font-size:24px;color:var(--green)}
				.hs-arrow{display:grid;place-items:center;width:48px;height:48px;border-radius:16px;cursor:pointer;background:#fff;border:1px solid var(--line);color:var(--ink);
					transition:background .3s ease,color .3s ease,border-color .3s ease,transform .3s ease}
				.hs-arrow:hover{background:var(--green);color:#fff;border-color:var(--green);transform:translateY(-2px)}

				@keyframes hsUp{from{opacity:0;transform:translateY(28px)}}
				@keyframes hsLine{from{transform:translateY(115%)}}
				@keyframes hsWipe{from{clip-path:inset(0 0 0 100% round 32px)}to{clip-path:inset(0 0 0 0 round 32px)}}
				@keyframes hsKen{from{transform:scale(1.25)}}
				@keyframes hsPop{from{opacity:0;transform:translateY(46px) rotate(0deg) scale(.75)}}
				@keyframes hsFloat{to{translate:0 -12px}}
				@keyframes hsGhost{from{opacity:0;transform:translateY(60px)}}
				@keyframes hsFill{to{transform:scaleX(1)}}
				@keyframes hsPulse{0%{box-shadow:0 0 0 0 rgba(247,165,0,.55)}70%{box-shadow:0 0 0 9px rgba(247,165,0,0)}100%{box-shadow:0 0 0 0 rgba(247,165,0,0)}}

				@media (max-width:1100px){
					.hs-slide{gap:40px}
					.hs-stage{height:480px}
					.px-info{left:-14px}
					.hs-info{width:272px}
					.px-b{right:30px}
					.hs-loc strong{font-size:32px}
				}
				@media (max-width:991px){
					.hs{padding:28px 0 32px}
					.hs-wrap{padding:0 18px}
					.hs-slide{grid-template-columns:minmax(0,1fr);gap:34px;min-height:0}
					.hs-stage{order:-1;height:380px;margin-bottom:34px}
					.px-main{left:0}
					.px-a{right:-6px;top:-10px}
					.px-a .hs-mini{--w:104px !important;--h:136px !important}
					.px-b{right:26px;bottom:-14px}
					.px-b .hs-mini{--w:140px !important;--h:92px !important}
					.px-info{left:8px;bottom:-30px}
					.hs-info{width:min(290px,calc(100vw - 80px))}
					.hs-ghost{display:none}
					.hs-title{font-size:clamp(32px,7.4vw,46px)}
					.hs-sub{font-size:15.5px;margin-bottom:26px}
					.hs-btns{margin-bottom:30px}
					.hs-nav{margin-top:36px}
					.hs-count{display:none}
				}
				@media (max-width:540px){
					.hs-wrap{padding:0 16px}
					.hs-stage{height:310px;margin-bottom:46px}
					.hs-clip{border-radius:24px}
					.hs-loc{left:20px;top:18px}
					.hs-loc strong{font-size:26px}
					.hs-loc small{font-size:9.5px}
					.px-a .hs-mini{--w:80px !important;--h:106px !important;border-width:4px;border-radius:20px}
					.px-b{display:none}
					.hs-info{width:calc(100vw - 64px);padding:13px 14px 12px;grid-template-columns:auto 1fr}
					.hs-info-ico{width:40px;height:40px;border-radius:12px}
					.hs-info h4{font-size:16px}
					.px-info{left:6px;bottom:-40px}
					.hs-title{font-size:clamp(28px,8.4vw,34px)}
					.hs-sub{font-size:14.5px;line-height:1.65}
					.hs-btns{flex-direction:column;align-items:stretch;gap:6px}
					.hs-btn.primary{justify-content:space-between}
					.hs-btn.ghost{justify-content:center}
					.hs-btn.ghost::after{display:none}
					.hs-tab{padding:6px 18px 9px 6px}
					.hs-thumb{width:36px;height:36px}
					.hs-tab-t{font-size:13px}
					.hs-ctl{display:none}
				}
				@media (prefers-reduced-motion:reduce){
					.hs *,.hs *::before,.hs *::after{animation:none !important;transition:none !important}
					.hs-slide.on .hs-clip,.hs-slide.prev .hs-clip{clip-path:inset(0 0 0 0 round 32px)}
					.hs-slide.on .hs-copy{opacity:1}
					.hs-tab.on .hs-fill{transform:scaleX(1)}
				}
			`}</style>

			<div className="hs-bg" aria-hidden="true" />

			<div className="hs-wrap">
				<div className="hs-slides">
					{currentSlides.map((s, i) => {
						const main = s.arches?.[0] || { src: '/assets/images/tour/tour-details.jpg', label: s.tab || 'Destination' }
						const a = s.arches?.[1] || { src: '/assets/images/tour/2.jpg', label: 'Explore' }
						const b = s.arches?.[2] || { src: '/assets/images/tour/3.jpg', label: 'Discover' }
						return (
							<div
								key={s.id}
								className={`hs-slide${i === active ? ' on' : ''}${i === prev ? ' prev' : ''}`}
								role="group"
								aria-roledescription="slide"
								aria-label={`${i + 1} of ${total}`}
								aria-hidden={i !== active}
							>
								<div className="hs-ghost" aria-hidden="true">{s.tab}</div>

								{/* LEFT */}
								<div className="hs-copy">
									<div className="hs-eyebrow hs-in" style={{ '--i': 0 }}><i />{s.eyebrowBadge || 'Bespoke Luxury Holidays'}</div>
									<h1 className="hs-title">
										{s.title.map((line, k) => (
											<span key={k} className="hs-line"><span style={{ '--i': k }}>{line}</span></span>
										))}
									</h1>
									<p className="hs-sub hs-in" style={{ '--i': 3 }}>{s.text}</p>

									<div className="hs-btns hs-in" style={{ '--i': 4 }}>
										<button
											className="hs-btn primary"
											onClick={() => onOpenInquiry && onOpenInquiry({ packageName: s.inquiry, source: 'Contact Page Enquiry - Plan My Trip', isPlanMyTrip: true })}
											tabIndex={i === active ? 0 : -1}
										>
											Plan My Trip <span className="ar"><ArrowRight /></span>
										</button>
										<button
											className="hs-btn ghost"
											onClick={() => document.getElementById('exclusive-packages')?.scrollIntoView({ behavior: 'smooth' })}
											tabIndex={i === active ? 0 : -1}
										>
											Explore Packages <span className="dn"><ArrowDown /></span>
										</button>
									</div>
								</div>

								{/* RIGHT */}
								<div className="hs-stage">
									<div className="hs-px px-main" style={{ '--d': -6 }}>
										<div className="hs-main">
											<div className="hs-clip">
												<img src={main.src} alt={main.label} />
												<div className="hs-loc">
													<small><i />{s.featuredLabel || 'Featured destination'}</small>
													<strong><Pin />{main.label}</strong>
												</div>
											</div>
										</div>
									</div>

									<div className="hs-px px-a fade" style={{ '--d': 18 }}>
										<div className="hs-mini" style={{ '--w': '132px', '--h': '172px', '--r': '6deg', '--dl': '700ms' }}>
											<img src={a.src} alt={a.label} />
										</div>
									</div>

									<div className="hs-px px-b fade" style={{ '--d': 24 }}>
										<div className="hs-mini" style={{ '--w': '176px', '--h': '112px', '--r': '-5deg', '--dl': '880ms' }}>
											<img src={b.src} alt={b.label} />
										</div>
									</div>

									<div className="hs-px px-info fade" style={{ '--d': 10 }}>
										<div className="hs-info">
											<div className="hs-info-ico"><Plane /></div>
											<div>
												<small>{s.pass.tag}</small>
												<h4>{s.pass.title}</h4>
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				<nav className="hs-nav" aria-label="Featured holidays">
					<div className="hs-tabs" role="tablist" aria-label="Choose slide">
						{currentSlides.map((s, i) => (
							<button
								key={s.id}
								role="tab"
								aria-selected={i === active}
								className={`hs-tab${i === active ? ' on' : ''}`}
								onClick={() => go(i)}
							>
								<span className="hs-thumb"><img src={s.arches?.[0]?.src || '/assets/images/tour/tour-details.jpg'} alt="" /></span>
								<span>
									<span className="hs-tab-t">{s.tab}</span>
									<span className="hs-tab-s">{pad(i + 1)} / {pad(total)}</span>
								</span>
								<span className="hs-bar">
									<span className="hs-fill" onAnimationEnd={i === active ? next : undefined} />
								</span>
							</button>
						))}
					</div>
					<div className="hs-ctl">
						<div className="hs-count" aria-hidden="true"><b>{pad(active + 1)}</b> / {pad(total)}</div>
						<button className="hs-arrow" onClick={() => go(active - 1)} aria-label="Previous slide"><ArrowLeft /></button>
						<button className="hs-arrow" onClick={() => go(active + 1)} aria-label="Next slide"><ArrowRight /></button>
					</div>
				</nav>
			</div>
		</section>
	)
}
