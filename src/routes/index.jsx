import { Navigate } from "react-router-dom";
import { roles } from "../constants/roles";
import { MainLayout } from "../pages/main-layout";

export const Routes = [
    {
        path: "*",
        element: <h1>Page Not Found</h1>,
        role: [roles.user, roles.admin]
    },
    {
        path: "/login",
        element: <h1>Login Page</h1>,
        role: [roles.user, roles.admin]
    },
    {
        path: "/register",
        element: <h1>Register Page</h1>,
        role: [roles.user, roles.admin]
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
                element: <h1>Manage Tasks Page</h1>,
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