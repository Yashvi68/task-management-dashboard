import { NavLink } from "react-router-dom"
import { sideBarItems } from "./data"
import styles from "./styles.module.scss"
import { useAuthStore } from "../../zustand-store/auth/authStore"
import { roles } from "../../constants/roles"
import { filterByRole } from "../../utils/filterByRole"

export const SideBar = ()=>{
    const userDetails = useAuthStore((state) => state.userDetails)
    const clearAuth = useAuthStore((state) => state.clearAuth)
    const role = userDetails?.role ?? roles.user
    const filteredItems = filterByRole(sideBarItems, role)
    return(
        <div className={styles.sidebar}>
        <ul className={styles.navList}>
                {filteredItems.map((item, index) => (
                    <li key={index} className={styles.navItem}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
       
        <div className={styles.logoutWrapper}>
            <button className={styles.logoutBtn} onClick={clearAuth}>
                Log Out
            </button>
        </div>
        </div>
    )
}