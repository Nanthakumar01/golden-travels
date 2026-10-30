import React from 'react'
import Link from './Link'

export default function Logo({ isWhite = false, size = 'default' }) {
	const isLarge = size === 'large'

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap');

				.gt-logo-wrap {
					display: inline-flex;
					align-items: center;
					gap: ${isLarge ? '16px' : '13px'};
					text-decoration: none;
					user-select: none;
				}
				.gt-logo-emblem {
					width: ${isLarge ? '84px' : '70px'};
					height: ${isLarge ? '84px' : '70px'};
					border-radius: 50% !important;
					overflow: hidden !important;
					border: 2.5px solid #E5A91E !important;
					flex-shrink: 0 !important;
					background: #ffffff !important;
					display: flex !important;
					align-items: center !important;
					justify-content: center !important;
					padding: 4px !important;
					box-sizing: border-box !important;
					position: relative !important;
					z-index: 5 !important;
				}
				.gt-logo-title {
					font-size: ${isLarge ? '32px' : '28px'};
					font-weight: 700;
					font-family: 'Playfair Display', Georgia, serif;
					font-style: italic;
					letter-spacing: 0.01em;
					text-transform: none;
					display: flex;
					align-items: center;
					gap: 7px;
					line-height: 1;
				}
				@media (max-width: 1199px) {
					.gt-logo-wrap {
						gap: 10px !important;
					}
					.gt-logo-emblem {
						width: 54px !important;
						height: 54px !important;
						border: 2px solid #E5A91E !important;
						padding: 2.5px !important;
					}
					.gt-logo-title {
						font-size: 22px !important;
						gap: 5px !important;
					}
				}
				@media (max-width: 768px) {
					.gt-logo-wrap {
						gap: 7px !important;
					}
					.gt-logo-emblem {
						width: 46px !important;
						height: 46px !important;
						border: 2px solid #E5A91E !important;
						padding: 2.5px !important;
					}
					.gt-logo-title {
						font-size: 20px !important;
						gap: 5px !important;
					}
				}
				@media (max-width: 380px) {
					.gt-logo-wrap {
						gap: 5px !important;
					}
					.gt-logo-emblem {
						width: 40px !important;
						height: 40px !important;
						border: 1.5px solid #E5A91E !important;
						padding: 2px !important;
					}
					.gt-logo-title {
						font-size: 17.5px !important;
						gap: 4px !important;
					}
				}
			`}</style>

			<Link href="/" className="gt-logo-wrap">
				{/* Official Circular Golden Travels Logo Emblem */}
				<div
					className="gt-logo-emblem"
					style={{
						boxShadow: isWhite 
							? '0 4px 14px rgba(229, 169, 30, 0.45)' 
							: '0 4px 12px rgba(0, 0, 0, 0.12)'
					}}
				>
					<img
						src="/assets/images/logo/golden-travels-emblem.png"
						alt="Golden Travels Logo"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'contain',
							display: 'block'
						}}
					/>
				</div>

				{/* Typography Matching Official Branding */}
				<div className="gt-logo-title" style={{ color: isWhite ? '#ffffff' : '#111827' }}>
					<span style={{ color: '#E5A91E' }}>Golden</span>
					<span style={{ color: '#3A5A20' }}>Travels</span>
				</div>
			</Link>
		</>
	)
}
