/* global global, jest, expect */

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
};

// Mock MutationObserver
global.MutationObserver = class {
  constructor(_callback) {
    // Implementation for tests
  }
  disconnect() {
    // Implementation for tests
  }
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
