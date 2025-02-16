Run npm run test:ci

> wized-filter-and-pagination@1.0.2 test:ci
> jest --ci --coverage --maxWorkers=2
> console.error

    Invalid chip relationship parameters
       99 |   createChipRelationship(chipId, sourceElement, onSourceUpdate) {
      100 |     if (!chipId || !sourceElement) {
    > 101 |       console.error('Invalid chip relationship parameters');
          |               ^
      102 |       return;
      103 |     }
      104 |
      at console.<anonymous> (node_modules/jest-mock/build/index.js:794:25)
      at FilterChipsManager.error [as createChipRelationship] (src/filters/filter-chips.js:101:15)
      at Object.createChipRelationship (src/__tests__/unit/FilterChipsManager.test.js:244:15)

PASS src/**tests**/unit/FilterChipsManager.test.js
FilterChipsManager
initialization
✓ should initialize with Wized instance (21 ms)
✓ should initialize with correct state (4 ms)
✓ should setup template correctly (3 ms)
✓ should setup container correctly (2 ms)
✓ should initialize chip type tracking (2 ms)
✓ should expose public API (3 ms)
chip creation
✓ should create chip with correct attributes (21 ms)
✓ should set correct label text (11 ms)
✓ should not create duplicate chips (16 ms)
✓ should handle single selection types (5 ms)
chip removal
✓ should remove chip on remove button click (4 ms)
✓ should call source update callback on removal (3 ms)
✓ should remove chip by value (2 ms)
✓ should clear category chips (2 ms)
✓ should clear type chips (3 ms)
✓ should clear all chips (2 ms)
chip relationships
✓ should create chip relationship (2 ms)
✓ should handle invalid relationship parameters (37 ms)
error handling
✓ should handle missing template gracefully (2 ms)
✓ should handle missing required parameters in chip creation (1 ms)
✓ should handle chip removal with missing attributes (2 ms)
FAIL src/**tests**/unit/FilterSortManager.test.js
FilterSortManager
initialization
✕ should initialize with Wized instance (13 ms)
✕ should set up event listeners on initialization (2 ms)
✕ should initialize with correct state (1 ms)
✕ should make reset function globally available (1 ms)
✕ should not initialize twice (2 ms)
sort select setup
✕ should setup sort select with options (1 ms)
✕ should not setup same sort select twice (1 ms)
✕ should handle missing options wrapper (2 ms)
✕ should initialize Wized variable (2 ms)
✕ should handle missing category attribute (1 ms)
✕ should handle invalid JSON in select value (1 ms)
dynamic sort functionality
✕ should setup dynamic sort monitoring (1 ms)
✕ should update options on dynamic request end (1 ms)
✕ should handle missing wrapper for dynamic sort (2 ms)
✕ should handle missing request name (2 ms)
✕ should update Wized variable on dynamic update (2 ms)
event handling
✕ should handle sort selection change (1 ms)
✕ should create filter chip on selection (1 ms)
✕ should clear chips on selection reset (1 ms)
✕ should handle filter request errors (2 ms)
✕ should prevent multiple simultaneous changes (1 ms)
✕ should handle missing filterChips (2 ms)
✕ should handle missing filterChipsReady (1 ms)
reset functionality
✕ should reset all sort inputs (2 ms)
✕ should handle missing sort selects during reset (1 ms)
✕ should handle missing filter wrapper during reset (1 ms)
● FilterSortManager › initialization › should initialize with Wized instance
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › initialization › should set up event listeners on initialization
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › initialization › should initialize with correct state
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › initialization › should make reset function globally available
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › initialization › should not initialize twice
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should setup sort select with options
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should not setup same sort select twice
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should handle missing options wrapper
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should initialize Wized variable
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should handle missing category attribute
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › sort select setup › should handle invalid JSON in select value
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › dynamic sort functionality › should setup dynamic sort monitoring
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › dynamic sort functionality › should update options on dynamic request end
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › dynamic sort functionality › should handle missing wrapper for dynamic sort
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › dynamic sort functionality › should handle missing request name
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › dynamic sort functionality › should update Wized variable on dynamic update
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should handle sort selection change
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should create filter chip on selection
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should clear chips on selection reset
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should handle filter request errors
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should prevent multiple simultaneous changes
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should handle missing filterChips
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › event handling › should handle missing filterChipsReady
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › reset functionality › should reset all sort inputs
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › reset functionality › should handle missing sort selects during reset
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
● FilterSortManager › reset functionality › should handle missing filter wrapper during reset
TypeError: \_filterSort.FilterSortManager is not a constructor
87 |
88 | // Create manager instance > 89 | manager = new FilterSortManager(Wized);
| ^
90 | });
91 |
92 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterSortManager.test.js:89:15)
FAIL src/**tests**/unit/FilterResetManager.test.js
FilterResetManager
initialization
✕ should initialize with Wized instance (2 ms)
✕ should setup reset button (1 ms)
✕ should handle missing reset button gracefully (1 ms)
active filter detection
✕ should detect active string filters (1 ms)
✕ should detect active array filters (1 ms)
✕ should detect active sort filters (1 ms)
✕ should detect active number filters (1 ms)
✕ should ignore system variables (1 ms)
✕ should handle null values (1 ms)
✕ should handle empty arrays (1 ms)
✕ should handle empty strings (4 ms)
✕ should handle zero values (1 ms)
reset functionality
✕ should reset all filter types (1 ms)
✕ should reset pagination (1 ms)
✕ should execute filter request (1 ms)
✕ should handle missing reset functions gracefully (1 ms)
✕ should handle filter request errors (1 ms)
event handling
✕ should handle reset button click with active filters (1 ms)
✕ should not reset when no active filters (1 ms)
✕ should handle reset errors gracefully (1 ms)
● FilterResetManager › initialization › should initialize with Wized instance
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › initialization › should setup reset button
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › initialization › should handle missing reset button gracefully
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should detect active string filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should detect active array filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should detect active sort filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should detect active number filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should ignore system variables
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should handle null values
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should handle empty arrays
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should handle empty strings
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › active filter detection › should handle zero values
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › reset functionality › should reset all filter types
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › reset functionality › should reset pagination
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › reset functionality › should execute filter request
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › reset functionality › should handle missing reset functions gracefully
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › reset functionality › should handle filter request errors
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › event handling › should handle reset button click with active filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › event handling › should not reset when no active filters
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
● FilterResetManager › event handling › should handle reset errors gracefully
TypeError: \_filterReset.FilterResetManager is not a constructor
39 |
40 | // Create a new instance of the manager > 41 | manager = new FilterResetManager(Wized);
| ^
42 | });
43 |
44 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterResetManager.test.js:41:15)
FAIL src/**tests**/unit/FilterPaginationManager.test.js
FilterPaginationManager
initialization
✕ should initialize with Wized instance (1 ms)
✕ should set up event listeners on initialization
✕ should initialize with correct state
filter monitoring
✕ should setup filter monitoring when wrapper exists (1 ms)
✕ should not setup monitoring when wrapper does not exist
✕ should not setup monitoring when no triggers exist
trigger setup
✕ should setup trigger with correct configuration
✕ should not setup same trigger twice
pagination handling
✕ should handle pagination trigger correctly
✕ should not paginate when no next page exists (1 ms)
data handling
✕ should merge results correctly (1 ms)
✕ should handle empty initial results
✕ should get data from nested path correctly
● FilterPaginationManager › initialization › should initialize with Wized instance
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › initialization › should set up event listeners on initialization
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › initialization › should initialize with correct state
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › filter monitoring › should setup filter monitoring when wrapper exists
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › filter monitoring › should not setup monitoring when wrapper does not exist
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › filter monitoring › should not setup monitoring when no triggers exist
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › trigger setup › should setup trigger with correct configuration
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › trigger setup › should not setup same trigger twice
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › pagination handling › should handle pagination trigger correctly
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › pagination handling › should not paginate when no next page exists
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › data handling › should merge results correctly
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › data handling › should handle empty initial results
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
● FilterPaginationManager › data handling › should get data from nested path correctly
TypeError: \_filterPagination.FilterPaginationManager is not a constructor
46 |
47 | // Create a new instance of the manager > 48 | manager = new FilterPaginationManager(Wized);
| ^
49 | });
50 |
51 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterPaginationManager.test.js:48:15)
PASS src/**tests**/unit/FilterSelectManager.test.js
FilterSelectManager
initialization
✓ should initialize with Wized instance (5 ms)
✓ should set up event listeners on initialization
✓ should initialize with correct state (1 ms)
✓ should make reset function globally available (4 ms)
helper methods
✓ should create select identifier from category and variable
✓ should get selected value from select element (1 ms)
Wized integration
✓ should update Wized variable with select value (1 ms)
PASS src/**tests**/unit/FilterSelectRangeManager.test.js
FilterSelectRangeManager
✓ should initialize with Wized instance (5 ms)
✓ should set up event listeners on initialization (2 ms)
✓ should initialize with correct state (1 ms)
✓ should make reset function globally available
FAIL src/**tests**/unit/FilterCheckboxManager.test.js
FilterCheckboxManager
✕ should initialize with Wized instance (4 ms)
✕ should set up event listeners on initialization (1 ms)
● FilterCheckboxManager › should initialize with Wized instance
TypeError: \_filterCheckbox.FilterCheckboxManager is not a constructor
16 |
17 | // Create a new instance of the manager > 18 | manager = new FilterCheckboxManager(Wized);
| ^
19 | });
20 |
21 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterCheckboxManager.test.js:18:15)
● FilterCheckboxManager › should set up event listeners on initialization
TypeError: \_filterCheckbox.FilterCheckboxManager is not a constructor
16 |
17 | // Create a new instance of the manager > 18 | manager = new FilterCheckboxManager(Wized);
| ^
19 | });
20 |
21 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterCheckboxManager.test.js:18:15)
FAIL src/**tests**/unit/FilterRadioManager.test.js
FilterRadioManager
✕ should initialize with Wized instance (1 ms)
✕ should set up event listeners on initialization (1 ms)
● FilterRadioManager › should initialize with Wized instance
TypeError: \_filterRadio.FilterRadioManager is not a constructor
16 |
17 | // Create a new instance of the manager > 18 | manager = new FilterRadioManager(Wized);
| ^
19 | });
20 |
21 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterRadioManager.test.js:18:15)
● FilterRadioManager › should set up event listeners on initialization
TypeError: \_filterRadio.FilterRadioManager is not a constructor
16 |
17 | // Create a new instance of the manager > 18 | manager = new FilterRadioManager(Wized);
| ^
19 | });
20 |
21 | afterEach(() => {
at Object.<anonymous> (src/**tests**/unit/FilterRadioManager.test.js:18:15)
----------------------|---------|----------|---------|---------|------------------------------------------------------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
----------------------|---------|----------|---------|---------|------------------------------------------------------------------------------------------------
All files | 34.04 | 72.88 | 22.72 | 34.04 |  
 filter-checkbox.js | 29.39 | 100 | 0 | 29.39 | 13-28,38-43,55-56,64-72,84-113,121-123,133-166,176-215,225-254,264-283,286-327,333-340,350-378
filter-chips.js | 92.64 | 72.88 | 100 | 92.64 | 84-86,116-118,146,190-195,225-226,237-238,252-253,258-260,272-273,295-297  
 filter-pagination.js | 32.54 | 100 | 0 | 32.54 | 13-29,39-49,60-99,111-142,153-190,199-213,225-231,239-247,260-287,297-321,332-337  
 filter-radio.js | 20 | 100 | 0 | 20 | 6-21,28-33,40-41,44-52,59-92,99-125,132-160,167-196,203-217,220-256,259-266,273-299  
 filter-reset.js | 14.59 | 100 | 0 | 14.59 | 10-12,19-89,96-151,157-184  
 filter-sort.js | 11.2 | 100 | 0 | 11.2 | 12-31,38-48,55-69,72-86,89-122,129-169,176-208,211-396,399-433,440-442,449-499  
----------------------|---------|----------|---------|---------|------------------------------------------------------------------------------------------------
Test Suites: 5 failed, 3 passed, 8 total
Tests: 63 failed, 32 passed, 95 total
Snapshots: 0 total
Time: 2.831 s
Ran all test suites.
Error: Process completed with exit code 1.
