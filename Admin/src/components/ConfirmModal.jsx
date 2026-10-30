import React, { useEffect } from 'react'
import { IconTrash, IconClose } from '@/components/Icons'

export default function ConfirmModal({
	isOpen = false,
	title = 'Are you sure?',
	message = 'This action cannot be undone.',
	confirmText = 'Yes, Delete',
	cancelText = 'Cancel',
	confirmColor = '#dc2626',
	onConfirm,
	onCancel
}) {
	// Close on Escape key
	useEffect(() => {
		if (!isOpen) return
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onCancel && onCancel()
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onCancel])

	if (!isOpen) return null

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(15, 23, 42, 0.65)',
				backdropFilter: 'blur(5px)',
				zIndex: 9999999,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '20px',
				animation: 'confirmFadeIn 0.2s ease-out'
			}}
			onClick={onCancel}
		>
			<style>{`
				@keyframes confirmFadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes confirmPopIn {
					from { opacity: 0; transform: scale(0.92) translateY(8px); }
					to { opacity: 1; transform: scale(1) translateY(0); }
				}
			`}</style>
			<div
				style={{
					background: '#ffffff',
					borderRadius: '22px',
					maxWidth: '430px',
					width: '100%',
					padding: '28px',
					boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
					border: '1px solid #e2e8f0',
					position: 'relative',
					animation: 'confirmPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close "X" Button */}
				<button
					type="button"
					onClick={onCancel}
					title="Cancel"
					style={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						background: '#f1f5f9',
						border: 'none',
						width: '32px',
						height: '32px',
						borderRadius: '10px',
						color: '#64748b',
						cursor: 'pointer',
						display: 'grid',
						placeItems: 'center',
						transition: 'all 0.15s ease'
					}}
				>
					<IconClose size={16} />
				</button>

				{/* Danger / Warning Icon */}
				<div
					style={{
						width: '52px',
						height: '52px',
						borderRadius: '16px',
						background: '#fee2e2',
						color: '#dc2626',
						display: 'grid',
						placeItems: 'center',
						marginBottom: '18px'
					}}
				>
					<IconTrash size={24} color="#dc2626" />
				</div>

				{/* Title */}
				<h3
					style={{
						margin: '0 0 8px',
						fontSize: '19px',
						fontWeight: '800',
						color: '#0f172a',
						lineHeight: 1.3
					}}
				>
					{title}
				</h3>

				{/* Message */}
				<p
					style={{
						margin: '0 0 24px',
						fontSize: '13.5px',
						color: '#64748b',
						lineHeight: 1.55
					}}
				>
					{message}
				</p>

				{/* Actions */}
				<div
					style={{
						display: 'flex',
						gap: '12px',
						justifyContent: 'flex-end',
						alignItems: 'center'
					}}
				>
					<button
						type="button"
						onClick={onCancel}
						style={{
							padding: '10px 18px',
							background: '#f1f5f9',
							border: '1px solid #cbd5e1',
							borderRadius: '10px',
							color: '#475569',
							fontWeight: '700',
							fontSize: '13px',
							cursor: 'pointer',
							transition: 'all 0.15s ease'
						}}
					>
						{cancelText}
					</button>

					<button
						type="button"
						onClick={onConfirm}
						style={{
							padding: '10px 22px',
							background: confirmColor,
							border: 'none',
							borderRadius: '10px',
							color: '#ffffff',
							fontWeight: '800',
							fontSize: '13px',
							cursor: 'pointer',
							display: 'inline-flex',
							alignItems: 'center',
							gap: '6px',
							boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
							transition: 'all 0.15s ease'
						}}
					>
						<IconTrash size={14} color="#ffffff" />
						<span>{confirmText}</span>
					</button>
				</div>
			</div>
		</div>
	)
}
