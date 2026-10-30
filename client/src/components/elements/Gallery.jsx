import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

const images = [
	{
		id: 1,
		url: '/assets/images/gallery/gl1.jpg',
		title: 'Image 1',
		description: 'This is the first image',
	},
	{
		id: 2,
		url: '/assets/images/gallery/gl2.jpg',
		title: 'Image 2',
		description: 'This is the second image',
	},
	{
		id: 3,
		url: '/assets/images/gallery/gl3.jpg',
		title: 'Image 3',
		description: 'This is the third image',
	},
	{
		id: 4,
		url: '/assets/images/gallery/gl4.jpg',
		title: 'Image 4',
		description: 'This is the fourth image',
	},
	{
		id: 5,
		url: '/assets/images/gallery/gl5.jpg',
		title: 'Image 5',
		description: 'This is the fifth image',
	},
	{
		id: 6,
		url: '/assets/images/gallery/gl6.jpg',
		title: 'Image 6',
		description: 'This is the sixth image',
	}
]

export default function Gallery2() {
	const [open, setOpen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)

	const handleClick = (index) => {
		setCurrentIndex(index)
		setOpen(true)
	}

	return (
		<>
			<div className="gallery-img">
				{images.map((image, index) => (
					<a key={image.id} onClick={() => handleClick(index)}>
						<img src={image.url} alt={image.title} />
					</a>
				))}
			</div>
			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={images.map(image => ({ src: image.url }))}
				index={currentIndex}
			/>
		</>
	)
}
