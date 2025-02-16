import { FilterCheckboxManager } from '../filters/filter-checkbox.js';

describe('FilterCheckboxManager', () => {
  let manager;
  let mockWized;

  beforeEach(() => {
    // Setup mock DOM
    document.body.innerHTML = `
      <div w-filter-wrapper>
        <label wized="filter1" 
               w-filter-checkbox-variable="category"
               w-filter-checkbox-category="productType"
               w-filter-request="filterProducts">
          <input type="checkbox">
          <div w-filter-checkbox-label>Electronics</div>
        </label>
      </div>
    `;

    // Setup mock Wized
    mockWized = {
      data: {
        v: {},
        subscribe: jest.fn(),
      },
      requests: {
        execute: jest.fn(),
      },
      on: jest.fn(),
    };

    manager = new FilterCheckboxManager(mockWized);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('initializes with Wized instance', () => {
    expect(manager.Wized).toBe(mockWized);
    expect(manager.state.monitoredGroups).toBeDefined();
    expect(manager.state.checkboxGroups).toBeNull();
  });

  test('sets up filter monitoring correctly', () => {
    const groups = manager.setupFilterMonitoring();
    expect(groups).toBeDefined();
    expect(Object.keys(groups).length).toBe(1);
    expect(groups.filter1.variableName).toBe('category');
  });

  test('handles checkbox click correctly', async () => {
    const checkbox = document.querySelector('label[wized="filter1"]');
    checkbox.click();

    // Wait for any async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockWized.requests.execute).toHaveBeenCalledWith('filterProducts');
    expect(mockWized.data.v.category).toBeDefined();
  });

  test('unchecks all checkboxes correctly', async () => {
    // First check the checkbox
    const checkbox = document.querySelector('label[wized="filter1"]');
    checkbox.click();

    // Then uncheck all
    await manager.uncheckAllFilterCheckboxes();

    expect(mockWized.data.v.category).toEqual([]);
    expect(
      checkbox.querySelector('.w-checkbox-input--inputType-custom.w--redirected-checked')
    ).toBeNull();
  });
});
