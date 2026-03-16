import { roles } from "../../constants/roles";

export const sideBarItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        role: [roles.user, roles.admin]
    },
    {
        title: "Tasks",
        path: "/tasks",
        role: [roles.user]

    },
    {
        title: "Manage Tasks",
        path: "/manage-tasks",
        role: [roles.user]

    },
    {
        title: "Users",
        path: "/admin/users",
        role: [roles.admin]

    },
    {
        title:"Assign Tasks",
        path: "/admin/assign-tasks",
        role: [roles.admin]
    },
    {
        title: "All Tasks",
        path: "/admin/all-tasks",
        role: [roles.admin]

    },
]