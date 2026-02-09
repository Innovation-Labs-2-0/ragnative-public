const storage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error storing item:", key, err);
    }
  },

  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error("Error parsing storage item:", key, err);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  clearAll: () => {
    localStorage.clear();
  },
};

export default storage;
