/* global jest */

const Wized = {
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

export default Wized;
