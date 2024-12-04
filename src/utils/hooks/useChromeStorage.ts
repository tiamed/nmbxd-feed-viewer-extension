import { useEffect, useState } from "react";

// Custom hook to manage chrome.storage.sync
export default function useChromeStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue);

  // Load the value from chrome storage when the hook is initialized
  useEffect(() => {
    const fetchData = async () => {
      chrome.storage.sync.get([key], (result) => {
        if (result[key] !== undefined) {
          setValue(result[key]);
        }
      });
    };

    fetchData();

    // Listen for changes in chrome storage
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: chrome.storage.AreaName
    ) => {
      if (namespace === "sync" && changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [key]);

  // Update the value in both state and chrome storage
  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    chrome.storage.sync.set({ [key]: newValue });
  };

  return [value, setStoredValue] as const;
}
