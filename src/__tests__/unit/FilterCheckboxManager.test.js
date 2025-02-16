import { FilterCheckboxManager } from '../../filters/filter-checkbox.js';
import { createMockWized, createMockFilterData, createMockDOM } from '../../__mocks__/wized.js';

describe('FilterCheckboxManager', () => {
  let manager;
  let mockWized;
  let filterData;

  beforeEach(() => {
    // Create mock data
    filterData = createMockFilterData('checkbox');

    // Setup mock DOM
    document.body.innerHTML = createMockDOM('checkbox', filterData);

    // Setup mock Wized
    mockWized = createMockWized();

    // Initialize manager
    manager = new FilterCheckboxManager(mockWized);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('initializes with Wized instance', () => {
      expect(manager.Wized).toBe(mockWized);
      expect(manager.state.monitoredGroups).toBeDefined();
      expect(manager.state.checkboxGroups).toBeNull();
    });

    test('sets up global reset function', () => {
      expect(window.uncheckAllFilterCheckboxes).toBeDefined();
      expect(typeof window.uncheckAllFilterCheckboxes).toBe('function');
    });

    test('sets up request end listener', () => {
      expect(mockWized.on).toHaveBeenCalledWith('requestend', expect.any(Function));
    });
  });

  describe('Filter Monitoring', () => {
    test('sets up filter monitoring correctly', () => {
      const groups = manager.setupFilterMonitoring();
      expect(groups).toBeDefined();
      expect(Object.keys(groups).length).toBe(1);
      expect(groups.filter1.variableName).toBe(filterData.variable);
      expect(groups.filter1.elements.length).toBe(filterData.values.length);
    });

    test('handles missing filter wrapper', () => {
      document.body.innerHTML = '';
      const groups = manager.setupFilterMonitoring();
      expect(groups).toBeNull();
    });
  });

  describe('Checkbox Interactions', () => {
    test('handles single checkbox click', async () => {
      const checkbox = document.querySelector('label[wized="filter1"]');
      checkbox.click();

      // Wait for any async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockWized.requests.execute).toHaveBeenCalledWith(filterData.request);
      expect(mockWized.data.v[filterData.variable]).toBeDefined();
    });

    test('handles multiple checkbox selections', async () => {
      const checkboxes = document.querySelectorAll('label[wized="filter1"]');

      // Click first two checkboxes
      checkboxes[0].click();
      checkboxes[1].click();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockWized.data.v[filterData.variable]).toHaveLength(2);
      expect(mockWized.requests.execute).toHaveBeenCalledTimes(2);
    });
  });

  describe('Reset Functionality', () => {
    test('unchecks all checkboxes correctly', async () => {
      const checkboxes = document.querySelectorAll('label[wized="filter1"]');

      // Check all checkboxes first
      checkboxes.forEach((checkbox) => checkbox.click());

      await manager.uncheckAllFilterCheckboxes();

      expect(mockWized.data.v[filterData.variable]).toEqual([]);
      checkboxes.forEach((checkbox) => {
        expect(
          checkbox.querySelector('.w-checkbox-input--inputType-custom.w--redirected-checked')
        ).toBeNull();
      });
    });

    test('handles reset with no checkboxes selected', async () => {
      await manager.uncheckAllFilterCheckboxes();
      expect(mockWized.data.v[filterData.variable]).toEqual([]);
    });
  });

  describe('Visual State Management', () => {
    test('updates checkbox visual state correctly', () => {
      const checkbox = document.querySelector('label[wized="filter1"]');
      manager.updateCheckboxVisualState(checkbox, true);

      expect(
        checkbox.querySelector('.w-checkbox-input--inputType-custom.w--redirected-checked')
      ).toBeTruthy();

      manager.updateCheckboxVisualState(checkbox, false);
      expect(
        checkbox.querySelector('.w-checkbox-input--inputType-custom.w--redirected-checked')
      ).toBeNull();
    });

    test('handles missing custom checkbox element', () => {
      const checkbox = document.querySelector('label[wized="filter1"]');
      checkbox.querySelector('.w-checkbox-input--inputType-custom').remove();

      // Should not throw error
      expect(() => {
        manager.updateCheckboxVisualState(checkbox, true);
      }).not.toThrow();
    });
  });

  describe('Label Management', () => {
    test('gets checkbox label text correctly', () => {
      const checkbox = document.querySelector('label[wized="filter1"]');
      const label = manager.getCheckboxLabel(checkbox);
      expect(label).toBe(filterData.values[0]);
    });

    test('handles missing label element', () => {
      const checkbox = document.querySelector('label[wized="filter1"]');
      checkbox.querySelector('[w-filter-checkbox-label]').remove();

      const label = manager.getCheckboxLabel(checkbox);
      expect(label).toBe('');
    });
  });
});
