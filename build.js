import * as esbuild from 'esbuild';

async function build() {
  try {
    const commonOptions = {
      entryPoints: ['src/index.js'],
      bundle: true,
      format: 'esm',
      target: ['es2020'],
      platform: 'browser',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      pure: ['console.log', 'console.info', 'console.debug'],
      sourcemap: false,
    };

    // Minified bundle for browsers
    await esbuild.build({
      ...commonOptions,
      minify: true,
      outfile: 'dist/index.min.js',
    });

    // ESM bundle for bundlers
    await esbuild.build({
      ...commonOptions,
      minify: false,
      outfile: 'dist/index.esm.js',
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
}

build();
