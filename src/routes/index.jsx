import { Navigate } from "react-router-dom";
import { roles } from "../constants/roles";
import { MainLayout } from "../pages/main-layout";
import { LoginPage } from "../pages/auth/login";
import { RegisterPage } from "../pages/auth/register";
import ManageTasks from "../pages/users/manage-tasks";

export const Routes = [
    {
        path: "*",
        element: <h1>Page Not Found</h1>,
        role: [roles.user, roles.admin]
    },
    {
        path: "/login",
        element: <LoginPage />,
        role: [roles.user, roles.admin]
    },
    {
        path: "/register",
        element: <RegisterPage />,
        role: [roles.user]
    },
    {
        path: "/",
        element: <MainLayout />,
        role: [roles.user, roles.admin],
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
                role: [roles.user, roles.admin]
            },
            {
                path: "dashboard",
                element: <h1>Dashboard</h1>,
                role: [roles.user, roles.admin]
            },
            {
                path: "tasks",
                element: <h1>Tasks Page</h1>,
                role: [roles.user]
            },
            {
                path: "manage-tasks",
                element: <ManageTasks />,
                role: [roles.user]
            },
            {
                path: "admin/users",
                element: <h1>Admin Users Page</h1>,
                role: [roles.admin]
            },
            {
                path: "admin/assign-tasks",
                element: <h1>Assign Tasks Page</h1>,
                role: [roles.admin]
            },
            {
                path: "admin/all-tasks",
                element: <h1>All Tasks Page</h1>,
                role: [roles.admin]
            },
        ]
    }
]