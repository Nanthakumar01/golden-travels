import React, { useState, useRef } from 'react'
import { uploadImage } from '@/services/api'
import { useToast } from '@/context/ToastContext'

export const isVideoUrl = (url) => {
	if (!url || typeof url !== 'string') return false
	return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

export default function ImageUploader({
	value,
	onChange,
	label = 'Upload Image',
	resolution = '',
	placeholder = 'e.g. /assets/images/tour/1.jpg or drag file here',
	required = false,
	accept = 'image/*'
}) {
	const { showToast } = useToast()
	const [isDragging, setIsDragging] = useState(false)
	const [uploading, setUploading] = useState(false)
	const fileInputRef = useRef(null)

	const allowsVideo = accept.includes('video')
	const allowsImage = accept.includes('image')
	const isVideoOnly = allowsVideo && !allowsImage

	// Clean out any hardcoded localhost URL
	const cleanPath = (p) => {
		if (!p) return ''
		return p.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '')
	}

	const handleFile = async (file) => {
		if (!file) return
		const isImg = file.type.startsWith('image/')
		const isVid = file.type.startsWith('video/')

		if (isVideoOnly && !isVid) {
			showToast('Please upload a video file (MP4, WebM, MOV)', 'error')
			return
		}
		if (!allowsVideo && !isImg) {
			showToast('Please upload an image file (JPG, PNG, WebP)', 'error')
			return
		}
		if (!isImg && !isVid) {
			showToast('Please upload a valid image or video file', 'error')
			return
		}

		setUploading(true)
		try {
			const res = await uploadImage(file)
			if (res.success && (res.relativeUrl || res.url)) {
				const finalUrl = cleanPath(res.relativeUrl || res.url)
				onChange(finalUrl)
				showToast(`${isVid ? 'Video' : 'Image'} uploaded successfully!`, 'success')
			} else {
				showToast('Upload failed', 'error')
			}
		} catch (err) {
			showToast(err.message || 'Upload failed', 'error')
		} finally {
			setUploading(false)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		setIsDragging(false)
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0])
		}
	}

	const handleDragOver = (e) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const valueIsVideo = isVideoUrl(value)

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
			{label && (
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
					<label
						style={{
							display: 'block',
							fontSize: '11.5px',
							fontWeight: '700',
							color: '#475569',
							textTransform: 'uppercase'
						}}
					>
						{label}
						{required && <span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>}
					</label>
					{resolution && (
						<span style={{ fontSize: '11px', fontWeight: '700', color: '#047857', background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<polyline points="21 15 16 10 5 21" />
							</svg>
							<span>All sizes allowed • Suitable size: {resolution}</span>
						</span>
					)}
				</div>
			)}

			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				style={{
					border: isDragging ? '2px dashed #16a34a' : (required && !value ? '1.5px dashed #f87171' : '1.5px dashed #cbd5e1'),
					background: isDragging ? '#f0fdf4' : (required && !value ? '#fffafa' : '#f8fafc'),
					borderRadius: '12px',
					padding: '12px 14px',
					transition: 'all 0.2s ease',
					position: 'relative'
				}}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept={accept}
					style={{ display: 'none' }}
					onChange={(e) => {
						if (e.target.files && e.target.files[0]) {
							handleFile(e.target.files[0])
						}
						e.target.value = ''
					}}
				/>

				{/* If media exists, show thumbnail preview and actions without raw text box */}
				{value ? (
					<div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
						<div
							style={{
								width: '76px',
								height: '58px',
								borderRadius: '8px',
								overflow: 'hidden',
								border: '1.5px solid #e2e8f0',
								background: '#0f172a',
								flexShrink: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
							}}
						>
							{valueIsVideo ? (
								<video
									src={value}
									muted
									playsInline
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<img
									src={value}
									alt="Preview"
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									onError={(e) => {
										e.target.style.display = 'none'
									}}
								/>
							)}
						</div>

						{/* Hidden input to ensure value persists cleanly in DOM if needed */}
						<input type="hidden" value={cleanPath(value)} />

						<div style={{ flex: 1, minWidth: 0 }}>
							<div style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								{cleanPath(value).split('/').pop()}
							</div>
							<div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploading}
									style={{
										background: '#f0fdf4',
										border: '1px solid #bbf7d0',
										padding: '5px 10px',
										borderRadius: '6px',
										color: '#16a34a',
										fontSize: '11.5px',
										fontWeight: '700',
										cursor: 'pointer',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '4px',
										whiteSpace: 'nowrap'
									}}
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
									<span>{uploading ? 'Uploading...' : `Change ${valueIsVideo ? 'Video' : 'Photo'}`}</span>
								</button>
								<button
									type="button"
									onClick={() => onChange('')}
									style={{
										background: '#fef2f2',
										border: '1px solid #fecaca',
										padding: '5px 10px',
										borderRadius: '6px',
										color: '#dc2626',
										fontSize: '11.5px',
										fontWeight: '700',
										cursor: 'pointer',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '4px',
										whiteSpace: 'nowrap'
									}}
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
									<span>Remove</span>
								</button>
							</div>
						</div>
					</div>
				) : (
					/* Dropzone empty state */
					<div
						onClick={() => fileInputRef.current?.click()}
						style={{
							cursor: 'pointer',
							textAlign: 'center',
							padding: '10px 4px'
						}}
					>
						<div style={{ color: required ? '#dc2626' : '#16a34a', marginBottom: '4px' }}>
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
						</div>
						<div style={{ fontSize: '12.5px', fontWeight: '700', color: required ? '#dc2626' : '#334155' }}>
							{uploading
								? 'Uploading...'
								: required
									? `Upload ${isVideoOnly ? 'Video' : 'Image'} * (Required)`
									: `Drag & drop ${isVideoOnly ? 'video' : 'image'} here, or Browse`}
						</div>
						<div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
							<span>{isVideoOnly ? 'Supports MP4, WebM, MOV' : 'Supports JPG, PNG, WebP'}</span>
							{resolution && <span style={{ color: '#047857', fontWeight: '700' }}>• All sizes allowed (Suitable: {resolution})</span>}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

