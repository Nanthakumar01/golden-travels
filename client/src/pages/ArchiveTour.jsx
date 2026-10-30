import React, { useState } from 'react'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { packagesData } from "@/data/packagesData"
import { openInquiryModal } from "@/components/elements/InquiryModal"
import {
	IconIndiaFlag,
	IconGlobe,
	IconCalendar,
	IconLocation,
	IconCheck,
	IconMeal,
	IconPlane,
	IconHotel,
	IconBus,
	IconSightseeing,
	IconPhone
} from "@/components/common/Icons"

export default function ArchiveTour() {
	const [activeCategory, setActiveCategory] = useState("domestic")
	const categories = [
		{ id: "domestic", label: "Domestic" },
		{ id: "international", label: "International" }
	]

	const filteredPackages = activeCategory === "international"
		? packagesData.filter(p => p.type === "INTERNATIONAL")
		: packagesData.filter(p => p.type === "DOMESTIC")

	return (
		<Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Curated Tour Packages">
			<section style={{ padding: '60px 0 50px', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ textAlign: 'center', marginBottom: '36px' }}>
						<div className="col-lg-12">
							<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
								Handcrafted Itineraries
							</span>
							<h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0' }}>
								Curated Domestic &amp; International Tour Packages
							</h2>
							<p style={{ color: '#64748b', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
								All packages include premium hotel & tent stays, private transfers, guided excursions, and 24/7 on-trip concierge assistance.
							</p>
						</div>
					</div>

					{/* Category Filter */}
					<div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								style={{
									padding: '8px 22px',
									borderRadius: '30px',
									fontSize: '13px',
									fontWeight: '700',
									border: activeCategory === cat.id ? '1px solid #16a34a' : '1px solid #e2e8f0',
									backgroundColor: activeCategory === cat.id ? '#16a34a' : '#ffffff',
									color: activeCategory === cat.id ? '#ffffff' : '#334155',
									cursor: 'pointer',
									transition: 'all 0.25s ease',
									boxShadow: activeCategory === cat.id ? '0 4px 14px rgba(22, 163, 74, 0.25)' : 'none'
								}}
							>
								{cat.label}
							</button>
						))}
					</div>

					{/* Packages Grid */}
					<style>{`
						.archive-tour-grid {
							display: grid;
							grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
							gap: 28px;
						}
						@media (max-width: 640px) {
							.archive-tour-grid {
								grid-template-columns: 1fr;
								gap: 20px;
							}
						}
					`}</style>
					<div className="archive-tour-grid">
						{filteredPackages.map((tour) => {
							const tourLink = `/tour/${tour.slug}`
							return (
								<div
									key={tour.id}
									style={{
										backgroundColor: '#ffffff',
										borderRadius: '20px',
										overflow: 'hidden',
										boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
										border: '1px solid #e2e8f0',
										display: 'flex',
										flexDirection: 'column',
										textAlign: 'center',
										transition: 'transform 0.3s ease, box-shadow 0.3s ease'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-6px)'
										e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0)'
										e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.06)'
									}}
								>
									{/* Image */}
									<Link href={tourLink} style={{ height: '220px', position: 'relative', overflow: 'hidden', display: 'block' }}>
										<img
											src={tour.image}
											alt={tour.title}
											loading="lazy"
											decoding="async"
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
										<div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap', zIndex: 2, pointerEvents: 'none' }}>
											<span style={{ backgroundColor: tour.type === 'DOMESTIC' ? '#16a34a' : '#071812', color: tour.type === 'DOMESTIC' ? '#ffffff' : '#FDE047', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap', border: tour.type === 'DOMESTIC' ? 'none' : '1px solid rgba(253, 224, 71, 0.4)' }}>
												{tour.type === 'DOMESTIC' ? (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconIndiaFlag size={12} /> Domestic
													</span>
												) : (
													<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconGlobe size={12} color="#FDE047" /> International
													</span>
												)}
											</span>
											{tour.badge && (
												<span style={{ marginLeft: 'auto', backgroundColor: '#e0a21b', color: '#1d2a0f', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
													{tour.badge}
												</span>
											)}
										</div>
									</Link>

									{/* Details */}
									<div style={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
										{/* Title */}
										<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.3, minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<Link href={tourLink} style={{ color: '#0f172a', textDecoration: 'none' }}>{tour.shortTitle || tour.title}</Link>
										</h3>

										{/* Duration & Cities */}
										<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#475569', fontWeight: '600', marginBottom: '16px' }}>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconCalendar size={13} color="#64748b" /> {tour.duration || (tour.days ? `${tour.days} Day${tour.days > 1 ? 's' : ''}${tour.nights !== undefined ? ` | ${tour.nights} Night${tour.nights > 1 ? 's' : ''}` : ''}` : '')}
											</span>
											<span style={{ color: '#cbd5e1' }}>|</span>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconLocation size={13} color="#64748b" /> {tour.destination || tour.cities}
											</span>
										</div>

										{/* Inclusions preview */}
										{((Array.isArray(tour.keyInclusions) && tour.keyInclusions.filter(Boolean).length > 0) || (Array.isArray(tour.inclusions) && tour.inclusions.filter(Boolean).length > 0)) && (
											<ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', fontSize: '12px', color: '#475569' }}>
												{((tour.keyInclusions?.filter(Boolean)?.length ? tour.keyInclusions.filter(Boolean) : tour.inclusions?.filter(Boolean)) || []).slice(0, 3).map((inc, iIdx) => (
													<li key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
														<IconCheck size={12} color="#16a34a" />
														<span>{inc}</span>
													</li>
												))}
											</ul>
										)}

										{/* 5 Inclusions Icons Row */}
										<div
											style={{
												display: 'grid',
												gridTemplateColumns: 'repeat(5, 1fr)',
												gap: '6px',
												padding: '12px 6px',
												borderTop: '1px solid #f1f5f9',
												borderBottom: '1px solid #f1f5f9',
												marginBottom: '20px'
											}}
										>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
												<IconMeal size={18} color="#0f172a" />
												<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Meals</span>
											</div>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
												<IconPlane size={18} color="#0f172a" />
												<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Transit</span>
											</div>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
												<IconHotel size={18} color="#0f172a" />
												<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Stay</span>
											</div>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
												<IconBus size={18} color="#0f172a" />
												<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Transport</span>
											</div>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
												<IconSightseeing size={18} color="#0f172a" />
												<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Sightseeing</span>
											</div>
										</div>

										{/* Action Row: [ 📞 ] [ View Details ] [ 💬 ] */}
										<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
											<a
												href="tel:04222477090"
												title="Call Office: 0422 2477090"
												style={{
													width: '46px',
													height: '44px',
													borderRadius: '12px',
													border: '1.5px solid #E5A91E',
													backgroundColor: '#ffffff',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													textDecoration: 'none',
													transition: 'all 0.2s ease',
													flexShrink: 0
												}}
											>
												<IconPhone size={17} color="#E5A91E" />
											</a>

											<Link
												href={tourLink}
												style={{
													flex: 1,
													height: '44px',
													borderRadius: '22px',
													backgroundColor: '#FDE047',
													backgroundImage: 'linear-gradient(180deg, #FDE047 0%, #E5A91E 100%)',
													color: '#071812',
													fontSize: '14px',
													fontWeight: '800',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													textDecoration: 'none',
													boxShadow: '0 4px 14px rgba(229, 169, 30, 0.35)',
													transition: 'all 0.2s ease'
												}}
											>
												View Details
											</Link>

											<button
												type="button"
												onClick={() => openInquiryModal({
													packageName: tour.title || tour.shortTitle || '',
													duration: tour.duration || '',
													destination: tour.destination || tour.region || tour.cities || ''
												})}
												title="Enquire Now"
												style={{
													height: '44px',
													padding: '0 16px',
													borderRadius: '22px',
													border: '1.5px solid #071812',
													backgroundColor: '#071812',
													color: '#FDE047',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: '13.5px',
													fontWeight: '800',
													cursor: 'pointer',
													transition: 'all 0.2s ease',
													flexShrink: 0
												}}
											>
												Enquire
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>
		</Layout>
	)
}
