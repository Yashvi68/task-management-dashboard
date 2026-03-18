import styles from "./styles.module.scss";

export const Textarea = ({
  name,
  label,
  placeholder,
  register,
  error,
  ...restProps
}) => {
  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        {...register}
        {...restProps}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};