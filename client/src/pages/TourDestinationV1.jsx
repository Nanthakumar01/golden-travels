import React, { useState, useEffect } from 'react'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { openInquiryModal } from '@/components/elements/InquiryModal'
import { fetchDestinations, fetchDestinationGroups, fetchPackages } from '@/services/api'
import { findPackageForDestination } from '@/data/destinationsData'
import SEO from '@/components/elements/SEO'
import { IconPlane, IconIndiaFlag, IconGlobe, IconLocation } from '@/components/common/Icons'

export default function TourDestinationV1() {
	const [activeType, setActiveType] = useState("All")
	const [destinations, setDestinations] = useState([])
	const [destinationGroups, setDestinationGroups] = useState([])
	const [allPackages, setAllPackages] = useState([])
	const [loading, setLoading] = useState(true)

	// Directory browser state
	const [browserGroup, setBrowserGroup] = useState('International')
	const [browserRegionId, setBrowserRegionId] = useState('north-america')

	useEffect(() => {
		const load = async () => {
			try {
				const [resDests, resGroups, resPkgs] = await Promise.all([
					fetchDestinations(),
					fetchDestinationGroups(),
					fetchPackages({ activeOnly: 'true' })
				])
				if (resDests && resDests.success && resDests.data) {
					setDestinations(resDests.data)
				}
				if (resGroups && resGroups.success && resGroups.data) {
					setDestinationGroups(resGroups.data)
					if (resGroups.data[0]?.regions?.[0]) {
						setBrowserRegionId(resGroups.data[0].regions[0].id)
					}
				}
				if (resPkgs && resPkgs.success && resPkgs.data) {
					setAllPackages(resPkgs.data)
				}
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	const filteredDestinations = destinations.filter(d => {
		if (activeType === "All") return true
		return (d.type || '').toUpperCase() === activeType.toUpperCase()
	})

	const intlCount = destinations.filter(d => (d.type || '').toUpperCase() === 'INTERNATIONAL').length
	const domCount = destinations.filter(d => (d.type || '').toUpperCase() === 'DOMESTIC').length

	// Active Region for Directory Browser
	const currentGroupObj = destinationGroups.find(g => g.group === browserGroup) || destinationGroups[0]
	const currentRegions = currentGroupObj?.regions || []
	const activeRegion = currentRegions.find(r => r.id === browserRegionId) || currentRegions[0] || { countries: [] }

	const handleCountryClick = (country) => {
		const countryName = typeof country === 'object' && country ? country.name : country
		const matched = findPackageForDestination(country, allPackages)
		if (matched && matched.slug) {
			window.location.href = `/tour/${matched.slug}`
		} else {
			openInquiryModal({
				destination: countryName,
				packageName: countryName,
				duration: '',
				source: 'Destination Directory Inquiry'
			})
		}
	}

	return (
		<Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Trending World Destinations">
			<SEO pageKey="destinations" />
			{/* Header */}
			<section style={{ padding: '60px 0 30px', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ textAlign: 'center', marginBottom: '32px' }}>
						<div className="col-lg-12">
							<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
								Where to Next?
							</span>
							<h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0' }}>
								Explore Worldwide Destinations
							</h2>
							<p style={{ color: '#64748b', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
								From romantic European alpine valleys and Southeast Asian escapes to majestic Indian heritage circuits, discover our handcrafted holiday destinations.
							</p>
						</div>
					</div>

					{/* Category Filter Tabs */}
					<div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
						<button
							onClick={() => setActiveType("All")}
							style={{
								padding: '9px 24px',
								borderRadius: '30px',
								fontSize: '13.5px',
								fontWeight: '800',
								border: activeType === "All" ? '2px solid #16a34a' : '1px solid #cbd5e1',
								backgroundColor: activeType === "All" ? '#16a34a' : '#ffffff',
								color: activeType === "All" ? '#ffffff' : '#334155',
								cursor: 'pointer',
								transition: 'all 0.25s ease',
								boxShadow: activeType === "All" ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none'
							}}
						>
							All Destinations ({destinations.length})
						</button>

						<button
							onClick={() => setActiveType("INTERNATIONAL")}
							style={{
								padding: '9px 24px',
								borderRadius: '30px',
								fontSize: '13.5px',
								fontWeight: '800',
								border: activeType === "INTERNATIONAL" ? '2px solid #2563eb' : '1px solid #cbd5e1',
								backgroundColor: activeType === "INTERNATIONAL" ? '#2563eb' : '#ffffff',
								color: activeType === "INTERNATIONAL" ? '#ffffff' : '#334155',
								cursor: 'pointer',
								transition: 'all 0.25s ease',
								boxShadow: activeType === "INTERNATIONAL" ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
							}}
						>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
								<IconPlane size={14} color={activeType === "INTERNATIONAL" ? '#ffffff' : '#2563eb'} /> International Escapes ({intlCount})
							</span>
						</button>

						<button
							onClick={() => setActiveType("DOMESTIC")}
							style={{
								padding: '9px 24px',
								borderRadius: '30px',
								fontSize: '13.5px',
								fontWeight: '800',
								border: activeType === "DOMESTIC" ? '2px solid #16a34a' : '1px solid #cbd5e1',
								backgroundColor: activeType === "DOMESTIC" ? '#16a34a' : '#ffffff',
								color: activeType === "DOMESTIC" ? '#ffffff' : '#334155',
								cursor: 'pointer',
								transition: 'all 0.25s ease',
								boxShadow: activeType === "DOMESTIC" ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none'
							}}
						>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
								<IconIndiaFlag size={14} /> Incredible India (Domestic) ({domCount})
							</span>
						</button>
					</div>

					{/* Destinations Grid */}
					{loading ? (
						<div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
							Loading destinations...
						</div>
					) : (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
							{filteredDestinations.map((dest) => {
								const targetLink = dest.packageSlug ? `/tour/${dest.packageSlug}` : (dest.link || '/tour')
								const isIntl = (dest.type || '').toUpperCase() === 'INTERNATIONAL'

								return (
									<div
										key={dest.id}
										style={{
											backgroundColor: '#ffffff',
											borderRadius: '24px',
											overflow: 'hidden',
											boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
											border: '1px solid #e2e8f0',
											display: 'flex',
											flexDirection: 'column',
											transition: 'transform 0.3s ease, box-shadow 0.3s ease'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-6px)'
											e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)'
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)'
											e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.06)'
										}}
									>
										{/* Top Image with Direct Link */}
										<Link href={targetLink} style={{ height: '230px', position: 'relative', overflow: 'hidden', display: 'block' }}>
											<img
												src={dest.img || dest.image || '/assets/images/packages/vietnam.jpg'}
												alt={dest.name}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												onError={e => { e.target.src = '/assets/images/packages/rann-kutch.jpg' }}
											/>
											{/* Region Badge */}
											<span style={{
												position: 'absolute',
												top: '14px',
												left: '14px',
												backgroundColor: isIntl ? 'rgba(37,99,235,0.92)' : 'rgba(22,163,74,0.92)',
												color: '#ffffff',
												fontSize: '11px',
												fontWeight: '800',
												padding: '4px 12px',
												borderRadius: '20px',
												letterSpacing: '0.04em',
												backdropFilter: 'blur(4px)'
											}}>
												{isIntl ? (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconGlobe size={11} color="#ffffff" /> INTERNATIONAL
													</span>
												) : (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconIndiaFlag size={11} /> DOMESTIC
													</span>
												)}
											</span>

											{/* Duration Badge */}
											{dest.tours && (
												<span style={{
													position: 'absolute',
													bottom: '12px',
													right: '12px',
													backgroundColor: 'rgba(15,23,42,0.85)',
													color: '#ffffff',
													fontSize: '11.5px',
													fontWeight: '700',
													padding: '4px 10px',
													borderRadius: '8px',
													backdropFilter: 'blur(4px)'
												}}>
													{dest.tours}
												</span>
											)}
										</Link>

										{/* Info */}
										<div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
											<h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>
												<Link href={targetLink} style={{ color: '#0f172a', textDecoration: 'none' }}>
													{dest.name}
												</Link>
											</h3>

											{/* Places Covered */}
											{dest.places && (
												<div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '16px', textAlign: 'center' }}>
													<span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px', width: '100%' }}>
														<IconLocation size={12} color="#16a34a" /> Places Covered
													</span>
													<p style={{ margin: 0, fontSize: '13px', color: '#475569', fontWeight: '600', lineHeight: '1.4' }}>
														{dest.places}
													</p>
												</div>
											)}

											{/* Icons Row */}
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '22px', padding: '0 8px' }}>
												{[
													{ name: 'Hotels', icon: <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h6M9 11h6M9 15h6"/></svg> },
													{ name: 'Transfers', icon: <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M4 14l-1 4h2l1-4M20 14l1 4h-2l-1-4M8 10h8M6 14h12"/></svg> },
													{ name: 'Sightseeing', icon: <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> },
													{ name: 'Meals', icon: <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 2v7c0 2.2 1.8 4 4 4h1v7h2v-7h1c2.2 0 4-1.8 4-4V2H3zm13 0l-1.5 7h4L17 22"/></svg> }
												].map((item, idx) => (
													<div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
														<div>{item.icon}</div>
														<span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{item.name}</span>
													</div>
												))}
											</div>

											{/* Buttons */}
											<div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
												{/* Call Button */}
												<a href="tel:+919003546546" title="Call Concierge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}>
													<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
												</a>

												{/* View Package / Details Button */}
												<Link href={targetLink} style={{ flex: 1, padding: '0 12px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: '#16a34a', color: '#ffffff', textDecoration: 'none', fontWeight: '800', fontSize: '13.5px', transition: 'all 0.2s', textAlign: 'center', whiteSpace: 'nowrap' }}>
													{dest.packageSlug ? 'View Tour Package' : 'Explore Tours'}
												</Link>

												{/* Enquire Button */}
												<button
													type="button"
													onClick={() => openInquiryModal({
														packageName: dest.name,
														duration: dest.tours || 'Custom Itinerary',
														destination: dest.name,
														source: 'Destination Page Enquiry'
													})}
													style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', height: '42px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fde047', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
												>
													Enquire
												</button>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</section>

			{/* DYNAMIC DESTINATION DIRECTORY (International & Domestic Hierarchy) */}
			{destinationGroups.length > 0 && (
				<section style={{ padding: '70px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
					<div className="tf-container">
						<div className="row" style={{ textAlign: 'center', marginBottom: '36px' }}>
							<div className="col-lg-12">
								<span style={{ color: '#16a34a', fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
									Browse by Continent &amp; Region
								</span>
								<h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
									Complete Destinations Directory
								</h2>
								<p style={{ color: '#64748b', fontSize: '15px', maxWidth: '620px', margin: '0 auto' }}>
									Explore all destination countries and Indian states we service. Click any country to explore packages or request a customized itinerary.
								</p>
							</div>
						</div>

						{/* Group Switcher: International vs Domestic */}
						<div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
							<button
								type="button"
								onClick={() => {
									setBrowserGroup('International')
									const firstR = destinationGroups.find(g => g.group === 'International')?.regions?.[0]
									if (firstR) setBrowserRegionId(firstR.id)
								}}
								style={{
									padding: '9px 24px',
									borderRadius: '25px',
									fontSize: '13.5px',
									fontWeight: '800',
									border: browserGroup === 'International' ? '2px solid #2563eb' : '1px solid #cbd5e1',
									background: browserGroup === 'International' ? '#2563eb' : '#f8fafc',
									color: browserGroup === 'International' ? '#ffffff' : '#334155',
									cursor: 'pointer',
									transition: 'all 0.2s'
								}}
							>
								<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconPlane size={14} color={browserGroup === 'International' ? '#ffffff' : '#2563eb'} /> International Continents
								</span>
							</button>

							<button
								type="button"
								onClick={() => {
									setBrowserGroup('India')
									const firstR = destinationGroups.find(g => g.group === 'India')?.regions?.[0]
									if (firstR) setBrowserRegionId(firstR.id)
								}}
								style={{
									padding: '9px 24px',
									borderRadius: '25px',
									fontSize: '13.5px',
									fontWeight: '800',
									border: browserGroup === 'India' ? '2px solid #16a34a' : '1px solid #cbd5e1',
									background: browserGroup === 'India' ? '#16a34a' : '#f8fafc',
									color: browserGroup === 'India' ? '#ffffff' : '#334155',
									cursor: 'pointer',
									transition: 'all 0.2s'
								}}
							>
								<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconIndiaFlag size={14} /> India (Domestic) Zones
								</span>
							</button>
						</div>

						{/* Directory Split Browser */}
						<div style={{ background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)', gap: '24px' }}>
							
							{/* Left Regions List */}
							<div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
								<span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
									Select Region
								</span>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
									{currentRegions.map(r => {
										const isSel = r.id === activeRegion.id
										return (
											<button
												key={r.id}
												type="button"
												onClick={() => setBrowserRegionId(r.id)}
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													padding: '10px 14px',
													borderRadius: '12px',
													border: isSel
														? (browserGroup === 'International' ? '2px solid #2563eb' : '2px solid #16a34a')
														: '1px solid transparent',
													background: isSel
														? (browserGroup === 'International' ? '#eff6ff' : '#f0fdf4')
														: '#ffffff',
													color: isSel ? '#0f172a' : '#475569',
													fontWeight: isSel ? '800' : '600',
													fontSize: '13.5px',
													cursor: 'pointer',
													textAlign: 'left',
													transition: 'all 0.15s ease'
												}}
											>
												<span>{r.name}</span>
												<span style={{
													fontSize: '11px',
													fontWeight: '800',
													padding: '2px 7px',
													borderRadius: '8px',
													background: isSel
														? (browserGroup === 'International' ? '#2563eb' : '#16a34a')
														: '#f1f5f9',
													color: isSel ? '#ffffff' : '#64748b'
												}}>
													{r.countries?.length || 0}
												</span>
											</button>
										)
									})}
								</div>
							</div>

							{/* Right Countries Grid */}
							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
									<h4 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
										{activeRegion.name}
									</h4>
									<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
										{activeRegion.countries?.length || 0} Destinations
									</span>
								</div>

								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '8px' }}>
									{activeRegion.countries?.map((country, idx) => {
										const countryName = typeof country === 'object' && country ? country.name : country
										const matched = findPackageForDestination(country, allPackages)
										return (
											<button
												key={idx}
												type="button"
												onClick={() => handleCountryClick(country)}
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													padding: '10px 12px',
													background: '#ffffff',
													border: matched ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
													borderRadius: '10px',
													cursor: 'pointer',
													textAlign: 'left',
													transition: 'all 0.15s ease'
												}}
												onMouseEnter={e => {
													e.currentTarget.style.borderColor = '#16a34a'
													e.currentTarget.style.background = '#f0fdf4'
												}}
												onMouseLeave={e => {
													e.currentTarget.style.borderColor = matched ? '#bbf7d0' : '#e2e8f0'
													e.currentTarget.style.background = '#ffffff'
												}}
											>
												<span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '6px' }}>
													{countryName}
												</span>
												{matched ? (
													<span style={{ fontSize: '10px', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
														Package
													</span>
												) : (
													<span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }}>
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
				</section>
			)}

			{/* How it Works - Premium Design Grid */}
			<section style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ textAlign: 'center', marginBottom: '50px' }}>
						<div className="col-lg-12">
							<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px' }}>
								Simple &amp; Seamless
							</span>
							<h2 style={{ fontSize: '38px', fontWeight: '900', color: '#0f172a', margin: '0' }}>
								How to Plan Your Journey
							</h2>
						</div>
					</div>
					
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
						{/* Step 1 Card */}
						<div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px 30px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
							<div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
								<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
							</div>
							<div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '120px', fontWeight: '900', color: '#f1f5f9', lineHeight: 1, zIndex: 0, opacity: 0.5 }}>1</div>
							<div style={{ position: 'relative', zIndex: 1 }}>
								<h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Choose Destination</h4>
								<p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Browse our curated list of worldwide destinations and select the places you want to explore with your family or partner.</p>
							</div>
						</div>

						{/* Step 2 Card */}
						<div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px 30px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
							<div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
								<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
							</div>
							<div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '120px', fontWeight: '900', color: '#f1f5f9', lineHeight: 1, zIndex: 0, opacity: 0.5 }}>2</div>
							<div style={{ position: 'relative', zIndex: 1 }}>
								<h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Customize Itinerary</h4>
								<p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Connect with our travel experts on WhatsApp or a call to tailor your flights, luxury stays, and daily sightseeing plan.</p>
							</div>
						</div>

						{/* Step 3 Card */}
						<div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px 30px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
							<div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
								<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
							</div>
							<div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '120px', fontWeight: '900', color: '#f1f5f9', lineHeight: 1, zIndex: 0, opacity: 0.5 }}>3</div>
							<div style={{ position: 'relative', zIndex: 1 }}>
								<h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Travel &amp; Relax</h4>
								<p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Enjoy a seamless vacation with our 24/7 on-trip concierge handling tickets, check-ins, and everything in the background.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}
