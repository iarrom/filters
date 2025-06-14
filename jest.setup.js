/* global jest, expect */

// Mock the Wized global object
global.Wized = {
  data: {
    v: {},
    r: {},
    subscribe: jest.fn(),
  },
  requests: {
    execute: jest.fn(),
  },
  on: jest.fn(),
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  /**
   * @param {Function} _callback - Callback function for intersection events (unused in mock)
   */
  constructor(_callback) {
    // Implementation for tests
  }

  observe() {
    // Implementation for tests
  }

  unobserve() {
    // Implementation for tests
  }

  disconnect() {
    // Implementation for tests
  }
};

// Mock DOM environment
global.document = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  createElement: jest.fn(),
  body: {
    appendChild: jest.fn(),
    innerHTML: '',
  },
};

// Mock window object
global.window = {
  Wized: [],
  filterChips: {
    create: jest.fn(),
    addToContainer: jest.fn(),
    clearCategory: jest.fn(),
    clearAll: jest.fn(),
    exists: jest.fn(),
    removeByValue: jest.fn(),
  },
  location: {
    search: '',
    pathname: '/',
    hash: '',
  },
  history: {
    replaceState: jest.fn((_, __, url) => {
      const parsed = new URL(url, 'http://localhost');
      global.window.location.search = parsed.search;
    }),
  },
};

// Mock MutationObserver
global.MutationObserver = class {
  /**
   * @param {Function} _callback - Callback function for mutation events (unused in mock)
   */
  constructor(_callback) {
    // Implementation for tests
  }
  disconnect() {
    // Implementation for tests
  }
  /**
   * @param {Element} _element - The element to observe (unused in mock)
   * @param {Object} _initObject - Observer configuration (unused in mock)
   */
  observe(_element, _initObject) {
    // Implementation for tests
  }
};

// Add custom jest matchers if needed
expect.extend({
  // Add custom matchers here
  toHaveBeenCalledWithMatch(received, ...expected) {
    const pass = received.mock.calls.some((call) =>
      expected.every((arg, index) => {
        if (typeof arg === 'function') {
          return arg(call[index]);
        }
        return JSON.stringify(call[index]) === JSON.stringify(arg);
      })
    );

    return {
      pass,
      message: () =>
        `expected ${received.getMockName()} to have been called with arguments matching ${expected.join(
          ', '
        )}`,
    };
  },
});
