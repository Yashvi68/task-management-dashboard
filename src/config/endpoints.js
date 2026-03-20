export const baseUrl = (url) =>{
    return `http://localhost:2614/api/${url}`;
}

export const api = {
    createTask:baseUrl("tasks"),
    updateTask: (id) => baseUrl(`tasks/${id}`),
    deleteTask: (id) => baseUrl(`tasks/${id}`),
    getTasks: baseUrl("tasks"),

}