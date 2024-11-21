import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import axios from "axios";

export const createTodoService = async (formData) => {
  try {
    const response = await axiosInstance.post("/todos/", formData);

    if (response.status >= 200 && response.status < 301) {
      toast.success("Created new todo");
      return response.data;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      if (error.response.status >= 500) {
        // Internal Server Error
        toast.error("Server error. Please try again later.");
      } else if (error.response.status === 400) {
        // Validation errors or bad request (e.g., missing required fields)
        if (error.response) {
          // Extract the error message from the response
          const { data } = error.response;
          if (data) {
            // Toast only the error messages, ignoring the field names
            Object.values(data).forEach((messages) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => toast.error(msg)); // Directly display the error message
              } else {
                toast.error(messages);
              }
            });
          } else {
            toast.error("An error occurred. Please try again.");
          }
        }
      } else {
        // Other client-side errors like 401 (Unauthorized), 404 (Not Found), etc.
        toast.error(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      }
    } else if (error.request) {
      // The request was made but no response was received (network error)
      toast.error("Network error. Please check your connection.");
    } else {
      // Something went wrong in setting up the request
      toast.error("An unexpected error occurred.");
    }
  }
};

export const listTodoService = async () => {
  try {
    const response = await axiosInstance.get("/todos/");

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      if (error.response.status >= 500) {
        // Internal Server Error
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received (network error)
      toast.error("Network error. Please check your connection.");
    } else {
      // Something went wrong in setting up the request
      toast.error("An unexpected error occurred.");
    }
  }
};

export const removeTodoService = async (todoId) => {
  try {
    const response = await axiosInstance.delete(`/todos/${todoId}/`);
    if (response.status === 204) {
      toast.success("Todo delted successfully");
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const bulkDestroyService = async (todos) => {
  try {
    const response = await axiosInstance.delete("/destroy/", {
      data: { todo_ids: [7, 8] },
    });

    toast.success("Deleted selected todos.");
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const editTodoService = async (todoId, formData) => {
  try {
    const response = await axiosInstance.patch(`/todos/${todoId}/`, formData);

    if (response.status >= 200 && response.status < 301) {
      toast.success("Todo updated");
      return response.data
    }
  } catch (error) {
    console.log(error);
  }
};
