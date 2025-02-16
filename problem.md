Run npm run clean

> wized-filter-and-pagination@1.0.2 clean
> rm -rf dist .parcel-cache

> wized-filter-and-pagination@1.0.2 build
> parcel build src/index.html --dist-dir dist --no-source-maps

Building...
🚨 Build failed.

@parcel/core: No transformers found for src/index.html with pipeline: 'types'.

/home/runner/work/wized-filter-pagination/wized-filter-pagination/.parcelrc:5:3
4 | ],

> 5 | "transformers": {
> | ^^^^^^^^^^^^^^^^^
> 6 | "_.{js,mjs,jsx,cjs,ts,tsx}": [
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 7 | "@parcel/transformer-js"
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 8 | ],
> | ^^^^^^
> 9 | "_.{css,pcss}": [
> > | ^^^^^^^^^^^^^^^^^^^^^
> > 10 | "@parcel/transformer-css"
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 11 | ],
> | ^^^^^^
> 12 | "\*.html": [
> > | ^^^^^^^^^^^^^^^
> > 13 | "@parcel/transformer-html"
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 14 | ]
> | ^^^^^
> 15 | },
> | ^^^

/home/runner/work/wized-filter-pagination/wized-filter-pagination/node_modules/@parcel/config-default/index.json:3:3
2 | "bundler": "@parcel/bundler-default",

> 3 | "transformers": {
> | ^^^^^^^^^^^^^^^^^
> 4 | "types:_.{ts,tsx}": ["@parcel/transformer-typescript-types"],
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 5 | "bundle-text:_": ["...", "@parcel/transformer-inline-string"],
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 6 | "data-url:_": ["...", "@parcel/transformer-inline-string"],
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 7 | "worklet:_.{js,mjs,jsm,jsx,es6,cjs,ts,tsx}": [
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 8 | "@parcel/transformer-worklet",
> > | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> > 9 | "..."
> > | ^^^^^^^^^^^
> > 10 | ],
> | ^^^^^^
> 11 | "\*.{js,mjs,jsm,jsx,es6,cjs,ts,tsx}": [
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 12 | "@parcel/transformer-babel",
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 13 | "@parcel/transformer-js",
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Error: Process completed with exit code 1.
