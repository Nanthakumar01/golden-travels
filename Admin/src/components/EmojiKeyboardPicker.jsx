import React, { useState } from 'react'
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react'

const LEGACY_EMOJI_MAP = {
	plane: '✈️',
	flight: '✈️',
	airline: '✈️',
	globe: '🌐',
	world: '🌐',
	hotel: '🏨',
	stay: '🏨',
	building: '🏛️',
	palace: '🏛️',
	train: '🚆',
	rail: '🚆',
	star: '⭐',
	crown: '👑',
	diamond: '💎',
	cruise: '🛳️',
	ship: '🛳️',
	palm: '🌴',
	beach: '🏖️',
	target: '🎯',
	custom: '🎯',
	chat: '💬',
	support: '💬',
	users: '👥',
	traveler: '👥',
	trophy: '🏆',
	award: '🏆',
	shield: '🛡️',
	safe: '🛡️',
	trust: '🛡️',
	luggage: '🧳',
	camera: '📷',
	mountain: '🏔️',
	car: '🚗',
	cab: '🚗',
	ticket: '🎟️',
	pass: '🎟️',
	phone: '📞',
	clock: '⏱️',
	headphones: '🎧',
	compass: '🧭',
	sparkles: '✨'
}

export const getDisplayEmoji = (val) => {
	if (!val) return '✈️'
	const clean = val.trim().toLowerCase()
	return LEGACY_EMOJI_MAP[clean] || val
}

export default function EmojiKeyboardPicker({ value, onChange }) {
	const [isOpen, setIsOpen] = useState(false)
	const displayEmoji = getDisplayEmoji(value)

	const handleEmojiClick = (emojiData) => {
		if (emojiData && emojiData.emoji) {
			onChange(emojiData.emoji)
		}
		setIsOpen(false)
	}

	return (
		<div style={{ position: 'relative', width: '100%' }}>
			{/* Clean Responsive Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				title="Click to open full Emoji Keyboard"
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '10px',
					padding: '9px 14px',
					borderRadius: '10px',
					border: '1.5px solid #16a34a',
					background: '#f0fdf4',
					cursor: 'pointer',
					transition: 'all 0.2s ease',
					minHeight: '42px',
					boxSizing: 'border-box'
				}}
			>
				<span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13.5px', color: '#166534' }}>
					<span style={{ fontSize: '20px', lineHeight: 1 }}>{displayEmoji}</span>
					<span>Choose Emoji</span>
				</span>
				<span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"/></svg>
					<span>Keyboard</span>
				</span>
			</button>

			{/* FULLY RESPONSIVE CENTERED EMOJI PICKER MODAL */}
			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(15, 23, 42, 0.55)',
						backdropFilter: 'blur(3px)',
						zIndex: 100000,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '16px',
						boxSizing: 'border-box'
					}}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						style={{
							background: '#ffffff',
							borderRadius: '20px',
							boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
							width: '100%',
							maxWidth: '360px',
							maxHeight: '90vh',
							display: 'flex',
							flexDirection: 'column',
							overflow: 'hidden',
							animation: 'fadeInScale 0.18s ease'
						}}
					>
						{/* Header with Title and Close Button */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '12px 16px',
								background: '#f8fafc',
								borderBottom: '1px solid #e2e8f0'
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
								<span style={{ fontSize: '20px', lineHeight: 1 }}>{displayEmoji}</span>
								<span>Select Badge Emoji</span>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								style={{
									border: 'none',
									background: '#e2e8f0',
									width: '28px',
									height: '28px',
									borderRadius: '50%',
									color: '#475569',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '13px',
									fontWeight: 'bold',
									padding: 0
								}}
							>
								✕
							</button>
						</div>

						{/* Full Gboard Emoji Picker */}
						<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
							<EmojiPicker
								onEmojiClick={handleEmojiClick}
								theme={Theme.LIGHT}
								emojiStyle={EmojiStyle.NATIVE}
								searchPlaceHolder="Search emoji..."
								width="100%"
								height={380}
								lazyLoadEmojis={true}
								previewConfig={{ showPreview: false }}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
