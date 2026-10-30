import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { packagesData, matchesSearchQuery } from '@/data/packagesData'
import { IconLocation, IconCalendar, IconSearch } from '@/components/common/Icons'

const QUICK = ['Vietnam', 'Taiwan', 'Spain', 'South Korea', 'Philippines', 'Rann Utsav', 'Rajasthan', 'Andaman', 'Puri', 'North East']

export default function HeaderSearch({ isOpen: controlledOpen, onToggle }) {
	const navigate = useNavigate()
	const boxRef = useRef(null)
	const desktopInputRef = useRef(null)
	const mobileInputRef = useRef(null)
	const [internalOpen, setInternalOpen] = useState(false)
	const [q, setQ] = useState('')
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1199 : false)

	const searchMatches = q.trim()
		? packagesData.filter(pkg => matchesSearchQuery(pkg, q))
		: []

	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : internalOpen

	const close = () => {
		if (isControlled && onToggle) {
			onToggle()
		} else {
			setInternalOpen(false)
		}
	}

	const toggle = () => {
		if (isControlled && onToggle) {
			onToggle()
		} else {
			setInternalOpen((prev) => !prev)
		}
	}

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 1199)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		if (!open) return
		const timer = setTimeout(() => {
			if (isMobile) {
				mobileInputRef.current?.focus({ preventScroll: true })
			} else {
				desktopInputRef.current?.focus({ preventScroll: true })
			}
		}, 260)

		const onDown = (e) => {
			if (!isMobile && boxRef.current && !boxRef.current.contains(e.target)) {
				close()
			}
		}
		const onKey = (e) => {
			if (e.key === 'Escape') close()
		}
		document.addEventListener('mousedown', onDown)
		document.addEventListener('keydown', onKey)

		if (isMobile) {
			document.body.style.overflow = 'hidden'
		}

		return () => {
			clearTimeout(timer)
			document.removeEventListener('mousedown', onDown)
			document.removeEventListener('keydown', onKey)
			document.body.style.overflow = ''
		}
	}, [open, isMobile])

	const go = (term) => {
		const t = term.trim()
		if (!t) return
		navigate(`/tour?search=${encodeURIComponent(t)}`)
		setQ('')
		close()
	}

	const onIconClick = () => {
		if (!open) {
			toggle()
			return
		}
		close()
	}

	return (
		<>
			{/* Desktop Search Component */}
			<div ref={boxRef} className={`gt-search ${!isMobile && open ? 'open' : ''}`}>
				<style>{`
					.gt-search {
						position: relative;
						width: 40px;
						height: 40px;
						flex-shrink: 0;
						z-index: 9999;
					}
					.gt-pill-btn {
						flex-shrink: 0;
						width: 40px !important;
						height: 40px !important;
						min-width: 40px !important;
						max-width: 40px !important;
						padding: 0 !important;
						margin: 0 !important;
						display: inline-flex !important;
						align-items: center !important;
						justify-content: center !important;
						border: 1.5px solid #e2e8f0 !important;
						border-radius: 50% !important;
						background: #ffffff !important;
						color: #0f172a !important;
						cursor: pointer !important;
						box-shadow: none !important;
						transition: all .2s ease !important;
						outline: none !important;
					}
					.gt-pill-btn:hover {
						background: #ecfdf5 !important;
						border-color: #16a34a !important;
						color: #16a34a !important;
					}
					.gt-search.open .gt-pill-btn {
						background: #16a34a !important;
						border-color: #16a34a !important;
						color: #ffffff !important;
						box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25) !important;
					}
					.gt-pill-btn svg {
						display: block !important;
						width: 18px !important;
						height: 18px !important;
						stroke: currentColor !important;
						margin: 0 auto !important;
					}
					.gt-chips {
						position: absolute;
						top: calc(100% + 10px);
						right: 0;
						width: min(340px, calc(100vw - 32px));
						background: #ffffff;
						border: 1.5px solid #e2e8f0;
						border-radius: 18px;
						padding: 14px 16px;
						box-shadow: 0 16px 45px rgba(15,23,42,.15);
						z-index: 100000;
						opacity: 0;
						visibility: hidden;
						transform: translateY(-6px);
						transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
						max-height: 420px;
						overflow-y: auto;
						pointer-events: none;
					}
					.gt-search.open .gt-chips {
						opacity: 1;
						visibility: visible;
						transform: translateY(0);
						pointer-events: auto;
					}
					.gt-chips p {
						margin: 0 0 8px;
						font-size: 12px;
						font-weight: 600;
						color: #64748b;
					}
					.gt-chips div {
						display: flex;
						flex-wrap: wrap;
						gap: 6px;
					}
					.gt-chips button {
						padding: 5px 12px !important;
						min-width: auto !important;
						height: auto !important;
						line-height: 1.2 !important;
						border-radius: 20px !important;
						border: 1px solid #e2e8f0 !important;
						background: #f8fafc !important;
						color: #334155 !important;
						font-size: 13px !important;
						font-weight: 600 !important;
						cursor: pointer !important;
						transition: all .2s !important;
					}
					.gt-chips button:hover {
						background: #16a34a !important;
						border-color: #16a34a !important;
						color: #ffffff !important;
					}

					@media (min-width: 768px) and (max-width: 1199px) {
						.gt-search-trigger-mobile {
							width: 48px !important;
							height: 48px !important;
							border-radius: 12px !important;
						}
						.gt-search-trigger-mobile svg {
							width: 20px !important;
							height: 20px !important;
						}
					}

					/* Mobile Search Portal Styles */
					.gt-search-mobile-overlay {
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 9999999;
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 16px 14px;
						box-sizing: border-box;
					}
					.gt-search-mobile-backdrop {
						position: absolute;
						inset: 0;
						background-color: rgba(7, 24, 18, 0.75);
						backdrop-filter: blur(8px);
						-webkit-backdrop-filter: blur(8px);
					}
					.gt-search-mobile-modal {
						position: relative;
						z-index: 2;
						width: 100%;
						max-width: 480px;
						display: flex;
						flex-direction: column;
						gap: 12px;
						animation: gtSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
					}
					@keyframes gtSlideDown {
						from {
							opacity: 0;
							transform: translateY(-16px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
					.gt-search-mobile-input-bar {
						display: flex;
						align-items: center;
						background: #ffffff;
						border-radius: 14px;
						padding: 6px 12px;
						box-shadow: 0 12px 36px rgba(0,0,0,0.3);
						border: 2px solid #16a34a;
						gap: 8px;
					}
					.gt-search-mobile-input-bar input {
						flex: 1;
						min-width: 0;
						border: none;
						outline: none;
						font-size: 15px;
						color: #0f172a;
						background: transparent;
						padding: 6px 8px;
						caret-color: #16a34a;
					}
					.gt-search-mobile-close {
						background: #f1f5f9 !important;
						border: none !important;
						width: 28px !important;
						min-width: 28px !important;
						max-width: 28px !important;
						height: 28px !important;
						min-height: 28px !important;
						max-height: 28px !important;
						border-radius: 50% !important;
						display: flex !important;
						align-items: center !important;
						justify-content: center !important;
						cursor: pointer !important;
						font-size: 13px !important;
						line-height: 1 !important;
						color: #475569 !important;
						padding: 0 !important;
						margin: 0 !important;
						flex: 0 0 28px !important;
						aspect-ratio: 1 / 1 !important;
						box-sizing: border-box !important;
						transition: all 0.2s ease;
					}
					.gt-search-mobile-close:hover {
						background: #e2e8f0;
						color: #0f172a;
					}
					.gt-search-mobile-body {
						background: #ffffff;
						border-radius: 16px;
						padding: 16px;
						box-shadow: 0 16px 44px rgba(0,0,0,0.25);
						max-height: calc(85vh - 80px);
						overflow-y: auto;
						-webkit-overflow-scrolling: touch;
					}
				`}</style>

				{/* Desktop Header Search */}
				{!isMobile ? (
					<>
						<button
							type="button"
							className="gt-pill-btn"
							onClick={onIconClick}
							aria-label={open ? 'Close search' : 'Open search'}
							aria-expanded={open}
						>
							{open ? (
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							) : (
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="11" cy="11" r="7" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
							)}
						</button>

						{/* Desktop Search Dropdown Card */}
						<div className="gt-chips">
							<form
								role="search"
								onSubmit={(e) => {
									e.preventDefault()
									go(q)
								}}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									backgroundColor: '#f8fafc',
									border: '1.5px solid #16a34a',
									borderRadius: '12px',
									padding: '8px 12px',
									marginBottom: '14px',
									boxShadow: '0 2px 8px rgba(22,163,74,0.1)'
								}}
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
									<circle cx="11" cy="11" r="7" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
								<input
									ref={desktopInputRef}
									type="text"
									value={q}
									placeholder="Search destination, package..."
									onChange={(e) => setQ(e.target.value)}
									tabIndex={open ? 0 : -1}
									aria-label="Search destinations"
									style={{
										flex: 1,
										minWidth: 0,
										border: 'none',
										outline: 'none',
										background: 'transparent',
										fontSize: '13.5px',
										color: '#0f172a',
										padding: '3px 8px',
										margin: 0,
										caretColor: '#16a34a'
									}}
								/>
								{q && (
									<button
										type="button"
										onClick={() => setQ('')}
										style={{
											border: 'none',
											background: '#e2e8f0',
											borderRadius: '50%',
											width: '18px',
											height: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '11px',
											cursor: 'pointer',
											color: '#475569',
											padding: 0
										}}
									>
										✕
									</button>
								)}
							</form>
							{q.trim() ? (
								<div>
									<p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
										{searchMatches.length > 0 ? `Matching Tours (${searchMatches.length})` : 'Search Results'}
									</p>
									{searchMatches.length > 0 ? (
										<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
											{searchMatches.slice(0, 5).map((pkg) => (
												<div
													key={pkg.id}
													onClick={() => {
														navigate(`/tour/${pkg.slug}`)
														close()
														setQ('')
													}}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '12px',
														padding: '8px 10px',
														borderRadius: '10px',
														cursor: 'pointer',
														backgroundColor: '#f8fafc',
														border: '1px solid #f1f5f9',
														transition: 'all 0.2s ease',
														width: '100%'
													}}
													onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
													onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
												>
													<img
														src={pkg.image}
														alt={pkg.title}
														style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
													/>
													<div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
														<div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
															{pkg.title}
														</div>
														<div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', marginTop: '2px' }}>
															<span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><IconLocation size={11} color="#64748b" /> {pkg.region}</span>
															<span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><IconCalendar size={11} color="#64748b" /> {pkg.duration}</span>
														</div>
													</div>
												</div>
											))}
											<button
												type="button"
												onClick={() => go(q)}
												style={{
													marginTop: '4px',
													width: '100%',
													padding: '8px 12px',
													fontSize: '12px',
													fontWeight: '700',
													color: '#16a34a',
													backgroundColor: '#f0fdf4',
													border: '1px solid #bbf7d0',
													borderRadius: '10px',
													cursor: 'pointer',
													textAlign: 'center'
												}}
											>
												View all results for "{q}" →
											</button>
										</div>
									) : (
										<div style={{ padding: '16px 8px', textAlign: 'center', color: '#94a3b8' }}>
											<p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: '600' }}>No tours found for "{q}"</p>
											<button
												type="button"
												onClick={() => go(q)}
												style={{
													padding: '6px 14px',
													fontSize: '12px',
													fontWeight: '600',
													color: '#16a34a',
													backgroundColor: '#f0fdf4',
													border: '1px solid #bbf7d0',
													borderRadius: '20px',
													cursor: 'pointer'
												}}
											>
												Search all tours for "{q}"
											</button>
										</div>
									)}
								</div>
							) : (
								<>
									<p>Popular searches</p>
									<div>
										{QUICK.map((d) => (
											<button key={d} type="button" tabIndex={open ? 0 : -1} onClick={() => go(d)}>
												{d}
											</button>
										))}
									</div>
								</>
							)}
						</div>
					</>
				) : (
					/* Mobile Search Trigger Button */
					<button
						type="button"
						className="gt-pill-btn gt-search-trigger-mobile"
						onClick={toggle}
						aria-label="Open search"
						style={{
							width: '40px',
							height: '40px',
							borderRadius: '10px',
							border: '1.5px solid #cbd5e1',
							backgroundColor: '#f8fafc',
							color: '#0f172a',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer'
						}}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="11" cy="11" r="7" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</button>
				)}
			</div>

			{/* Dedicated Mobile Search Modal via Portal */}
			{isMobile && open && typeof document !== 'undefined' && createPortal(
				<div className="gt-search-mobile-overlay">
					{/* Dark blurred backdrop */}
					<div className="gt-search-mobile-backdrop" onClick={close} />

					{/* Modal Box */}
					<div className="gt-search-mobile-modal">
						{/* Input Bar */}
						<form
							onSubmit={(e) => {
								e.preventDefault()
								go(q)
							}}
							className="gt-search-mobile-input-bar"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
								<circle cx="11" cy="11" r="7" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>

							<input
								ref={mobileInputRef}
								type="text"
								value={q}
								onChange={(e) => setQ(e.target.value)}
								placeholder="Search tour, destination..."
								aria-label="Search destination"
							/>

							<button
								type="button"
								onClick={() => {
									setQ('')
									close()
								}}
								className="gt-search-mobile-close"
								aria-label="Close search"
								style={{
									width: '28px',
									minWidth: '28px',
									maxWidth: '28px',
									height: '28px',
									minHeight: '28px',
									maxHeight: '28px',
									padding: 0,
									margin: 0,
									borderRadius: '50%',
									aspectRatio: '1 / 1',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									lineHeight: 1,
									flex: '0 0 28px',
									background: '#f1f5f9',
									border: 'none',
									color: '#475569',
									cursor: 'pointer'
								}}
							>
								✕
							</button>
						</form>

						{/* Results or Quick Suggestions */}
						<div className="gt-search-mobile-body">
							{q.trim() ? (
								<div>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
										<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
											Matching Tours ({searchMatches.length})
										</span>
										{searchMatches.length > 0 && (
											<button
												type="button"
												onClick={() => go(q)}
												style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: '700', fontSize: '12px', cursor: 'pointer', padding: 0 }}
											>
												View All →
											</button>
										)}
									</div>

									{searchMatches.length > 0 ? (
										<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
											{searchMatches.slice(0, 6).map((pkg) => (
												<div
													key={pkg.id}
													onClick={() => {
														navigate(`/tour/${pkg.slug}`)
														close()
														setQ('')
													}}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '12px',
														padding: '10px',
														borderRadius: '12px',
														cursor: 'pointer',
														backgroundColor: '#f8fafc',
														border: '1px solid #e2e8f0'
													}}
												>
													<img
														src={pkg.image}
														alt={pkg.title}
														style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
													/>
													<div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
														<div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
															{pkg.title}
														</div>
														<div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', gap: '8px', marginTop: '3px' }}>
															<span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><IconLocation size={11} color="#64748b" /> {pkg.region}</span>
															<span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><IconCalendar size={11} color="#64748b" /> {pkg.duration}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div style={{ padding: '24px 10px', textAlign: 'center', color: '#94a3b8' }}>
											<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
												<IconSearch size={32} color="#94a3b8" />
											</div>
											<p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
												No exact tour matches found for "{q}"
											</p>
											<button
												type="button"
												onClick={() => go(q)}
												style={{
													padding: '8px 16px',
													fontSize: '12.5px',
													fontWeight: '700',
													color: '#16a34a',
													backgroundColor: '#f0fdf4',
													border: '1px solid #bbf7d0',
													borderRadius: '25px',
													cursor: 'pointer'
												}}
											>
												Explore search in all tours →
											</button>
										</div>
									)}
								</div>
							) : (
								<div>
									<p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
										Popular Destinations
									</p>
									<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
										{QUICK.map((term) => (
											<button
												key={term}
												type="button"
												onClick={() => go(term)}
												style={{
													padding: '7px 14px',
													borderRadius: '25px',
													backgroundColor: '#f1f5f9',
													border: '1px solid #e2e8f0',
													color: '#1e293b',
													fontSize: '13px',
													fontWeight: '600',
													cursor: 'pointer',
													transition: 'all 0.2s'
												}}
											>
												{term}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
	)
}