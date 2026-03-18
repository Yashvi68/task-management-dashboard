import { create } from "zustand";

const initialState = {
    isOpen: false,
    modalType: null,
    modalData: null,
}
export const useModalStore = create((set) => ({
    ...initialState,

  openModal: (type, data = null) =>
    set({
      isOpen: true,
      modalType: type,
      modalData: data,
    }),

  closeModal: () =>
    set({ ...initialState }),
}));