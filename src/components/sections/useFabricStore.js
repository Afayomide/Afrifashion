import { create } from "zustand";
import axios from "axios";

const useFabricStore = create((set, get) => ({
  fabricsList: [],
  isLoading: true,
  error: null,

  fetchFabrics: async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/fabrics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newFabrics = response.data.fabrics;

      // ✅ Only update state if data has changed
      if (JSON.stringify(newFabrics) !== JSON.stringify(get().fabricsList)) {
        set({ fabricsList: newFabrics, error: null });
      }
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      set({ error: error.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFabricStore;
