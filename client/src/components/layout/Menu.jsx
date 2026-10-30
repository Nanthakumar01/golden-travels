import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Link from '@/components/elements/Link'
import { DESTINATION_GROUPS, findPackageForDestination } from '@/data/destinationsData'
import { packagesData } from '@/data/packagesData'
import { fetchPackages, fetchDestinationGroups } from '@/services/api'

export default function Menu({ onOpenInquiry }) {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [currentMenuItem, setCurrentMenuItem] = useState("")
	const [isDestHovered, setIsDestHovered] = useState(false)
	const [isClosedManually, setIsClosedManually] = useState(false)
	const [activeRegionId, setActiveRegionId] = useState('north-america')
	const [allPackages, setAllPackages] = useState(packagesData)
	const [destinationGroups, setDestinationGroups] = useState(DESTINATION_GROUPS)
	const hoverTimeoutRef = useRef(null)

	useEffect(() => {
		fetchPackages({ activeOnly: 'true' })
			.then(res => {
				if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
					setAllPackages(res.data)
				}
			})
			.catch(() => {})

		fetchDestinationGroups()
			.then(res => {
				if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
					setDestinationGroups(res.data)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		setCurrentMenuItem(pathname)
		setIsDestHovered(false)
		setIsClosedManually(false)
	}, [pathname])

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current" : ""
	const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current" : ""

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
		setIsClosedManually(false)
		setIsDestHovered(true)
	}

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsDestHovered(false)
			setIsClosedManually(false)
		}, 220)
	}

	const handleCloseDropdown = (e) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		setIsClosedManually(true)
		setIsDestHovered(false)
	}

	// Handle destination click
	const handleDestinationClick = (country) => {
		setIsDestHovered(false)
		setIsClosedManually(true)

		const countryName = typeof country === 'object' && country ? country.name : country
		const matched = findPackageForDestination(country, allPackages)
		if (matched && matched.slug) {
			navigate(`/tour/${matched.slug}`)
		} else if (onOpenInquiry) {
			onOpenInquiry({
				destination: countryName,
				packageName: countryName,
				duration: '',
				source: 'Destination Inquiry'
			})
		}
	}

	// Find active region
	let activeRegion = null
	for (const g of destinationGroups) {
		const found = g.regions?.find(r => r.id === activeRegionId)
		if (found) {
			activeRegion = found
			break
		}
	}
	if (!activeRegion) {
		activeRegion = destinationGroups[0]?.regions?.[0] || { name: 'Destinations', countries: [] }
	}

	return (
		<>
			<style>{`
				/* remove the theme's default top-edge indicator */
				.main-header .navigation > li::before,
				.main-header .navigation > li::after,
				.main-header .navigation > li > a::before {
					content: none !important;
					display: none !important;
				}

				/* Navigation indicator bar */
				.main-header .navigation > li { position: relative; }
				.main-header .navigation > li > a { position: relative; display: inline-flex; align-items: center; }
				.main-header .header-lower .navigation > li > a::after {
					content: '' !important;
					display: block !important;
					position: absolute !important;
					left: 0 !important;
					right: 0 !important;
					top: auto !important;
					bottom: 22px !important;
					width: auto !important;
					height: 3px !important;
					border-radius: 3px;
					background: #16a34a !important;
					transform: scaleX(0);
					transform-origin: center;
					transition: transform .3s ease;
				}
				.main-header .sticky-header .navigation > li > a::after {
					content: '' !important;
					display: block !important;
					position: absolute !important;
					left: 0 !important;
					right: 0 !important;
					top: auto !important;
					bottom: 16px !important;
					width: auto !important;
					height: 3px !important;
					border-radius: 3px;
					background: #16a34a !important;
					transform: scaleX(0);
					transform-origin: center;
					transition: transform .3s ease;
				}
				.main-header .navigation > li.current > a::after,
				.main-header .navigation > li > a:hover::after,
				.main-header .navigation > li.nav-dest-active > a::after {
					transform: scaleX(1) !important;
				}
				.main-header .navigation > li.current > a,
				.main-header .navigation > li.nav-dest-active > a { 
					color: #16a34a !important; 
				}

				/* Header Navigation: Ensure all items are vertically centered on the exact same axis */
				.main-header .main-menu .navigation {
					display: flex !important;
					align-items: center !important;
					margin: 0 !important;
					padding: 0 !important;
				}
				.main-header .main-menu .navigation > li {
					display: inline-flex !important;
					align-items: center !important;
					vertical-align: middle !important;
					position: relative !important;
					margin-right: 20px !important;
				}
				.main-header .main-menu .navigation > li > a {
					display: inline-flex !important;
					align-items: center !important;
					vertical-align: middle !important;
				}

				/* TAAI & TAAC Accreditation Logo Items: Centered vertically on the exact same axis */
				.main-header .main-menu .navigation > li.header-taai-item {
					display: inline-flex !important;
					align-items: center !important;
					justify-content: center !important;
					gap: 26px !important;
					vertical-align: middle !important;
					margin-left: 26px !important;
					margin-right: 0 !important;
					padding: 0 !important;
					line-height: 1 !important;
				}
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

				/* Destinations Mega Dropdown Wrapper */
				.nav-dest-wrapper {
					position: relative;
				}
				.nav-dest-wrapper::after {
					content: '';
					position: absolute;
					top: 100%;
					left: -40px;
					right: -40px;
					height: 36px;
					background: transparent;
					display: block;
				}

				/* Benny's Royal Tours Clean Mega Dropdown Menu */
				.benny-mega-panel {
					position: absolute;
					top: calc(100% + 10px);
					left: 50%;
					transform: translateX(-42%) translateY(10px);
					width: 980px;
					max-width: min(980px, calc(100vw - 32px));
					box-sizing: border-box;
					background: #ffffff;
					border-radius: 16px;
					box-shadow: 0 25px 60px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(226, 232, 240, 0.95);
					padding: 24px 24px 22px;
					opacity: 0;
					visibility: hidden;
					pointer-events: none;
					transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
					z-index: 9999;
					text-align: left;
					overflow: hidden;
				}

				.benny-mega-panel.is-open {
					opacity: 1 !important;
					visibility: visible !important;
					pointer-events: auto !important;
					transform: translateX(-42%) translateY(0) !important;
				}

				.main-header .sticky-header .benny-mega-panel {
					top: calc(100% + 6px);
				}

				/* Category Sidebar Item */
				.benny-sidebar-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					padding: 7px 10px;
					border-radius: 8px;
					background: transparent;
					border: none;
					text-align: left;
					cursor: pointer;
					font-size: 13.5px;
					font-weight: 700;
					color: #334155;
					transition: all 0.18s ease;
					line-height: 1.25;
					box-sizing: border-box;
				}
				.benny-sidebar-item:hover {
					color: #16a34a;
					background-color: #f8fafc;
					transform: translateX(3px);
				}
				.benny-sidebar-item.active {
					color: #0f172a !important;
					background-color: #f1f5f9 !important;
					font-weight: 800 !important;
					border-left: 3px solid #16a34a !important;
				}

				/* Destination Clickable Item */
				.benny-dest-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 6px;
					padding: 6px 8px;
					border-radius: 6px;
					color: #334155;
					font-size: 13px;
					font-weight: 500;
					text-decoration: none !important;
					background: none;
					border: none;
					width: 100%;
					min-width: 0;
					box-sizing: border-box;
					text-align: left;
					cursor: pointer;
					transition: all 0.16s ease;
					line-height: 1.3;
				}
				.benny-dest-item:hover {
					color: #16a34a !important;
					background-color: #f8fafc;
					transform: translateX(3px);
				}
				.benny-dest-item.has-pkg {
					font-weight: 700;
					color: #0f172a;
				}
			`}</style>

			<ul className="navigation clearfix">
				<li className={`${checkCurrentMenuItem("/")}`}>
					<Link href="/">Home</Link>
				</li>

				{/* DESTINATIONS (Replacing About Us) - Benny's Royal Tours Mega Dropdown */}
				<li 
					className={`nav-dest-wrapper ${checkParentActive(["/destinations", "/tour-destination-v1"])} ${isDestHovered ? 'nav-dest-active is-open' : ''}`}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Link href="/tour" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
						<span>Destinations</span>
						<svg 
							width="11" 
							height="11" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="currentColor" 
							strokeWidth="2.5" 
							style={{ 
								transition: 'transform 0.25s ease',
								transform: isDestHovered ? 'rotate(180deg)' : 'rotate(0deg)'
							}}
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</Link>

					{/* Benny's Royal Tours Mega Dropdown Panel */}
					<div className={`benny-mega-panel ${isDestHovered && !isClosedManually ? 'is-open' : ''}`}>
						
						{/* Close Button at Top Right */}
						<button 
							type="button" 
							onClick={handleCloseDropdown}
							aria-label="Close menu"
							style={{
								position: 'absolute',
								top: '12px',
								right: '14px',
								background: 'transparent',
								border: 'none',
								color: '#64748b',
								cursor: 'pointer',
								fontSize: '18px',
								fontWeight: '600',
								lineHeight: 1,
								padding: '4px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transition: 'color 0.2s ease',
								zIndex: 10
							}}
							onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a' }}
							onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
						>
							✕
						</button>

						<div style={{ display: 'grid', gridTemplateColumns: '215px minmax(0, 1fr)', gap: '20px', minWidth: 0 }}>
							
							{/* Left Sidebar: Categories (International & India) */}
							<div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '12px', maxHeight: '460px', overflowY: 'auto' }}>
								{destinationGroups.map((g) => (
									<div key={g.group} style={{ marginBottom: '18px' }}>
										<span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', paddingLeft: '8px' }}>
											{g.group}
										</span>
										<div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
											{g.regions.map((region) => (
												<button
													key={region.id}
													type="button"
													className={`benny-sidebar-item ${activeRegionId === region.id ? 'active' : ''}`}
													onMouseEnter={() => setActiveRegionId(region.id)}
													onClick={() => setActiveRegionId(region.id)}
												>
													<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{region.name}</span>
													<span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '10px', background: activeRegionId === region.id ? '#16a34a' : '#f1f5f9', color: activeRegionId === region.id ? '#ffffff' : '#64748b', fontWeight: '700', flexShrink: 0, marginLeft: '6px' }}>
														{region.countries.length}
													</span>
												</button>
											))}
										</div>
									</div>
								))}
							</div>

							{/* Right Area: Destination Countries Grid */}
							<div style={{ minWidth: 0, paddingRight: '4px', display: 'flex', flexDirection: 'column' }}>
								
								{/* Active Region Header Bar */}
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '14px', minWidth: 0 }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										{/* <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block', flexShrink: 0 }} /> */}
										<div>
											<h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
												{activeRegion.name}
											</h4>
											<span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>
												{activeRegion.countries.length} Destinations Click to explore packages or request custom quote
											</span>
										</div>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '24px', flexShrink: 0 }}>
										<Link 
											href="/tour" 
											onClick={() => setIsDestHovered(false)}
											style={{ fontSize: '12px', fontWeight: '800', color: '#16a34a', textDecoration: 'none', background: '#ecfdf5', padding: '4px 12px', borderRadius: '14px', border: '1px solid #bbf7d0', flexShrink: 0 }}
										>
											Browse All Packages →
										</Link>
									</div>
								</div>

								{/* 3 Columns of Countries */}
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4px 12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px', minWidth: 0 }}>
									{activeRegion.countries.map((country, cIdx) => {
										const countryName = typeof country === 'object' && country ? country.name : country
										const matched = findPackageForDestination(country, allPackages)
										return (
											<button
												key={cIdx}
												type="button"
												className={`benny-dest-item ${matched ? 'has-pkg' : ''}`}
												onClick={() => handleDestinationClick(country)}
												title={matched ? `View Golden Travels package for ${countryName}` : `Enquire customized tour for ${countryName}`}
											>
												<span style={{ 
													flex: '1 1 auto',
													minWidth: 0,
													fontSize: '13px',
													lineHeight: '1.25',
													wordBreak: 'break-word',
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden'
												}}>
													{countryName}
												</span>
												{matched ? (
													<span style={{ fontSize: '9.5px', fontWeight: '800', background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1px 5px', borderRadius: '6px', flexShrink: 0, marginLeft: '4px' }}>
														Package
													</span>
												) : (
													<span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, marginLeft: '4px', opacity: 0.6 }}>
														→
													</span>
												)}
											</button>
										)
									})}
								</div>

							</div>

						</div>

					</div>
				</li>

				{/* TOURS & PACKAGES */}
				<li className={`${checkParentActive(["/tour", "/archieve-tour", "/tour/"])}`}>
					<Link href="/tour">Tour Packages</Link>
				</li>

				{/* BLOG */}
				<li className={`${checkParentActive(["/blog"])}`}>
					<Link href="/blog">Blog</Link>
				</li>

				{/* CONTACT US */}
				<li className={`${checkCurrentMenuItem("/contact-us")}`}>
					<Link href="/contact-us">Contact</Link>
				</li>

				{/* TAAI & TAAC ACCREDITATION LOGOS (Clean standalone logos, perfectly centered, Ultra HD) */}
				<li className="header-taai-item" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '26px', verticalAlign: 'middle', marginLeft: '26px' }}>
					{/* TAAI Logo (Travel Agents Association of India) */}
					<img 
						src="/assets/images/logo/taai-logo.svg" 
						onError={(e) => { e.currentTarget.src = '/assets/images/logo/taai-logo.png'; }}
						alt="TAAI Since 1951" 
						className="header-taai-logo-img"
						title="Accredited Member: TAAI (Travel Agents Association of India) Since 1951"
						style={{ 
							height: '66px', 
							width: 'auto', 
							objectFit: 'contain',
							display: 'block',
							transition: 'transform 0.2s ease',
							cursor: 'pointer'
						}} 
					/>

					{/* TAAC Logo (Travel Agent Association of Coimbatore) */}
					<img 
						src="/assets/images/logo/taac-logo.svg" 
						onError={(e) => { e.currentTarget.src = '/assets/images/logo/taac-logo.png'; }}
						alt="TAAC - Travel Agent Association of Coimbatore" 
						className="header-taac-logo-img"
						title="Member: TAAC (Travel Agent Association of Coimbatore)"
						style={{ 
							height: '60px', 
							width: 'auto', 
							objectFit: 'contain',
							display: 'block',
							transition: 'transform 0.2s ease',
							cursor: 'pointer'
						}} 
					/>
				</li>
			</ul>
		</>
	)
}
