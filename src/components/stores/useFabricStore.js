import { create } from "zustand";
import axios from "axios";

const useFabricStore = create((set, get) => ({
  fabricsList: JSON.parse(localStorage.getItem("fabricsList")) || [],
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
      console.log("called")

      if (JSON.stringify(newFabrics) !== JSON.stringify(get().fabricsList)) {
        set({ fabricsList: newFabrics, error: null });
        localStorage.setItem("fabricsList", JSON.stringify(newFabrics)); // 🔹 Persist data
      }
    } catch (error) {
      set({ error: error.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFabricStore;
