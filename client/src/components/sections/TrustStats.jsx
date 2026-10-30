import React from 'react'
import { renderTrustStatIcon, IconShield } from '@/components/common/Icons'

export default function TrustStats({ statsData }) {
	const defaultStats = [
		{ number: '25+', label: 'Years of Excellence', icon: 'trophy', desc: 'Serving travelers since 1999' },
		{ number: '50,000+', label: 'Happy Travelers', icon: 'plane', desc: 'Delighted families & explorers' },
		{ number: '150+', label: 'Global Destinations', icon: 'globe', desc: 'Covering 6 continents' },
		{ number: '4.9 / 5', label: 'Google Rating', icon: 'star', desc: 'Based on 4,800+ real reviews' }
	]

	const stats = (statsData && statsData.length > 0) ? statsData : defaultStats

	return (
		<section style={{ backgroundColor: '#071812', padding: '36px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
			<style>{`
				.trust-stats-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
					gap: 20px;
					text-align: center;
				}
				@media (max-width: 991px) {
					.trust-stats-grid {
						grid-template-columns: repeat(2, 1fr);
						gap: 16px;
					}
				}
				@media (max-width: 480px) {
					.trust-stats-grid {
						grid-template-columns: repeat(2, 1fr);
						gap: 10px;
					}
					.trust-stat-card {
						padding: 16px 10px !important;
					}
					.trust-stat-number {
						font-size: 24px !important;
					}
					.trust-stat-label {
						font-size: 13px !important;
					}
					.trust-stat-desc {
						font-size: 11px !important;
					}
					.trust-badges-row {
						gap: 8px !important;
						padding: 12px 14px !important;
						flex-direction: column !important;
						text-align: center !important;
					}
					.trust-badge-bullet {
						display: none !important;
					}
				}
			`}</style>
			<div className="tf-container">
				<div className="trust-stats-grid">
					{stats.map((stat, idx) => (
						<div
							key={stat.id || idx}
							className={`trust-stat-card scroll-reveal stagger-delay-${(idx % 4) + 1} card-hover-effect`}
							style={{
								padding: '22px 18px',
								borderRadius: '16px',
								backgroundColor: 'rgba(255, 255, 255, 0.03)',
								border: '1px solid rgba(255, 255, 255, 0.08)',
								cursor: 'default'
							}}
						>
							<div className="floating-elem" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', marginBottom: '8px' }}>
								{renderTrustStatIcon(stat.icon, stat.label, 30)}
							</div>
							<div className="trust-stat-number" style={{ fontSize: '30px', fontWeight: '800', color: '#4ade80', letterSpacing: '-0.02em', marginBottom: '2px' }}>
								{stat.number}
							</div>
							<div className="trust-stat-label" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
								{stat.label}
							</div>
							<div className="trust-stat-desc" style={{ fontSize: '12px', color: '#9ca3af' }}>
								{stat.desc}
							</div>
						</div>
					))}
				</div>

				<div
					className="trust-badges-row scroll-reveal reveal-fade-up stagger-delay-4"
					style={{
						marginTop: '24px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '24px',
						flexWrap: 'wrap',
						padding: '16px 24px',
						borderRadius: '12px',
						backgroundColor: 'rgba(34, 197, 94, 0.08)',
						border: '1px solid rgba(34, 197, 94, 0.2)'
					}}
				>
					<span style={{ fontSize: '12.5px', color: '#e5e7eb', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
						<IconShield size={14} color="#4ade80" />
						ISO 9001:2015 Certified Travel Agency
					</span>
					<span className="trust-badge-bullet" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
					<span style={{ fontSize: '12.5px', color: '#e5e7eb', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
						<IconShield size={14} color="#4ade80" />
						IATA Accredited Tour Operator
					</span>
					<span className="trust-badge-bullet" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
					<span style={{ fontSize: '12.5px', color: '#e5e7eb', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
						<IconShield size={14} color="#4ade80" />
						100% Guaranteed Financial Security
					</span>
				</div>
			</div>
		</section>
	)
}
