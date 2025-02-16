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
  constructor(callback) {
    this.callback = callback;
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

// Add custom jest matchers if needed
expect.extend({
  // Add custom matchers here
});
