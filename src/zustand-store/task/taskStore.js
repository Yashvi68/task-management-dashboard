import { create } from "zustand";
import { httpGet } from "../../services/httpGet";
import { api } from "../../config/endpoints";

const initialState = {
  tasks: [],
  page: 1,
  limit: 100,
  total: 0,
  loading: false,
  error: null,
};

export const useTaskStore = create((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchTasks: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const page = params.page || get().page;
      const limit = params.limit || get().limit;

      const response = await httpGet(
        `${api.getTasks}?limit=${limit}&page=${page}`
      );

      if (response.success) {
        const data = response.data?.data;

        set({
          tasks: data?.tasks || [],
          page: data?.page || page,
          limit: data?.limit || limit,
          total: data?.total || 0,
          loading: false,
        });
      } else {
        set({
          error:
            response.data?.message ||
            response.error ||
            "Failed to fetch tasks",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  clearTasks: () => set(initialState),
}));