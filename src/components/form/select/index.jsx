import styles from "./styles.module.scss";

export const Select = ({
    label,
    options = [],
    value,
    onChange,
}) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}

            <select
                className={styles.select}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};