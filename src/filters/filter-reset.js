/**
 * FilterResetManager: Main class responsible for resetting all filter types
 *
 * This class handles:
 * 1. Finding and monitoring the main reset button
 * 2. Coordinating reset operations across all filter types (checkbox, radio, select, sort)
 */
export class FilterResetManager {
  constructor(Wized) {
    this.Wized = Wized;
    this.setupMainResetButton();
  }

  /**
   * Checks if there are any active filters by examining Wized variables
   * @returns {boolean} True if any filters are active
   */
  checkForActiveFilters() {
    const variables = this.Wized.data.v;
    console.log('=== Checking Active Filters ===');
    console.log('All Wized variables:', variables);

    // List of variables to always skip
    const skipVariables = ['pagination', 'result', 'cards', 'itemsperpage', 'index'];

    const activeFilters = Object.entries(variables).filter(([key, value]) => {
      console.log(`Checking variable: ${key} with value:`, value);

      // Skip non-filter variables
      if (skipVariables.some((skip) => key.toLowerCase().includes(skip))) {
        console.log(`Skipping system variable: ${key}`);
        return false;
      }

      // Handle null values
      if (value === null) {
        console.log(`Null value for ${key}: inactive`);
        return false;
      }

      // Check arrays (used by checkboxes, sort, and selected options)
      if (Array.isArray(value)) {
        // Special handling for sort options
        if (key.includes('_sort')) {
          // Check if any sort option has non-empty orderBy or sortBy
          const isActive = value.some(
            (item) => item && typeof item === 'object' && (item.orderBy || item.sortBy)
          );
          console.log(`Sort array check for ${key}: ${isActive ? 'active' : 'inactive'}`);
          return isActive;
        }

        // Special handling for filter arrays
        if (
          key.includes('_make') ||
          key.includes('_fuelType') ||
          key.includes('_year') ||
          key.includes('_location')
        ) {
          const isActive = value.length > 0;
          console.log(`Filter array check for ${key}: ${isActive ? 'active' : 'inactive'}`);
          return isActive;
        }
        return false;
      }

      // Check strings (used by radio and select)
      if (typeof value === 'string') {
        const isActive = value !== '';
        console.log(`String check for ${key}: ${isActive ? 'active' : 'inactive'}`);
        return isActive;
      }

      // Check numbers (used by range filters)
      if (typeof value === 'number') {
        const isActive = value !== 0;
        console.log(`Number check for ${key}: ${isActive ? 'active' : 'inactive'}`);
        return isActive;
      }

      console.log(`Skipping unknown type for ${key}:`, typeof value);
      return false;
    });

    console.log('Active filters found:', activeFilters);
    console.log('=== Filter Check Complete ===');

    return activeFilters.length > 0;
  }

  /**
   * Resets all filters and executes the filter request
   * @param {HTMLElement} resetButton - The reset button element
   */
  async resetAllFilters(resetButton) {
    console.log('=== Starting Filter Reset ===');
    try {
      // Reset all filter types
      if (typeof window.uncheckAllFilterCheckboxes === 'function') {
        console.log('Found checkbox reset function');
        await window.uncheckAllFilterCheckboxes();
        console.log('Checkboxes reset complete');
      }

      if (typeof window.uncheckAllRadioButtons === 'function') {
        console.log('Found radio reset function');
        await window.uncheckAllRadioButtons();
        console.log('Radio buttons reset complete');
      }

      if (typeof window.resetAllSelectInputs === 'function') {
        console.log('Found select reset function');
        await window.resetAllSelectInputs();
        console.log('Select inputs reset complete');
      }

      if (typeof window.resetAllRangeSelects === 'function') {
        console.log('Found range reset function');
        await window.resetAllRangeSelects();
        console.log('Range selects reset complete');
      }

      if (typeof window.resetAllSortInputs === 'function') {
        console.log('Found sort reset function');
        await window.resetAllSortInputs();
        console.log('Sort inputs reset complete');
      }

      // Reset pagination to 1
      const paginationVariable = resetButton.getAttribute('w-filter-pagination-current-variable');
      if (paginationVariable) {
        console.log(`Setting pagination variable ${paginationVariable} to 1`);
        this.Wized.data.v[paginationVariable] = 1;
      }

      // Execute filter request to update results
      const filterRequest = resetButton.getAttribute('w-filter-request');
      if (filterRequest) {
        console.log(`Preparing to execute filter request: ${filterRequest}`);
        try {
          await this.Wized.requests.execute(filterRequest);
          console.log('Filter request executed successfully');
        } catch (error) {
          console.error(`Error executing filter request: ${error}`);
        }
      }
    } catch (error) {
      console.error('Error in resetAllFilters:', error);
    }
    console.log('=== Filter Reset Complete ===');
  }

  /**
   * Sets up the main reset button event listener
   */
  setupMainResetButton() {
    console.log('=== Setting up Reset Button ===');
    const resetButton = document.querySelector('[w-filter-reset="main-reset"]');
    console.log('Reset button found:', resetButton);

    if (!resetButton) {
      console.log('No reset button found, exiting setup');
      return;
    }

    resetButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('=== Reset Button Clicked ===');

      // Check if any filters are active
      console.log('Checking for active filters...');
      const hasActiveFilters = this.checkForActiveFilters();
      console.log('Active filters check result:', hasActiveFilters);

      if (hasActiveFilters) {
        console.log('Active filters found, proceeding with reset');
        await this.resetAllFilters(resetButton);
      } else {
        console.log('No active filters found, skipping reset');
      }
      console.log('=== Reset Button Click Handled ===');
    });
    console.log('Reset button setup complete');
  }
}
