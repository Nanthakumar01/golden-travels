import React from 'react'

export const IconTrophy = ({ size = 26, color = '#fbbf24', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
		<path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
		<path d="M4 22h16" />
		<path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
		<path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill={`${color}22`} />
	</svg>
)

export const IconPlane = ({ size = 26, color = '#60a5fa', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill={`${color}22`} />
	</svg>
)

export const IconGlobe = ({ size = 26, color = '#38bdf8', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" fill={`${color}15`} />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
)

export const IconStar = ({ size = 24, color = '#eab308', filled = true, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
	</svg>
)

export const IconTarget = ({ size = 28, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="12" r="6" fill={`${color}22`} />
		<circle cx="12" cy="12" r="2" fill={color} />
	</svg>
)

export const IconChat = ({ size = 28, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill={`${color}22`} />
		<circle cx="9" cy="10" r="1" fill={color} />
		<circle cx="12" cy="10" r="1" fill={color} />
		<circle cx="15" cy="10" r="1" fill={color} />
	</svg>
)

export const IconDiamond = ({ size = 28, color = '#38bdf8', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M6 3h12l4 7-10 11L2 10l4-7z" fill={`${color}22`} />
		<path d="M12 21 2 10h20L12 21z" />
		<path d="M6 3 12 10 18 3" />
	</svg>
)

export const IconPassport = ({ size = 28, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect x="4" y="2" width="16" height="20" rx="3" fill={`${color}22`} />
		<circle cx="12" cy="10" r="3.5" />
		<path d="M9 16.5h6" />
		<path d="M8 20h8" />
	</svg>
)

export const IconShield = ({ size = 18, color = '#22c55e', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={`${color}22`} />
		<polyline points="9 12 11 14 15 10" />
	</svg>
)

export const IconCheck = ({ size = 16, color = '#16a34a', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<polyline points="20 6 9 17 4 12" />
	</svg>
)

export const IconClose = ({ size = 16, color = '#ef4444', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
)

export const IconCalendar = ({ size = 14, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
		<line x1="16" y1="2" x2="16" y2="6" />
		<line x1="8" y1="2" x2="8" y2="6" />
		<line x1="3" y1="10" x2="21" y2="10" />
	</svg>
)

export const IconLocation = ({ size = 14, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
)

export const IconPhone = ({ size = 14, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
	</svg>
)

export const IconMail = ({ size = 14, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
		<polyline points="22,6 12,13 2,6" />
	</svg>
)

export const IconLock = ({ size = 13, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
)

export const IconSearch = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
)

export const IconCheckCircle = ({ size = 46, color = '#16a34a', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" fill={`${color}15`} />
		<polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
	</svg>
)

export const IconIndiaFlag = ({ size = 15, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
		<rect x="2" y="4" width="20" height="5" rx="1" fill="#FF9933" />
		<rect x="2" y="9.5" width="20" height="5" fill="#FFFFFF" />
		<rect x="2" y="15" width="20" height="5" rx="1" fill="#138808" />
		<circle cx="12" cy="12" r="2" stroke="#000080" strokeWidth="1" fill="none" />
	</svg>
)

export const IconMeal = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M18 8h1a4 4 0 0 1 0 8h-1" />
		<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
		<line x1="6" y1="1" x2="6" y2="4" />
		<line x1="10" y1="1" x2="10" y2="4" />
		<line x1="14" y1="1" x2="14" y2="4" />
	</svg>
)

export const IconHotel = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
		<path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
		<line x1="9" y1="7" x2="9.01" y2="7" />
		<line x1="15" y1="7" x2="15.01" y2="7" />
		<line x1="9" y1="11" x2="9.01" y2="11" />
		<line x1="15" y1="11" x2="15.01" y2="11" />
	</svg>
)

export const IconBus = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect x="4" y="3" width="16" height="16" rx="2" />
		<line x1="4" y1="11" x2="20" y2="11" />
		<circle cx="8" cy="15" r="1" fill={color} />
		<circle cx="16" cy="15" r="1" fill={color} />
		<line x1="6" y1="19" x2="6" y2="21" />
		<line x1="18" y1="19" x2="18" y2="21" />
	</svg>
)

export const IconSightseeing = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="6" cy="14" r="4" />
		<circle cx="18" cy="14" r="4" />
		<line x1="10" y1="14" x2="14" y2="14" />
		<path d="M8 10.5 10 4h4l2 6.5" />
	</svg>
)

export const IconMap = ({ size = 16, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
		<line x1="8" y1="2" x2="8" y2="18" />
		<line x1="16" y1="6" x2="16" y2="22" />
	</svg>
)

export const IconSparkles = ({ size = 16, color = '#eab308', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="m12 3 1.912 4.673a2 2 0 0 0 1.088 1.088L19.673 10.7a.5.5 0 0 1 0 .946l-4.673 1.912a2 2 0 0 0-1.088 1.088L12 19.317a.5.5 0 0 1-.946 0l-1.912-4.673a2 2 0 0 0-1.088-1.088L3.381 11.646a.5.5 0 0 1 0-.946l4.673-1.912a2 2 0 0 0 1.088-1.088L11.054 3.027a.5.5 0 0 1 .946 0Z" />
		<path d="M19 16l.5 1.5 1.5.5-1.5.5L19 20l-.5-1.5-1.5-.5 1.5-.5z" />
	</svg>
)

export const IconAuthor = ({ size = 14, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
)

export const IconCompass = ({ size = 15, color = 'currentColor', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" />
		<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} />
	</svg>
)

export const IconHome = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={`${color}22`} />
		<polyline points="9 22 9 12 15 12 15 22" />
	</svg>
)

export const IconClock = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" fill={`${color}22`} />
		<polyline points="12 6 12 12 16 14" />
	</svg>
)

export const IconHeadphones = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M3 18v-6a9 9 0 0 1 18 0v6" />
		<path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill={`${color}22`} />
	</svg>
)

export const IconHeart = ({ size = 26, color = '#f87171', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	</svg>
)

/**
 * Helper to dynamically render a high-quality SVG icon for Trust Stats (20+ Years, Happy Travelers, etc.)
 */
export const IconUsers = ({ size = 26, color = '#38bdf8', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" fill={`${color}22`} />
		<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</svg>
)

export const IconLuggage = ({ size = 26, color = '#38bdf8', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect x="6" y="7" width="12" height="13" rx="2" fill={`${color}22`} />
		<path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
		<line x1="10" y1="12" x2="10" y2="15" />
		<line x1="14" y1="12" x2="14" y2="15" />
	</svg>
)

export const IconCamera = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill={`${color}22`} />
		<circle cx="12" cy="13" r="4" />
	</svg>
)

export const IconMountain = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="m8 3 4 8 5-5 5 15H2L8 3z" fill={`${color}22`} />
	</svg>
)

export const IconBeach = ({ size = 26, color = '#38bdf8', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M12 2a9 9 0 0 1 9 9c0 4-3 7-9 7s-9-3-9-7a9 9 0 0 1 9-9Z" fill={`${color}22`} />
		<path d="M12 2v19" />
		<path d="M4 14a8.5 8.5 0 0 0 16 0" />
	</svg>
)

export const IconCar = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M5 17h14v-5l-2-6H7L5 12v5z" fill={`${color}22`} />
		<circle cx="7.5" cy="17.5" r="2.5" fill={color} />
		<circle cx="16.5" cy="17.5" r="2.5" fill={color} />
	</svg>
)

export const IconTicket = ({ size = 26, color = '#4ade80', ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M2 9a3 3 0 0 1 0 6v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 1 0-6V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4z" fill={`${color}22`} />
		<line x1="9" y1="3" x2="9" y2="21" strokeDasharray="3 3" />
	</svg>
)

/**
 * Helper to dynamically render a high-quality SVG icon for Trust Stats (20+ Years, Happy Travelers, etc.)
 */
export const renderTrustStatIcon = (rawIcon = '', label = '', size = 28) => {
	const raw = (rawIcon || '').trim()
	const iconKey = raw.toLowerCase()
	const labelKey = (label || '').trim().toLowerCase()

	// 1. If it's a custom uploaded image/svg path
	if (raw.startsWith('/') || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:image')) {
		return <img src={raw} alt="" style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }} />
	}

	// 2. Strictly check rawIcon first
	if (iconKey === 'trophy' || iconKey === 'award' || iconKey === 'excellence' || iconKey === 'year' || iconKey === '🏆') {
		return <IconTrophy size={size} color="#fbbf24" />
	}
	if (iconKey === 'users' || iconKey === 'people' || iconKey === 'family' || iconKey === 'group' || iconKey === 'traveler' || iconKey === 'travelers' || iconKey === 'tourist' || iconKey === 'tourists' || iconKey === '👥' || iconKey === '👨‍👩‍👦') {
		return <IconUsers size={size} color="#38bdf8" />
	}
	if (iconKey === 'plane' || iconKey === 'flight' || iconKey === 'fly' || iconKey === 'air' || iconKey === '✈️' || iconKey === '✈') {
		return <IconPlane size={size} color="#38bdf8" />
	}
	if (iconKey === 'globe' || iconKey === 'destin' || iconKey === 'world' || iconKey === 'earth' || iconKey === 'international' || iconKey === '🌍' || iconKey === '🌎' || iconKey === '🌐') {
		return <IconGlobe size={size} color="#22c55e" />
	}
	if (iconKey === 'star' || iconKey === 'rating' || iconKey === 'review' || iconKey === '⭐' || iconKey === '★' || iconKey === '🌟') {
		return <IconStar size={size} color="#eab308" />
	}
	if (iconKey === 'luggage' || iconKey === 'baggage' || iconKey === 'suitcase' || iconKey === '🧳') {
		return <IconLuggage size={size} color="#38bdf8" />
	}
	if (iconKey === 'shield' || iconKey === 'safe' || iconKey === 'trust' || iconKey === '🛡️') {
		return <IconShield size={size} color="#22c55e" />
	}
	if (iconKey === 'clock' || iconKey === 'time' || iconKey === '24/7' || iconKey === '⏱️') {
		return <IconClock size={size} color="#22c55e" />
	}
	if (iconKey === 'heart' || iconKey === 'care' || iconKey === 'satisfaction' || iconKey === '❤️') {
		return <IconHeart size={size} color="#f87171" />
	}
	if (iconKey === 'target' || iconKey === 'milestone' || iconKey === 'goal' || iconKey === '🎯') {
		return <IconTarget size={size} color="#4ade80" />
	}
	if (iconKey === 'camera' || iconKey === 'photo' || iconKey === '📷' || iconKey === '📸') {
		return <IconCamera size={size} color="#4ade80" />
	}
	if (iconKey === 'mountain' || iconKey === 'trek' || iconKey === '🏔️' || iconKey === '⛰️') {
		return <IconMountain size={size} color="#4ade80" />
	}
	if (iconKey === 'beach' || iconKey === 'island' || iconKey === 'resort' || iconKey === '🏖️' || iconKey === '🏝️') {
		return <IconBeach size={size} color="#38bdf8" />
	}
	if (iconKey === 'hotel' || iconKey === 'stays' || iconKey === '🏨') {
		return <IconHotel size={size} color="#4ade80" />
	}
	if (iconKey === 'passport' || iconKey === 'visa' || iconKey === '🛂') {
		return <IconPassport size={size} color="#4ade80" />
	}
	if (iconKey === 'car' || iconKey === 'cab' || iconKey === 'taxi' || iconKey === 'transfers' || iconKey === '🚗') {
		return <IconCar size={size} color="#4ade80" />
	}
	if (iconKey === 'ticket' || iconKey === 'pass' || iconKey === 'booking' || iconKey === '🎟️') {
		return <IconTicket size={size} color="#4ade80" />
	}

	// 3. If raw is provided (any custom emoji or symbol), render it directly!
	if (raw) {
		return <span style={{ fontSize: `${Math.round(size * 0.9)}px`, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{raw}</span>
	}

	// 4. Fallback to label keyword matching ONLY when no icon is provided
	if (labelKey.includes('year') || labelKey.includes('excellence') || labelKey.includes('award') || labelKey.includes('trophy')) {
		return <IconTrophy size={size} color="#fbbf24" />
	}
	if (labelKey.includes('traveler') || labelKey.includes('customer') || labelKey.includes('family') || labelKey.includes('tourist')) {
		return <IconUsers size={size} color="#38bdf8" />
	}
	if (labelKey.includes('destin') || labelKey.includes('country') || labelKey.includes('world') || labelKey.includes('globe')) {
		return <IconGlobe size={size} color="#22c55e" />
	}
	if (labelKey.includes('rating') || labelKey.includes('review') || labelKey.includes('star') || labelKey.includes('google')) {
		return <IconStar size={size} color="#eab308" />
	}

	return <IconShield size={size} color="#10b981" />
}

/**
 * Helper to dynamically render a high-quality SVG icon for Why Choose Us features (100% Customized, Concierge, Pricing, Visa, etc.)
 */
export const renderFeatureIcon = (rawIcon = '', title = '', size = 28) => {
	const raw = (rawIcon || '').trim()
	const iconKey = raw.toLowerCase()
	const titleKey = (title || '').trim().toLowerCase()

	// 1. If it's a custom uploaded image/svg path
	if (raw.startsWith('/') || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:image')) {
		return <img src={raw} alt="" style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }} />
	}

	// 2. Strictly check rawIcon first for preset SVG icons
	if (iconKey === 'target' || iconKey === 'custom' || iconKey === '🎯') {
		return <IconTarget size={size} color="#4ade80" />
	}
	if (iconKey === 'chat' || iconKey === 'concierge' || iconKey === 'support' || iconKey === 'whatsapp' || iconKey === 'message' || iconKey === '💬' || iconKey === '🗨️') {
		return <IconChat size={size} color="#4ade80" />
	}
	if (iconKey === 'diamond' || iconKey === 'pricing' || iconKey === 'price' || iconKey === 'cost' || iconKey === 'gem' || iconKey === '💎') {
		return <IconDiamond size={size} color="#38bdf8" />
	}
	if (iconKey === 'passport' || iconKey === 'visa' || iconKey === 'document' || iconKey === 'id' || iconKey === '🛂' || iconKey === '🛃') {
		return <IconPassport size={size} color="#4ade80" />
	}
	if (iconKey === 'home' || iconKey === 'house' || iconKey === 'stay' || iconKey === 'villa' || iconKey === '🏠' || iconKey === '🏡') {
		return <IconHome size={size} color="#4ade80" />
	}
	if (iconKey === 'hotel' || iconKey === 'resort' || iconKey === 'building' || iconKey === '🏨') {
		return <IconHotel size={size} color="#4ade80" />
	}
	if (iconKey === 'phone' || iconKey === 'call' || iconKey === 'helpline' || iconKey === '📞' || iconKey === '📱') {
		return <IconPhone size={size} color="#4ade80" />
	}
	if (iconKey === 'clock' || iconKey === 'time' || iconKey === '24/7' || iconKey === 'hour' || iconKey === '⏱️' || iconKey === '🕒' || iconKey === '⏰') {
		return <IconClock size={size} color="#4ade80" />
	}
	if (iconKey === 'headphones' || iconKey === 'headset' || iconKey === 'agent' || iconKey === 'guide' || iconKey === '🎧') {
		return <IconHeadphones size={size} color="#4ade80" />
	}
	if (iconKey === 'shield' || iconKey === 'safe' || iconKey === 'security' || iconKey === 'trust' || iconKey === 'guarantee' || iconKey === 'verified' || iconKey === '🛡️' || iconKey === '🔒') {
		return <IconShield size={size} color="#4ade80" />
	}
	if (iconKey === 'plane' || iconKey === 'flight' || iconKey === 'fly' || iconKey === 'air' || iconKey === '✈️' || iconKey === '🛫') {
		return <IconPlane size={size} color="#38bdf8" />
	}
	if (iconKey === 'globe' || iconKey === 'world' || iconKey === 'earth' || iconKey === 'international' || iconKey === 'destination' || iconKey === '🌍' || iconKey === '🌎' || iconKey === '🌐') {
		return <IconGlobe size={size} color="#4ade80" />
	}
	if (iconKey === 'star' || iconKey === 'rating' || iconKey === 'review' || iconKey === '⭐' || iconKey === '★' || iconKey === '🌟') {
		return <IconStar size={size} color="#eab308" />
	}
	if (iconKey === 'trophy' || iconKey === 'award' || iconKey === 'excellence' || iconKey === '🏆') {
		return <IconTrophy size={size} color="#fbbf24" />
	}
	if (iconKey === 'users' || iconKey === 'people' || iconKey === 'traveler' || iconKey === 'family' || iconKey === 'group' || iconKey === '👥' || iconKey === '👨‍👩‍👦') {
		return <IconUsers size={size} color="#38bdf8" />
	}
	if (iconKey === 'luggage' || iconKey === 'baggage' || iconKey === 'suitcase' || iconKey === '🧳') {
		return <IconLuggage size={size} color="#38bdf8" />
	}
	if (iconKey === 'camera' || iconKey === 'photo' || iconKey === 'sightseeing' || iconKey === '📷' || iconKey === '📸') {
		return <IconCamera size={size} color="#4ade80" />
	}
	if (iconKey === 'mountain' || iconKey === 'trek' || iconKey === 'hiking' || iconKey === '🏔️' || iconKey === '⛰️') {
		return <IconMountain size={size} color="#4ade80" />
	}
	if (iconKey === 'beach' || iconKey === 'island' || iconKey === 'sea' || iconKey === 'ocean' || iconKey === '🏖️' || iconKey === '🏝️') {
		return <IconBeach size={size} color="#38bdf8" />
	}
	if (iconKey === 'car' || iconKey === 'cab' || iconKey === 'taxi' || iconKey === 'transfers' || iconKey === 'chauffeur' || iconKey === '🚗') {
		return <IconCar size={size} color="#4ade80" />
	}
	if (iconKey === 'ticket' || iconKey === 'pass' || iconKey === 'booking' || iconKey === 'train' || iconKey === '🎟️') {
		return <IconTicket size={size} color="#4ade80" />
	}
	if (iconKey === 'heart' || iconKey === 'love' || iconKey === 'honeymoon' || iconKey === 'care' || iconKey === 'romantic' || iconKey === '❤️' || iconKey === '💖') {
		return <IconHeart size={size} color="#f87171" />
	}
	if (iconKey === 'compass' || iconKey === 'explore' || iconKey === 'adventure' || iconKey === '🧭') {
		return <IconCompass size={size} color="#4ade80" />
	}
	if (iconKey === 'map' || iconKey === 'route' || iconKey === 'itinerary' || iconKey === '🗺️') {
		return <IconMap size={size} color="#4ade80" />
	}
	if (iconKey === 'sparkles' || iconKey === 'luxury' || iconKey === 'vip' || iconKey === 'magic' || iconKey === '✨') {
		return <IconSparkles size={size} color="#eab308" />
	}
	if (iconKey === 'check' || iconKey === 'approved' || iconKey === 'done' || iconKey === '✓' || iconKey === '✅') {
		return <IconCheck size={size} color="#4ade80" />
	}

	// 3. If user provided any emoji or custom character/icon, render it directly!
	if (raw) {
		return <span style={{ fontSize: `${Math.round(size * 0.9)}px`, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{raw}</span>
	}

	// 4. Fall back to title keywords ONLY when rawIcon was NOT provided by user
	if (titleKey.includes('custom') || titleKey.includes('tailor') || titleKey.includes('bespoke')) {
		return <IconTarget size={size} color="#4ade80" />
	}
	if (titleKey.includes('concierge') || titleKey.includes('support') || titleKey.includes('whatsapp') || titleKey.includes('24/7') || titleKey.includes('chat')) {
		return <IconChat size={size} color="#4ade80" />
	}
	if (titleKey.includes('pric') || titleKey.includes('transparent') || titleKey.includes('cost') || titleKey.includes('rate')) {
		return <IconDiamond size={size} color="#38bdf8" />
	}
	if (titleKey.includes('visa') || titleKey.includes('passport') || titleKey.includes('document')) {
		return <IconPassport size={size} color="#4ade80" />
	}
	if (titleKey.includes('stay') || titleKey.includes('resort') || titleKey.includes('hotel') || titleKey.includes('villa')) {
		return <IconHotel size={size} color="#4ade80" />
	}
	if (titleKey.includes('flight') || titleKey.includes('ticket') || titleKey.includes('airline')) {
		return <IconPlane size={size} color="#38bdf8" />
	}

	return <IconShield size={size} color="#4ade80" />
}
