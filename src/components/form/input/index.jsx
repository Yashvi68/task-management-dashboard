import { useState } from "react"
import styles from "./styles.module.scss"

export const Input = ({
    name,
    label,
    type = "text",
    placeholder,
    register,
    error,
    min,
    ...otherProps
}) => {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputContainer}>
                <input
                    id={name}
                    type={inputType}
                    placeholder={placeholder}
                    className={`${styles.input} ${error ? styles.inputError : ""}`}
                    {...register}
                    min={min}
                    {...otherProps}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}
        </div>
    )
}