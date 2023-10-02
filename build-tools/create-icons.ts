import imagemagick from 'imagemagick';

const root = `../public/assets/`;
const filename = 'example.png';

/**
 * Creates icons from an image for the manifest.
 * Sizes: 16, 32, 48, 128
 */
function createIcons() {
  for (let size of [16, 32, 48, 128]) {
    imagemagick.resize(
      {
        srcPath: `${root}${filename}`,
        dstPath: `${root}icon${size}.png`,
        width: size,
        height: size,
      },
      (err, res) => {
        if (err) throw err;
      }
    );
    console.log(`resized ${filename} to ${size}x${size}`);
  }
}

createIcons();
