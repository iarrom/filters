import FilterCheckboxManager from './filters/filter-checkbox.js';
import FilterRadioManager from './filters/filter-radio.js';
import FilterSelectManager from './filters/filter-select.js';
import FilterSelectRangeManager from './filters/filter-select-range.js';
import FilterChipsManager from './filters/filter-chips.js';
import FilterResetManager from './filters/filter-reset.js';
import FilterSortManager from './filters/filter-sort.js';
import FilterPaginationManager from './filters/filter-pagination.js';

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Initialize chips manager first since other managers depend on it
  new FilterChipsManager(Wized);

  // Initialize all other filter managers
  new FilterCheckboxManager(Wized);
  new FilterRadioManager(Wized);
  new FilterSelectManager(Wized);
  new FilterSelectRangeManager(Wized);
  new FilterSortManager(Wized);
  new FilterPaginationManager(Wized);

  // Initialize reset manager last since it depends on other managers being ready
  new FilterResetManager(Wized);
});
