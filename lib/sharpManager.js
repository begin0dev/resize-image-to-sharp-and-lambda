// npm install --arch=x64 --platform=linux --target=8.10.0 sharp
const sharp = require('sharp');

module.exports.sharpImage = (input) => {
  return sharp(input).rotate();
};

module.exports.resizeImage = (image, functions) => {
  return new Promise(async (resolve) => {
    try {
      const clone = await image.clone();
      functions.forEach(([func, ...parameters]) => clone[func](...parameters));
      resolve(await clone.toBuffer());
    } catch (err) {
      console.error('Failed resize image function');
      throw err;
    }
  });
};
