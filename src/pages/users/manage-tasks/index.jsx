import styles from "./styles.module.scss";
import { useModalStore } from "../../../zustand-store/modal-store/modalStore";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/buttons";
import Modal from "../../../components/modal";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../components/form/textarea";
import { useState, useEffect } from "react";
import { useToastStore } from "../../../zustand-store/toast/toastStore";
import { useTaskStore } from "../../../zustand-store/task/taskStore";
import { httpPost } from "../../../services/httpPost";
import { httpPut } from "../../../services/httpPut";
import { httpDelete } from "../../../services/httpDelete";
import { api } from "../../../config/endpoints";

const ManageTasks = () => {
  const { openModal, closeModal, modalType, modalData } = useModalStore();
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToastStore()
  const { tasks, fetchTasks, loading, error } = useTaskStore()
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onSubmit = async (data) => {
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (modalType === MODAL_TYPES.CREATE_TASK) {
        // console.log("API URL:", api?.createTask);
        const response = await httpPost(api?.createTask, data);

        if (response.success) {
          fetchTasks();

          addToast("Task created successfully", "success");
          // console.log("SUBMIT WORKING", data);
          reset();
          closeModal();
        } else {
          addToast(
            response.data?.message || "Failed to create task",
            "error"
          );
        }
      }

      if (modalType === MODAL_TYPES.EDIT_TASK) {
        const response = await httpPut(api.updateTask(modalData._id), data);

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
      console.error("CREATE TASK ERROR:", error);
      addToast("Something went wrong", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreateTask = () => {
    openModal(MODAL_TYPES.CREATE_TASK);
  };

  const handleStatusChange = async (task, newStatus) => {
    if (newStatus === "Completed") {
      openModal(MODAL_TYPES.COMPLETE_TASK, task);
      return;
    }

    const response = await httpPut(api.updateTask(task._id), { status: newStatus });
    if (response.success) {
      fetchTasks();
    } else {
      addToast(response.data?.message || "Failed to update status", "error");
    }
  };

  const confirmComplete = async () => {
    const response = await httpPut(api.updateTask(modalData._id), { status: "Completed" });
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
    const response = await httpDelete(api.deleteTask(modalData._id));
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

  const toggleExpand = (id) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      {loading && <p>Loading tasks...</p>}
      {error && <p>Error: {error}</p>}

      <div className={styles.header}>

        <Button
          label="Create Task"
          onClick={handleCreateTask}
        />
      </div>

      <div className={styles.tasksWrapper}>
        {tasks.map((task) => (
          <div key={task._id} className={styles.card}>
            <h3>{task.title}</h3>

            <div>
              <p
                className={
                  expandedTasks[task._id]
                    ? styles.descriptionExpanded
                    : styles.descriptionCollapsed
                }
              >
                {task.description}
              </p>

              {task.description.length > 80 && (
                <span
                  className={styles.seeMore}
                  onClick={() => toggleExpand(task._id)}
                >
                  {expandedTasks[task._id] ? "See less" : "See more"}
                </span>
              )}
            </div>

            <p>Due: {task.dueDate}</p>

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
        ))}
      </div>

      <Modal>
        {(modalType === MODAL_TYPES.CREATE_TASK ||
          modalType === MODAL_TYPES.EDIT_TASK) && (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.modalContent}>
              <h3> {modalType === MODAL_TYPES.EDIT_TASK ? "Edit Task" : "Create Task"}</h3>

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
                register={register("description", {
                  required: "Description is required",
                })}
                error={errors.description?.message}
              />

              <Input
                name="dueDate"
                label="Due Date"
                type="date"
                min={today}
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
                  // onClick={handleSubmit(onSubmit)}
                  isLoading={isSaving}
                />
              </div>
            </form>
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

export default ManageTasks;