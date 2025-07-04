/**
 * Utility functions to replace lodash dependencies
 * These functions provide native JavaScript alternatives to commonly used lodash methods
 */

/**
 * Deep clone an object using structuredClone or JSON fallback
 * Replacement for _.cloneDeep()
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function cloneDeep(obj) {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj);
  }

  // Fallback for older browsers
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => cloneDeep(item));
  }

  if (typeof obj === 'object') {
    const cloned = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = cloneDeep(obj[key]);
      }
    }

    return cloned;
  }

  return obj;
}

/**
 * Debounce function calls
 * Replacement for _.debounce()
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - Trigger on leading edge
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

/**
 * Convert string to kebab-case
 * Replacement for _.kebabCase()
 * @param {string} str - String to convert
 * @returns {string} Kebab-cased string
 */
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * Replacement for _.isEmpty()
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
}

/**
 * Remove falsy values from array
 * Replacement for _.compact()
 * @param {Array} array - Array to compact
 * @returns {Array} Array with falsy values removed
 */
function compact(array) {
  return array.filter(Boolean);
}

/**
 * Deep merge objects (similar to _.assignIn but recursive)
 * Replacement for _.assignIn() with deep merging
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects to merge
 * @returns {Object} Merged object
 */
function assignIn(target, ...sources) {
  if (!target || typeof target !== 'object') {
    target = {};
  }

  sources.forEach(source => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = assignIn(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  });

  return target;
}

/**
 * Check if object has a property
 * Replacement for _.has()
 * @param {Object} obj - Object to check
 * @param {string} path - Property path
 * @returns {boolean} True if property exists
 */
function has(obj, path) {
  if (!obj || typeof obj !== 'object') return false;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }

    current = current[key];
  }

  return true;
}

/**
 * Get unique values from array
 * Replacement for _.uniq()
 * @param {Array} array - Array to process
 * @returns {Array} Array with unique values
 */
function uniq(array) {
  return [...new Set(array)];
}

/**
 * Get unique values from array using a comparator function
 * Replacement for _.uniqWith()
 * @param {Array} array - Array to process
 * @param {Function} comparator - Function to compare values
 * @returns {Array} Array with unique values
 */
function uniqWith(array, comparator) {
  const result = [];

  for (const item of array) {
    if (!result.some(existing => comparator(existing, item))) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Sort array by property or function
 * Replacement for _.sortBy()
 * @param {Array} array - Array to sort
 * @param {string|Function} iteratee - Property name or function
 * @returns {Array} Sorted array
 */
function sortBy(array, iteratee) {
  const getValue = typeof iteratee === 'function'
    ? iteratee
    : item => item[iteratee];

  return [...array].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;

    return 0;
  });
}

/**
 * Check if two values are equal (deep comparison)
 * Replacement for _.isEqual()
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if equal
 */
function isEqual(a, b) {
  if (a === b) return true;

  if (a === null || a === undefined || b === null || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => isEqual(item, b[index]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => isEqual(a[key], b[key]));
}

// Export utilities for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cloneDeep,
    debounce,
    kebabCase,
    isEmpty,
    compact,
    assignIn,
    has,
    uniq,
    uniqWith,
    sortBy,
    isEqual
  };
}

// Make utilities available globally for browser usage
if (typeof window !== 'undefined') {
  window.FlipletUtils = {
    cloneDeep,
    debounce,
    kebabCase,
    isEmpty,
    compact,
    assignIn,
    has,
    uniq,
    uniqWith,
    sortBy,
    isEqual
  };
}
