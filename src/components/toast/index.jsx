import { useToastStore } from "../../zustand-store/toast/toastStore"
import styles from "./styles.module.scss"
import ReactDOM from "react-dom"

export const Toast = () =>{
    const{toasts, removeToast} = useToastStore()
    return ReactDOM.createPortal(
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div  key={toast.id}
          className={`${styles.toast} ${
            toast.type === "error" ? styles.error : styles.success
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)}>×</button>
        </div>
            ))}

        </div>,
        document.getElementById("toast")
    )
}