/**
 * Creates a mock Wized instance for testing
 * @param {Object} overrides - Optional overrides for the mock
 * @returns {Object} Mock Wized instance
 */
export const createMockWized = (overrides = {}) => ({
  data: {
    v: {}, // Variables
    r: {}, // Requests
    subscribe: jest.fn(),
  },
  requests: {
    execute: jest.fn(),
  },
  on: jest.fn(),
  ...overrides,
});

/**
 * Creates mock filter data for testing
 * @param {string} type - Filter type (checkbox, radio, etc.)
 * @param {Object} options - Filter options
 * @returns {Object} Mock filter data
 */
export const createMockFilterData = (type, options = {}) => {
  const defaults = {
    checkbox: {
      variable: 'category',
      category: 'productType',
      request: 'filterProducts',
      values: ['Electronics', 'Clothing', 'Books'],
    },
    radio: {
      variable: 'sort',
      category: 'sortOrder',
      request: 'sortProducts',
      values: ['Price: Low to High', 'Price: High to Low'],
    },
    select: {
      variable: 'brand',
      category: 'brandName',
      request: 'filterBrands',
      values: ['Nike', 'Adidas', 'Puma'],
    },
    pagination: {
      request: 'loadMore',
      initialRequest: 'initialLoad',
      resultVariable: 'items',
      nextVariable: 'nextPage',
      currentVariable: 'currentPage',
    },
  };

  return {
    ...defaults[type],
    ...options,
  };
};

/**
 * Creates mock DOM elements for testing
 * @param {string} type - Filter type
 * @param {Object} data - Filter data
 * @returns {string} HTML string
 */
export const createMockDOM = (type, data) => {
  const templates = {
    checkbox: (data) => `
      <div w-filter-wrapper>
        ${data.values
          .map(
            (value) => `
          <label wized="filter1" 
                 w-filter-checkbox-variable="${data.variable}"
                 w-filter-checkbox-category="${data.category}"
                 w-filter-request="${data.request}">
            <input type="checkbox">
            <div w-filter-checkbox-label>${value}</div>
          </label>
        `
          )
          .join('')}
      </div>
    `,
    radio: (data) => `
      <div w-filter-wrapper>
        ${data.values
          .map(
            (value) => `
          <label wized="filter1"
                 w-filter-radio-variable="${data.variable}"
                 w-filter-radio-category="${data.category}"
                 w-filter-request="${data.request}">
            <input type="radio">
            <div w-filter-radio-label>${value}</div>
          </label>
        `
          )
          .join('')}
      </div>
    `,
    pagination: (data) => `
      <div w-filter-wrapper>
        <div w-filter-pagination-trigger
             w-filter-pagination-request="${data.initialRequest}"
             w-filter-request="${data.request}"
             w-filter-result-variable="${data.resultVariable}"
             w-filter-pagination-next-variable="${data.nextVariable}"
             w-filter-pagination-current-variable="${data.currentVariable}">
        </div>
      </div>
    `,
  };

  return templates[type](data);
};
