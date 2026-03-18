import ReactDOM from "react-dom";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import { useModalStore } from "../../zustand-store/modal-store/modalStore";

const Modal = ({ children }) => {
  const { isOpen, closeModal } = useModalStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        {children}
      </div>
    </div>,
    document.querySelector("#modal")
  );
};

export default Modal;