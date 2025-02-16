/* global describe, beforeEach, afterEach, test, expect, jest */

import FilterResetManager from '../../filters/filter-reset';
import Wized from '../../__mocks__/wized';

describe('FilterResetManager', () => {
  let manager;
  let mockResetButton;
  let consoleSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    document.body.innerHTML = '';

    // Create mock reset button
    mockResetButton = document.createElement('button');
    mockResetButton.setAttribute('w-filter-reset', 'main-reset');
    mockResetButton.setAttribute('w-filter-pagination-current-variable', 'currentPage');
    mockResetButton.setAttribute('w-filter-request', 'filterRequest');
    document.body.appendChild(mockResetButton);

    // Mock document methods
    document.querySelector = jest.fn((selector) => {
      if (selector === '[w-filter-reset="main-reset"]') return mockResetButton;
      return document.body.querySelector(selector);
    });

    // Mock global reset functions
    window.uncheckAllFilterCheckboxes = jest.fn().mockResolvedValue(undefined);
    window.uncheckAllRadioButtons = jest.fn().mockResolvedValue(undefined);
    window.resetAllSelectInputs = jest.fn().mockResolvedValue(undefined);
    window.resetAllRangeSelects = jest.fn().mockResolvedValue(undefined);
    window.resetAllSortInputs = jest.fn().mockResolvedValue(undefined);

    // Spy on console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create a new instance of the manager
    manager = new FilterResetManager(Wized);
  });

  afterEach(() => {
    // Clean up
    jest.resetAllMocks();
    document.body.innerHTML = '';
    window.uncheckAllFilterCheckboxes = undefined;
    window.uncheckAllRadioButtons = undefined;
    window.resetAllSelectInputs = undefined;
    window.resetAllRangeSelects = undefined;
    window.resetAllSortInputs = undefined;
  });

  // Initialization tests
  describe('initialization', () => {
    test('should initialize with Wized instance', () => {
      expect(manager).toBeDefined();
      expect(manager.Wized).toBe(Wized);
    });

    test('should setup reset button', () => {
      expect(document.querySelector).toHaveBeenCalledWith('[w-filter-reset="main-reset"]');
    });

    test('should handle missing reset button gracefully', () => {
      document.querySelector.mockReturnValue(null);
      const newManager = new FilterResetManager(Wized);
      expect(consoleSpy).toHaveBeenCalledWith('No reset button found, exiting setup');
    });
  });

  // Active filter detection tests
  describe('active filter detection', () => {
    beforeEach(() => {
      // Reset Wized data before each test
      Wized.data.v = {};
    });

    test('should detect active string filters', () => {
      Wized.data.v = {
        make: 'Toyota',
        pagination: '1', // Should be ignored
      };
      expect(manager.checkForActiveFilters()).toBe(true);
    });

    test('should detect active array filters', () => {
      Wized.data.v = {
        make_make: ['Toyota', 'Honda'],
        result: [], // Should be ignored
      };
      expect(manager.checkForActiveFilters()).toBe(true);
    });

    test('should detect active sort filters', () => {
      Wized.data.v = {
        car_sort: [{ orderBy: 'price', sortBy: 'asc' }],
      };
      expect(manager.checkForActiveFilters()).toBe(true);
    });

    test('should detect active number filters', () => {
      Wized.data.v = {
        price: 25000,
        itemsperpage: 10, // Should be ignored
      };
      expect(manager.checkForActiveFilters()).toBe(true);
    });

    test('should ignore system variables', () => {
      Wized.data.v = {
        pagination: '1',
        result: [],
        cards: [],
        itemsperpage: 10,
        index: 0,
      };
      expect(manager.checkForActiveFilters()).toBe(false);
    });

    test('should handle null values', () => {
      Wized.data.v = {
        make: null,
        model: null,
      };
      expect(manager.checkForActiveFilters()).toBe(false);
    });

    test('should handle empty arrays', () => {
      Wized.data.v = {
        make_make: [],
        car_sort: [],
      };
      expect(manager.checkForActiveFilters()).toBe(false);
    });

    test('should handle empty strings', () => {
      Wized.data.v = {
        make: '',
        model: '',
      };
      expect(manager.checkForActiveFilters()).toBe(false);
    });

    test('should handle zero values', () => {
      Wized.data.v = {
        price: 0,
        year: 0,
      };
      expect(manager.checkForActiveFilters()).toBe(false);
    });
  });

  // Reset functionality tests
  describe('reset functionality', () => {
    test('should reset all filter types', async () => {
      await manager.resetAllFilters(mockResetButton);

      expect(window.uncheckAllFilterCheckboxes).toHaveBeenCalled();
      expect(window.uncheckAllRadioButtons).toHaveBeenCalled();
      expect(window.resetAllSelectInputs).toHaveBeenCalled();
      expect(window.resetAllRangeSelects).toHaveBeenCalled();
      expect(window.resetAllSortInputs).toHaveBeenCalled();
    });

    test('should reset pagination', async () => {
      await manager.resetAllFilters(mockResetButton);
      expect(Wized.data.v.currentPage).toBe(1);
    });

    test('should execute filter request', async () => {
      await manager.resetAllFilters(mockResetButton);
      expect(Wized.requests.execute).toHaveBeenCalledWith('filterRequest');
    });

    test('should handle missing reset functions gracefully', async () => {
      window.uncheckAllFilterCheckboxes = undefined;
      window.uncheckAllRadioButtons = undefined;
      window.resetAllSelectInputs = undefined;
      window.resetAllRangeSelects = undefined;
      window.resetAllSortInputs = undefined;

      await manager.resetAllFilters(mockResetButton);
      expect(Wized.requests.execute).toHaveBeenCalledWith('filterRequest');
    });

    test('should handle filter request errors', async () => {
      const error = new Error('Filter request failed');
      Wized.requests.execute.mockRejectedValue(error);

      await manager.resetAllFilters(mockResetButton);
      expect(console.error).toHaveBeenCalledWith(
        'Error executing filter request: Error: Filter request failed'
      );
    });
  });

  // Event handling tests
  describe('event handling', () => {
    test('should handle reset button click with active filters', async () => {
      // Setup active filters
      Wized.data.v = { make: 'Toyota' };

      // Check for active filters and reset if needed
      if (manager.checkForActiveFilters()) {
        await manager.resetAllFilters(mockResetButton);
      }

      expect(window.uncheckAllFilterCheckboxes).toHaveBeenCalled();
      expect(Wized.requests.execute).toHaveBeenCalled();
    });

    test('should not reset when no active filters', async () => {
      // Setup no active filters
      Wized.data.v = { pagination: '1' };

      // Check for active filters and reset if needed
      if (manager.checkForActiveFilters()) {
        await manager.resetAllFilters(mockResetButton);
      }

      expect(window.uncheckAllFilterCheckboxes).not.toHaveBeenCalled();
      expect(Wized.requests.execute).not.toHaveBeenCalled();
    });

    test('should handle reset errors gracefully', async () => {
      // Setup error condition
      window.uncheckAllFilterCheckboxes.mockRejectedValue(new Error('Reset failed'));

      // Setup active filters
      Wized.data.v = { make: 'Toyota' };

      // Check for active filters and reset if needed
      if (manager.checkForActiveFilters()) {
        await manager.resetAllFilters(mockResetButton);
      }

      expect(console.error).toHaveBeenCalledWith('Error in resetAllFilters:', expect.any(Error));
    });
  });
});
