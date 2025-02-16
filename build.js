import { minify } from 'terser';
import fs from 'fs';
import path from 'path';

async function minifyFile() {
  try {
    const inputFile = path.resolve('dist/index.js');
    const outputFile = path.resolve('dist/index.min.js');

    const code = fs.readFileSync(inputFile, 'utf8');
    const minified = await minify(code, {
      compress: true,
      mangle: true,
    });

    fs.writeFileSync(outputFile, minified.code);
    console.log('Successfully minified the file!');
  } catch (error) {
    console.error('Error during minification:', error);
    process.exit(1);
  }
}

minifyFile();
