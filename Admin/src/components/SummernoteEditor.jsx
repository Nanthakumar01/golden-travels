import React, { useRef, useState, useEffect } from 'react'

/**
 * Summernote-style WYSIWYG Rich Text Editor for Admin
 * Supports: Bold, Italic, Underline, Strikethrough, Heading H2/H3, Bullet & Numbered lists,
 * Link Insertion (with URL & text & new tab), Unlink, and Code View (HTML mode) toggle!
 */
export default function SummernoteEditor({
	value = '',
	onChange,
	placeholder = 'Write content here...',
	minHeight = 160,
	maxLength = 8000
}) {
	const editorRef = useRef(null)
	const [isCodeView, setIsCodeView] = useState(false)
	const [showLinkModal, setShowLinkModal] = useState(false)
	const [linkText, setLinkText] = useState('')
	const [linkUrl, setLinkUrl] = useState('')
	const [openInNewTab, setOpenInNewTab] = useState(true)
	const savedSelectionRef = useRef(null)

	// Sync value into contentEditable when switching from outside, but don't overwrite if user is typing
	useEffect(() => {
		if (editorRef.current && !isCodeView) {
			if (editorRef.current.innerHTML !== (value || '')) {
				editorRef.current.innerHTML = value || ''
			}
		}
	}, [value, isCodeView])

	const handleInput = () => {
		if (editorRef.current) {
			const html = editorRef.current.innerHTML
			onChange(html === '<p><br></p>' || html === '<br>' ? '' : html)
		}
	}

	const saveSelection = () => {
		const sel = window.getSelection()
		if (sel && sel.rangeCount > 0) {
			savedSelectionRef.current = sel.getRangeAt(0).cloneRange()
			const text = sel.toString()
			if (text) setLinkText(text)
		}
	}

	const restoreSelection = () => {
		if (savedSelectionRef.current) {
			const sel = window.getSelection()
			sel.removeAllRanges()
			sel.addRange(savedSelectionRef.current)
		}
	}

	const exec = (command, val = null) => {
		if (isCodeView) return
		editorRef.current?.focus()
		document.execCommand(command, false, val)
		handleInput()
	}

	const handleOpenLinkModal = () => {
		saveSelection()
		setShowLinkModal(true)
	}

	const handleInsertLink = (e) => {
		e.preventDefault()
		let url = linkUrl.trim()
		if (!url) return
		if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
			url = 'https://' + url
		}

		editorRef.current?.focus()
		restoreSelection()

		const text = linkText.trim() || url
		const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
		const linkHtml = `<a href="${url}"${targetAttr} style="color: #16a34a; text-decoration: underline; font-weight: 700; word-break: break-all;">${text}</a>`

		document.execCommand('insertHTML', false, linkHtml)
		handleInput()

		setShowLinkModal(false)
		setLinkUrl('')
		setLinkText('')
		savedSelectionRef.current = null
	}

	const handleUnlink = () => {
		exec('unlink')
	}

	// Calculate text length for character counter
	const plainTextLength = (value || '').replace(/<[^>]*>/g, '').length

	return (
		<div style={{
			border: '1.5px solid #cbd5e1',
			borderRadius: '12px',
			overflow: 'hidden',
			background: '#ffffff',
			boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
			display: 'flex',
			flexDirection: 'column'
		}}>
			{/* SUMMERNOTE TOOLBAR */}
			<div style={{
				background: '#f8fafc',
				borderBottom: '1px solid #e2e8f0',
				padding: '6px 8px',
				display: 'flex',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '4px'
			}}>
				{/* Format Selector */}
				<select
					disabled={isCodeView}
					onChange={(e) => {
						const tag = e.target.value
						if (tag) exec('formatBlock', tag)
						e.target.value = ''
					}}
					defaultValue=""
					style={{
						padding: '4px 8px',
						fontSize: '12px',
						fontWeight: '700',
						color: '#334155',
						border: '1px solid #cbd5e1',
						borderRadius: '6px',
						background: '#ffffff',
						cursor: 'pointer',
						outline: 'none'
					}}
				>
					<option value="" disabled>Format</option>
					<option value="p">Paragraph</option>
					<option value="h2">Heading 2</option>
					<option value="h3">Heading 3</option>
					<option value="blockquote">Quote Block</option>
				</select>

				<div style={{ width: '1px', height: '18px', background: '#cbd5e1', margin: '0 3px' }} />

				{/* Bold */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('bold')}
					title="Bold (Ctrl+B)"
					style={btnStyle}
				>
					<strong>B</strong>
				</button>

				{/* Italic */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('italic')}
					title="Italic (Ctrl+I)"
					style={btnStyle}
				>
					<em>I</em>
				</button>

				{/* Underline */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('underline')}
					title="Underline (Ctrl+U)"
					style={btnStyle}
				>
					<u>U</u>
				</button>

				{/* Strikethrough */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('strikeThrough')}
					title="Strikethrough"
					style={btnStyle}
				>
					<s>S</s>
				</button>

				<div style={{ width: '1px', height: '18px', background: '#cbd5e1', margin: '0 3px' }} />

				{/* Bullet List */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('insertUnorderedList')}
					title="Bullet List"
					style={btnStyle}
				>
					• List
				</button>

				{/* Numbered List */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={() => exec('insertOrderedList')}
					title="Numbered List"
					style={btnStyle}
				>
					1. List
				</button>

				<div style={{ width: '1px', height: '18px', background: '#cbd5e1', margin: '0 3px' }} />

				{/* Link Button */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={handleOpenLinkModal}
					title="Insert Link 🔗"
					style={{
						...btnStyle,
						background: '#ecfdf5',
						border: '1px solid #a7f3d0',
						color: '#065f46',
						fontWeight: '800'
					}}
				>
					🔗 Link
				</button>

				{/* Unlink Button */}
				<button
					type="button"
					disabled={isCodeView}
					onClick={handleUnlink}
					title="Remove Link"
					style={btnStyle}
				>
					Unlink
				</button>

				<div style={{ width: '1px', height: '18px', background: '#cbd5e1', margin: '0 3px' }} />

				{/* Summernote Code View Toggle */}
				<button
					type="button"
					onClick={() => setIsCodeView(!isCodeView)}
					title="Toggle HTML Code View"
					style={{
						...btnStyle,
						background: isCodeView ? '#0f172a' : '#f1f5f9',
						color: isCodeView ? '#ffffff' : '#334155',
						border: '1px solid #94a3b8',
						fontWeight: '800'
					}}
				>
					{isCodeView ? '👁️ Visual' : 'click to visible'}
				</button>
			</div>

			{/* LINK INSERTION MODAL */}
			{showLinkModal && (
				<div style={{
					background: '#f0fdf4',
					borderBottom: '1.5px solid #86efac',
					padding: '12px 14px',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span style={{ fontSize: '12px', fontWeight: '800', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
							🔗 Insert Link / URL
						</span>
						<button
							type="button"
							onClick={() => setShowLinkModal(false)}
							style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold' }}
						>
							✕
						</button>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
						<div>
							<label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '2px' }}>
								Web Address / URL *
							</label>
							<input
								type="text"
								required
								autoFocus
								value={linkUrl}
								onChange={e => setLinkUrl(e.target.value)}
								placeholder="https://dashboard.razorpay.com/..."
								style={{
									width: '100%',
									padding: '6px 10px',
									borderRadius: '6px',
									border: '1px solid #86efac',
									fontSize: '12.5px',
									outline: 'none',
									background: '#ffffff',
									boxSizing: 'border-box'
								}}
							/>
						</div>
						<div>
							<label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '2px' }}>
								Link Text To Display
							</label>
							<input
								type="text"
								value={linkText}
								onChange={e => setLinkText(e.target.value)}
								placeholder="e.g. Razorpay Settings or Leave Empty"
								style={{
									width: '100%',
									padding: '6px 10px',
									borderRadius: '6px',
									border: '1px solid #cbd5e1',
									fontSize: '12.5px',
									outline: 'none',
									background: '#ffffff',
									boxSizing: 'border-box'
								}}
							/>
						</div>
					</div>

					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
						<label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>
							<input
								type="checkbox"
								checked={openInNewTab}
								onChange={e => setOpenInNewTab(e.target.checked)}
								style={{ accentColor: '#16a34a' }}
							/>
							Open link in new window / tab
						</label>

						<div style={{ display: 'flex', gap: '6px' }}>
							<button
								type="button"
								onClick={() => setShowLinkModal(false)}
								style={{
									padding: '4px 10px',
									background: '#ffffff',
									border: '1px solid #cbd5e1',
									borderRadius: '6px',
									fontSize: '11.5px',
									fontWeight: '700',
									color: '#475569',
									cursor: 'pointer'
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleInsertLink}
								style={{
									padding: '4px 14px',
									background: '#16a34a',
									border: 'none',
									borderRadius: '6px',
									fontSize: '11.5px',
									fontWeight: '800',
									color: '#ffffff',
									cursor: 'pointer'
								}}
							>
								Insert Link
							</button>
						</div>
					</div>
				</div>
			)}

			{/* EDITOR CANVAS */}
			{isCodeView ? (
				<textarea
					value={value || ''}
					onChange={e => onChange(e.target.value)}
					placeholder="Enter raw HTML / text..."
					style={{
						width: '100%',
						minHeight: `${minHeight}px`,
						padding: '14px',
						fontFamily: 'Consolas, Monaco, monospace',
						fontSize: '13px',
						lineHeight: '1.6',
						color: '#0f172a',
						border: 'none',
						outline: 'none',
						resize: 'vertical',
						boxSizing: 'border-box',
						background: '#fafafa'
					}}
				/>
			) : (
				<div
					ref={editorRef}
					contentEditable
					onInput={handleInput}
					onBlur={handleInput}
					data-placeholder={placeholder}
					style={{
						minHeight: `${minHeight}px`,
						padding: '14px 16px',
						fontSize: '14.5px',
						lineHeight: '1.7',
						color: '#1e293b',
						outline: 'none',
						overflowY: 'auto',
						wordBreak: 'break-word'
					}}
				/>
			)}

			{/* FOOTER BAR WITH CHAR COUNT */}
			<div style={{
				background: '#f8fafc',
				borderTop: '1px solid #f1f5f9',
				padding: '4px 12px',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				fontSize: '11px',
				color: '#64748b'
			}}>
				
				<span style={{ fontWeight: '700', color: plainTextLength > maxLength - 200 ? '#dc2626' : '#64748b' }}>
					{plainTextLength}/{maxLength} chars
				</span>
			</div>
		</div>
	)
}

const btnStyle = {
	background: '#ffffff',
	border: '1px solid #cbd5e1',
	borderRadius: '6px',
	padding: '4px 9px',
	fontSize: '12px',
	fontWeight: '600',
	color: '#334155',
	cursor: 'pointer',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: 'all 0.15s ease'
}
