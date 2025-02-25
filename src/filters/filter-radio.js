/**
 * FilterRadioManager: Main class responsible for managing radio-based filtering functionality
 */
export default class FilterRadioManager {
  constructor(Wized) {
    console.log('[FilterRadioManager] Initializing...');
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredGroups: new Set(), // Tracks which radio groups are being monitored
      radioGroups: null, // Stores organized radio group data
      hasChipsSupport: false, // Track if chips functionality is available
    };

    // Bind methods
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.uncheckAllRadioButtons = this.uncheckAllRadioButtons.bind(this);

    // Initialize immediately
    this.initialize();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  initialize() {
    console.log('[FilterRadioManager] Setting up global functions and event listeners');
    // Make uncheck function globally available
    window.uncheckAllRadioButtons = this.uncheckAllRadioButtons;

    // Set up request monitoring
    this.Wized.on('requestend', this.handleRequestEnd);
  }

  // =============================================
  // UI HELPERS AND DOM MANIPULATION
  // =============================================

  getRadioLabel(radio) {
    return radio.querySelector('[w-filter-radio-label]')?.textContent || '';
  }

  updateRadioVisualState(radio, checked) {
    const customRadio = radio.querySelector('.w-form-formradioinput--inputType-custom');
    if (customRadio) {
      if (checked) {
        customRadio.classList.add('w--redirected-checked');
      } else {
        customRadio.classList.remove('w--redirected-checked');
      }
    }
  }

  // =============================================
  // CHIPS INTEGRATION
  // =============================================

  createRadioChip(radio, category) {
    if (!window.filterChips || !window.filterChipsReady) {
      console.log('[FilterRadioManager] Chips functionality not available, skipping chip creation');
      return;
    }

    console.log('[FilterRadioManager] Creating radio chip');
    const label = this.getRadioLabel(radio);
    if (!label) return;

    const variableName = radio.getAttribute('w-filter-radio-variable');
    const paginationVariable = radio.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = radio.getAttribute('w-filter-request');

    try {
      const chip = window.filterChips.create({
        label: `${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}: ${label}`,
        filterType: 'radio',
        category,
        value: label,
        sourceElement: radio,
        onSourceUpdate: async () => {
          const group = document.querySelectorAll(`[w-filter-radio-variable="${variableName}"]`);
          group.forEach((groupRadio) => {
            this.updateRadioVisualState(groupRadio, false);
          });
          await this.updateWizedVariable(
            Array.from(group),
            variableName,
            paginationVariable,
            filterRequest,
            true
          );
        },
      });

      if (chip && window.filterChips.addToContainer) {
        window.filterChips.addToContainer(chip);
      }
    } catch (error) {
      console.error('[FilterRadioManager] Error creating chip:', error);
      // Continue radio functionality even if chip creation fails
    }
  }

  // =============================================
  // STATE MANAGEMENT AND WIZED INTEGRATION
  // =============================================

  async updateWizedVariable(
    radios,
    variableName,
    paginationVariable,
    filterRequest,
    forceEmpty = false
  ) {
    console.log('[FilterRadioManager] Updating Wized variable:', {
      variableName,
      paginationVariable,
      forceEmpty,
    });

    try {
      const selectedValue = forceEmpty
        ? ''
        : Array.from(radios).find((radio) =>
            radio.querySelector('.w-form-formradioinput--inputType-custom.w--redirected-checked')
          );

      const value = selectedValue ? this.getRadioLabel(selectedValue) : '';
      this.Wized.data.v[variableName] = value;

      if (paginationVariable) {
        this.Wized.data.v[paginationVariable] = 1;
      }

      if (filterRequest) {
        await this.Wized.requests.execute(filterRequest);
      }

      console.log('[FilterRadioManager] Successfully updated Wized variable:', {
        variableName,
        value,
      });
    } catch (error) {
      console.error('[FilterRadioManager] Error updating Wized variable:', error);
    }
  }

  // =============================================
  // RESET FUNCTIONALITY
  // =============================================

  setupResetButton(group) {
    const { elements: radios } = group;
    if (radios.length === 0) return;

    const firstRadio = radios[0];
    const category = firstRadio.getAttribute('w-filter-radio-category');
    const filterRequest = firstRadio.getAttribute('w-filter-request');

    if (!category || !filterRequest) return;

    const resetButton = document.querySelector(`[w-filter-radio-reset="${category}"]`);
    if (!resetButton) return;

    console.log('[FilterRadioManager] Setting up reset button for category:', category);

    resetButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[FilterRadioManager] Reset button clicked for category:', category);

      const variableName = firstRadio.getAttribute('w-filter-radio-variable');
      const paginationVariable = firstRadio.getAttribute('w-filter-pagination-current-variable');

      // Try to clear chips if available, but continue if it fails
      if (window.filterChips && window.filterChipsReady) {
        try {
          window.filterChips.clearCategory(category);
        } catch (error) {
          console.error('[FilterRadioManager] Error clearing chips:', error);
        }
      }

      radios.forEach((radio) => {
        this.updateRadioVisualState(radio, false);
      });

      await this.updateWizedVariable(radios, variableName, paginationVariable, filterRequest, true);
    });
  }

  // =============================================
  // FILTER GROUP MANAGEMENT
  // =============================================

  setupFilterMonitoring() {
    console.log('[FilterRadioManager] Setting up filter monitoring');
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return null;

    const radios = filterWrapper.querySelectorAll('label[wized][w-filter-radio-variable]');

    if (radios.length > 0) {
      console.log('[FilterRadioManager] Found radio buttons to monitor:', radios.length);
      return Array.from(radios).reduce((groups, radio) => {
        const wizedValue = radio.getAttribute('wized');
        const variableName = radio.getAttribute('w-filter-radio-variable');
        const paginationVariable = radio.getAttribute('w-filter-pagination-current-variable');
        const filterRequest = radio.getAttribute('w-filter-request');
        const requestName = radio.getAttribute('w-filter-radio-request');

        if (!groups[wizedValue]) {
          groups[wizedValue] = {
            wizedName: wizedValue,
            requestName,
            variableName,
            paginationVariable,
            filterRequest,
            elements: [],
            isStatic: !requestName,
          };
        }
        groups[wizedValue].elements.push(radio);
        return groups;
      }, {});
    }
    return null;
  }

  // =============================================
  // EVENT HANDLING
  // =============================================

  handleRadioClick(radio, elements, variableName, paginationVariable, filterRequest) {
    console.log('[FilterRadioManager] Handling radio click:', {
      variableName,
      paginationVariable,
      filterRequest,
    });

    setTimeout(() => {
      const category = radio.getAttribute('w-filter-radio-category');

      // First handle the core radio functionality
      elements.forEach((otherRadio) => {
        this.updateRadioVisualState(otherRadio, otherRadio === radio);
      });

      // Update Wized variable
      this.updateWizedVariable(elements, variableName, paginationVariable, filterRequest)
        .then(() => {
          console.log('[FilterRadioManager] Successfully handled radio click');

          // Then try to handle chips if available
          if (window.filterChips && window.filterChipsReady) {
            try {
              window.filterChips.clearCategory(category);
              this.createRadioChip(radio, category);
            } catch (error) {
              console.error('[FilterRadioManager] Error handling chips:', error);
              // Continue radio functionality even if chips fail
            }
          }
        })
        .catch((error) => {
          console.error('[FilterRadioManager] Error handling radio click:', error);
        });
    }, 50);
  }

  setupGroupEventHandlers(group) {
    console.log('[FilterRadioManager] Setting up group event handlers:', {
      wizedName: group.wizedName,
      variableName: group.variableName,
    });

    const {
      wizedName,
      requestName,
      variableName,
      paginationVariable,
      filterRequest,
      elements,
      isStatic,
    } = group;

    const groupKey = `${wizedName}-${variableName}`;

    if (!this.state.monitoredGroups.has(groupKey)) {
      this.state.monitoredGroups.add(groupKey);

      if (!this.Wized.data.v[variableName]) {
        console.log('[FilterRadioManager] Initializing Wized variable:', variableName);
        this.Wized.data.v[variableName] = '';
      }

      this.setupResetButton(group);

      elements.forEach((radio) => {
        radio.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleRadioClick(radio, elements, variableName, paginationVariable, filterRequest);
        });
      });

      if (!isStatic && requestName) {
        console.log(
          '[FilterRadioManager] Setting up dynamic filter request monitoring:',
          requestName
        );
        this.Wized.on('requestend', (filterResult) => {
          if (filterResult.id === requestName || filterResult.name === requestName) {
            console.log('[FilterRadioManager] Dynamic filter request completed:', filterResult);
          }
        });
      }
    }
  }

  handleRequestEnd(_result) {
    const radioGroups = this.setupFilterMonitoring();

    if (radioGroups) {
      Object.values(radioGroups).forEach((group) => {
        this.setupGroupEventHandlers(group);
      });
    }
  }

  // =============================================
  // PUBLIC API
  // =============================================

  async uncheckAllRadioButtons() {
    console.log('[FilterRadioManager] Unchecking all radio buttons...');

    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) {
      console.log('[FilterRadioManager] No filter wrapper found');
      return;
    }

    const radios = filterWrapper.querySelectorAll('label[wized][w-filter-radio-variable]');
    if (radios.length === 0) {
      console.log('[FilterRadioManager] No radio buttons found');
      return;
    }

    // Try to clear chips if available
    if (window.filterChips && window.filterChipsReady && window.filterChips.clearAll) {
      console.log('[FilterRadioManager] Clearing all chips');
      try {
        window.filterChips.clearAll();
      } catch (error) {
        console.error('[FilterRadioManager] Error clearing chips:', error);
        // Continue with radio reset even if chips fail
      }
    }

    const groupedByVariable = Array.from(radios).reduce((groups, radio) => {
      const variableName = radio.getAttribute('w-filter-radio-variable');
      if (!groups[variableName]) {
        groups[variableName] = [];
      }
      groups[variableName].push(radio);
      return groups;
    }, {});

    for (const [variableName, radioGroup] of Object.entries(groupedByVariable)) {
      console.log('[FilterRadioManager] Resetting radio group:', variableName);

      radioGroup.forEach((radio) => {
        this.updateRadioVisualState(radio, false);
      });

      try {
        this.Wized.data.v[variableName] = '';
        console.log('[FilterRadioManager] Successfully reset Wized variable:', variableName);
      } catch (error) {
        console.error('[FilterRadioManager] Error resetting Wized variable:', variableName, error);
      }
    }
  }
}
