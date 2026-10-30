import React, { useState } from 'react'
import { IconChat } from '@/components/common/Icons'

export default function WhatsAppFloat() {
	const [hovered, setHovered] = useState(false)
	const phoneNumber = "919003546546" // Golden Travels Coimbatore Official WhatsApp
	const message = encodeURIComponent("Hello Golden Travels Coimbatore, I would like to enquire about tour packages!")
	const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`

	return (
		<>
			<style>{`
				@keyframes whatsappPulse {
					0% {
						box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7), 0 6px 20px rgba(37, 211, 102, 0.4);
					}
					70% {
						box-shadow: 0 0 0 15px rgba(37, 211, 102, 0), 0 8px 25px rgba(37, 211, 102, 0.5);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 6px 20px rgba(37, 211, 102, 0.4);
					}
				}
				@keyframes whatsappFloat {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-4px);
					}
				}
				.whatsapp-float-btn {
					animation: whatsappPulse 2.5s infinite, whatsappFloat 3s ease-in-out infinite;
					transition: transform 0.25s ease, filter 0.25s ease !important;
				}
				.whatsapp-float-btn:hover {
					transform: scale(1.1) translateY(-2px) !important;
					filter: brightness(1.05);
				}
				body.mobile-menu-visible .gt-whatsapp-float {
					display: none !important;
					visibility: hidden !important;
					opacity: 0 !important;
					pointer-events: none !important;
				}
			`}</style>
			<div
				className="gt-whatsapp-float"
				style={{
					position: 'fixed',
					bottom: '85px',
					right: '25px',
					zIndex: 9999,
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
				}}
			>
				{hovered && (
					<div
						style={{
							background: '#ffffff',
							color: '#111827',
							padding: '8px 14px',
							borderRadius: '20px',
							boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
							fontSize: '13px',
							fontWeight: '600',
							whiteSpace: 'nowrap',
							border: '1px solid #e5e7eb',
							animation: 'fadeIn 0.2s ease-in-out'
						}}
					>
						<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
							Chat with Tour Specialist <IconChat size={14} color="#16a34a" />
						</span>
					</div>
				)}
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="whatsapp-float-btn"
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					style={{
						width: '52px',
						height: '52px',
						borderRadius: '50%',
						backgroundColor: '#25D366',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						textDecoration: 'none',
						cursor: 'pointer'
					}}
					title="Chat on WhatsApp"
				>
					<svg
						width="30"
						height="30"
						viewBox="0 0 24 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.44 19.64L5.27 16.61L5.07 16.29C4.24 14.97 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.24 15.1 13.64 14.87 13.56C14.65 13.47 14.48 13.43 14.32 13.68C14.15 13.93 13.68 14.49 13.53 14.66C13.39 14.82 13.24 14.85 12.99 14.72C12.74 14.6 11.94 14.33 10.99 13.49C10.25 12.83 9.75 12.02 9.61 11.77C9.46 11.52 9.59 11.39 9.72 11.26C9.83 11.15 9.97 10.97 10.1 10.82C10.22 10.68 10.27 10.57 10.35 10.4C10.43 10.24 10.39 10.1 10.33 9.98C10.27 9.85 9.77 8.63 9.57 8.13C9.37 7.64 9.17 7.71 9.02 7.7C8.88 7.69 8.71 7.69 8.55 7.69C8.38 7.69 8.11 7.75 7.88 8C7.65 8.25 7.02 8.84 7.02 10.05C7.02 11.26 7.9 12.43 8.02 12.59C8.15 12.76 9.75 15.22 12.21 16.28C12.79 16.53 13.25 16.68 13.6 16.79C14.19 16.98 14.72 16.95 15.15 16.89C15.62 16.82 16.59 16.3 16.79 15.73C17 15.16 17 14.67 16.93 14.57C16.86 14.47 16.72 14.41 16.57 14.37Z" />
					</svg>
				</a>
			</div>
		</>
	)
}
