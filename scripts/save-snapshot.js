const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'components', 'BackgroundCarousel.snapshot.js');
const dest = path.join(__dirname, '..', 'src', 'components', 'BackgroundCarousel.js');

fs.copyFileSync(src, dest);
console.log('Snapshot saved to BackgroundCarousel.js');
