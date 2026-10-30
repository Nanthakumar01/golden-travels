import React, { useEffect, useState } from "react"

export default function BackToTop({ target }) {
	const [hasScrolled, setHasScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => {
			setHasScrolled(window.scrollY > 100)
		}

		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const handleClick = () => {
		const el = target ? document.querySelector(target) : null
		if (el) {
			window.scrollTo({
				top: el.offsetTop,
				behavior: 'smooth'
			})
		} else {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		}
	}

	return (
		<>
			<style>{`
				body.mobile-menu-visible #scroll-top,
				body.mobile-menu-visible .button-go {
					display: none !important;
					visibility: hidden !important;
					opacity: 0 !important;
					pointer-events: none !important;
				}
			`}</style>
			{hasScrolled && (
				<button
					id="scroll-top"
					className="button-go show"
					onClick={handleClick}
					title="Scroll to Top"
					aria-label="Scroll to Top"
					style={{
						position: 'fixed',
						bottom: '25px',
						right: '25px',
						width: '48px',
						height: '48px',
						borderRadius: '50%',
						backgroundColor: '#16a34a',
						border: 'none',
						outline: 'none',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						zIndex: 9998,
						boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
						color: '#ffffff',
						padding: 0
					}}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{ display: 'block' }}
					>
						<line x1="12" y1="19" x2="12" y2="5" />
						<polyline points="5 12 12 5 19 12" />
					</svg>
				</button>
			)}
		</>
	)
}
