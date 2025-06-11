/* global describe, test, expect, beforeEach */
import { setParam, applyParamsToWized } from '../../utils/url-sync';
import Wized from '../../__mocks__/wized';
import FilterSearchManager from '../../filters/filter-search';

describe('URL Sync', () => {
  beforeEach(() => {
    window.location.search = '';
    window.history.replaceState.mockClear();
    Wized.data.v = {};
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
    expect(window.location.search).toBe('?search=shoes');
  });

  test('applyParamsToWized populates variables from URL', () => {
    window.location.search = '?search=boots';
    applyParamsToWized(Wized, { search: 'searchVar' });
    expect(Wized.data.v.searchVar).toBe('boots');
  });
});
