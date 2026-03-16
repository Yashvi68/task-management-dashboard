import { useLocation } from "react-router-dom";
import styles from "./styles.module.scss";
import { sideBarItems } from "../sidebar/data";
import { useAuthStore } from "../../zustand-store/auth/authStore";

export const NavBar = () =>{
    const location = useLocation()
    console.log("==location==",location);
     const currentPage = sideBarItems.find(
        (item) => item.path === location.pathname
    )
    const{userDetails} = useAuthStore()
    const pageTitle = currentPage?.title ?? "Dashboard"
    
    return(
        <header className={styles.navContainer}>
            <div className={styles.navSection}>
                <p className={styles.pageTitle}>{pageTitle}</p>
                <p className={styles.userName}>
                    {userDetails?.name ?? "Guest"}
                </p>
            </div>
        </header>
    )
}