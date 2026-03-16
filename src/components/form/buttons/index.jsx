import styles from "./styles.module.scss"

export const Button = ({
    label,
    type = "button",
    onClick,
    disabled = false,
    isLoading = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={styles.button}
        >
            {isLoading ? "Loading..." : label}
        </button>
    )
}