import React, { useState } from 'react'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { openInquiryModal } from '@/components/elements/InquiryModal'
import { IconCheck, IconClose, IconStar } from '@/components/common/Icons'

export default function SingleDestination() {
	const [activeTab, setActiveTab] = useState('itinerary')

	const itineraryDays = [
		{ day: "Day 1", title: "Arrival in Zurich & Scenic Train to Lucerne", desc: "Arrive at Zurich Airport. Meet your Golden Travels executive. Take the scenic Swiss Federal Railway to Lucerne. Enjoy an evening romantic cruise on Lake Lucerne with the Swiss Alps as your backdrop." },
		{ day: "Day 2", title: "Mount Titlis & World's First Revolving Cable Car", desc: "Ascend to 10,000 feet on the Rotair revolving gondola. Walk through the glacier ice cave, cross the Cliff Walk suspension bridge, and enjoy snow activities." },
		{ day: "Day 3", title: "Lucerne to Interlaken via GoldenPass Panoramic Express", desc: "Experience one of the world's most scenic train journeys passing turquoise lakes and alpine waterfalls. Check into your 5-star hotel in Interlaken." },
		{ day: "Day 4", title: "Jungfraujoch - Top of Europe (3,454m)", desc: "Travel on the Eiger Express tricable gondola to Jungfraujoch. Marvel at the Aletsch Glacier, visit the Ice Palace, and dine at high-altitude panoramic restaurants." },
		{ day: "Day 5", title: "Lake Brienz Jetboat & Lauterbrunnen Valley of 72 Waterfalls", desc: "Private boat excursion on Lake Brienz, followed by a leisure stroll through fairytale Lauterbrunnen village and Staubbach Falls." },
		{ day: "Day 6", title: "Zurich Old Town, Luxury Shopping & Departure", desc: "Return to Zurich. Enjoy time on Bahnhofstrasse for Swiss chocolates and timepieces. Private chauffeur transfer to Zurich Airport for your flight back home." }
	]

	return (
		<Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Switzerland & The Alps Explorer">
			{/* Destination Info Header (No Image) */}
			<section
				style={{
					position: 'relative',
					padding: '60px 0',
					backgroundColor: '#ffffff',
					borderBottom: '1px solid #f1f5f9'
				}}
			>
				<div className="tf-container relative" style={{ zIndex: 2 }}>
					<div className="row">
						<div className="col-lg-12">
							<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
								
								<div>
									<span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
										Europe Grandeur • Best Seller
									</span>
								</div>

								<h1 style={{ fontSize: '38px', fontWeight: '900', color: '#0f172a', margin: '0', lineHeight: 1.2 }}>
									Switzerland &amp; The Alps Explorer
								</h1>
								
								<p style={{ fontSize: '15px', color: '#475569', maxWidth: '800px', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>
									6 Nights / 7 Days • Zurich, Lucerne, Interlaken, Jungfraujoch &amp; Mount Titlis. 100% customizable with 5-star Swiss stays and Swiss Travel Pass.
								</p>

								<div style={{ display: 'flex', gap: '24px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
									<div style={{ backgroundColor: '#f8fafc', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
										<span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Starting From</span>
										<span style={{ fontSize: '20px', fontWeight: '900', color: '#16a34a' }}>₹1,29,999 <span style={{fontSize: '13px', color: '#64748b'}}>/ person</span></span>
									</div>
									<div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
										<span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Duration</span>
										<span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>7 Days / 6 Nights</span>
									</div>
									<div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
										<span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Rating</span>
										<span style={{ fontSize: '15px', fontWeight: '800', color: '#d97706', display: 'flex', alignItems: 'center', gap: '5px' }}>
											<IconStar size={15} color="#d97706" /> 4.9/5 (120+ Reviews)
										</span>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Details & Booking Area */}
			<section style={{ padding: '60px 0', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
						
						{/* Left: Itinerary, Inclusions */}
						<div className="col-lg-8" style={{ flex: '1 1 500px' }}>
							<div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 6px 24px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
								
								{/* Tabs */}
								<div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
									<button
										onClick={() => setActiveTab('itinerary')}
										style={{
											padding: '8px 18px',
											borderRadius: '10px',
											border: 'none',
											backgroundColor: activeTab === 'itinerary' ? '#16a34a' : '#f1f5f9',
											color: activeTab === 'itinerary' ? '#ffffff' : '#334155',
											fontWeight: '700',
											fontSize: '13px',
											cursor: 'pointer'
										}}
									>
										Day-by-Day Plan
									</button>
									<button
										onClick={() => setActiveTab('inclusions')}
										style={{
											padding: '8px 18px',
											borderRadius: '10px',
											border: 'none',
											backgroundColor: activeTab === 'inclusions' ? '#16a34a' : '#f1f5f9',
											color: activeTab === 'inclusions' ? '#ffffff' : '#334155',
											fontWeight: '700',
											fontSize: '13px',
											cursor: 'pointer'
										}}
									>
										What's Included
									</button>
								</div>

								{/* Itinerary Tab */}
								{activeTab === 'itinerary' && (
									<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
										{itineraryDays.map((item, idx) => (
											<div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
												<div
													style={{
														width: '64px',
														height: '32px',
														borderRadius: '8px',
														backgroundColor: '#ecfdf5',
														color: '#16a34a',
														fontWeight: '800',
														fontSize: '12px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														flexShrink: 0
													}}
												>
													{item.day}
												</div>
												<div>
													<h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>{item.title}</h4>
													<p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
												</div>
											</div>
										))}
									</div>
								)}

								{/* Inclusions Tab */}
								{activeTab === 'inclusions' && (
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
										<div>
											<h4 style={{ color: '#16a34a', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
												<IconCheck size={16} color="#16a34a" /> Inclusions
											</h4>
											<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
												{[
													"6 Nights in 4★/5★ Handpicked Hotels",
													"Daily Swiss Breakfast Buffet",
													"8-Day 1st Class Swiss Travel Pass",
													"Excursion to Mount Titlis & Cable Car",
													"Jungfraujoch Top of Europe Train Ticket",
													"Lake Lucerne & Lake Brienz Cruises",
													"24/7 Concierge Support from Coimbatore"
												].map((inc, i) => (
													<li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
														<IconCheck size={14} color="#16a34a" />
														<span>{inc}</span>
													</li>
												))}
											</ul>
										</div>
										<div>
											<h4 style={{ color: '#dc2626', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
												<IconClose size={16} color="#dc2626" /> Optional / Exclusions
											</h4>
											<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#64748b' }}>
												{[
													"International Flights (can be added on request)",
													"Schengen Visa fee (we provide full assistance)",
													"Personal expenses & optional adventure sports"
												].map((exc, i) => (
													<li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
														<IconClose size={14} color="#dc2626" />
														<span>{exc}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								)}

							</div>
						</div>

						{/* Right: Booking Card */}
						<div className="col-lg-4" style={{ flex: '1 1 320px' }}>
							<div
								style={{
									backgroundColor: '#ffffff',
									padding: '28px',
									borderRadius: '24px',
									boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
									border: '1px solid #e2e8f0',
									position: 'sticky',
									top: '100px'
								}}
							>
								<h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
									Request Custom Itinerary
								</h3>
								<p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
									Our Switzerland specialists in Coimbatore will tailor this package to your exact travel dates and budget.
								</p>

								<div style={{ backgroundColor: '#ecfdf5', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #a7f3d0' }}>
									<span style={{ fontSize: '11px', color: '#065f46', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Price Guarantee</span>
									<span style={{ fontSize: '22px', fontWeight: '900', color: '#16a34a' }}>₹1,29,999</span>
									<span style={{ fontSize: '12px', color: '#047857' }}> / person</span>
								</div>

								<button
									type="button"
									onClick={() => openInquiryModal({
										packageName: 'Switzerland & The Alps Explorer',
										duration: '7 Days / 6 Nights',
										destination: 'Switzerland & The Alps',
										source: 'Destination Inquiry'
									})}
									style={{
										display: 'block',
										width: '100%',
										textAlign: 'center',
										backgroundColor: '#16a34a',
										color: '#ffffff',
										padding: '14px 20px',
										borderRadius: '12px',
										border: 'none',
										cursor: 'pointer',
										fontWeight: '800',
										fontSize: '14px',
										boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
										marginBottom: '12px'
									}}
								>
									Enquire ➔
								</button>

								<a
									href="tel:+919003546546"
									style={{
										display: 'block',
										textAlign: 'center',
										backgroundColor: '#f1f5f9',
										color: '#0f172a',
										padding: '12px 20px',
										borderRadius: '12px',
										fontWeight: '700',
										fontSize: '13px',
										textDecoration: 'none'
									}}
								>
									Call Specialist: +91 90035 46546
								</a>
							</div>
						</div>

					</div>
				</div>
			</section>
		</Layout>
	)
}
