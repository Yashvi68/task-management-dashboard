import { create } from "zustand";

const initialState = {
    userDetails: null,
}

export const useAuthStore = create((set) =>({
    ...initialState,
    setUser: (userDetails) => set({ userDetails }),
    clearAuth: () => set({ ...initialState }),
}) )