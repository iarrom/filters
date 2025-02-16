/**
 * FilterSortManager: Main class responsible for managing sort-based filtering functionality
 *
 * This class handles:
 * 1. State Management: Tracks sort states and filter variables
 * 2. UI Management: Handles sort select updates and options
 * 3. Event Handling: Manages change events and request completions
 * 4. Wized Integration: Coordinates with Wized for data and requests
 */
export default class FilterSortManager {
  constructor(Wized) {
    // console.log("FilterSortManager: Initializing...");
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredSorts: new Set(),
      initialized: false,
      processingChange: false, // Prevent multiple simultaneous changes
      dynamicSorts: new Map(), // Track selects with dynamic options
    };

    // Bind methods
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.resetAllSortInputs = this.resetAllSortInputs.bind(this);

    // Initialize and run initial setup
    this.initialize();
    this.setupFilterMonitoring();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  initialize() {
    if (this.state.initialized) return;

    // Make reset function globally available
    window.resetAllSortInputs = this.resetAllSortInputs;

    // Set up request monitoring
    this.Wized.on('requestend', this.handleRequestEnd);

    this.state.initialized = true;
    // console.log("FilterSortManager: Initialization complete");
  }

  // =============================================
  // SORT HELPERS AND DOM MANIPULATION
  // =============================================

  findOptionsWrapper(select) {
    const category = select.getAttribute('w-filter-sort-category');
    // console.log("FilterSortManager: Looking for wrapper with category:", category);

    if (!category) {
      // console.warn("FilterSortManager: No category found on select element");
      return null;
    }

    const wrapper = document.querySelector(
      `[w-filter-sort-category="${category}"][w-filter-sort-option="wrapper"]`
    );

    // console.log("FilterSortManager: Found wrapper:", wrapper);
    return wrapper;
  }

  extractOptionsFromWrapper(wrapper) {
    const optionElements = wrapper.querySelectorAll('[w-filter-sort-option="option-text"]');
    // console.log("FilterSortManager: Found option elements:", optionElements.length);

    const options = Array.from(optionElements).map((optionEl) => {
      const option = {
        text: optionEl.textContent || '',
        orderBy: optionEl.getAttribute('w-filter-sort-orderby') || '',
        sortBy: optionEl.getAttribute('w-filter-sort-sortby') || '',
      };
      // console.log("FilterSortManager: Extracted option:", option);
      return option;
    });

    return options;
  }

  updateSelectOptions(select, wrapper) {
    // console.log("FilterSortManager: Updating select options...");
    const currentValue = select.value;
    const placeholder = select.options[0];
    // console.log("FilterSortManager: Current value:", currentValue);
    // console.log("FilterSortManager: Placeholder:", placeholder?.text);

    // Clear all options
    select.innerHTML = '';

    // Restore placeholder
    if (placeholder) {
      select.add(placeholder);
      // console.log("FilterSortManager: Restored placeholder");
    }

    // Get new options from wrapper
    const options = this.extractOptionsFromWrapper(wrapper);
    // console.log("FilterSortManager: Extracted options:", options);

    // Add new options
    options.forEach(({ text, orderBy, sortBy }) => {
      const option = document.createElement('option');
      option.text = text;
      option.value = JSON.stringify({ orderBy, sortBy });
      select.add(option);
      // console.log("FilterSortManager: Added option:", { text, value: option.value });
    });

    // Restore previous value if it still exists
    if (currentValue && Array.from(select.options).some((opt) => opt.value === currentValue)) {
      select.value = currentValue;
      // console.log("FilterSortManager: Restored previous value:", currentValue);
    }
  }

  // =============================================
  // STATE MANAGEMENT AND WIZED INTEGRATION
  // =============================================

  async updateWizedVariable(select, variableName, paginationVariable, filterRequest) {
    // console.log("FilterSortManager: Updating Wized variable...");
    let value = [];

    if (select.value) {
      try {
        const selectedOption = JSON.parse(select.value);
        value = [
          {
            orderBy: selectedOption.orderBy || '',
            sortBy: selectedOption.sortBy || '',
          },
        ];
        // console.log("FilterSortManager: Parsed selected option:", value);
      } catch (error) {
        // console.error("FilterSortManager: Error parsing sort option:", error);
        value = [{ orderBy: '', sortBy: '' }];
      }
    } else {
      value = [{ orderBy: '', sortBy: '' }];
    }

    // Update Wized variable
    this.Wized.data.v[variableName] = value;
    // console.log("FilterSortManager: Updated Wized variable:", variableName, "with value:", value);

    // Reset pagination if needed
    if (paginationVariable) {
      this.Wized.data.v[paginationVariable] = 1;
      // console.log("FilterSortManager: Reset pagination to 1");
    }

    // Execute filter request if provided
    if (filterRequest) {
      try {
        // console.log("FilterSortManager: Executing filter request:", filterRequest);
        await this.Wized.requests.execute(filterRequest);
      } catch (error) {
        // console.error("FilterSortManager: Error executing filter request:", error);
      }
    }
  }

  // =============================================
  // SELECT SETUP AND MONITORING
  // =============================================

  setupDynamicSort(select) {
    const requestName = select.getAttribute('w-filter-sort-request');
    if (!requestName) return;

    const category = select.getAttribute('w-filter-sort-category');
    const variableName = select.getAttribute('w-filter-sort-variable');
    const paginationVariable = select.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = select.getAttribute('w-filter-request');

    // Find the options wrapper
    const wrapper = document.querySelector(
      `[w-filter-sort-category="${category}"][w-filter-sort-option="wrapper"]`
    );
    if (!wrapper) return;

    // Store the dynamic sort info
    this.state.dynamicSorts.set(select, { wrapper, requestName });

    // Monitor for option updates
    this.Wized.on('requestend', (result) => {
      if (result.id === requestName || result.name === requestName) {
        // console.log("Dynamic sort: Updating options for request:", requestName);

        // Update the options
        this.updateSelectOptions(select, wrapper);

        // Check if we need to update the Wized variable
        const currentValue = select.value;
        if (currentValue && currentValue !== this.Wized.data.v[variableName]) {
          this.updateWizedVariable(select, variableName, paginationVariable, filterRequest);
        }
      }
    });
  }

  setupSelect(select) {
    // console.log("FilterSortManager: Setting up sort select...");
    const variableName = select.getAttribute('w-filter-sort-variable');
    const category = select.getAttribute('w-filter-sort-category');
    const identifier = `${category}-${variableName}`;

    // console.log("FilterSortManager: Select details:", { variableName, category, identifier });

    if (this.state.monitoredSorts.has(identifier)) {
      // console.log("FilterSortManager: Select already monitored, skipping setup");
      return;
    }

    this.state.monitoredSorts.add(identifier);

    const paginationVariable = select.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = select.getAttribute('w-filter-request');
    const requestName = select.getAttribute('w-filter-sort-request');
    const isDynamic = !!requestName;

    // Find the options wrapper with matching category
    const optionsWrapper = document.querySelector(
      `[w-filter-sort-category="${category}"][w-filter-sort-option="wrapper"]`
    );
    // console.log("Found options wrapper:", optionsWrapper);

    if (!optionsWrapper) {
      // console.warn("No options wrapper found");
      return;
    }

    // Get all option elements
    const optionElements = optionsWrapper.querySelectorAll('[w-filter-sort-option="option-text"]');
    // console.log("Found option elements:", optionElements.length);

    // Store the placeholder option if it exists
    const placeholder = select.options[0];

    // Clear existing options
    select.innerHTML = '';

    // Restore placeholder if it existed
    if (placeholder) {
      select.add(placeholder);
    }

    // Add new options
    optionElements.forEach((optionEl) => {
      const option = document.createElement('option');
      option.text = optionEl.textContent;
      option.value = JSON.stringify({
        orderBy: optionEl.getAttribute('w-filter-sort-orderby'),
        sortBy: optionEl.getAttribute('w-filter-sort-sortby'),
      });
      select.add(option);
      // console.log("Added option:", option.text, option.value);
    });

    // Initialize Wized variable if needed
    if (typeof this.Wized.data.v[variableName] === 'undefined') {
      this.Wized.data.v[variableName] = [];
    }

    // Setup dynamic functionality if needed
    if (isDynamic) {
      // console.log("Setting up dynamic sort for:", category);
      this.setupDynamicSort(select);
    }

    // Add change handler
    select.addEventListener('change', async () => {
      // console.log("Sort selection changed");

      if (this.state.processingChange) return;
      this.state.processingChange = true;

      try {
        // Store the selected value and index
        const selectedValue = select.value;
        const selectedIndex = select.selectedIndex;
        // console.log("Chips: Stored selection:", { selectedValue, selectedIndex });

        // Clear existing chips for this category if chips manager is available
        if (window.filterChips && window.filterChipsReady && window.filterChips.clearCategory) {
          // console.log("Chips: Clearing chips for category:", category);
          window.filterChips.clearCategory(category);
        }

        // Restore the selection
        select.selectedIndex = selectedIndex;
        // console.log("Chips: Restored selection index:", selectedIndex);

        let sortValue = []; // Default empty value

        if (selectedValue && selectedIndex > 0) {
          try {
            const selectedOption = JSON.parse(selectedValue);
            sortValue = [
              {
                orderBy: selectedOption.orderBy || '',
                sortBy: selectedOption.sortBy || '',
              },
            ];

            // Create chip if an option is selected and chips manager is available
            if (window.filterChips && window.filterChipsReady) {
              const selectedText = select.options[selectedIndex].text;
              const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

              // console.log("Chips: Creating new chip with:", {
              //   selectedText,
              //   categoryLabel,
              //   value: selectedValue,
              // });

              const chip = window.filterChips.create({
                label: `${categoryLabel}: ${selectedText}`,
                filterType: 'sort',
                category: category,
                value: selectedValue,
                sourceElement: select,
                onSourceUpdate: async () => {
                  // console.log("Chips: Chip removed, executing onSourceUpdate");
                  // console.log("Chips: Current select value before reset:", select.value);

                  // Reset the select to its first option
                  select.selectedIndex = 0;
                  // console.log("Chips: Select index after reset:", select.selectedIndex);

                  // Update Wized variable
                  this.Wized.data.v[variableName] = [];
                  // console.log("Chips: Cleared Wized variable:", variableName);

                  // Reset pagination if needed
                  if (paginationVariable) {
                    this.Wized.data.v[paginationVariable] = 1;
                    // console.log("Chips: Reset pagination to 1");
                  }

                  // Execute the filter request
                  if (filterRequest) {
                    try {
                      // console.log("Chips: Executing filter request after chip removal");
                      await this.Wized.requests.execute(filterRequest);
                    } catch (error) {
                      // console.error("Chips: Error executing filter request:", error);
                    }
                  }
                },
              });

              if (chip && window.filterChips.addToContainer) {
                // console.log("Chips: Adding chip to container");
                window.filterChips.addToContainer(chip);
              }
            }
          } catch (error) {
            // console.error("Error parsing sort option:", error);
          }
        }

        // Update Wized variable
        this.Wized.data.v[variableName] = sortValue;
        // console.log("Updated Wized variable:", variableName, "with value:", sortValue);

        // Reset pagination to 1
        if (paginationVariable) {
          this.Wized.data.v[paginationVariable] = 1;
          // console.log("Reset pagination to 1");
        }

        // Execute the filter request if provided
        if (filterRequest) {
          try {
            // console.log("Executing filter request:", filterRequest);
            await this.Wized.requests.execute(filterRequest);
          } catch (error) {
            // console.error("Error executing filter request:", error);
          }
        }
      } catch (error) {
        // console.error("Error handling sort change:", error);
      } finally {
        this.state.processingChange = false;
      }
    });
  }

  setupFilterMonitoring() {
    // console.log("FilterSortManager: Setting up filter monitoring...");

    // First try to find all sort selects anywhere in the document
    const allSortSelects = document.querySelectorAll('select[w-filter-sort-variable]');
    // console.log("FilterSortManager: All sort selects in document:", {
    //   count: allSortSelects.length,
    //   elements: Array.from(allSortSelects).map((select) => ({
    //     variable: select.getAttribute("w-filter-sort-variable"),
    //     category: select.getAttribute("w-filter-sort-category"),
    //     parentElement: select.parentElement.className,
    //   })),
    // });

    // If we found any sort selects, set them up regardless of wrapper
    if (allSortSelects.length > 0) {
      allSortSelects.forEach((select) => this.setupSelect(select));
      return;
    }

    // If no sort selects found, try to find them within the wrapper
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) {
      // console.warn("FilterSortManager: No filter wrapper found");
      return;
    }

    const sortSelects = filterWrapper.querySelectorAll('select[w-filter-sort-variable]');

    if (sortSelects.length === 0) {
      // console.warn("FilterSortManager: No sort selects found in wrapper");
      return;
    }

    sortSelects.forEach((select) => this.setupSelect(select));
  }

  // =============================================
  // EVENT HANDLING
  // =============================================

  handleRequestEnd() {
    // console.log("FilterSortManager: Request ended, setting up monitoring");
    this.setupFilterMonitoring();
  }

  // =============================================
  // PUBLIC API
  // =============================================

  async resetAllSortInputs() {
    // console.log("FilterSortManager: Starting sort reset...");

    // First try to find the sort select directly
    const sortSelect = document.querySelector('select[w-filter-sort-variable]');
    if (sortSelect) {
      // console.log("FilterSortManager: Found sort select directly");
      const variableName = sortSelect.getAttribute('w-filter-sort-variable');
      const category = sortSelect.getAttribute('w-filter-sort-category');

      // Clear chips for this category if chips manager is available
      if (window.filterChips && window.filterChipsReady && window.filterChips.clearCategory) {
        window.filterChips.clearCategory(category);
      }

      sortSelect.selectedIndex = 0;
      this.Wized.data.v[variableName] = [];
      // console.log("FilterSortManager: Reset sort select:", variableName);
      return;
    }

    // If direct select not found, try through filter wrapper
    // console.log("FilterSortManager: Trying to find sort select through wrapper...");
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) {
      // console.warn("FilterSortManager: No filter wrapper found for reset");
      return;
    }

    const sortSelects = filterWrapper.querySelectorAll('select[w-filter-sort-variable]');
    // console.log("FilterSortManager: Found sort selects in wrapper:", sortSelects.length);

    if (sortSelects.length === 0) {
      // console.warn("FilterSortManager: No sort selects found to reset");
      return;
    }

    for (const select of sortSelects) {
      const variableName = select.getAttribute('w-filter-sort-variable');
      const category = select.getAttribute('w-filter-sort-category');
      // console.log("FilterSortManager: Resetting sort select:", variableName);

      // Clear chips for this category if chips manager is available
      if (window.filterChips && window.filterChipsReady && window.filterChips.clearCategory) {
        window.filterChips.clearCategory(category);
      }

      select.selectedIndex = 0;
      this.Wized.data.v[variableName] = [];
      // console.log("FilterSortManager: Reset complete for:", variableName);
    }
  }
}
