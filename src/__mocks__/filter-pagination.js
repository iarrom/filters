/* global jest */

export class FilterPaginationManager {
  constructor(Wized) {
    this.Wized = Wized;
    this.state = {
      monitoredTriggers: new Set(),
      initialized: false,
      processingRequest: false,
    };

    // Bind methods
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.setupTrigger = this.setupTrigger.bind(this);
    this.createIntersectionObserver = this.createIntersectionObserver.bind(this);
    this.handlePaginationTrigger = this.handlePaginationTrigger.bind(this);
    this.executePaginationRequest = this.executePaginationRequest.bind(this);
    this.getDataFromPath = this.getDataFromPath.bind(this);
    this.mergeResults = this.mergeResults.bind(this);
    this.setupInitialRequestMonitoring = this.setupInitialRequestMonitoring.bind(this);

    // Initialize immediately
    this.initialize();
  }

  initialize() {
    if (this.state.initialized) return;
    this.Wized.on('requestend', this.handleRequestEnd);
    this.setupFilterMonitoring();
    this.state.initialized = true;
  }

  setupFilterMonitoring = jest.fn(function () {
    const wrapper = document.querySelector('[w-filter-wrapper]');
    if (!wrapper) return;

    const triggers = wrapper.querySelectorAll('[w-filter-pagination-trigger]');
    if (triggers.length === 0) return;

    triggers.forEach((trigger) => this.setupTrigger(trigger));
  });

  handleRequestEnd = jest.fn(function () {
    this.setupFilterMonitoring();
  });

  setupTrigger = jest.fn(async function (trigger) {
    const paginationRequestName = trigger.getAttribute('w-filter-request');
    if (this.state.monitoredTriggers.has(paginationRequestName)) return;

    this.state.monitoredTriggers.add(paginationRequestName);
    const config = {
      paginationRequestName,
      resultDataPath: trigger.getAttribute('w-filter-result-data-path'),
      resultVariableName: trigger.getAttribute('w-filter-result-variable'),
      nextVariableName: trigger.getAttribute('w-filter-pagination-next-variable'),
      currentVariableName: trigger.getAttribute('w-filter-pagination-current-variable'),
    };

    const observer = this.createIntersectionObserver(trigger, config);
    this.setupInitialRequestMonitoring(
      trigger,
      trigger.getAttribute('w-filter-pagination-request'),
      observer
    );
  });

  createIntersectionObserver = jest.fn(function (trigger, config) {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  handlePaginationTrigger = jest.fn(async function (config) {
    const nextPageValue = this.Wized.data.v[config.nextVariableName];
    if (nextPageValue !== null) {
      const currentPage = this.Wized.data.v[config.currentVariableName] || 0;
      this.Wized.data.v[config.currentVariableName] = currentPage + 1;
      await this.executePaginationRequest(
        config.paginationRequestName,
        config.resultDataPath,
        config.resultVariableName
      );
    }
  });

  executePaginationRequest = jest.fn(async function (requestName, dataPath, resultVariable) {
    await this.Wized.requests.execute(requestName);
    const newData = this.getDataFromPath(dataPath);
    if (newData && Array.isArray(newData)) {
      this.mergeResults(resultVariable, newData);
    }
  });

  getDataFromPath = jest.fn(function (path) {
    let result = this.Wized.data;
    path.split('.').forEach((key) => {
      result = result[key];
    });
    return result;
  });

  mergeResults = jest.fn(function (resultVariable, newData) {
    const currentResult = this.Wized.data.v[resultVariable] || [];
    this.Wized.data.v[resultVariable] = [...currentResult, ...newData];
  });

  setupInitialRequestMonitoring = jest.fn(function (trigger, initialRequestName, observer) {
    const lastRequest = this.Wized.data.r[initialRequestName];
    if (lastRequest && lastRequest.hasRequested) {
      observer.observe(trigger);
    }

    this.Wized.on('requestend', (result) => {
      if (result.name === initialRequestName) {
        observer.observe(trigger);
      }
    });
  });
}

// Create a mock instance for testing
const mockManager = new FilterPaginationManager(null);

// Export both the class and mock methods
export default {
  FilterPaginationManager,
  setupFilterMonitoring: mockManager.setupFilterMonitoring,
  handleRequestEnd: mockManager.handleRequestEnd,
  setupTrigger: mockManager.setupTrigger,
  createIntersectionObserver: mockManager.createIntersectionObserver,
  handlePaginationTrigger: mockManager.handlePaginationTrigger,
  executePaginationRequest: mockManager.executePaginationRequest,
  getDataFromPath: mockManager.getDataFromPath,
  mergeResults: mockManager.mergeResults,
  setupInitialRequestMonitoring: mockManager.setupInitialRequestMonitoring,
};
