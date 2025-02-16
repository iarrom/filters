/**
 * FilterPaginationManager: Main class responsible for managing infinite scroll pagination functionality
 *
 * This class handles:
 * 1. State Management: Tracks pagination triggers and request states
 * 2. Intersection Observation: Monitors when pagination triggers come into view
 * 3. Request Management: Handles initial and pagination request execution
 * 4. Data Merging: Manages merging new data with existing results
 * 5. Variable Management: Handles pagination-related variables (next, current page)
 */
export class FilterPaginationManager {
  constructor(Wized) {
    // console.log("FilterPaginationManager: Initializing");
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredTriggers: new Set(), // Track which triggers are being monitored
      initialized: false,
      processingRequest: false, // Prevent multiple simultaneous requests
    };

    // Bind methods to maintain context
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);

    // Initialize immediately since Wized is already available
    this.initialize();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  /**
   * Initializes the manager and sets up event listeners
   */
  initialize() {
    if (this.state.initialized) return;
    // console.log("FilterPaginationManager: Running initialize");

    // Set up request monitoring using the correct event system
    this.Wized.on('requestend', this.handleRequestEnd);

    // Initial setup
    this.setupFilterMonitoring();

    this.state.initialized = true;
  }

  // =============================================
  // TRIGGER SETUP AND MANAGEMENT
  // =============================================

  /**
   * Sets up a pagination trigger with intersection observer and request handling
   * @param {HTMLElement} trigger - The pagination trigger element
   */
  async setupTrigger(trigger) {
    // Get all required attributes
    const initialRequestName = trigger.getAttribute('w-filter-pagination-request'); // Initial request to wait for
    const paginationRequestName = trigger.getAttribute('w-filter-request'); // Request to execute on intersection
    const resultDataPath = trigger.getAttribute('w-filter-result-data-path');
    const resultVariableName = trigger.getAttribute('w-filter-result-variable');
    const nextVariableName = trigger.getAttribute('w-filter-pagination-next-variable');
    const currentVariableName = trigger.getAttribute('w-filter-pagination-current-variable');

    // console.log("FilterPaginationManager: Setting up trigger", {
    //   initialRequestName,
    //   paginationRequestName,
    //   resultDataPath,
    //   resultVariableName,
    //   nextVariableName,
    //   currentVariableName,
    //   triggerElement: trigger.outerHTML,
    // });

    // Skip if already monitoring this trigger
    if (this.state.monitoredTriggers.has(paginationRequestName)) {
      //   console.log(
      //     "FilterPaginationManager: Trigger already monitored, skipping"
      //   );
      return;
    }

    this.state.monitoredTriggers.add(paginationRequestName);

    // Create intersection observer for pagination
    const observer = this.createIntersectionObserver(trigger, {
      paginationRequestName,
      resultDataPath,
      resultVariableName,
      nextVariableName,
      currentVariableName,
    });

    // Set up initial request completion monitoring
    this.setupInitialRequestMonitoring(trigger, initialRequestName, observer);
  }

  // =============================================
  // INTERSECTION OBSERVER
  // =============================================

  /**
   * Creates an intersection observer for pagination triggering
   * @param {HTMLElement} trigger - The element to observe
   * @param {Object} config - Configuration for pagination handling
   */
  createIntersectionObserver(trigger, config) {
    const {
      paginationRequestName,
      resultDataPath,
      resultVariableName,
      nextVariableName,
      currentVariableName,
    } = config;

    return new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.state.processingRequest) {
          this.state.processingRequest = true;

          try {
            await this.handlePaginationTrigger({
              paginationRequestName,
              resultDataPath,
              resultVariableName,
              nextVariableName,
              currentVariableName,
            });
          } catch (error) {
            console.error('FilterPaginationManager: Error in pagination process:', error);
          } finally {
            this.state.processingRequest = false;
          }
        }
      },
      { threshold: 0.1 }
    );
  }

  // =============================================
  // REQUEST HANDLING
  // =============================================

  /**
   * Handles the pagination trigger when it comes into view
   * @param {Object} config - Configuration for pagination handling
   */
  async handlePaginationTrigger(config) {
    const {
      paginationRequestName,
      resultDataPath,
      resultVariableName,
      nextVariableName,
      currentVariableName,
    } = config;

    // Check if next page exists
    const nextPageValue = this.Wized.data.v[nextVariableName];
    // console.log("FilterPaginationManager: Checking next page value:", {
    //   variable: nextVariableName,
    //   value: nextPageValue,
    // });

    if (nextPageValue !== null) {
      // Increment the current page variable
      const currentPage = this.Wized.data.v[currentVariableName] || 0;
      this.Wized.data.v[currentVariableName] = currentPage + 1;

      //   console.log("FilterPaginationManager: Updated current page:", {
      //     variable: currentVariableName,
      //     oldValue: currentPage,
      //     newValue: this.Wized.data.v[currentVariableName],
      //   });

      // Execute pagination request and merge data
      await this.executePaginationRequest(
        paginationRequestName,
        resultDataPath,
        resultVariableName
      );
    } else {
      //   console.log(
      //     "FilterPaginationManager: No next page available, skipping request"
      //   );
    }
  }

  /**
   * Executes the pagination request and merges the new data
   * @param {string} requestName - The name of the request to execute
   * @param {string} dataPath - The path to the data in the response
   * @param {string} resultVariable - The variable to merge results into
   */
  async executePaginationRequest(requestName, dataPath, resultVariable) {
    // console.log(
    //   "FilterPaginationManager: Executing pagination request:",
    //   requestName
    // );
    await this.Wized.requests.execute(requestName);
    // console.log(
    //   "FilterPaginationManager: Successfully executed pagination request"
    // );

    // Get and merge the new data
    const newData = this.getDataFromPath(dataPath);
    if (newData && Array.isArray(newData)) {
      this.mergeResults(resultVariable, newData);
    }
  }

  // =============================================
  // DATA MANAGEMENT
  // =============================================

  /**
   * Gets data from a dot-notation path in the Wized data store
   * @param {string} path - Dot-notation path to the data
   * @returns {any} The data at the specified path
   */
  getDataFromPath(path) {
    const pathParts = path.split('.');
    let data = this.Wized.data;
    for (const part of pathParts) {
      data = data[part];
    }
    return data;
  }

  /**
   * Merges new results with existing data in the result variable
   * @param {string} resultVariable - The variable to merge results into
   * @param {Array} newData - The new data to merge
   */
  mergeResults(resultVariable, newData) {
    const currentResult = this.Wized.data.v[resultVariable] || [];

    // console.log("FilterPaginationManager: Merging data:", {
    //   currentLength: currentResult.length,
    //   newItemsLength: newData.length,
    // });

    this.Wized.data.v[resultVariable] = [...currentResult, ...newData];
  }

  // =============================================
  // INITIAL REQUEST MONITORING
  // =============================================

  /**
   * Sets up monitoring for the initial request completion
   * @param {HTMLElement} trigger - The trigger element to observe
   * @param {string} initialRequestName - The name of the initial request to wait for
   * @param {IntersectionObserver} observer - The observer to start after request completion
   */
  setupInitialRequestMonitoring(trigger, initialRequestName, observer) {
    // console.log(
    //   "FilterPaginationManager: Setting up requestend listener for:",
    //   initialRequestName
    // );

    // Check if initial request is already completed
    const lastRequest = this.Wized.data.r[initialRequestName];
    if (lastRequest && lastRequest.hasRequested) {
      //   console.log(
      //     "FilterPaginationManager: Initial request already completed, starting to observe element immediately"
      //   );
      observer.observe(trigger);
    }

    // Monitor for future request completions
    this.Wized.on('requestend', (result) => {
      //   console.log(
      //     "FilterPaginationManager: Received requestend event:",
      //     result
      //   );
      if (result.name === initialRequestName) {
        // console.log(
        //   "FilterPaginationManager: Initial request completed, starting to observe element"
        // );
        observer.observe(trigger);
      }
    });
  }

  // =============================================
  // FILTER MONITORING
  // =============================================

  /**
   * Sets up monitoring for pagination triggers within the filter wrapper
   */
  setupFilterMonitoring() {
    // console.log("FilterPaginationManager: Setting up filter monitoring");

    // Find the wrapper element
    const filterWrapper = document.querySelector('[w-filter-wrapper]');
    if (!filterWrapper) {
      //   console.log("FilterPaginationManager: No filter wrapper found");
      return;
    }

    // Find pagination triggers inside the wrapper
    const paginationTriggers = filterWrapper.querySelectorAll('[w-filter-pagination-trigger]');

    // console.log(
    //   "FilterPaginationManager: Found pagination triggers inside wrapper:",
    //   {
    //     wrapperElement: filterWrapper.outerHTML,
    //     triggerCount: paginationTriggers.length,
    //     triggers: Array.from(paginationTriggers).map((el) => el.outerHTML),
    //   }
    // );

    if (paginationTriggers.length === 0) return;

    paginationTriggers.forEach((trigger) => this.setupTrigger(trigger));
  }

  // =============================================
  // EVENT HANDLING
  // =============================================

  /**
   * Handles request completion events
   * @param {Object} result - The request completion result
   */
  handleRequestEnd(result) {
    // console.log(
    //   "FilterPaginationManager: handleRequestEnd called with:",
    //   result
    // );
    this.setupFilterMonitoring();
  }
}
