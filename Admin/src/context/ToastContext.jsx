import React, { createContext, useContext, useState, useCallback } from 'react'
import { IconCheck, IconAlert, IconClose } from '@/components/Icons'
import ConfirmModal from '@/components/ConfirmModal'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([])
	const [confirmState, setConfirmState] = useState(null)

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	const showToast = useCallback((message, type = 'success', duration = 3500) => {
		const id = Date.now() + Math.random()
		setToasts((prev) => [...prev, { id, message, type }])

		if (duration > 0) {
			setTimeout(() => {
				removeToast(id)
			}, duration)
		}
	}, [removeToast])

	const confirmAction = useCallback(({
		title = 'Confirm Deletion',
		message = 'Are you sure you want to delete this item? This action cannot be undone.',
		confirmText = 'Yes, Delete',
		cancelText = 'Cancel',
		confirmColor = '#dc2626',
		onConfirm
	}) => {
		setConfirmState({
			isOpen: true,
			title,
			message,
			confirmText,
			cancelText,
			confirmColor,
			onConfirm: async () => {
				setConfirmState(null)
				if (onConfirm) await onConfirm()
			},
			onCancel: () => setConfirmState(null)
		})
	}, [])

	return (
		<ToastContext.Provider value={{ showToast, confirmAction }}>
			{children}

			{/* Global Confirm Modal */}
			{confirmState && (
				<ConfirmModal
					isOpen={confirmState.isOpen}
					title={confirmState.title}
					message={confirmState.message}
					confirmText={confirmState.confirmText}
					cancelText={confirmState.cancelText}
					confirmColor={confirmState.confirmColor}
					onConfirm={confirmState.onConfirm}
					onCancel={confirmState.onCancel}
				/>
			)}

			{/* Toast Container */}
			<div
				style={{
					position: 'fixed',
					top: '24px',
					right: '24px',
					zIndex: 999999,
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
					pointerEvents: 'none',
					maxWidth: '380px',
					width: 'calc(100% - 48px)'
				}}
			>
				{toasts.map((t) => {
					const isSuccess = t.type === 'success'
					const isError = t.type === 'error'
					return (
						<div
							key={t.id}
							style={{
								pointerEvents: 'auto',
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								padding: '13px 16px',
								borderRadius: '14px',
								background: '#ffffff',
								border: isSuccess ? '1.5px solid #86efac' : isError ? '1.5px solid #fca5a5' : '1.5px solid #cbd5e1',
								borderLeft: isSuccess ? '5px solid #16a34a' : isError ? '5px solid #dc2626' : '5px solid #d97706',
								boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
								animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
								color: '#0f172a',
								fontSize: '13.5px',
								fontWeight: '600'
							}}
						>
							<span
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: '26px',
									height: '26px',
									borderRadius: '50%',
									background: isSuccess ? '#ecfdf5' : isError ? '#fef2f2' : '#fefce8',
									color: isSuccess ? '#16a34a' : isError ? '#dc2626' : '#d97706',
									flexShrink: 0
								}}
							>
								{isSuccess ? <IconCheck size={16} /> : <IconAlert size={16} />}
							</span>
							<span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
							<button
								onClick={() => removeToast(t.id)}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									color: '#94a3b8',
									padding: '4px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0
								}}
							>
								<IconClose size={15} />
							</button>
						</div>
					)
				})}
			</div>
			<style>{`
				@keyframes toastSlideIn {
					from {
						opacity: 0;
						transform: translateX(40px) scale(0.95);
					}
					to {
						opacity: 1;
						transform: translateX(0) scale(1);
					}
				}
			`}</style>
		</ToastContext.Provider>
	)
}

export const useToast = () => {
	const ctx = useContext(ToastContext)
	if (!ctx) {
		return {
			showToast: (msg) => console.log('Toast:', msg),
			confirmAction: ({ onConfirm }) => onConfirm && onConfirm()
		}
	}
	return ctx
}
