import nodemailer from 'nodemailer'

const createTransporter = () => {
	const user = process.env.SMTP_USER
	const pass = process.env.SMTP_PASS

	if (!user || !pass) {
		return null
	}

	return nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'smtp.gmail.com',
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user,
			// Strip spaces in Gmail app passwords if any
			pass: pass.replace(/\s+/g, '')
		}
	})
}

const getAdminInquiriesUrl = () => {
	// 1. Explicit ADMIN_URL from env (highest priority)
	const rawAdminUrl = process.env.ADMIN_URL || process.env.ADMIN_SITE_URL || process.env.VITE_ADMIN_URL
	if (rawAdminUrl && rawAdminUrl.trim()) {
		return `${rawAdminUrl.trim().replace(/\/$/, '')}/inquiries`
	}

	// 2. Derived from SITE_URL if available
	if (process.env.SITE_URL && process.env.SITE_URL.trim()) {
		const cleanSite = process.env.SITE_URL.trim().replace(/\/$/, '')
		// If localhost:3000, admin is on port 3001
		if (cleanSite.includes('localhost:3000') || cleanSite.includes('127.0.0.1:3000')) {
			return cleanSite.replace(':3000', ':3001') + '/inquiries'
		}
		// If production domain e.g. https://goldentravels.in -> https://admin.goldentravels.in/inquiries
		try {
			const parsed = new URL(cleanSite)
			if (!parsed.hostname.startsWith('admin.')) {
				return `${parsed.protocol}//admin.${parsed.hostname}/inquiries`
			}
			return `${cleanSite}/inquiries`
		} catch (e) {
			return `${cleanSite}/inquiries`
		}
	}

	return 'http://localhost:3001/inquiries'
}

export const sendInquiryNotification = async (inquiry) => {
	try {
		const transporter = createTransporter()
		if (!transporter) {
			console.log('ℹ️ SMTP is not configured. Email notification skipped.')
			return false
		}

		const recipient = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || 'nanthakumar.sts@gmail.com'

		const html = `
		<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #0A192F 0%, #1B365D 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #C59B27;">
				<h1 style="color: #C59B27; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">GOLDEN TRAVELS</h1>
				<p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">✈️ New Customer Holiday Inquiry Received</p>
			</div>

			<!-- Body -->
			<div style="padding: 32px 28px;">
				<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
					<h2 style="color: #0f172a; font-size: 18px; margin: 0; font-weight: 700;">
						Lead Details
					</h2>
					<span style="background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0;">
						New Lead
					</span>
				</div>

				<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 150px;">Name:</td>
						<td style="padding: 12px 0; color: #0f172a; font-weight: 700; font-size: 15px;">${inquiry.name || 'N/A'}</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email:</td>
						<td style="padding: 12px 0; color: #0f172a;">
							${inquiry.email ? `<a href="mailto:${inquiry.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${inquiry.email}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
						</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">WhatsApp Number:</td>
						<td style="padding: 12px 0; color: #0f172a;">
							<a href="tel:${inquiry.phone}" style="color: #C59B27; text-decoration: none; font-weight: 700; font-size: 15px;">
								📞 ${inquiry.phone || 'N/A'}
							</a>
						</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">Package Name:</td>
						<td style="padding: 12px 0; color: #16a34a; font-weight: 700; font-size: 15px;">
							${inquiry.packageName || inquiry.destination || 'Custom Holiday Package'}
						</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">Days / Nights:</td>
						<td style="padding: 12px 0; color: #0f172a; font-weight: 700; font-size: 14px;">
							📅 ${inquiry.duration || inquiry.travelDate || 'Customizable Duration'}
						</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">Destination:</td>
						<td style="padding: 12px 0; color: #1B365D; font-weight: 700; font-size: 15px;">
							📍 ${inquiry.destination || 'Custom Holiday Inquiry'}
						</td>
					</tr>
					<tr style="border-bottom: 1px solid #f8fafc;">
						<td style="padding: 12px 0; color: #64748b; font-weight: 600;">Lead Source:</td>
						<td style="padding: 12px 0; color: #0f172a;">
							<span style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
								${inquiry.source || 'Website'}
							</span>
						</td>
					</tr>
					<tr>
						<td style="padding: 14px 0 6px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
						<td style="padding: 14px 0 6px 0; color: #334155; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 8px;">
							${inquiry.message || '<span style="color: #94a3b8; font-style: italic;">No specific requirements specified.</span>'}
						</td>
					</tr>
				</table>

				<!-- CTA -->
				<div style="margin-top: 32px; text-align: center;">
					<a href="${getAdminInquiriesUrl()}" style="display: inline-block; background: #C59B27; color: #0A192F; font-weight: 700; padding: 13px 30px; border-radius: 10px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 12px rgba(197, 155, 39, 0.3);">
						Open Inquiries Dashboard &rarr;
					</a>
				</div>
			</div>

			<!-- Footer -->
			<div style="background: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
				Golden Travels Automated Concierge System &bull; Received at ${new Date().toLocaleString()}
			</div>
		</div>
		`

		const pkgSubject = inquiry.packageName || inquiry.destination || 'Custom Holiday'
		const durSubject = (inquiry.duration || inquiry.travelDate) ? ` [${inquiry.duration || inquiry.travelDate}]` : ''

		const info = await transporter.sendMail({
			from: `"Golden Travels Concierge" <${process.env.SMTP_USER}>`,
			to: recipient,
			replyTo: inquiry.email || undefined,
			subject: `✈️ New Tour Inquiry: ${inquiry.name} — ${pkgSubject}${durSubject}`,
			html
		})

		console.log('✅ Lead notification email sent to ' + recipient + ' (ID: ' + info.messageId + ')')
		return true
	} catch (error) {
		console.error('❌ Failed to send lead notification email:', error.message)
		return false
	}
}

export default {
	sendInquiryNotification
}
