import { create } from "zustand";
import axios from "axios";

const useSearchStore = create((set, get) => ({
  searchResult: JSON.parse(localStorage.getItem("searchResults"))?.result || [],
  lastSearchTerm: JSON.parse(localStorage.getItem("searchResults"))?.term || "",
  isLoading: false,
  error: null,

  fetchSearchResults: async (searchTerm) => {
    if (!searchTerm) return;

    // 🔹 Prevent unnecessary API calls if term hasn't changed
    if (searchTerm === get().lastSearchTerm) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/search`,
        { searchTerm }
      );

      const newResults = response.data.result;

      set({
        searchResult: newResults,
        lastSearchTerm: searchTerm,
        isLoading: false,
      });

      // 🔹 Save to localStorage for persistence
      localStorage.setItem(
        "searchResults",
        JSON.stringify({ term: searchTerm, result: newResults })
      );
    } catch (error) {
      set({ error: error.message || "An error occurred.", isLoading: false });
    }
  },
}));

export default useSearchStore;
