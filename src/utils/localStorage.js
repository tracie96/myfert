/**
 * Safely parse a localStorage item as JSON
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value to return if parsing fails
 * @returns {any} The parsed value or defaultValue
 */
export const safeLocalStorageParse = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely get userInfo from localStorage
 * @returns {object|null} The userInfo object or null if not found/invalid
 */
export const safeGetUserInfo = () => {
  return safeLocalStorageParse('userInfo', null);
};

/**
 * Safely get patient info from localStorage
 * @returns {object|null} The patient object or null if not found/invalid
 */
export const safeGetPatient = () => {
  return safeLocalStorageParse('patient', null);
};

/**
 * Safely get answers from localStorage
 * @returns {object|null} The answers object or null if not found/invalid
 */
export const safeGetAnswers = () => {
  return safeLocalStorageParse('answers', null);
};

/**
 * Safely get session from userInfo
 * @returns {string|null} The session string or null if not found
 */
export const safeGetSession = () => {
  const userInfo = safeGetUserInfo();
  return userInfo?.session || null;
};
