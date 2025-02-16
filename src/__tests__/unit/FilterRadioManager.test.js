import { FilterRadioManager } from '../../filters/filter-radio.js';
import mockWized from '../../__mocks__/wized.js';

describe('FilterRadioManager', () => {
  let manager;
  let mockElement;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div w-filter-wrapper>
        <label wized="RADIO1" w-filter-radio-variable="category" w-filter-radio-category="Category" w-filter-request="filterRequest">
          <div class="w-form-formradioinput--inputType-custom"></div>
          <span w-filter-radio-label>Option 1</span>
        </label>
      </div>
    `;

    mockElement = document.querySelector('label[wized]');
    manager = new FilterRadioManager(mockWized);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('initializes with correct state', () => {
    expect(manager.state.monitoredGroups).toBeDefined();
    expect(manager.state.radioGroups).toBeNull();
  });

  test('sets up event listeners on initialization', () => {
    expect(mockWized.on).toHaveBeenCalledWith('requestend', expect.any(Function));
  });
});
