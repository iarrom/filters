/**
 * FilterSelectRangeManager: Main class responsible for managing range-based select filtering functionality
 *
 * This class handles:
 * 1. State Management: Tracks range select states and filter variables
 * 2. UI Management: Handles select updates and options
 * 3. Event Handling: Manages change events and request completions
 * 4. Wized Integration: Coordinates with Wized for data and requests
 * 5. Dynamic Options: Manages dynamic option updates
 */
export class FilterSelectRangeManager {
  constructor(Wized) {
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredRanges: new Set(),
      initialized: false,
      processingChange: false, // Prevent multiple simultaneous changes
      dynamicRanges: new Map(), // Track ranges with dynamic options
    };

    // Bind methods
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.resetAllRangeSelects = this.resetAllRangeSelects.bind(this);

    // Initialize immediately
    this.initialize();
  }

  /**
   * Initializes the manager and sets up event listeners
   */
  initialize() {
    if (this.state.initialized) return;

    // Make reset function globally available
    window.resetAllRangeSelects = this.resetAllRangeSelects;

    // Set up request monitoring
    this.Wized.on('requestend', this.handleRequestEnd);

    this.state.initialized = true;
    // console.log("Initialized range select filter monitoring");
  }

  // =============================================
  // UI HELPERS AND DOM MANIPULATION
  // =============================================

  getSelectedValue(select) {
    return select.value || '';
  }

  createRangeIdentifier(category) {
    return `range-${category}`;
  }

  findOptionsWrapper(select, isFromSelect) {
    const category = select.getAttribute('w-filter-select-range-category');
    if (!category) return null;

    const wrapperSelector = isFromSelect
      ? `[w-filter-select-range-from-option="wrapper"]`
      : `[w-filter-select-range-to-option="wrapper"]`;

    return document.querySelector(
      `[w-filter-select-range-category="${category}"]${wrapperSelector}`
    );
  }

  updateDisabledOptions(currentSelect, otherSelect, isFromSelect) {
    const otherValue = parseFloat(otherSelect.value);

    Array.from(currentSelect.options).forEach((option) => {
      if (!option.value) return; // Skip placeholder

      const optionValue = parseFloat(option.value);
      if (!isNaN(optionValue) && !isNaN(otherValue)) {
        option.disabled = isFromSelect
          ? otherValue > 0 && optionValue > otherValue
          : otherValue > 0 && optionValue < otherValue;
      }
    });
  }

  // =============================================
  // OPTION MANAGEMENT
  // =============================================

  extractOptionsFromWrapper(wrapper, isFromSelect) {
    const optionType = isFromSelect ? 'from' : 'to';
    const optionTexts = Array.from(
      wrapper.querySelectorAll(`[w-filter-select-range-${optionType}-option="option-text"]`)
    );
    const optionValues = Array.from(
      wrapper.querySelectorAll(`[w-filter-select-range-${optionType}-value="value-text"]`)
    );

    return optionTexts
      .map((textEl, index) => {
        const text = textEl.textContent?.trim() || '';
        const value = optionValues[index]?.textContent?.trim() || text;
        return { text, value };
      })
      .filter(({ text, value }) => {
        return text && value && !isNaN(parseFloat(value));
      });
  }

  updateSelectOptions(select, wrapper, isFromSelect, otherSelect) {
    const currentValue = select.value;
    const placeholder = select.options[0]?.cloneNode(true);
    const options = this.extractOptionsFromWrapper(wrapper, isFromSelect);
    const sortedOptions = options.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

    // Create a new select element to build options
    const tempSelect = document.createElement('select');
    if (placeholder) tempSelect.add(placeholder);

    // Add all options to temp select
    sortedOptions.forEach(({ text, value }) => {
      const option = document.createElement('option');
      option.text = text;
      option.value = value;
      tempSelect.add(option);
    });

    // If current value exists in new options, pre-select it in temp select
    if (currentValue && Array.from(tempSelect.options).some((opt) => opt.value === currentValue)) {
      tempSelect.value = currentValue;
    }

    // Replace options in original select
    select.innerHTML = tempSelect.innerHTML;

    // Restore the value after replacing options
    if (currentValue) {
      select.value = currentValue;
    }

    // Update disabled states
    if (otherSelect) {
      setTimeout(() => {
        this.updateDisabledOptions(select, otherSelect, isFromSelect);
      }, 0);
    }
  }

  // =============================================
  // STATE MANAGEMENT AND WIZED INTEGRATION
  // =============================================

  getSelectedText(select) {
    return select.options[select.selectedIndex]?.text || '';
  }

  createRangeChipId(category, isFromSelect) {
    return `${category}-${isFromSelect ? 'from' : 'to'}`;
  }

  createRangeChip(select, category, isFromSelect) {
    // Skip if chips functionality is not available
    if (!window.filterChips || !window.filterChipsReady) return;

    const value = this.getSelectedValue(select);
    const text = this.getSelectedText(select);
    if (!value || !text) return;

    const chipLabel = `${
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    } ${isFromSelect ? 'FROM' : 'TO'}: ${text}`;
    const chipValue = value;
    const chipId = this.createRangeChipId(category, isFromSelect);

    // Store current value before removing existing chip
    const currentValue = select.value;

    // Remove existing chip for this type if it exists
    if (window.filterChips.exists && window.filterChips.exists(chipId, chipValue)) {
      if (window.filterChips.removeByValue) {
        window.filterChips.removeByValue(chipId, chipValue);
      }
    }

    const chip = window.filterChips.create({
      label: chipLabel,
      filterType: 'select',
      category: chipId, // Use unique category for FROM/TO
      value: chipValue,
      sourceElement: select,
      onSourceUpdate: () => {
        // Only reset if the current value is different from when the chip was created
        if (select.value === currentValue) {
          select.value = '';
          Array.from(select.options).forEach((option) => (option.disabled = false));
        }
      },
    });

    // Only try to add chip if it was created successfully
    if (chip && window.filterChips.addToContainer) {
      window.filterChips.addToContainer(chip);
    }
  }

  async updateWizedVariables(
    fromSelect,
    toSelect,
    fromVariable,
    toVariable,
    paginationVariable,
    filterRequest,
    forceEmpty = false,
    isReset = false
  ) {
    const fromValue = forceEmpty ? '' : this.getSelectedValue(fromSelect);
    const toValue = forceEmpty ? '' : this.getSelectedValue(toSelect);
    const category = fromSelect.getAttribute('w-filter-select-range-category');

    if (window.filterChips && window.filterChipsReady) {
      if (isReset) {
        // Only clear chips on reset if available
        if (window.filterChips.clearCategory) {
          window.filterChips.clearCategory(this.createRangeChipId(category, true));
          window.filterChips.clearCategory(this.createRangeChipId(category, false));
        }
      } else if (!forceEmpty) {
        // Update chips based on which select changed
        if (fromValue !== this.Wized.data.v[fromVariable]) {
          this.createRangeChip(fromSelect, category, true);
        }
        if (toValue !== this.Wized.data.v[toVariable]) {
          this.createRangeChip(toSelect, category, false);
        }
      }
    }

    // Update Wized variables
    this.Wized.data.v[fromVariable] = fromValue;
    this.Wized.data.v[toVariable] = toValue;

    if (isReset || fromValue || toValue || (!forceEmpty && (!fromValue || !toValue))) {
      if (paginationVariable) {
        this.Wized.data.v[paginationVariable] = 1;
      }

      if (filterRequest) {
        try {
          await this.Wized.requests.execute(filterRequest);
        } catch (error) {
          console.error(`Error executing filter request: ${error}`);
        }
      }
    }
  }

  // =============================================
  // RESET FUNCTIONALITY
  // =============================================

  setupResetButton(
    category,
    fromSelect,
    toSelect,
    fromVariable,
    toVariable,
    paginationVariable,
    filterRequest
  ) {
    const resetButton = document.querySelector(`[w-filter-select-range-reset="${category}"]`);
    if (!resetButton) return;

    resetButton.addEventListener('click', async (e) => {
      e.preventDefault();

      const hadSelection = fromSelect.value !== '' || toSelect.value !== '';

      fromSelect.value = '';
      toSelect.value = '';

      Array.from(fromSelect.options).forEach((option) => (option.disabled = false));
      Array.from(toSelect.options).forEach((option) => (option.disabled = false));

      await this.updateWizedVariables(
        fromSelect,
        toSelect,
        fromVariable,
        toVariable,
        paginationVariable,
        filterRequest,
        true,
        hadSelection
      );
    });
  }

  // =============================================
  // DYNAMIC RANGE MANAGEMENT
  // =============================================

  setupDynamicRange(
    fromSelect,
    toSelect,
    requestName,
    fromVariable,
    toVariable,
    paginationVariable,
    filterRequest
  ) {
    const fromWrapper = this.findOptionsWrapper(fromSelect, true);
    const toWrapper = this.findOptionsWrapper(toSelect, false);
    if (!fromWrapper || !toWrapper) return;

    this.updateSelectOptions(fromSelect, fromWrapper, true, toSelect);
    this.updateSelectOptions(toSelect, toWrapper, false, fromSelect);

    this.Wized.on('requestend', (result) => {
      if (result.id === requestName || result.name === requestName) {
        this.updateSelectOptions(fromSelect, fromWrapper, true, toSelect);
        this.updateSelectOptions(toSelect, toWrapper, false, fromSelect);

        const currentFromValue = fromSelect.value;
        const currentToValue = toSelect.value;

        if (
          (currentFromValue && currentFromValue !== this.Wized.data.v[fromVariable]) ||
          (currentToValue && currentToValue !== this.Wized.data.v[toVariable])
        ) {
          this.updateWizedVariables(
            fromSelect,
            toSelect,
            fromVariable,
            toVariable,
            paginationVariable,
            filterRequest
          );
        }
      }
    });
  }

  // =============================================
  // RANGE GROUP SETUP
  // =============================================

  setupRangeGroup(fromSelect, toSelect) {
    const category = fromSelect.getAttribute('w-filter-select-range-category');
    const fromVariable = fromSelect.getAttribute('w-filter-select-range-from-variable');
    const toVariable = toSelect.getAttribute('w-filter-select-range-to-variable');
    const paginationVariable = fromSelect.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = fromSelect.getAttribute('w-filter-request');
    const requestName = fromSelect.getAttribute('w-filter-select-range-request');

    // Initialize Wized variables if needed
    if (typeof this.Wized.data.v[fromVariable] === 'undefined') {
      this.Wized.data.v[fromVariable] = '';
    }
    if (typeof this.Wized.data.v[toVariable] === 'undefined') {
      this.Wized.data.v[toVariable] = '';
    }

    this.setupResetButton(
      category,
      fromSelect,
      toSelect,
      fromVariable,
      toVariable,
      paginationVariable,
      filterRequest
    );

    // Add change handlers
    fromSelect.addEventListener('change', async () => {
      if (this.state.processingChange) return;
      this.state.processingChange = true;

      this.updateDisabledOptions(toSelect, fromSelect, false);
      await this.updateWizedVariables(
        fromSelect,
        toSelect,
        fromVariable,
        toVariable,
        paginationVariable,
        filterRequest
      );

      this.state.processingChange = false;
    });

    toSelect.addEventListener('change', async () => {
      if (this.state.processingChange) return;
      this.state.processingChange = true;

      this.updateDisabledOptions(fromSelect, toSelect, true);
      await this.updateWizedVariables(
        fromSelect,
        toSelect,
        fromVariable,
        toVariable,
        paginationVariable,
        filterRequest
      );

      this.state.processingChange = false;
    });

    if (requestName) {
      this.setupDynamicRange(
        fromSelect,
        toSelect,
        requestName,
        fromVariable,
        toVariable,
        paginationVariable,
        filterRequest
      );
    } else {
      this.updateDisabledOptions(fromSelect, toSelect, true);
      this.updateDisabledOptions(toSelect, fromSelect, false);
    }
  }

  // =============================================
  // FILTER MONITORING
  // =============================================

  setupFilterMonitoring() {
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return;

    const fromSelects = filterWrapper.querySelectorAll(
      'select[w-filter-select-range-from-variable]'
    );
    if (fromSelects.length === 0) return;

    fromSelects.forEach((fromSelect) => {
      const category = fromSelect.getAttribute('w-filter-select-range-category');
      if (!category) return;

      const identifier = this.createRangeIdentifier(category);
      if (this.state.monitoredRanges.has(identifier)) return;

      const toSelect = filterWrapper.querySelector(
        `select[w-filter-select-range-to-variable][w-filter-select-range-category="${category}"]`
      );
      if (!toSelect) return;

      this.state.monitoredRanges.add(identifier);
      this.setupRangeGroup(fromSelect, toSelect);
    });
  }

  // =============================================
  // EVENT HANDLING
  // =============================================

  handleRequestEnd() {
    this.setupFilterMonitoring();
  }

  // =============================================
  // PUBLIC API
  // =============================================

  async resetAllRangeSelects() {
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return;

    const rangeSelects = filterWrapper.querySelectorAll(
      'select[w-filter-select-range-from-variable], select[w-filter-select-range-to-variable]'
    );
    if (rangeSelects.length === 0) return;

    // Clear all range select chips if available
    if (window.filterChips && window.filterChipsReady) {
      const processedCategories = new Set();
      rangeSelects.forEach((select) => {
        const category = select.getAttribute('w-filter-select-range-category');
        if (category && !processedCategories.has(category)) {
          processedCategories.add(category);
          // Clear both FROM and TO chips for this category if clearCategory is available
          if (window.filterChips.clearCategory) {
            window.filterChips.clearCategory(this.createRangeChipId(category, true));
            window.filterChips.clearCategory(this.createRangeChipId(category, false));
          }
        }
      });
    }

    rangeSelects.forEach((select) => {
      select.value = '';
      Array.from(select.options).forEach((option) => (option.disabled = false));

      const fromVariable = select.getAttribute('w-filter-select-range-from-variable');
      const toVariable = select.getAttribute('w-filter-select-range-to-variable');
      if (fromVariable) this.Wized.data.v[fromVariable] = '';
      if (toVariable) this.Wized.data.v[toVariable] = '';
    });
  }
}

// Initialize Wized and the FilterSelectRangeManager
window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  new FilterSelectRangeManager(Wized);
});
