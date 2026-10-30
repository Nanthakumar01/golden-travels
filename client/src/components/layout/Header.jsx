import React from 'react'
import Link from '@/components/elements/Link'
import Logo from '@/components/elements/Logo'
import Menu from './Menu'
import MobileMenu from './MobileMenu'
import HeaderSearch from "./SearchModal"
import { IconPhone, IconMail } from '@/components/common/Icons'

export default function Header({ scroll, isMobileMenu, handleMobileMenu, onOpenInquiry, handleSearch, isSearch }) {
	return (
		<header className={`main-header header-style-three ${scroll ? 'fixed-header' : ''}`}>
			<style>{`
				/* Universal Header Alignment Across ALL Screen Sizes */
				.main-header .header-top,
				.main-header .header-lower,
				.main-header .sticky-header {
					padding-left: 0 !important;
					padding-right: 0 !important;
				}

				/* Prevent double header / ghosting when sticky header is active */
				.main-header.fixed-header .header-lower {
					opacity: 0 !important;
					visibility: hidden !important;
					pointer-events: none !important;
				}
				.main-header.fixed-header .header-top {
					visibility: hidden !important;
				}
				.main-header .sticky-header {
					background-color: #ffffff !important;
					box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
				}

				/* Standardize auto-container across header-top, header-lower, and sticky-header */
				.main-header .auto-container,
				.main-header .header-top .auto-container,
				.main-header .header-lower .auto-container,
				.main-header .sticky-header .auto-container {
					max-width: 100% !important;
					width: 100% !important;
					margin: 0 auto !important;
					padding-left: clamp(16px, 3.2vw, 48px) !important;
					padding-right: clamp(16px, 3.2vw, 48px) !important;
					box-sizing: border-box !important;
				}

				/* Container Heights & Vertical Midpoint Alignments */
				.main-header .header-lower .outer-box {
					height: 88px !important;
				}
				.main-header .sticky-header .outer-box {
					height: 78px !important;
				}

				/* Navigation Link Heights & Underline Indicators */
				.main-header .header-lower .main-menu .navigation > li > a {
					padding: 31px 0px !important;
					line-height: 26px !important;
				}
				.main-header .header-lower .navigation > li > a::after {
					bottom: 22px !important;
				}

				.main-header .sticky-header .main-menu .navigation > li > a {
					padding: 26px 0px !important;
					line-height: 26px !important;
				}
				.main-header .sticky-header .navigation > li > a::after {
					bottom: 16px !important;
				}

				/* Sticky Header Emblem & Brand scaling */
				.main-header .sticky-header .gt-logo-emblem {
					width: 58px !important;
					height: 58px !important;
				}
				.main-header .sticky-header .gt-logo-title {
					font-size: 20px !important;
				}

				/* TAAI & TAAC Accreditation Logo sizing & crisp rendering */
				.main-header .header-lower .header-taai-logo-img {
					height: 66px !important;
					max-height: 66px !important;
					width: auto !important;
				}
				.main-header .header-lower .header-taac-logo-img {
					height: 60px !important;
					max-height: 60px !important;
					width: auto !important;
				}
				.main-header .sticky-header .header-taai-logo-img {
					height: 54px !important;
					max-height: 54px !important;
					width: auto !important;
				}
				.main-header .sticky-header .header-taac-logo-img {
					height: 48px !important;
					max-height: 48px !important;
					width: auto !important;
				}

				/* Desktop Menu gap refinement (1200px - 1399px screens) */
				@media (min-width: 1200px) and (max-width: 1399px) {
					.main-header .main-menu .navigation > li {
						margin-right: 14px !important;
					}
					.main-header .main-menu .navigation > li.header-taai-item {
						margin-left: 18px !important;
						gap: 18px !important;
					}
					.main-header .header-lower .header-taai-logo-img {
						height: 58px !important;
					}
					.main-header .header-lower .header-taac-logo-img {
						height: 52px !important;
					}
					.main-header .sticky-header .header-taai-logo-img {
						height: 48px !important;
					}
					.main-header .sticky-header .header-taac-logo-img {
						height: 44px !important;
					}
				}

				/* Mobile Header TAAI Triangle Logo (shown on < 1200px screens right next to Golden Travels) */
				.header-mobile-taai-wrap {
					display: none !important;
				}
				@media (max-width: 1199px) {
					.header-mobile-taai-wrap {
						display: inline-flex !important;
						align-items: center !important;
						margin-left: 14px !important;
						flex-shrink: 0 !important;
					}
					.main-header .header-lower .header-mobile-taai-logo {
						height: 38px !important;
						max-height: 38px !important;
						width: auto !important;
					}
					.main-header .sticky-header .header-mobile-taai-logo {
						height: 30px !important;
						max-height: 30px !important;
						width: auto !important;
					}
				}
				@media (max-width: 768px) {
					.main-header .header-lower .auto-container,
					.main-header .sticky-header .auto-container {
						padding: 0 12px !important;
					}
					.header-mobile-taai-wrap {
						margin-left: 12px !important;
					}
					.main-header .header-lower .header-mobile-taai-logo {
						height: 34px !important;
						max-height: 34px !important;
					}
					.main-header .sticky-header .header-mobile-taai-logo {
						height: 28px !important;
						max-height: 28px !important;
					}
					.main-header .mobile-nav-toggler {
						width: 38px !important;
						height: 38px !important;
					}
					.main-header .menu-right-content {
						gap: 6px !important;
					}
				}
				@media (max-width: 480px) {
					.main-header .header-lower .auto-container,
					.main-header .sticky-header .auto-container {
						padding: 0 10px !important;
					}
					.header-mobile-taai-wrap {
						margin-left: 10px !important;
					}
					.main-header .header-lower .header-mobile-taai-logo {
						height: 32px !important;
						max-height: 32px !important;
					}
					.main-header .sticky-header .header-mobile-taai-logo {
						height: 26px !important;
						max-height: 26px !important;
					}
					.main-header .mobile-nav-toggler {
						width: 36px !important;
						height: 36px !important;
					}
					.main-header .menu-right-content {
						gap: 5px !important;
					}
				}
				@media (max-width: 360px) {
					.main-header .header-lower .auto-container,
					.main-header .sticky-header .auto-container {
						padding: 0 8px !important;
					}
					.header-mobile-taai-wrap {
						margin-left: 8px !important;
					}
					.main-header .header-lower .header-mobile-taai-logo {
						height: 28px !important;
						max-height: 28px !important;
					}
					.main-header .sticky-header .header-mobile-taai-logo {
						height: 24px !important;
						max-height: 24px !important;
					}
					.main-header .sticky-header .gt-logo-emblem {
						width: 38px !important;
						height: 38px !important;
					}
					.main-header .sticky-header .gt-logo-title {
						font-size: 17px !important;
					}
					.main-header .mobile-nav-toggler {
						width: 32px !important;
						height: 32px !important;
					}
				}

				/* Mobile & Tablet Header Responsive Rules */
				@media (max-width: 1199px) {
					.main-header .main-menu,
					.main-header .menu-area {
						display: none !important;
					}
					.main-header .mobile-nav-toggler {
						display: flex !important;
						align-items: center;
						justify-content: center;
						width: 40px !important;
						height: 40px !important;
						border-radius: 10px !important;
						background: #f8fafc !important;
						border: 1.5px solid #cbd5e1 !important;
						cursor: pointer !important;
						color: #0f172a !important;
						transition: all 0.2s ease !important;
						flex-shrink: 0 !important;
					}
					.main-header .mobile-nav-toggler:hover {
						background: #ecfdf5 !important;
						border-color: #16a34a !important;
						color: #16a34a !important;
					}
					.main-header .btn-box button {
						padding: 9px 18px !important;
						font-size: 13px !important;
					}
					.main-header .menu-right-content {
						gap: 10px !important;
					}
				}

				@media (min-width: 1200px) {
					.main-header .mobile-nav-toggler {
						display: none !important;
					}
				}

				@media (max-width: 1199px) and (min-width: 768px) {
					.header-top-desktop-info ul {
						gap: 14px !important;
						font-size: 12px !important;
					}
					.header-top-desktop-info ul li {
						white-space: nowrap !important;
					}
					.main-header .header-lower .outer-box {
						height: 76px !important;
					}
					.main-header .sticky-header .outer-box {
						height: 72px !important;
					}
					.main-header .sticky-header .gt-logo-emblem {
						width: 50px !important;
						height: 50px !important;
					}
					.main-header .sticky-header .gt-logo-title {
						font-size: 20px !important;
					}
					.main-header .mobile-nav-toggler {
						width: 44px !important;
						height: 44px !important;
						border-radius: 12px !important;
						gap: 5px !important;
					}
					.main-header .mobile-nav-toggler span {
						width: 22px !important;
						height: 2.5px !important;
					}
					.main-header .btn-box button {
						padding: 10px 20px !important;
						font-size: 13.5px !important;
					}
				}

				@media (max-width: 1024px) and (min-width: 768px) {
					.header-top-hours,
					.header-top-landline {
						display: none !important;
					}
				}

				@media (max-width: 767px) {
					.header-top-desktop-info {
						display: none !important;
					}
					.header-top-mobile-info {
						display: flex !important;
					}
					.header-top {
						padding: 6px 0 !important;
					}
					.main-header .header-lower {
						padding-left: 0 !important;
						padding-right: 0 !important;
						margin-top: 0 !important;
					}
					.main-header .header-lower .auto-container,
					.main-header .sticky-header .auto-container {
						padding: 0 14px !important;
					}
					.main-header .header-lower .outer-box {
						height: 70px !important;
						display: flex !important;
						align-items: center !important;
						justify-content: space-between !important;
						gap: 8px !important;
					}
					.main-header .sticky-header .outer-box {
						height: 64px !important;
						display: flex !important;
						align-items: center !important;
						justify-content: space-between !important;
						gap: 8px !important;
					}
					.main-header .logo-box {
						padding: 0 !important;
						margin: 0 !important;
						display: flex !important;
						align-items: center !important;
						flex-shrink: 0 !important;
						height: 100% !important;
					}
					.main-header .sticky-header .gt-logo-wrap {
						display: inline-flex !important;
						align-items: center !important;
						margin: 0 !important;
					}
					.main-header .sticky-header .gt-logo-emblem {
						width: 44px !important;
						height: 44px !important;
						margin-top: 0 !important;
						margin-bottom: 0 !important;
					}
					.main-header .sticky-header .gt-logo-title {
						font-size: 19px !important;
						margin-top: 0 !important;
						margin-bottom: 0 !important;
					}
					.main-header .btn-box {
						display: none !important;
					}
					.main-header .menu-right-content {
						display: flex !important;
						align-items: center !important;
						gap: 8px !important;
						flex-shrink: 0 !important;
						margin-left: auto !important;
					}
					.main-header .mobile-nav-toggler {
						display: flex !important;
						width: 38px !important;
						height: 38px !important;
						border-radius: 8px !important;
						gap: 4px !important;
						margin: 0 !important;
						padding: 0 !important;
					}
					.main-header .mobile-nav-toggler span {
						width: 18px !important;
						height: 2px !important;
					}
				}
				@media (min-width: 768px) {
					.header-top-mobile-info {
						display: none !important;
					}
				}
			`}</style>

			{/* Top Bar with Torn Paper Edge */}
			<div className="header-top" style={{ backgroundColor: '#3A5A20', color: '#ffffff', position: 'relative', zIndex: 11, paddingLeft: 0, paddingRight: 0 }}>
				<div className="auto-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '10px clamp(16px, 3.2vw, 48px)' }}>
					
					{/* Desktop Top Bar Info */}
					<div className="header-top-desktop-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '500' }}>
						<ul style={{ display: 'flex', gap: '22px', listStyle: 'none', margin: 0, padding: 0 }}>
							<li className="header-top-hours" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
								Mon - Sat: 10:00 AM - 07:00 PM
							</li>
							<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<a
									href="mailto:goldentravelscbe@gmail.com"
									onClick={() => { window.location.href = 'mailto:goldentravelscbe@gmail.com' }}
									style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
									title="Click to write an email"
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
									<span>goldentravelscbe@gmail.com</span>
								</a>
							</li>
							<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
								<a href="tel:+919003546546" style={{ color: 'inherit', textDecoration: 'none' }}>+91 90035 46546</a>
							</li>
							<li className="header-top-landline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<a href="tel:04222477090" style={{ color: 'inherit', textDecoration: 'none' }}>0422 2477090</a>
							</li>
						</ul>

						{/* Right Socials */}
						<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
							<span style={{ fontWeight: '700' }}>Follow Us:</span>
							<ul style={{ display: 'flex', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }}>
								<li>
									<a href="https://www.facebook.com/photo/?fbid=482086857261193&set=a.482086827261196" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: '#fff', background: '#1877F2', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.3s ease' }}>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
									</a>
								</li>
								<li>
									<a href="https://www.instagram.com/goldentravelscbe/?hl=en#" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#fff', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.3s ease' }}>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
									</a>
								</li>
								<li>
									<a href="https://wa.me/919003546546" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#25D366', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.3s ease' }}>
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Mobile Top Bar Info (< 768px): Mobile Number & Email Only */}
					<div className="header-top-mobile-info" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', fontWeight: '600' }}>
						<a href="tel:+919003546546" style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
							<IconPhone size={13} color="#ffffff" /> +91 90035 46546
						</a>
						<a href="mailto:goldentravelscbe@gmail.com" style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
							<IconMail size={13} color="#ffffff" /> goldentravelscbe@gmail.com
						</a>
					</div>

				</div>
			</div>

			{/* Main Header / Navigation */}
			<div className="header-lower" style={{ backgroundColor: '#ffffff', position: 'relative', zIndex: 20 }}>
				<div className="auto-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 clamp(16px, 3.2vw, 48px)' }}>
					<div className="outer-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '88px' }}>
						
						{/* Logo & Mobile TAAI Triangle Logo */}
						<div className="logo-box" style={{ zIndex: 30, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
							<Logo />
							<div className="header-mobile-taai-wrap" style={{ display: 'none', alignItems: 'center' }}>
								<img 
									src="/assets/images/logo/taai-logo.svg" 
									onError={(e) => { e.currentTarget.src = '/assets/images/logo/taai-logo.png'; }}
									alt="TAAI Since 1951" 
									title="Accredited Member: TAAI (Travel Agents Association of India)"
									className="header-mobile-taai-logo"
									style={{ 
										height: '42px', 
										width: 'auto', 
										objectFit: 'contain',
										display: 'block' 
									}} 
								/>
							</div>
						</div>

						{/* Menu - Centered between Logo and Right Content */}
						<div className="menu-area" style={{ display: 'flex', alignItems: 'center', marginLeft: 'clamp(20px, 2.5vw, 40px)', marginRight: 'auto', flexShrink: 0 }}>
							<nav className="main-menu navbar-expand-md navbar-light">
								<div className="collapse navbar-collapse show clearfix">
									<Menu onOpenInquiry={onOpenInquiry} />
								</div>
							</nav>
						</div>

						{/* Right Side Buttons - Pushed to the right */}
						<div className="menu-right-content" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
							<HeaderSearch />
							
							<div className="btn-box">
								<button 
									onClick={() => onOpenInquiry && onOpenInquiry({ packageName: 'Customized Holiday Package', source: 'Contact Page Enquiry - Plan My Trip', isPlanMyTrip: true })}
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										backgroundColor: '#16a34a',
										color: '#ffffff',
										padding: '11px 22px',
										borderRadius: '50px',
										fontWeight: '800',
										fontSize: '14px',
										border: 'none',
										cursor: 'pointer',
										boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
										transition: 'all 0.3s ease',
										whiteSpace: 'nowrap'
									}}
								>
									Plan My Trip <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
								</button>
							</div>

							{/* Mobile Menu Hamburger Toggler Button (3 Clean Lines) */}
							<button
								className="mobile-nav-toggler"
								onClick={handleMobileMenu}
								aria-label="Toggle mobile menu"
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									gap: '5px',
									width: '42px',
									height: '42px',
									borderRadius: '10px',
									backgroundColor: '#f8fafc',
									border: '1.5px solid #cbd5e1',
									cursor: 'pointer',
									padding: 0,
									flexShrink: 0
								}}
							>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
							</button>
						</div>

					</div>
				</div>
			</div>

			{/* Sticky Header */}
			<div className={`sticky-header ${scroll ? 'animated slideInDown' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', zIndex: 999, display: scroll ? 'block' : 'none', opacity: scroll ? 1 : 0, visibility: scroll ? 'visible' : 'hidden', transition: 'all 0.3s ease' }}>
				<div className="auto-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 clamp(16px, 3.2vw, 48px)' }}>
					<div className="outer-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '78px' }}>
						<div className="logo-box" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
							<Logo />
							<div className="header-mobile-taai-wrap" style={{ display: 'none', alignItems: 'center' }}>
								<img 
									src="/assets/images/logo/taai-logo.svg" 
									onError={(e) => { e.currentTarget.src = '/assets/images/logo/taai-logo.png'; }}
									alt="TAAI Since 1951" 
									title="Accredited Member: TAAI (Travel Agents Association of India)"
									className="header-mobile-taai-logo"
									style={{ 
										height: '34px', 
										width: 'auto', 
										objectFit: 'contain',
										display: 'block' 
									}} 
								/>
							</div>
						</div>
						<div className="menu-area" style={{ display: 'flex', alignItems: 'center', marginLeft: 'clamp(20px, 2.5vw, 40px)', marginRight: 'auto', flexShrink: 0 }}>
							<nav className="main-menu clearfix">
								<Menu onOpenInquiry={onOpenInquiry} />
							</nav>
						</div>
						<div className="menu-right-content" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
							<HeaderSearch />
							<div className="btn-box">
								<button 
									onClick={() => onOpenInquiry && onOpenInquiry({ packageName: 'Customized Holiday Package', source: 'Contact Page Enquiry - Plan My Trip', isPlanMyTrip: true })}
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										backgroundColor: '#16a34a',
										color: '#ffffff',
										padding: '10px 20px',
										borderRadius: '50px',
										fontWeight: '800',
										fontSize: '13.5px',
										border: 'none',
										cursor: 'pointer',
										whiteSpace: 'nowrap'
									}}
								>
									Plan My Trip <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
								</button>
							</div>

							{/* Sticky Mobile Toggler Button (3 Clean Lines) */}
							<button
								className="mobile-nav-toggler"
								onClick={handleMobileMenu}
								aria-label="Toggle mobile menu"
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									gap: '5px',
									width: '42px',
									height: '42px',
									borderRadius: '10px',
									backgroundColor: '#f8fafc',
									border: '1.5px solid #cbd5e1',
									cursor: 'pointer',
									padding: 0,
									flexShrink: 0
								}}
							>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
								<span style={{ display: 'block', width: '20px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '2px' }}></span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} onOpenInquiry={onOpenInquiry} />
		</header>
	)
}
