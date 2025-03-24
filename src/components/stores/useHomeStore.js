import { create } from "zustand";
import axios from "axios";

const useHomeStore = create((set, get) => ({
  lace: JSON.parse(localStorage.getItem("lace")) || [],
  asoOke: JSON.parse(localStorage.getItem("asoOke")) || [],
  dansiki: JSON.parse(localStorage.getItem("dansiki")) || [],
  ankara: JSON.parse(localStorage.getItem("ankara")) || [],
  gele: JSON.parse(localStorage.getItem("gele")) || [],
  isLoading: true,

  fetchData: async () => {
    
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/clothespreview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newData = response.data.previewData;

      if (
        JSON.stringify(newData.asoOke) !== JSON.stringify(get().asoOke) ||
        JSON.stringify(newData.lace) !== JSON.stringify(get().lace) ||
        JSON.stringify(newData.dansiki) !== JSON.stringify(get().dansiki) ||
        JSON.stringify(newData.gele) !== JSON.stringify(get().gele) ||
        JSON.stringify(newData.ankara) !== JSON.stringify(get().ankara)
      ) {
        // ✅ Save fetched data to localStorage
        localStorage.setItem("asoOke", JSON.stringify(newData.asoOke));
        localStorage.setItem("lace", JSON.stringify(newData.lace));
        localStorage.setItem("dansiki", JSON.stringify(newData.dansiki));
        localStorage.setItem("gele", JSON.stringify(newData.gele));
        localStorage.setItem("ankara", JSON.stringify(newData.ankara));

        set({
          asoOke: newData.asoOke,
          lace: newData.lace,
          dansiki: newData.dansiki,
          gele: newData.gele,
          ankara: newData.ankara,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default useHomeStore;
