const https = require('https');
const sizeOf = require('image-size'); // wait, image-size might not be installed, let's just fetch the image and print its size or use a simple check

https.get('https://res.cloudinary.com/dwgnnr10/image/upload/v1785341862/festive-section-image-_zy2mxi.png', (response) => {
  const chunks = [];
  response.on('data', (chunk) => {
    chunks.push(chunk);
  });
  response.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Image fetched successfully, size:', buffer.length, 'bytes');
    try {
      // PNG header has dimensions at offset 16 (width: 4 bytes, height: 4 bytes)
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      console.log('Dimensions:', width, 'x', height, 'Aspect Ratio:', width / height);
    } catch (e) {
      console.error('Failed to read PNG dimensions:', e);
    }
  });
});
