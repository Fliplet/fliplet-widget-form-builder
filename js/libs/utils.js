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

/**
 * Maximum size of a single file that can be attached to a form field, in bytes.
 *
 * MUST stay in sync with MAX_FILE_SIZE in fliplet-api routes/v1/data-sources.js
 * (itself sourced from V3's MAX_BINARY_FILE_SIZE). A client limit lower than the
 * server's rejects files the server would happily accept; a higher one puts the
 * user back where PS-2112 started — waiting out a long upload only to be refused.
 */
const MAX_FILE_SIZE = 500 * 1024 * 1024;

/**
 * Checks whether a selected file exceeds the maximum upload size.
 *
 * @param {File} file - the file selected by the user
 *
 * @return {Boolean} true when the file is larger than MAX_FILE_SIZE
 */
function isFileSizeExceeded(file) {
  return !!file && typeof file.size === 'number' && file.size > MAX_FILE_SIZE;
}

/**
 * Maximum size of a whole upload, in bytes.
 *
 * Deliberately STRICTER than the API's MAX_REQUEST_BODY_SIZE
 * (routes/v1/data-sources.js), not equal to it. The API compares its limit
 * against content-length, which carries multipart boundaries, per-part headers,
 * every sibling text field, and 4/3 expansion for base64-submitted fields. This
 * limit is compared against a raw sum of file bytes. Setting the two to the same
 * number would make the client the LOOSER gate: a payload just under the client
 * threshold arrives just over the server's, which is exactly the "find out after
 * uploading" symptom PS-2112 exists to remove.
 *
 * Sitting at MAX_FILE_SIZE leaves the API's +10 MB headroom as the margin that
 * absorbs the envelope overhead, so anything this check passes is guaranteed to
 * fit. The per-file check alone is not enough — three 200 MB files are each
 * valid and the submission is still refused.
 */
const MAX_TOTAL_SIZE = MAX_FILE_SIZE;

/**
 * Checks whether the combined size of the given files exceeds the maximum a
 * single request can carry.
 *
 * Sizes each entry with payloadValueSize, the same function the submit-time
 * check uses. The two counted base64 differently before — this check saw a data
 * URI as 0 bytes and the submit check saw its full length — so a form with a
 * signature plus large files passed here and was then refused at submit with a
 * different message, which is exactly what a field-level check exists to avoid.
 *
 * @param {Array} files - files selected by the user
 *
 * @return {Boolean} true when the files together are larger than MAX_TOTAL_SIZE
 */
function isTotalSizeExceeded(files) {
  if (!Array.isArray(files) || !files.length) {
    return false;
  }

  const total = files.reduce(function(sum, file) {
    return sum + payloadValueSize(file);
  }, 0);

  return total > MAX_TOTAL_SIZE;
}

/**
 * Approximate the number of bytes a single form value contributes to the
 * multipart request.
 *
 * Files and blobs report their size. Strings are counted as one byte per
 * character, which is exact for the case that matters — base64 data URIs, what
 * the signature field and the image field's legacy path submit — and an
 * undercount for non-ASCII text, since `length` is UTF-16 code units rather
 * than the UTF-8 bytes that go on the wire. Text fields round to nothing next
 * to a 500 MB video, so the difference cannot move this check.
 *
 * Anything with a numeric `size` that is NOT a Blob is deliberately counted as
 * zero. In edit mode js/libs/form.js assigns `formData[field.name] = field.value`
 * verbatim, and for a file field that value is the array of already-uploaded
 * media objects loadFileData() stamped with `size` from `metadata.size`. Those
 * are re-sent as references, not bytes — counting them would refuse an entry
 * whose request carries no file bytes at all.
 *
 * @param {*} value - a value from the assembled formData
 *
 * @return {Number} approximate size in bytes
 */
function payloadValueSize(value) {
  if (!value) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.reduce(function(sum, item) {
      return sum + payloadValueSize(item);
    }, 0);
  }

  if (value instanceof Blob) {
    return typeof value.size === 'number' ? value.size : 0;
  }

  if (typeof value === 'string') {
    return value.length;
  }

  return 0;
}

/**
 * Checks whether an assembled form payload is too large to send in one request.
 *
 * The per-field checks in the file and image components cannot catch this on
 * their own: a form with a file field and an image field can put two separately
 * valid selections into the same request, and the API's checkRequestBodySize
 * measures the whole multipart envelope. This runs once over the final payload,
 * after beforeFormSubmit, so signatures and every file field are included.
 *
 * @param {Object} formData - the payload about to be sent to the data source
 *
 * @return {Boolean} true when the payload exceeds MAX_TOTAL_SIZE
 */
function isPayloadSizeExceeded(formData) {
  if (!formData || typeof formData !== 'object') {
    return false;
  }

  const total = Object.keys(formData).reduce(function(sum, key) {
    return sum + payloadValueSize(formData[key]);
  }, 0);

  return total > MAX_TOTAL_SIZE;
}

/**
 * Human-readable form of MAX_FILE_SIZE, for use in error messages.
 *
 * @return {String} e.g. "500 MB"
 */
function maxFileSizeLabel() {
  return Math.floor(MAX_FILE_SIZE / 1024 / 1024) + ' MB';
}

/**
 * Human-readable form of MAX_TOTAL_SIZE, for use in error messages.
 *
 * @return {String} e.g. "510 MB"
 */
function maxTotalSizeLabel() {
  return Math.floor(MAX_TOTAL_SIZE / 1024 / 1024) + ' MB';
}

Fliplet.FormBuilderUtils = {
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  isFileSizeExceeded,
  isTotalSizeExceeded,
  isPayloadSizeExceeded,
  maxFileSizeLabel,
  maxTotalSizeLabel,
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
    MAX_FILE_SIZE,
    MAX_TOTAL_SIZE,
    isFileSizeExceeded,
    isTotalSizeExceeded,
    isPayloadSizeExceeded,
    maxFileSizeLabel,
    maxTotalSizeLabel,
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
