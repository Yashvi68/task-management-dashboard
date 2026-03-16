import { Outlet } from "react-router-dom"
import { SideBar } from "../../components/sidebar"
import styles from "./styles.module.scss"
import { NavBar } from "../../components/navbar"

export const MainLayout = () =>{
    return(
        <>
        <main className={styles.mainContainer}>
            <aside className={styles.sidebarContainer}>
                <SideBar />
            </aside>
            <section className={styles.mainContentContainer}>
                <NavBar />
                <Outlet />
            </section>
        </main>
        </>
    )
}