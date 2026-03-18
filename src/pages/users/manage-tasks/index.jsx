import styles from "./styles.module.scss";
import { useModalStore } from "../../../zustand-store/modal-store/modalStore";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/buttons";
import Modal from "../../../components/modal";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../components/form/textarea";

const ManageTasks = () => {
  const { openModal, closeModal, modalType } = useModalStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreateTask = () => {
    openModal(MODAL_TYPES.CREATE_TASK);
  };

    const onSubmit = (data) => {
    addTask({
      id: Date.now().toString(),
      ...data,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    reset();
    closeModal();
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
        {/* Task cards will come here later */}
      </div>

      <Modal>
        {modalType === MODAL_TYPES.CREATE_TASK && (
          <div className={styles.modalContent}>
            <h3>Create Task</h3>

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
              {...register("description", {
                required: "Description is required",
              })}
              error={errors.description?.message}
           />

            {/* Due Date (temporary input, will replace with datepicker later) */}
            <Input
              name="dueDate"
              label="Due Date"
              type="date"
              min={today}
              register={register("dueDate", { required: "Due date is required" })}
              error={errors.dueDate?.message}
            />

            <div className={styles.actions}>
              <Button label="Cancel" onClick={closeModal} />
              <Button label="Save" onClick={handleSubmit(onSubmit)} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageTasks;