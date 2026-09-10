import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g. search input).
 * Delays invoking side effects until the user stops typing for `delay` ms.
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 350ms)
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value changes before delay has elapsed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
