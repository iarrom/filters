# Wized Filter and Pagination

A powerful and flexible filtering and pagination system designed specifically for Wized and Webflow projects. This package provides seamless integration of advanced filtering capabilities with Wized's data management system.

## Features

- 🔍 **Advanced Filtering**

  - Checkbox-based filtering
  - Radio button filtering
  - Select dropdown filtering
  - Range-based filtering
  - Filter chips for visual feedback
  - Reset functionality for each filter type

- 📄 **Smart Pagination**

  - Infinite scroll support
  - Dynamic page loading
  - Automatic state management
  - Seamless integration with filters

- ⚡ **Performance Optimized**

  - Efficient DOM manipulation
  - Debounced filter updates
  - Optimized state management
  - Minimal re-renders

- 🔧 **Highly Customizable**
  - Custom filter triggers
  - Flexible styling options
  - Configurable behaviors
  - Event-based architecture

## Installation

```bash
npm install wized-filter-and-pagination
```

## Quick Start

1. Add the required HTML attributes to your Webflow elements:

```html
<!-- Filter Wrapper -->
<div w-filter-wrapper>
  <!-- Checkbox Filter -->
  <label w-filter-checkbox-variable="categoryFilter">
    <input type="checkbox" />
    <div w-filter-checkbox-label>Category 1</div>
  </label>

  <!-- Radio Filter -->
  <label w-filter-radio-variable="sortFilter">
    <input type="radio" />
    <div w-filter-radio-label>Sort Option 1</div>
  </label>

  <!-- Pagination Trigger -->
  <div
    w-filter-pagination-trigger
    w-filter-pagination-request="initialLoad"
    w-filter-request="loadMore"
    w-filter-result-variable="items"
    w-filter-pagination-next-variable="nextPage"
    w-filter-pagination-current-variable="currentPage"
  ></div>
</div>
```

2. Import and initialize the filters:

```javascript
import {
  FilterCheckboxManager,
  FilterRadioManager,
  FilterPaginationManager,
} from 'wized-filter-and-pagination';

// Initialize filters when Wized is ready
window.Wized?.data?.subscribe(async ({ type }) => {
  if (type === 'wized:ready') {
    new FilterCheckboxManager(window.Wized);
    new FilterRadioManager(window.Wized);
    new FilterPaginationManager(window.Wized);
  }
});
```

## Filter Types

### Checkbox Filter

Used for multiple-selection filtering. Perfect for categories, tags, or any multi-select filtering needs.

```html
<label
  wized="filter1"
  w-filter-checkbox-variable="categoryFilter"
  w-filter-checkbox-category="category"
  w-filter-request="filterItems"
  w-filter-pagination-current-variable="currentPage"
>
  <input type="checkbox" />
  <div w-filter-checkbox-label>Category Name</div>
</label>
```

### Radio Filter

Ideal for single-selection filtering like sorting or exclusive options.

```html
<label
  wized="filter2"
  w-filter-radio-variable="sortFilter"
  w-filter-radio-category="sort"
  w-filter-request="filterItems"
  w-filter-pagination-current-variable="currentPage"
>
  <input type="radio" />
  <div w-filter-radio-label>Sort Option</div>
</label>
```

### Pagination

Implements infinite scroll functionality with automatic state management.

```html
<div
  w-filter-pagination-trigger
  w-filter-pagination-request="initialLoad"
  w-filter-request="loadMore"
  w-filter-result-variable="items"
  w-filter-pagination-next-variable="nextPage"
  w-filter-pagination-current-variable="currentPage"
></div>
```

## API Reference

### FilterCheckboxManager

```javascript
const checkboxManager = new FilterCheckboxManager(Wized);
```

#### Methods

- `uncheckAllFilterCheckboxes()`: Resets all checkbox filters

### FilterRadioManager

```javascript
const radioManager = new FilterRadioManager(Wized);
```

#### Methods

- `uncheckAllRadioButtons()`: Resets all radio filters

### FilterPaginationManager

```javascript
const paginationManager = new FilterPaginationManager(Wized);
```

Automatically handles pagination based on scroll position and configured triggers.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:

1. Check the [documentation](https://github.com/aonnoy/wized-filter-pagination)
2. Open an [issue](https://github.com/aonnoy/wized-filter-pagination/issues)
3. Contact us through [GitHub Discussions](https://github.com/aonnoy/wized-filter-pagination/discussions)
