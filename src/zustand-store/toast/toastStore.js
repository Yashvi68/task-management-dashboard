import { create } from "zustand";

const initialState = {
    toasts: [],
}
export const useToastStore = create((set) => ({
    ...initialState,

  addToast: (message, type = "success") => {
    const id = Date.now();

    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // auto remove after 3s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

    clearToasts: () => set({ ...initialState }),
}));