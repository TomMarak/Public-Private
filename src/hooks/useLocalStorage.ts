'use client';

import { useCallback } from 'react';

export const useLocalStorage = (key: string, initialValue: any) => {
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: any) => {
      try {
        const valueToStore = value instanceof Function ? value(getStoredValue()) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, getStoredValue]
  );

  return [getStoredValue(), setValue];
};
