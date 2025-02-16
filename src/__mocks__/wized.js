const mockWized = {
  data: {
    v: {},
  },
  requests: {
    execute: jest.fn().mockResolvedValue({}),
  },
  on: jest.fn(),
};

export default mockWized;
