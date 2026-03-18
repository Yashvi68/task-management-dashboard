import styles from "./styles.module.scss"

// export const Button = ({
//     label,
//     type = "button",
//     onClick,
//     disabled = false,
//     isLoading = false,
//     icon,
//     ...otherProps
// }) => {
//     return (
//         <button
//             type={type}
//             onClick={onClick}
//             disabled={disabled || isLoading}
//             className={styles.button}
//             {...otherProps}
//         >
//             {icon && <span className={styles.icon}>{icon}</span>}
//             {isLoading ? "Loading..." : label}
//         </button>
//     )
// }

export const Button = ({
  label,
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...otherProps
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
      `}
      {...otherProps}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {isLoading ? "Loading..." : label}
    </button>
  );
};