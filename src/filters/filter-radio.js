/**
 * FilterRadioManager: Main class responsible for managing radio-based filtering functionality
 */
export default class FilterRadioManager {
  constructor(Wized) {
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredGroups: new Set(), // Tracks which radio groups are being monitored
      radioGroups: null, // Stores organized radio group data
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
    if (!window.filterChips) return;

    const label = this.getRadioLabel(radio);
    if (!label) return;

    const variableName = radio.getAttribute('w-filter-radio-variable');
    const paginationVariable = radio.getAttribute('w-filter-pagination-current-variable');
    const filterRequest = radio.getAttribute('w-filter-request');

    const chip = window.filterChips.create({
      label: `${category.toUpperCase()}: ${label}`,
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
      try {
        await this.Wized.requests.execute(filterRequest);
      } catch (error) {
        console.error(`Error executing filter request:`, error);
      }
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

    resetButton.addEventListener('click', async (e) => {
      e.preventDefault();

      const variableName = firstRadio.getAttribute('w-filter-radio-variable');
      const paginationVariable = firstRadio.getAttribute('w-filter-pagination-current-variable');

      if (window.filterChips) {
        window.filterChips.clearCategory(category);
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
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return null;

    const radios = filterWrapper.querySelectorAll('label[wized][w-filter-radio-variable]');

    if (radios.length > 0) {
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
    setTimeout(() => {
      const category = radio.getAttribute('w-filter-radio-category');

      if (window.filterChips) {
        window.filterChips.clearCategory(category);
      }

      elements.forEach((otherRadio) => {
        this.updateRadioVisualState(otherRadio, otherRadio === radio);
      });

      this.createRadioChip(radio, category);
      this.updateWizedVariable(elements, variableName, paginationVariable, filterRequest);
    }, 50);
  }

  setupGroupEventHandlers(group) {
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
        this.Wized.on('requestend', (filterResult) => {
          if (filterResult.id === requestName || filterResult.name === requestName) {
            // Dynamic filter request completed
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
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) return;

    const radios = filterWrapper.querySelectorAll('label[wized][w-filter-radio-variable]');
    if (radios.length === 0) return;

    if (window.filterChips && window.filterChipsReady && window.filterChips.clearAll) {
      window.filterChips.clearAll();
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
      radioGroup.forEach((radio) => {
        this.updateRadioVisualState(radio, false);
      });

      this.Wized.data.v[variableName] = '';
    }
  }
}
