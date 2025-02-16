/* global jest */

export class FilterSelectRangeManager {
  constructor(Wized) {
    this.Wized = Wized;
    this.state = {
      monitoredRanges: new Set(),
      initialized: true,
      processingChange: false,
      dynamicRanges: new Map(),
    };

    this.initialize();
  }

  initialize() {
    window.resetAllRangeSelects = this.resetAllRangeSelects;
    this.Wized.on('requestend', this.handleRequestEnd);
  }

  handleRequestEnd = jest.fn();
  resetAllRangeSelects = jest.fn();
}
