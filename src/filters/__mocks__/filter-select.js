/* global jest */

export class FilterSelectManager {
  constructor(Wized) {
    this.Wized = Wized;
    this.state = {
      monitoredSelects: new Set(),
      initialized: true,
      processingChange: false,
      dynamicSelects: new Map(),
    };

    this.initialize();
  }

  initialize() {
    window.resetAllSelectInputs = this.resetAllSelectInputs;
    this.Wized.on('requestend', this.handleRequestEnd);
  }

  handleRequestEnd = jest.fn();
  resetAllSelectInputs = jest.fn();
  getSelectedValue = jest.fn();
  getSelectedText = jest.fn();
  createSelectIdentifier = jest.fn();
  createSelectChip = jest.fn();
  updateWizedVariable = jest.fn();
}
