import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '@/services/api'
import { IconEye, IconEyeOff, IconAlert, IconUser, IconLock } from '@/components/Icons'

export default function AdminLogin() {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [focusedField, setFocusedField] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		// Strictly reject leading or trailing spaces as invalid
		if (username !== username.trim() || password !== password.trim()) {
			setError('Invalid credentials')
			setLoading(false)
			return
		}

		if (!username || !password) {
			setError('Please enter both username and password.')
			setLoading(false)
			return
		}

		try {
			const res = await adminLogin(username, password)
			if (res.success && res.data.token) {
				localStorage.setItem('gt_admin_token', res.data.token)
				localStorage.setItem('gt_admin_user', JSON.stringify(res.data))
				navigate('/')
			} else {
				setError('Invalid credentials')
			}
		} catch (err) {
			setError(err.message || 'Invalid credentials')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'radial-gradient(ellipse at 50% -10%, rgba(229, 169, 30, 0.12) 0%, rgba(248, 250, 252, 0) 60%), radial-gradient(ellipse at 90% 90%, rgba(22, 163, 74, 0.06) 0%, rgba(248, 250, 252, 0) 50%), #f8fafc',
				padding: '24px 20px',
				fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Subtle decorative background circles */}
			<div
				style={{
					position: 'absolute',
					top: '-120px',
					left: '50%',
					transform: 'translateX(-50%)',
					width: '600px',
					height: '600px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(229, 169, 30, 0.06) 0%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)'
				}}
			/>

			<div
				style={{
					width: '100%',
					maxWidth: '430px',
					background: '#ffffff',
					border: '1px solid #e2e8f0',
					borderRadius: '24px',
					padding: '44px 36px 36px',
					boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(229, 169, 30, 0.08)',
					color: '#0f172a',
					position: 'relative',
					zIndex: 1
				}}
			>
				{/* Top subtle luxury accent line */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: '32px',
						right: '32px',
						height: '3.5px',
						background: 'linear-gradient(90deg, #E5A91E 0%, #16a34a 100%)',
						borderBottomLeftRadius: '4px',
						borderBottomRightRadius: '4px'
					}}
				/>

				{/* Brand Logo & Header */}
				<div style={{ textAlign: 'center', marginBottom: '32px' }}>
					<div
						style={{
							width: '74px',
							height: '74px',
							borderRadius: '50%',
							border: '2px solid #E5A91E',
							background: '#ffffff',
							margin: '0 auto 16px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '5px',
							boxShadow: '0 8px 24px rgba(229, 169, 30, 0.2)'
						}}
					>
						<img
							src="/assets/images/logo/golden-travels-emblem.png"
							alt="Golden Travels Emblem"
							style={{ width: '100%', height: '100%', objectFit: 'contain' }}
						/>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', lineHeight: 1, marginBottom: '10px' }}>
						<span style={{ color: '#D97706', fontWeight: '900', fontSize: '22px', letterSpacing: '0.04em' }}>GOLDEN</span>
						<span style={{ color: '#1B365D', fontWeight: '900', fontSize: '22px', letterSpacing: '0.04em' }}>TRAVELS</span>
					</div>

					<div>
						<span
							style={{
								display: 'inline-block',
								padding: '4px 14px',
								background: '#fef3c7',
								color: '#92400e',
								border: '1px solid #fde68a',
								borderRadius: '9999px',
								fontSize: '11px',
								fontWeight: '800',
								letterSpacing: '0.08em',
								textTransform: 'uppercase'
							}}
						>
							Admin Portal &amp; Management
						</span>
					</div>
				</div>

				{/* Error Notification */}
				{error && (
					<div
						style={{
							background: '#fef2f2',
							border: '1px solid #fecaca',
							color: '#dc2626',
							padding: '12px 14px',
							borderRadius: '12px',
							fontSize: '13px',
							marginBottom: '22px',
							lineHeight: 1.4,
							display: 'flex',
							alignItems: 'center',
							gap: '10px'
						}}
					>
						<IconAlert size={16} color="#dc2626" />
						<span>{error}</span>
					</div>
				)}

				{/* Login Form */}
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					{/* Username Field */}
					<div>
						<label
							htmlFor="admin-username"
							style={{
								display: 'block',
								fontSize: '12px',
								fontWeight: '700',
								color: '#475569',
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								marginBottom: '8px'
							}}
						>
							Admin Username
						</label>
						<div style={{ position: 'relative', width: '100%' }}>
							<span
								style={{
									position: 'absolute',
									left: '14px',
									top: '50%',
									transform: 'translateY(-50%)',
									display: 'flex',
									alignItems: 'center',
									color: focusedField === 'username' ? '#D97706' : '#94a3b8',
									transition: 'color 0.2s',
									pointerEvents: 'none'
								}}
							>
								<IconUser size={18} />
							</span>
							<input
								id="admin-username"
								type="text"
								required
								autoComplete="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								onFocus={() => setFocusedField('username')}
								onBlur={() => setFocusedField('')}
								placeholder="Enter username or email"
								style={{
									width: '100%',
									padding: '13px 16px 13px 42px',
									background: focusedField === 'username' ? '#ffffff' : '#f8fafc',
									border: focusedField === 'username' ? '1.5px solid #E5A91E' : '1.5px solid #e2e8f0',
									borderRadius: '12px',
									color: '#0f172a',
									fontSize: '14px',
									outline: 'none',
									boxSizing: 'border-box',
									boxShadow: focusedField === 'username' ? '0 0 0 3.5px rgba(229, 169, 30, 0.14)' : 'none',
									transition: 'all 0.2s ease'
								}}
							/>
						</div>
					</div>

					{/* Password Field */}
					<div>
						<label
							htmlFor="admin-password"
							style={{
								display: 'block',
								fontSize: '12px',
								fontWeight: '700',
								color: '#475569',
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								marginBottom: '8px'
							}}
						>
							Password
						</label>
						<div style={{ position: 'relative', width: '100%' }}>
							<span
								style={{
									position: 'absolute',
									left: '14px',
									top: '50%',
									transform: 'translateY(-50%)',
									display: 'flex',
									alignItems: 'center',
									color: focusedField === 'password' ? '#D97706' : '#94a3b8',
									transition: 'color 0.2s',
									pointerEvents: 'none'
								}}
							>
								<IconLock size={18} />
							</span>
							<input
								id="admin-password"
								type={showPassword ? 'text' : 'password'}
								required
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onFocus={() => setFocusedField('password')}
								onBlur={() => setFocusedField('')}
								placeholder="Enter your password"
								style={{
									width: '100%',
									padding: '13px 44px 13px 42px',
									background: focusedField === 'password' ? '#ffffff' : '#f8fafc',
									border: focusedField === 'password' ? '1.5px solid #E5A91E' : '1.5px solid #e2e8f0',
									borderRadius: '12px',
									color: '#0f172a',
									fontSize: '14px',
									outline: 'none',
									boxSizing: 'border-box',
									boxShadow: focusedField === 'password' ? '0 0 0 3.5px rgba(229, 169, 30, 0.14)' : 'none',
									transition: 'all 0.2s ease'
								}}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								title={showPassword ? 'Hide password' : 'Show password'}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								tabIndex={-1}
								style={{
									position: 'absolute',
									right: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									padding: '6px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#94a3b8',
									transition: 'color 0.2s'
								}}
								onMouseEnter={(e) => { e.currentTarget.style.color = '#15803d' }}
								onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
							>
								{showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						style={{
							marginTop: '6px',
							padding: '14px',
							borderRadius: '12px',
							border: 'none',
							background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
							color: '#ffffff',
							fontSize: '15px',
							fontWeight: '800',
							cursor: loading ? 'not-allowed' : 'pointer',
							boxShadow: '0 8px 20px rgba(22, 163, 74, 0.28)',
							transition: 'all 0.2s ease',
							opacity: loading ? 0.75 : 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px'
						}}
						onMouseEnter={(e) => {
							if (!loading) {
								e.currentTarget.style.transform = 'translateY(-1px)'
								e.currentTarget.style.boxShadow = '0 12px 24px rgba(22, 163, 74, 0.35)'
							}
						}}
						onMouseLeave={(e) => {
							if (!loading) {
								e.currentTarget.style.transform = 'translateY(0)'
								e.currentTarget.style.boxShadow = '0 8px 20px rgba(22, 163, 74, 0.28)'
							}
						}}
					>
						{loading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				{/* Subtle Security Badge */}
				<div
					style={{
						marginTop: '28px',
						paddingTop: '20px',
						borderTop: '1px solid #f1f5f9',
						textAlign: 'center',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '6px',
						fontSize: '12px',
						color: '#94a3b8'
					}}
				>
					
				</div>
			</div>
		</div>
	)
}
