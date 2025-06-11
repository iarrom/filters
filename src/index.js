import FilterCheckboxManager from './filters/filter-checkbox.js';
import FilterRadioManager from './filters/filter-radio.js';
import FilterSelectManager from './filters/filter-select.js';
import FilterSelectRangeManager from './filters/filter-select-range.js';
import FilterChipsManager from './filters/filter-chips.js';
import FilterSortManager from './filters/filter-sort.js';
import FilterPaginationManager from './filters/filter-pagination.js';
import FilterResetManager from './filters/filter-reset.js';
import FilterSearchManager from './filters/filter-search.js';
import { applyParamsToWized } from './utils/url-sync.js';

// Export all components
export { FilterCheckboxManager };
export { FilterRadioManager };
export { FilterSelectManager };
export { FilterSelectRangeManager };
export { FilterChipsManager };
export { FilterSortManager };
export { FilterPaginationManager };
export { FilterResetManager };
export { FilterSearchManager };

// Initialize components when loaded in browser
if (typeof window !== 'undefined') {
  window.Wized = window.Wized || [];
  window.Wized.push((Wized) => {
    const buildMapping = () => {
      const mapping = {};
      document.querySelectorAll('[wized][w-filter-checkbox-variable]').forEach((el) => {
        mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-checkbox-variable');
      });
      document.querySelectorAll('[wized][w-filter-radio-variable]').forEach((el) => {
        mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-radio-variable');
      });
      document.querySelectorAll('[wized][w-filter-select-variable]').forEach((el) => {
        mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-select-variable');
      });
      document
        .querySelectorAll('[wized][w-filter-select-range-from-variable]')
        .forEach((el) => {
          mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-select-range-from-variable');
        });
      document
        .querySelectorAll('[wized][w-filter-select-range-to-variable]')
        .forEach((el) => {
          mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-select-range-to-variable');
        });
      document.querySelectorAll('[wized][w-filter-sort-variable]').forEach((el) => {
        mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-sort-variable');
      });
      document.querySelectorAll('[wized][w-filter-search-variable]').forEach((el) => {
        mapping[el.getAttribute('wized')] = el.getAttribute('w-filter-search-variable');
      });
      return mapping;
    };

    applyParamsToWized(Wized, buildMapping());

    // Initialize chips manager first since other managers depend on it
    new FilterChipsManager(Wized);

    // Initialize all other filter managers
    new FilterCheckboxManager(Wized);
    new FilterRadioManager(Wized);
    new FilterSelectManager(Wized);
    new FilterSelectRangeManager(Wized);
    new FilterSortManager(Wized);
    new FilterPaginationManager(Wized);
    new FilterSearchManager(Wized);

    // Initialize reset manager last since it depends on other managers being ready
    new FilterResetManager(Wized);
  });
}
