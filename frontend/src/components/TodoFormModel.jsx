import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // For success/failure messages

import { createTodoService, editTodoService } from "../services/todoServices";

const TodoFormModal = ({
  isOpen,
  closeModal,
  onTodoCreated,
  todo,
  isEditing,
}) => {
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  // Convert deadline to 'YYYY-MM-DDTHH:mm' format (without Z)
  const [deadline, setDeadline] = useState(
    todo?.deadline ? todo?.deadline.replace("Z", "").slice(0, 16) : "" // Remove the 'Z' and trim to 'YYYY-MM-DDTHH:mm'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to update form fields whenever the todo changes
  useEffect(() => {
    setTitle(todo?.title || "");
    setDescription(todo?.description || "");

    // Format the deadline if it exists
    if (todo?.deadline) {
      // Remove the 'Z' and slice it to match the 'YYYY-MM-DDTHH:mm' format
      setDeadline(todo?.deadline.replace("Z", "").slice(0, 16) || "");
    } else {
      setDeadline("");
    }
  }, [todo]); // Dependency on `todo` to trigger effect when it changes

  const handleCloseModel = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    closeModal();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !deadline) {
      toast.error("Please fill in all fields.");
      return;
    }

    const todoCreated = await createTodoService({
      title,
      description,
      deadline,
    });

    if (todoCreated) {
      onTodoCreated(todoCreated);
      setTitle("");
      setDescription("");
      setDeadline("");
      closeModal();
    }
  };

  const handleUpdateTodo = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const todoUpdated = await editTodoService(todo?.id, {
        title,
        description,
        deadline,
      });

      if (todoUpdated) {
        onTodoCreated(todoUpdated);
        setTitle("");
        setDescription("");
        setDeadline("");
        closeModal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-1/3 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create New Todo
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
              placeholder="Enter Todo title"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
              placeholder="Enter Todo description"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleCloseModel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>

            {isEditing ? (
              <button
                onClick={handleUpdateTodo}
                disabled={isSubmitting}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-800"
              >
                Update Todo
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Create Todo
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoFormModal;
