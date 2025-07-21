export function saveToLocalStorage(key: string, data: any): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Data saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromLocalStorage(key: string): any {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    const data = JSON.parse(serializedData);
    console.log(`Data loaded from localStorage with key: ${key}`);
    return data;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
    console.log(`Data removed from localStorage with key: ${key}`);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}