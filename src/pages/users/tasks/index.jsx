import { useState, useMemo, useEffect } from "react";
import { useTaskStore } from "../../../zustand-store/task/taskStore";
import { Button } from "../../../components/form/buttons";
import { Pagination } from "../../../components/pagination";
import styles from "./styles.module.scss";
import { useModalStore } from "../../../zustand-store/modal-store/modalStore";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { Input } from "../../../components/form/input";
import Modal from "../../../components/modal";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../components/form/textarea";
import { useToastStore } from "../../../zustand-store/toast/toastStore";
import { httpPut } from "../../../services/httpPut";
import { httpDelete } from "../../../services/httpDelete";
import { api } from "../../../config/endpoints";

const Tasks = () => {
  // TODO: Replace with API call to fetch tasks when backend is ready
  // Example: const { data: tasks, loading, error } = useFetchTasks(userId);
  // For now, using local Zustand store with mock data
  const { tasks, fetchTasks, loading, error } = useTaskStore();
  const { openModal, closeModal, modalType, modalData } = useModalStore();
  const { addToast } = useToastStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onSubmit = async (data) => {
    setIsSaving(true);

    try {
      if (modalType === MODAL_TYPES.EDIT_TASK) {
        const response = await httpPut(api.updateTask(modalData.id), data);

        if (response.success) {
          fetchTasks();
          addToast("Task updated successfully", "success");
          reset();
          closeModal();
        } else {
          addToast(
            response.data?.message || "Failed to update task",
            "error"
          );
        }
      }
    } catch (error) {
      addToast("Something went wrong", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (newStatus === "Completed") {
      openModal(MODAL_TYPES.COMPLETE_TASK, task);
      return;
    }

    const response = await httpPut(api.updateTask(task.id), { status: newStatus });
    if (response.success) {
      fetchTasks();
    } else {
      addToast(response.data?.message || "Failed to update status", "error");
    }
  };

  const confirmComplete = async () => {
    const response = await httpPut(api.updateTask(modalData.id), { status: "Completed" });
    if (response.success) {
      fetchTasks();
      addToast("Task marked as completed", "success");
      closeModal();
    } else {
      addToast(response.data?.message || "Failed to complete task", "error");
    }
  };

  const handleEdit = (task) => {
    if (task.status === "Completed") {
      addToast("Cannot edit completed task", "error");
      return;
    }

    reset({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });

    openModal(MODAL_TYPES.EDIT_TASK, task);
  };

  const confirmDelete = async () => {
    const response = await httpDelete(api.deleteTask(modalData.id));
    if (response.success) {
      fetchTasks();
      addToast("Task deleted successfully", "success");
      closeModal();
    } else {
      addToast(response.data?.message || "Failed to delete task", "error");
    }
  };

  const handleDelete = (task) => {
    openModal(MODAL_TYPES.DELETE_TASK, task);
  };

  const currentDate = new Date().toISOString().split("T")[0];

  // TODO: Consider moving filtering/search to backend for better performance with large datasets
  // For now, client-side filtering is fine for mock data
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (activeFilter === "Pending") {
      filtered = filtered.filter(task => task.status === "Pending");
    } else if (activeFilter === "Completed") {
      filtered = filtered.filter(task => task.status === "Completed");
    } else if (activeFilter === "Overdue") {
      filtered = filtered.filter(task =>
        task.dueDate < currentDate && task.status !== "Completed"
      );
    }
    // All includes everything

    // Filter by search query (title)
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, activeFilter, searchQuery, currentDate]);

  // TODO: Pagination can stay client-side or be handled by backend (e.g., with limit/offset)
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className={styles.container}>
      {loading && <p>Loading tasks...</p>}
      {error && <p>Error: {error}</p>}

      <div className={styles.header}>
        <h2>My Tasks</h2>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterTabs}>
          {["All", "Pending", "Completed", "Overdue"].map(filter => (
            <Button
              key={filter}
              label={filter}
              variant="primary"
              size="sm"
              onClick={() => handleFilterChange(filter)}
            />
          ))}
        </div>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tasksWrapper}>
        {paginatedTasks.length === 0 ? (
          <p className={styles.noTasks}>No tasks found.</p>
        ) : (
          paginatedTasks.map((task) => (
            <div key={task.id} className={styles.card}>
              <h3>{task.title}</h3>
              <p className={styles.description}>{task.description}</p>
              <p>Status: <span className={`${styles.status} ${styles[task.status.toLowerCase()]}`}>{task.status}</span></p>
              <p>Due: {task.dueDate}</p>
              {task.dueDate < currentDate && task.status !== "Completed" && (
                <p className={styles.overdue}>Overdue</p>
              )}

              <select
                value={task.status}
                disabled={task.status === "Completed"}
                onChange={(e) => handleStatusChange(task, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <div className={styles.cardActions}>
                <Button
                  label="Edit"
                  size="sm"
                  variant="primary"
                  onClick={() => handleEdit(task)}
                  disabled={task.status === "Completed"}
                />

                <Button
                  label="Delete"
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(task)}
                  disabled={task.status === "Completed"}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal>
        {modalType === MODAL_TYPES.EDIT_TASK && (
          <div className={styles.modalContent}>
            <h3>Edit Task</h3>

            <Input
              name="title"
              label="Title"
              placeholder="Enter title"
              register={register("title", { required: "Title is required" })}
              error={errors.title?.message}
            />

            <Textarea
              name="description"
              label="Description"
              placeholder="Enter description"
              register={register("description", { required: "Description is required" })}
              error={errors.description?.message}
            />

            <Input
              name="dueDate"
              label="Due Date"
              type="date"
              min={currentDate}
              register={register("dueDate", { required: "Due date is required" })}
              error={errors.dueDate?.message}
            />

            <div className={styles.actions}>
              <Button
                label="Cancel"
                onClick={closeModal}
              />

              <Button
                label="Save"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                isLoading={isSaving}
              />
            </div>
          </div>
        )}

        {modalType === MODAL_TYPES.DELETE_TASK && (
          <div className={styles.modalContent}>
            <h3>Delete Task</h3>

            <p>Are you sure you want to delete this task?</p>

            <div className={styles.actions}>
              <Button
                label="Cancel"
                onClick={closeModal}
              />

              <Button
                label="Confirm"
                onClick={confirmDelete}
              />
            </div>
          </div>
        )}

        {modalType === MODAL_TYPES.COMPLETE_TASK && (
          <div className={styles.modalContent}>
            <h3>Complete Task</h3>

            <p>This action cannot be undone. Are you sure?</p>

            <div className={styles.actions}>
              <Button label="Cancel" onClick={closeModal} />
              <Button label="Confirm" onClick={confirmComplete} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tasks;