Run npm run clean

> wized-filter-and-pagination@1.0.2 clean
> rm -rf dist .parcel-cache
> wized-filter-and-pagination@1.0.2 build
> parcel build
> Building...
> 🚨 Build failed.
> @parcel/core: src/filters/filter-checkbox.js does not export 'default'
> /home/runner/work/wized-filter-pagination/wized-filter-pagination/src/index.js:2:10

    1 | // Export all components

> 2 | rt { default as FilterCheckboxManager } from './filters/filter-checkbox.
> | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    3 | export { default as FilterRadioManager } from './filters/filter-radio.js
    4 | export { default as FilterSelectManager } from './filters/filter-select.

Error: Process completed with exit code 1.
