import * as esbuild from 'esbuild';

async function build() {
  try {
    // Bundle and minify
    const result = await esbuild.build({
      entryPoints: ['src/index.js'],
      bundle: true,
      minify: true,
      format: 'esm',
      target: ['es2020'],
      outfile: 'dist/index.min.js',
      sourcemap: false,
      platform: 'browser',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
}

build();
