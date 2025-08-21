/**
 * Utility functions to replace lodash dependencies
 * These functions provide native JavaScript alternatives to commonly used lodash methods
 */

/**
 * Deep clone an object using structuredClone or a recursive fallback
 * Replacement for _.cloneDeep()
 * @param {*} obj - Object to clone
 * @param {WeakMap} cache - Cache for circular references
 * @returns {*} Cloned object
 */
function cloneDeep(obj, cache = new WeakMap()) {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj);
  }

  // Fallback for older browsers
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof RegExp) {
    const result = new RegExp(obj.source, obj.flags);

    result.lastIndex = obj.lastIndex || 0;

    return result;
  }

  if (Array.isArray(obj)) {
    const result = obj.map(item => cloneDeep(item, cache));

    cache.set(obj, result);

    return result;
  }

  if (typeof obj === 'object') {
    let cloned;

    if (obj instanceof Map) {
      cloned = new Map();
      cache.set(obj, cloned);

      for (const [key, value] of obj.entries()) {
        const clonedKey = cloneDeep(key, cache);
        const clonedValue = cloneDeep(value, cache);

        cloned.set(clonedKey, clonedValue);
      }

      return cloned;
    } else if (obj instanceof Set) {
      cloned = new Set();
      cache.set(obj, cloned);

      for (const value of obj.values()) {
        const clonedValue = cloneDeep(value, cache);

        cloned.add(clonedValue);
      }

      return cloned;
    }

    cloned = {};
    cache.set(obj, cloned);

    for (const key in obj) {
      if (has(obj, key)) {
        cloned[key] = cloneDeep(obj[key], cache);
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
    const context = this;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Convert string to kebab-case
 * Replacement for _.kebabCase()
 * @param {string} str - String to convert
 * @returns {string} Kebab-cased string
 */
function kebabCase(str) {
  if (!str) {
    return '';
  }

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
  if (value instanceof Map || value instanceof Set) return value.size === 0;
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
 * Check if object has a property
 * Replacement for _.has()
 * @param {Object} obj - Object to check
 * @param {string|Array} path - Property path (string or array)
 * @returns {boolean} True if property exists
 */
function has(obj, path) {
  if (!obj || typeof obj !== 'object') return false;
  if (typeof path !== 'string' && !Array.isArray(path)) return false;

  const keys = Array.isArray(path) ? path : path.split('.');
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

    // Handle undefined, null, and other falsy values
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

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

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExp objects
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Handle Map objects
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;

    for (const [key, value] of a) {
      if (!b.has(key) || !isEqual(value, b.get(key))) {
        return false;
      }
    }

    return true;
  }

  // Handle Set objects
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;

    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
    }

    return true;
  }


  // Handle Array objects
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => isEqual(item, b[index]));
  }

  // Handle plain objects
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => isEqual(a[key], b[key]));
}

/**
 * Check if value is a valid number
 * Replacement for _.isNumber()
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a valid number
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a string
 * Replacement for _.isString()
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a string
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if value is null or undefined
 * Replacement for _.isNil()
 * @param {*} value - Value to check
 * @returns {boolean} True if value is null or undefined
 */
function isNil(value) {
  return value === null || value === undefined;
}

/**
 * Check if value is a plain object (not null, not array)
 * Replacement for _.isObject()
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a plain object
 */
function isObject(value) {
  return value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Get nested property value from object using dot notation or array path
 * Replacement for _.get()
 * @param {Object} object - Source object
 * @param {string|Array} path - Property path (string with dots or array of keys)
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path or defaultValue
 */
function get(object, path, defaultValue) {
  if (!object || typeof object !== 'object') return defaultValue;
  if (typeof path !== 'string' && !Array.isArray(path)) return defaultValue;

  const keys = Array.isArray(path) ? path : path.split('.');
  let result = object;

  for (const key of keys) {
    if (result === null || result === undefined || !Object.prototype.hasOwnProperty.call(result, key)) {
      return defaultValue;
    }

    result = result[key];
  }

  return result;
}

/**
 * Set a value at a nested path in an object, creating intermediate objects as needed
 * Replicates _.set() behaviour for limited use cases
 * @param {Object} object - Target object to modify
 * @param {string|Array} path - Property path (string with dots or array of keys)
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
function set(object, path, value) {
  if (!object || typeof object !== 'object') {
    return object;
  }

  const keys = Array.isArray(path) ? path : path.split('.');
  let current = object;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the final value
  const finalKey = keys[keys.length - 1];

  current[finalKey] = value;

  return object;
}

/**
 * Create object with properties omitted based on predicate
 * Replacement for _.omitBy()
 * @param {Object} object - Source object
 * @param {Function} predicate - Function to test each property (value, key) => boolean
 * @returns {Object} New object with properties that don't match predicate
 */
function omitBy(object, predicate) {
  const result = {};

  for (const [key, value] of Object.entries(object)) {
    if (!predicate(value, key)) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Transform object keys using iteratee function
 * Replacement for _.mapKeys()
 * @param {Object} object - Source object
 * @param {Function} iteratee - Function to transform keys (value, key) => newKey
 * @returns {Object} New object with transformed keys
 */
function mapKeys(object, iteratee) {
  const result = {};

  for (const [key, value] of Object.entries(object)) {
    const newKey = iteratee(value, key);

    result[newKey] = value;
  }

  return result;
}

/**
 * Create array by calling iteratee n times
 * Replacement for _.times()
 * @param {number} n - Number of times to call iteratee
 * @param {Function} iteratee - Function to call for each index
 * @returns {Array} Array of results from iteratee calls
 */
function times(n, iteratee) {
  const result = [];

  for (let i = 0; i < n; i++) {
    result.push(iteratee(i));
  }

  return result;
}

/**
 * Create array of values from first array not included in second array
 * Replacement for _.difference()
 * @param {Array} array - Source array
 * @param {Array} values - Values to exclude
 * @returns {Array} New array with excluded values removed
 */
function difference(array, values) {
  const valueSet = new Set(values);

  return array.filter(item => !valueSet.has(item));
}

/**
 * Remove elements from array that match predicate
 * Replacement for _.remove()
 * @param {Array} array - Array to modify
 * @param {Function} predicate - Function to test each element
 * @returns {Array} Array of removed elements
 */
function remove(array, predicate) {
  const toRemove = [];

  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      toRemove.push(array.splice(i, 1)[0]);
    }
  }

  return toRemove.reverse();
}

/**
 * Extend target object with properties from source objects
 * Replacement for _.extend()
 * @param {Object} target - Target object to extend
 * @param {...Object} sources - Source objects to copy properties from
 * @returns {Object} Extended target object
 */
function extend(target, ...sources) {
  sources.forEach(source => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  });

  return target;
}

Fliplet.FormBuilderUtils = {
  cloneDeep,
  debounce,
  kebabCase,
  isEmpty,
  isNumber,
  isString,
  isNil,
  isObject,
  get,
  set,
  omitBy,
  mapKeys,
  times,
  difference,
  remove,
  extend,
  compact,
  has,
  uniq,
  sortBy,
  isEqual
};

// Make utilities available globally for browser usage
if (typeof window !== 'undefined') {
  window.FlipletUtils = {
    cloneDeep,
    debounce,
    kebabCase,
    isEmpty,
    isNumber,
    isString,
    isNil,
    isObject,
    get,
    set,
    omitBy,
    mapKeys,
    times,
    difference,
    remove,
    extend,
    compact,
    has,
    uniq,
    sortBy,
    isEqual
  };
}
