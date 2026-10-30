import sequelize from '../config/db.js';
import Package from '../models/Package.js';

const packageDayImages = {
  'rann-utsav-kutch': [
    '/assets/images/packages/rann-kutch.jpg',
    '/assets/images/destination/des3.jpg',
    '/assets/images/destination/des1.jpg',
    '/assets/images/tour/1.jpg'
  ],
  'rajasthan-royal-heritage': [
    '/assets/images/packages/rajasthan-fort.jpg',
    '/assets/images/travel-list/11.jpg',
    '/assets/images/travel-list/12.jpg',
    '/assets/images/destination/des4.jpg',
    '/assets/images/tour/5.jpg',
    '/assets/images/tour/1.jpg',
    '/assets/images/slide/slide3.jpg'
  ],
  'puri-bhubaneswar-heritage': [
    '/assets/images/tour/tour-details.jpg',
    '/assets/images/packages/puri-temple.jpg',
    '/assets/images/destination/des4.jpg',
    '/assets/images/destination/des5.jpg',
    '/assets/images/tour/1.jpg'
  ],
  'andaman-islands-escape': [
    '/assets/images/destination/img2.jpg',
    '/assets/images/packages/andaman-beach.jpg',
    '/assets/images/tour/tour-details.jpg',
    '/assets/images/tour/4.jpg',
    '/assets/images/travel-list/6.jpg',
    '/assets/images/tour/2.jpg'
  ],
  'north-east-program': [
    '/assets/images/packages/northeast-hills.jpg',
    '/assets/images/tour/tour-details.jpg',
    '/assets/images/slide/slide2.jpg',
    '/assets/images/explore/9.jpg',
    '/assets/images/tour/3.jpg',
    '/assets/images/destination/des2.jpg',
    '/assets/images/explore/10.jpg'
  ],
  'vietnam-beauty-of-vietnam': [
    '/assets/images/packages/vietnam.jpg',
    '/assets/images/tour/tour-details.jpg',
    '/assets/images/destination/des1.jpg',
    '/assets/images/destination/img1.jpg',
    '/assets/images/destination/des5.jpg',
    '/assets/images/packages/andaman-beach.jpg',
    '/assets/images/explore/8.jpg',
    '/assets/images/tour/2.jpg',
    '/assets/images/travel-list/6.jpg'
  ],
  'taiwan-taipei-explorer': [
    '/assets/images/packages/taiwan.jpg',
    '/assets/images/destination/des5.jpg',
    '/assets/images/tour/1.jpg',
    '/assets/images/destination/img1.jpg',
    '/assets/images/travel-list/6.jpg',
    '/assets/images/destination/2.jpg'
  ],
  'spain-barcelona-madrid': [
    '/assets/images/packages/spain.jpg',
    '/assets/images/tour/tour-details.jpg',
    '/assets/images/destination/des2.jpg',
    '/assets/images/tour/2.jpg',
    '/assets/images/tour/3.jpg',
    '/assets/images/page/explore3.jpg',
    '/assets/images/explore/7.jpg'
  ],
  'south-korea-seoul-busan': [
    '/assets/images/packages/south-korea.jpg',
    '/assets/images/destination/1.jpg',
    '/assets/images/travel-list/4.jpg',
    '/assets/images/destination/des1.jpg',
    '/assets/images/tour/6.jpg'
  ],
  'philippines-manila-angeles-pagsanjan': [
    '/assets/images/packages/philippines.jpg',
    '/assets/images/destination/3.jpg',
    '/assets/images/tour/tour-details2.jpg',
    '/assets/images/travel-list/5.jpg',
    '/assets/images/destination/des1.jpg',
    '/assets/images/slide/slide1.jpg'
  ],
  'rajastan': [
    '/assets/images/packages/rajasthan-fort.jpg'
  ]
};

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    const packages = await Package.findAll();
    console.log(`Found ${packages.length} packages in database.`);

    for (const pkg of packages) {
      const slug = pkg.slug;
      const images = packageDayImages[slug] || [];
      const currentItin = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];

      if (currentItin.length === 0) continue;

      const updatedItin = currentItin.map((day, idx) => {
        // Pick designated image, or cycle from images, or from pkg.gallery, or pkg.image
        const fallbackGallery = (Array.isArray(pkg.gallery) && pkg.gallery.length > 0)
          ? pkg.gallery.map(g => (typeof g === 'string' ? g : g.src)).filter(Boolean)
          : [];

        const assignedImage = images[idx] ||
          images[idx % images.length] ||
          fallbackGallery[idx % fallbackGallery.length] ||
          pkg.image ||
          '/assets/images/tour/1.jpg';

        return {
          ...day,
          image: assignedImage
        };
      });

      pkg.itinerary = updatedItin;
      await pkg.save();
      console.log(`✅ Updated package "${pkg.title}" (${slug}): ${updatedItin.length} days set with images.`);
    }

    console.log('\n🎉 ALL packages successfully updated with day-wise itinerary photos!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating packages:', err);
    process.exit(1);
  }
}

run();
