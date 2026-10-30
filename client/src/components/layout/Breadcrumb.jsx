import React from 'react'
import Link from '@/components/elements/Link'

export default function Breadcrumb({ breadcrumbTitle, subtitle, bgImage }) {
	const resolvedBg = bgImage || '/uploads/tour-1791823074893-747405157.jpg'
	return (
		<section
			className="breadcumb-section"
			style={{ backgroundImage: `url("${resolvedBg}")`, backgroundPosition: 'center center', backgroundSize: 'cover' }}
		>
			<div className="tf-container">
				<div className="row">
					<div className="col-lg-12 center z-index1">
						<h1 className="title">{breadcrumbTitle}</h1>
						{subtitle && (
							<p
								className="breadcrumb-subtitle"
								style={{
									color: 'rgba(255, 255, 255, 0.92)',
									fontSize: '16px',
									maxWidth: '680px',
									margin: '10px auto 16px',
									lineHeight: 1.55,
									fontWeight: '500',
									textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
								}}
							>
								{subtitle}
							</p>
						)}
						<ul className="breadcumb-list flex-five">
							<li><Link href="/">Home</Link></li>
							<li><span>{breadcrumbTitle}</span></li>
						</ul>
						<img className="bcrumb-ab" src="/assets/images/page/mask-bcrumb.png" alt="" />
					</div>
				</div>
			</div>
		</section>
	)
}
