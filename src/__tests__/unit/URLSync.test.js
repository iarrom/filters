/* global describe, test, expect, beforeEach */
import { setParam, applyParamsToWized } from '../../utils/url-sync';
import FilterSearchManager from '../../filters/filter-search';

let Wized;

describe('URL Sync', () => {
  beforeEach(() => {
    window.location = { search: '', pathname: '/', hash: '' };
    if (typeof window.history.replaceState?.mockClear === 'function') {
      window.history.replaceState.mockClear();
    } else {
      window.history.replaceState = jest.fn((_, __, url) => {
        const parsed = new URL(url, 'http://localhost');
        window.location.search = parsed.search;
      });
    }
    Wized = {
      data: { v: {}, r: {}, subscribe: jest.fn() },
      requests: { execute: jest.fn() },
      on: jest.fn(),
    };
  });

  test('changing search filter updates location search', async () => {
    const input = {
      value: 'shoes',
      getAttribute: (attr) => {
        if (attr === 'w-filter-search-variable') return 'searchVar';
        if (attr === 'w-filter-pagination-current-variable') return 'page';
        if (attr === 'w-filter-request') return 'req';
        if (attr === 'wized') return 'search';
        return null;
      },
      addEventListener: jest.fn(),
    };

    const manager = new FilterSearchManager(Wized);
    manager.setupSearch(input);

    await manager.updateWizedVariable(input, 'searchVar', 'page', 'req');
    expect(window.history.replaceState).toHaveBeenCalled();
    const urlArg = window.history.replaceState.mock.calls[0][2];
    expect(urlArg).toContain('?search=shoes');
  });

  test('applyParamsToWized populates variables from URL', () => {
    const originalWindow = global.window;
    global.window = {};
    applyParamsToWized(
      Wized,
      { search: { variable: 'searchVar' } },
      '?search=boots'
    );
    global.window = originalWindow;
    expect(Wized.data.v.searchVar).toBe('boots');
  });
});
