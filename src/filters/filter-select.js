/**
 * FilterSelectManager: Main class responsible for managing select-based filtering functionality
 *
 * This class handles:
 * 1. State Management: Tracks select states and filter variables
 * 2. UI Management: Handles select updates and options
 * 3. Event Handling: Manages change events and request completions
 * 4. Wized Integration: Coordinates with Wized for data and requests
 * 5. Chips Integration: Coordinates with FilterChipsManager for visual feedback
 * 6. Dynamic Options: Manages dynamic option updates
 */
export default class FilterSelectManager {
  constructor(Wized) {
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredSelects: new Set(),
      initialized: false,
      processingChange: false, // Prevent multiple simultaneous changes
      dynamicSelects: new Map(), // Track selects with dynamic options
    };

    // Bind methods
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.resetAllSelectInputs = this.resetAllSelectInputs.bind(this);

    // Initialize immediately
    this.initialize();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  initialize() {
    if (this.state.initialized) return;

    // Make reset function globally available
    window.resetAllSelectInputs = this.resetAllSelectInputs;

    // Set up request monitoring
    this.Wized.on('requestend', this.handleRequestEnd);

    this.state.initialized = true;
  }

  // =============================================
  // SELECT HELPERS AND DOM MANIPULATION
  // =============================================

  getSelectedValue(select) {
    return select.value || '';
  }

  getSelectedText(select) {
    return select.options[select.selectedIndex]?.text || '';
  }

  createSelectIdentifier(select) {
    const category = select.getAttribute('w-filter-select-category') || '';
    const variable = select.getAttribute('w-filter-select-variable') || '';
    return `${category}-${variable}`;
  }

  // =============================================
  // CHIPS INTEGRATION
  // =============================================

  createSelectChip(select, category) {
    // Skip if chips functionality is not available
    if (!window.filterChips || !window.filterChipsReady) return;

    const value = this.getSelectedValue(select);
    const text = this.getSelectedText(select);
    if (!value || !text) return;

    const variableName = select.getAttribute('w-filter-select-variable');
    const paginationVariable = select.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = select.getAttribute('w-filter-request');

    const chip = window.filterChips.create({
      label: `${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}: ${text}`,
      filterType: 'select',
      category,
      value: value,
      sourceElement: select,
      onSourceUpdate: async () => {
        // Reset the select to its first option
        select.selectedIndex = 0;

        // Update state and trigger request
        await this.updateWizedVariable(
          select,
          variableName,
          paginationVariable,
          filterRequest,
          true
        );
      },
    });

    // Only try to add chip if it was created successfully
    if (chip && window.filterChips.addToContainer) {
      window.filterChips.addToContainer(chip);
    }
  }

  // =============================================
  // DYNAMIC SELECT FUNCTIONALITY
  // =============================================

  findOptionsWrapper(select) {
    const category = select.getAttribute('w-filter-select-category');
    if (!category) return null;

    return document.querySelector(
      `[w-filter-select-category="${category}"][w-filter-select-option="wrapper"]`
    );
  }

  extractOptionsFromWrapper(wrapper) {
    const optionTexts = Array.from(
      wrapper.querySelectorAll('[w-filter-select-option="option-text"]')
    );

    const optionValues = Array.from(
      wrapper.querySelectorAll('[w-filter-select-option="value-text"]')
    );

    return optionTexts.map((textEl, index) => {
      const text = textEl.textContent || '';
      const value = optionValues[index] ? optionValues[index].textContent || '' : text;
      return { text, value };
    });
  }

  updateSelectOptions(select, wrapper) {
    const currentValue = select.value;
    const placeholder = select.options[0];

    // Clear all options
    select.innerHTML = '';

    // Restore placeholder
    if (placeholder) {
      select.add(placeholder);
    }

    // Get new options from wrapper
    const options = this.extractOptionsFromWrapper(wrapper);

    // Add new options
    options.forEach(({ text, value }) => {
      const option = document.createElement('option');
      option.text = text;
      option.value = value;
      select.add(option);
    });

    // Restore previous value if it still exists
    if (currentValue && Array.from(select.options).some((opt) => opt.value === currentValue)) {
      select.value = currentValue;
    }
  }

  // =============================================
  // STATE MANAGEMENT AND WIZED INTEGRATION
  // =============================================

  async updateWizedVariable(
    select,
    variableName,
    paginationVariable,
    filterRequest,
    forceEmpty = false
  ) {
    const value = forceEmpty ? '' : this.getSelectedValue(select);

    // Update Wized variable
    this.Wized.data.v[variableName] = value;

    // Reset pagination if needed
    if (paginationVariable) {
      this.Wized.data.v[paginationVariable] = 1;
    }

    // Execute filter request if provided
    if (filterRequest) {
      try {
        await this.Wized.requests.execute(filterRequest);
      } catch (error) {
        console.error(`Error executing filter request: ${error}`);
      }
    }
  }

  // =============================================
  // RESET FUNCTIONALITY
  // =============================================

  setupResetButton(select, category, variableName, paginationVariable, filterRequest) {
    if (!category || !filterRequest) return;

    const resetButton = document.querySelector(
      `[w-filter-select-reset="${category}"], [wized-filter-clear="${category}"]`
    );

    if (!resetButton) return;

    resetButton.addEventListener('click', async (e) => {
      e.preventDefault();

      // Clear chips for this category if available
      if (window.filterChips && window.filterChipsReady && window.filterChips.clearCategory) {
        window.filterChips.clearCategory(category);
      }

      // Reset select to first option
      select.selectedIndex = 0;

      await this.updateWizedVariable(select, variableName, paginationVariable, filterRequest, true);
    });
  }

  // =============================================
  // DYNAMIC SELECT MANAGEMENT
  // =============================================

  setupDynamicSelect(group) {
    const { element: select, requestName, variableName, paginationVariable, filterRequest } = group;

    const wrapper = this.findOptionsWrapper(select);
    if (!wrapper) return;

    this.updateSelectOptions(select, wrapper);
    this.state.dynamicSelects.set(select, { wrapper, requestName });

    // Monitor for option updates
    this.Wized.on('requestend', (result) => {
      if (result.id === requestName || result.name === requestName) {
        this.updateSelectOptions(select, wrapper);

        const currentValue = select.value;
        if (currentValue && currentValue !== this.Wized.data.v[variableName]) {
          this.updateWizedVariable(select, variableName, paginationVariable, filterRequest);
        }
      }
    });
  }

  // =============================================
  // SELECT SETUP AND MONITORING
  // =============================================

  setupSelect(select) {
    const identifier = this.createSelectIdentifier(select);
    if (this.state.monitoredSelects.has(identifier)) return;

    this.state.monitoredSelects.add(identifier);

    const variableName = select.getAttribute('w-filter-select-variable');
    const paginationVariable = select.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = select.getAttribute('w-filter-request');
    const requestName = select.getAttribute('w-filter-select-request');
    const category = select.getAttribute('w-filter-select-category');
    const isDynamic = !!requestName;

    // Initialize Wized variable if needed
    if (typeof this.Wized.data.v[variableName] === 'undefined') {
      this.Wized.data.v[variableName] = '';
    }

    // Setup reset functionality
    this.setupResetButton(select, category, variableName, paginationVariable, filterRequest);

    // Add change handler
    select.addEventListener('change', () => {
      if (this.state.processingChange) return;
      this.state.processingChange = true;

      try {
        // Store the selected value and index
        const selectedValue = select.value;
        const selectedIndex = select.selectedIndex;

        // Clear existing chips if available
        if (window.filterChips && window.filterChipsReady && window.filterChips.clearCategory) {
          window.filterChips.clearCategory(category);
        }

        // Restore the selection
        select.selectedIndex = selectedIndex;

        // Create new chip if value selected and chips are available
        if (selectedValue) {
          this.createSelectChip(select, category);
        }

        // Update Wized variable
        this.updateWizedVariable(select, variableName, paginationVariable, filterRequest);
      } catch (error) {
        console.error('Error handling select change:', error);
      } finally {
        this.state.processingChange = false;
      }
    });

    // Setup dynamic functionality if needed
    if (isDynamic) {
      this.setupDynamicSelect({
        element: select,
        requestName,
        variableName,
        paginationVariable,
        filterRequest,
      });
    }
  }

  setupFilterMonitoring() {
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return;

    const selects = filterWrapper.querySelectorAll('select[w-filter-select-variable]');

    if (selects.length === 0) return;

    selects.forEach((select) => this.setupSelect(select));
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

  async resetAllSelectInputs() {
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return;

    const selects = filterWrapper.querySelectorAll('select[w-filter-select-variable]');

    if (selects.length === 0) return;

    // Clear all select chips if available
    if (window.filterChips && window.filterChipsReady && window.filterChips.clearAll) {
      window.filterChips.clearAll();
    }

    for (const select of selects) {
      const variableName = select.getAttribute('w-filter-select-variable');
      select.selectedIndex = 0;
      this.Wized.data.v[variableName] = '';
    }
  }
}
