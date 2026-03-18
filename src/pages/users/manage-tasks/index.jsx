import styles from "./styles.module.scss";
import { useModalStore } from "../../../zustand-store/modal-store/modalStore";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/buttons";
import Modal from "../../../components/modal";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../components/form/textarea";
import { useState } from "react";
import { useToastStore } from "../../../zustand-store/toast/toastStore";
import { useTaskStore } from "../../../zustand-store/task/taskStore";

const ManageTasks = () => {
  const { openModal, closeModal, modalType, modalData } = useModalStore();
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToastStore()
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore()
  const [expandedTasks, setExpandedTasks] = useState({});

  const onSubmit = async (data) => {
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (modalType === MODAL_TYPES.CREATE_TASK) {
        addTask({
          id: Date.now(),
          ...data,
          status: "Pending",
        });

        addToast("Task created successfully", "success");
      }

      if (modalType === MODAL_TYPES.EDIT_TASK) {
        updateTask(modalData.id, data);

        addToast("Task updated successfully", "success");
      }

      reset();
      closeModal();

    } catch (error) {
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

  const handleStatusChange = (task, newStatus) => {
    if (newStatus === "Completed") {
      openModal(MODAL_TYPES.COMPLETE_TASK, task);
      return;
    }

    updateTask(task.id, { status: newStatus });
  };

  const confirmComplete = () => {
    updateTask(modalData.id, { status: "Completed" });
    addToast("Task marked as completed", "success");
    closeModal();
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

  const confirmDelete = () => {
    deleteTask(modalData.id);
    addToast("Task deleted successfully", "success");
    closeModal();
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

      <div className={styles.header}>
        <h2>Manage Tasks</h2>

        <Button
          label="Create Task"
          onClick={handleCreateTask}
        />
      </div>

      <div className={styles.tasksWrapper}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.card}>
            <h3>{task.title}</h3>

            <div>
              <p
                className={
                  expandedTasks[task.id]
                    ? styles.descriptionExpanded
                    : styles.descriptionCollapsed
                }
              >
                {task.description}
              </p>

              {task.description.length > 80 && (
                <span
                  className={styles.seeMore}
                  onClick={() => toggleExpand(task.id)}
                >
                  {expandedTasks[task.id] ? "See less" : "See more"}
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
            <div className={styles.modalContent}>
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

export default ManageTasks;