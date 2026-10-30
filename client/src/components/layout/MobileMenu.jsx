import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Link from '@/components/elements/Link'
import Logo from '@/components/elements/Logo'
import { packagesData } from '@/data/packagesData'
import { DESTINATION_GROUPS, findPackageForDestination } from '@/data/destinationsData'
import { fetchPackages, fetchDestinationGroups } from '@/services/api'
import { IconIndiaFlag, IconGlobe } from '@/components/common/Icons'

export default function MobileMenu({ isMobileMenu, handleMobileMenu, onOpenInquiry }) {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [currentMenuItem, setCurrentMenuItem] = useState("")
	const [isDestOpen, setIsDestOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState('India')
	const [mobileRegionId, setMobileRegionId] = useState('south-india')
	const [allPackages, setAllPackages] = useState(packagesData)
	const [destinationGroups, setDestinationGroups] = useState(DESTINATION_GROUPS)

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
	}, [pathname])

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "active-link" : ""
	const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "active-link" : ""

	const handleClose = () => {
		if (handleMobileMenu) handleMobileMenu()
	}

	const handleDestinationClick = (country) => {
		handleClose()
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

	const internationalGroup = destinationGroups.find(g => g.group === 'International') || { regions: [] }
	const indiaGroup = destinationGroups.find(g => g.group === 'India') || { regions: [] }
	const currentGroupRegions = selectedGroup === 'India' ? indiaGroup.regions : internationalGroup.regions
	const activeMobileRegion = currentGroupRegions.find(r => r.id === mobileRegionId) || currentGroupRegions[0] || { countries: [] }

	return (
		<>
			<style>{`
				.gt-mobile-drawer {
					width: 320px;
					max-width: 86vw;
					height: 100% !important;
					height: 100dvh !important;
					max-height: 100dvh !important;
					scrollbar-width: none !important;
					-ms-overflow-style: none !important;
				}
				.gt-menu-link {
					font-size: 15px;
					padding: 12px 14px;
					text-align: left;
				}
				.gt-menu-dest-header {
					font-size: 15px;
					padding: 12px 14px;
					text-align: left;
				}
				.gt-menu-country-btn {
					font-size: 11.5px;
					padding: 6px 8px;
					text-align: left;
				}

				/* Completely remove ugly white scrollbar line from mobile drawer and country list */
				.gt-mobile-drawer,
				.gt-menu-scrollable-body,
				.gt-menu-nav-area,
				.gt-menu-country-grid {
					scrollbar-width: none !important;
					-ms-overflow-style: none !important;
				}
				.gt-mobile-drawer ::-webkit-scrollbar,
				.gt-menu-scrollable-body::-webkit-scrollbar,
				.gt-menu-nav-area::-webkit-scrollbar,
				.gt-menu-country-grid::-webkit-scrollbar {
					display: none !important;
					width: 0 !important;
					height: 0 !important;
					background: transparent !important;
				}
				.gt-mobile-drawer ::-webkit-scrollbar-track,
				.gt-menu-scrollable-body::-webkit-scrollbar-track,
				.gt-menu-nav-area::-webkit-scrollbar-track,
				.gt-menu-country-grid::-webkit-scrollbar-track {
					background: transparent !important;
					border: none !important;
				}
				.gt-mobile-drawer ::-webkit-scrollbar-thumb,
				.gt-menu-scrollable-body::-webkit-scrollbar-thumb,
				.gt-menu-nav-area::-webkit-scrollbar-thumb,
				.gt-menu-country-grid::-webkit-scrollbar-thumb {
					background: transparent !important;
				}

				/* Tablet view styling: Larger & More Spacious */
				@media (min-width: 641px) and (max-width: 1199px) {
					.gt-mobile-drawer {
						width: 480px !important;
						max-width: 85vw !important;
					}
					.gt-menu-drawer-header {
						padding: 24px 28px !important;
					}
					.gt-menu-close-btn {
						font-size: 26px !important;
						padding: 10px !important;
					}
					.gt-menu-nav-area {
						padding: 24px 26px !important;
					}
					.gt-menu-link {
						font-size: 17.5px !important;
						padding: 14px 18px !important;
						border-radius: 12px !important;
					}
					.gt-menu-dest-header {
						font-size: 17.5px !important;
						padding: 14px 18px !important;
						border-radius: 12px !important;
					}
					.gt-menu-badge-count {
						font-size: 11px !important;
						padding: 2px 8px !important;
					}
					.gt-menu-dest-body {
						padding: 16px !important;
						gap: 14px !important;
						margin: 8px 0 14px 12px !important;
					}
					.gt-menu-group-btn {
						padding: 10px 14px !important;
						font-size: 13.5px !important;
					}
					.gt-menu-region-btn {
						padding: 6px 14px !important;
						font-size: 12.5px !important;
						border-radius: 14px !important;
					}
					.gt-menu-country-grid {
						max-height: 300px !important;
						gap: 8px !important;
					}
					.gt-menu-country-btn {
						padding: 9px 12px !important;
						font-size: 13px !important;
						border-radius: 8px !important;
					}
					.gt-menu-footer {
						padding: 16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
					}
					.gt-menu-contact-btn {
						width: 36px !important;
						height: 36px !important;
					}
					.gt-menu-contact-btn svg {
						width: 16px !important;
						height: 16px !important;
					}
					.gt-menu-email-link {
						font-size: 12.5px !important;
					}
				}
			`}</style>

			{/* Backdrop Overlay */}
			<div
				onClick={handleClose}
				style={{
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.65)',
					backdropFilter: 'blur(4px)',
					WebkitBackdropFilter: 'blur(4px)',
					zIndex: 99998,
					opacity: isMobileMenu ? 1 : 0,
					visibility: isMobileMenu ? 'visible' : 'hidden',
					transition: 'opacity 0.35s ease, visibility 0.35s ease',
					pointerEvents: isMobileMenu ? 'auto' : 'none'
				}}
			/>

			{/* Slide-out Drawer */}
			<aside
				className="gt-mobile-drawer"
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					bottom: 0,
					height: '100%',
					maxHeight: '100dvh',
					backgroundColor: '#071812',
					color: '#ffffff',
					zIndex: 99999,
					boxShadow: '4px 0 30px rgba(0,0,0,0.4)',
					transform: isMobileMenu ? 'translateX(0)' : 'translateX(-100%)',
					transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden'
				}}
			>
				{/* Drawer Header */}
				<div
					className="gt-menu-drawer-header"
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '20px 22px',
						borderBottom: '1px solid rgba(255,255,255,0.08)',
						backgroundColor: 'rgba(0,0,0,0.2)',
						flexShrink: 0
					}}
				>
					<div onClick={handleClose} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
						<Logo isWhite={true} />
					</div>
					
					{/* Close Button - Clean X icon with no background */}
					<button
						className="gt-menu-close-btn"
						onClick={handleClose}
						aria-label="Close menu"
						style={{
							background: 'transparent',
							border: 'none',
							color: '#ffffff',
							padding: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: '22px',
							lineHeight: 1,
							transition: 'opacity 0.2s ease',
							outline: 'none'
						}}
					>
						✕
					</button>
				</div>

				{/* Scrollable Drawer Body (Wraps both navigation links & bottom footer so nothing is ever cut off on any phone screen) */}
				<div
					className="gt-menu-scrollable-body"
					style={{
						flex: 1,
						overflowY: 'auto',
						WebkitOverflowScrolling: 'touch',
						display: 'flex',
						flexDirection: 'column',
						minHeight: 0
					}}
				>
					{/* Navigation Links */}
					<div className="gt-menu-nav-area" style={{ padding: '16px 18px 12px' }}>
					<ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
						
						{/* Home */}
						<li>
							<Link
								href="/"
								onClick={handleClose}
								className="gt-menu-link"
								style={{
									display: 'flex',
									alignItems: 'center',
									padding: '12px 14px',
									borderRadius: '10px',
									color: currentMenuItem === "/" ? '#4ade80' : '#f1f5f9',
									backgroundColor: currentMenuItem === "/" ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
									fontWeight: '700',
									fontSize: '15px',
									textDecoration: 'none',
									transition: 'background 0.2s'
								}}
							>
								Home
							</Link>
						</li>

						{/* Destinations with Collapsible Accordion */}
						<li>
							<div
								className="gt-menu-dest-header"
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: '12px 14px',
									borderRadius: '10px',
									color: isDestOpen ? '#4ade80' : '#f1f5f9',
									backgroundColor: isDestOpen ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
									fontWeight: '700',
									fontSize: '15px',
									cursor: 'pointer'
								}}
								onClick={() => setIsDestOpen(!isDestOpen)}
							>
								<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<span>Destinations</span>
									<span className="gt-menu-badge-count" style={{ fontSize: '10px', background: '#16a34a', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: '800' }}>150+</span>
								</span>
								<span
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: '28px',
										height: '28px',
										borderRadius: '6px',
										background: 'rgba(255,255,255,0.06)',
										transition: 'transform 0.25s ease',
										transform: isDestOpen ? 'rotate(180deg)' : 'rotate(0deg)'
									}}
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
								</span>
							</div>

							{/* Destinations Accordion Content */}
							{isDestOpen && (
								<div
									className="gt-menu-dest-body"
									style={{
										margin: '6px 0 10px 10px',
										padding: '12px',
										borderRadius: '12px',
										backgroundColor: 'rgba(255,255,255,0.03)',
										borderLeft: '2px solid #16a34a',
										display: 'flex',
										flexDirection: 'column',
										gap: '12px'
									}}
								>
									{/* Top Segmented Tabs: India vs International */}
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '3px', background: 'rgba(0,0,0,0.35)', borderRadius: '10px' }}>
										<button
											type="button"
											className="gt-menu-group-btn"
											onClick={() => {
												setSelectedGroup('India')
												setMobileRegionId(indiaGroup.regions[0]?.id || 'south-india')
											}}
											style={{
												padding: '7px 8px',
												borderRadius: '8px',
												border: 'none',
												fontWeight: '800',
												fontSize: '12px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: '6px',
												background: selectedGroup === 'India' ? '#16a34a' : 'transparent',
												color: selectedGroup === 'India' ? '#ffffff' : '#94a3b8',
												boxShadow: selectedGroup === 'India' ? '0 2px 8px rgba(22, 163, 74, 0.4)' : 'none',
												transition: 'all 0.2s ease'
											}}
										>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconIndiaFlag size={14} /> India
											</span>
											<span style={{ fontSize: '10px', opacity: 0.85, padding: '1px 5px', borderRadius: '8px', background: selectedGroup === 'India' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
												{indiaGroup.regions.length}
											</span>
										</button>

										<button
											type="button"
											className="gt-menu-group-btn"
											onClick={() => {
												setSelectedGroup('International')
												setMobileRegionId(internationalGroup.regions[0]?.id || 'asia')
											}}
											style={{
												padding: '7px 8px',
												borderRadius: '8px',
												border: 'none',
												fontWeight: '800',
												fontSize: '12px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: '6px',
												background: selectedGroup === 'International' ? '#16a34a' : 'transparent',
												color: selectedGroup === 'International' ? '#ffffff' : '#94a3b8',
												boxShadow: selectedGroup === 'International' ? '0 2px 8px rgba(22, 163, 74, 0.4)' : 'none',
												transition: 'all 0.2s ease'
											}}
										>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconGlobe size={14} color="#ffffff" /> International
											</span>
											<span style={{ fontSize: '10px', opacity: 0.85, padding: '1px 5px', borderRadius: '8px', background: selectedGroup === 'International' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
												{internationalGroup.regions.length}
											</span>
										</button>
									</div>

									{/* Region pills under selected group */}
									<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
										{currentGroupRegions.map(r => (
											<button
												key={r.id}
												type="button"
												className="gt-menu-region-btn"
												onClick={() => setMobileRegionId(r.id)}
												style={{
													background: mobileRegionId === r.id ? '#16a34a' : 'rgba(255,255,255,0.08)',
													color: mobileRegionId === r.id ? '#ffffff' : '#cbd5e1',
													border: 'none',
													padding: '4px 10px',
													borderRadius: '12px',
													fontSize: '11px',
													fontWeight: '700',
													cursor: 'pointer',
													transition: 'all 0.15s ease'
												}}
											>
												{r.name}
											</button>
										))}
									</div>

									{/* Active Region Header with count */}
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
										<span style={{ fontSize: '11.5px', fontWeight: '700', color: '#4ade80' }}>
											{activeMobileRegion?.name} ({activeMobileRegion?.countries?.length || 0})
										</span>
										<Link
											href="/tour"
											onClick={handleClose}
											style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none', fontWeight: '600' }}
										>
											All Packages →
										</Link>
									</div>

									{/* List of countries under selected region */}
									<div className="gt-menu-country-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', maxHeight: '230px', overflowY: 'auto', paddingRight: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
										{activeMobileRegion?.countries?.map((country, idx) => {
											const countryName = typeof country === 'object' && country ? country.name : country
											const matched = findPackageForDestination(country, allPackages)
											return (
												<button
													key={idx}
													type="button"
													className="gt-menu-country-btn"
													onClick={() => handleDestinationClick(country)}
													style={{
														background: 'rgba(255,255,255,0.02)',
														border: '1px solid rgba(255,255,255,0.05)',
														borderRadius: '6px',
														color: matched ? '#4ade80' : '#e2e8f0',
														textAlign: 'left',
														padding: '6px 8px',
														fontSize: '11.5px',
														fontWeight: matched ? '700' : '500',
														cursor: 'pointer',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														gap: '4px',
														minWidth: 0,
														boxSizing: 'border-box'
													}}
												>
													<span style={{
														flex: 1,
														minWidth: 0,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis'
													}}>
														{countryName}
													</span>
													{matched ? (
														<span style={{ fontSize: '9px', fontWeight: '800', background: '#16a34a', color: '#ffffff', padding: '1px 4px', borderRadius: '4px', flexShrink: 0 }}>
															Pkg
														</span>
													) : (
														<span style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }}>
															→
														</span>
													)}
												</button>
											)
										})}
									</div>
								</div>
							)}
						</li>

						{/* Tours & Packages - Direct Link without Arrow Mark */}
						<li>
							<Link
								href="/tour"
								onClick={handleClose}
								className="gt-menu-link"
								style={{
									display: 'flex',
									alignItems: 'center',
									padding: '12px 14px',
									borderRadius: '10px',
									color: currentMenuItem.startsWith("/tour") ? '#4ade80' : '#f1f5f9',
									backgroundColor: currentMenuItem.startsWith("/tour") ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
									fontWeight: '700',
									fontSize: '15px',
									textDecoration: 'none',
									transition: 'background 0.2s'
								}}
							>
								Tours &amp; Packages
							</Link>
						</li>

						{/* Blog */}
						<li>
							<Link
								href="/blog"
								onClick={handleClose}
								className="gt-menu-link"
								style={{
									display: 'flex',
									alignItems: 'center',
									padding: '12px 14px',
									borderRadius: '10px',
									color: currentMenuItem === "/blog" ? '#4ade80' : '#f1f5f9',
									backgroundColor: currentMenuItem === "/blog" ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
									fontWeight: '700',
									fontSize: '15px',
									textDecoration: 'none',
									transition: 'background 0.2s'
								}}
							>
								Blog
							</Link>
						</li>

						{/* Contact */}
						<li>
							<Link
								href="/contact-us"
								onClick={handleClose}
								className="gt-menu-link"
								style={{
									display: 'flex',
									alignItems: 'center',
									padding: '12px 14px',
									borderRadius: '10px',
									color: currentMenuItem === "/contact-us" ? '#4ade80' : '#f1f5f9',
									backgroundColor: currentMenuItem === "/contact-us" ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
									fontWeight: '700',
									fontSize: '15px',
									textDecoration: 'none',
									transition: 'background 0.2s'
								}}
							>
								Contact
							</Link>
						</li>
					</ul>
				</div>

					{/* Drawer Footer - Contact, Social & Clean Accreditation Badges */}
					<div
						className="gt-menu-footer"
						style={{
							marginTop: 'auto',
							flexShrink: 0,
							padding: '16px 18px calc(env(safe-area-inset-bottom, 0px) + 26px)',
							borderTop: '1px solid rgba(255, 255, 255, 0.08)',
							backgroundColor: 'rgba(0, 0, 0, 0.35)',
							display: 'flex',
							flexDirection: 'column',
							gap: '10px'
						}}
					>
						{/* Social contact buttons */}
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							{/* Phone */}
							<a
								href="tel:+919003546546"
								title="Call Golden Travels"
								aria-label="Call Golden Travels"
								className="gt-menu-contact-btn"
								style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: 'rgba(255, 255, 255, 0.08)',
									border: '1px solid rgba(255, 255, 255, 0.12)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#4ade80',
									textDecoration: 'none'
								}}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
							</a>

							{/* WhatsApp */}
							<a
								href="https://wa.me/919003546546"
								target="_blank"
								rel="noopener noreferrer"
								title="Chat on WhatsApp"
								aria-label="Chat on WhatsApp"
								className="gt-menu-contact-btn"
								style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: '#25D366',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#ffffff',
									textDecoration: 'none'
								}}
							>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
							</a>

							{/* Instagram */}
							<a
								href="https://www.instagram.com/goldentravelscbe/?hl=en#"
								target="_blank"
								rel="noopener noreferrer"
								title="Follow on Instagram"
								aria-label="Follow on Instagram"
								className="gt-menu-contact-btn"
								style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#ffffff',
									textDecoration: 'none'
								}}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
							</a>

							{/* Facebook */}
							<a
								href="https://www.facebook.com/photo/?fbid=482086857261193&set=a.482086827261196"
								target="_blank"
								rel="noopener noreferrer"
								title="Follow on Facebook"
								aria-label="Follow on Facebook"
								className="gt-menu-contact-btn"
								style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: '#1877F2',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#ffffff',
									textDecoration: 'none'
								}}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
							</a>
						</div>

						{/* Sleek Email link */}
						<a
							href="mailto:goldentravelscbe@gmail.com"
							onClick={() => { window.location.href = 'mailto:goldentravelscbe@gmail.com' }}
							className="gt-menu-email-link"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '6px',
								color: '#94a3b8',
								textDecoration: 'none',
								fontSize: '11.5px',
								fontWeight: '600',
								transition: 'color 0.2s ease',
								margin: '2px 0 4px'
							}}
						>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
							<span>goldentravelscbe@gmail.com</span>
						</a>

						{/* Accreditation Badges: TAAI & TAAC in Clean, Sleek Cards */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							{/* TAAI Card */}
							<div 
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									backgroundColor: 'rgba(255, 255, 255, 0.06)',
									border: '1px solid rgba(255, 255, 255, 0.12)',
									borderRadius: '10px',
									padding: '8px 12px'
								}}
							>
								<img 
									src="/assets/images/logo/taai-logo.svg" 
									onError={(e) => { e.currentTarget.src = '/assets/images/logo/taai-logo.png'; }}
									alt="TAAI Since 1951" 
									style={{ 
										height: '28px', 
										width: 'auto', 
										backgroundColor: '#ffffff',
										borderRadius: '5px',
										padding: '2px 4px',
										display: 'block',
										flexShrink: 0
									}} 
								/>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
									<span style={{ fontSize: '11px', fontWeight: '800', color: '#FDE047', letterSpacing: '0.03em', lineHeight: '1.2' }}>TAAI RECOGNIZED</span>
									<span style={{ fontSize: '9.5px', color: '#cbd5e1', lineHeight: '1.2' }}>Travel Agents Association of India (1951)</span>
								</div>
							</div>

							{/* TAAC Card */}
							<div 
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									backgroundColor: 'rgba(255, 255, 255, 0.06)',
									border: '1px solid rgba(255, 255, 255, 0.12)',
									borderRadius: '10px',
									padding: '8px 12px'
								}}
							>
								<img 
									src="/assets/images/logo/taac-logo.svg" 
									onError={(e) => { e.currentTarget.src = '/assets/images/logo/taac-logo.png'; }}
									alt="TAAC Coimbatore" 
									style={{ 
										height: '26px', 
										width: 'auto', 
										backgroundColor: '#ffffff',
										borderRadius: '5px',
										padding: '2px 4px',
										display: 'block',
										flexShrink: 0
									}} 
								/>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
									<span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.03em', lineHeight: '1.2' }}>TAAC MEMBER</span>
									<span style={{ fontSize: '9.5px', color: '#cbd5e1', lineHeight: '1.2' }}>Travel Agent Association of Coimbatore</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	)
}
