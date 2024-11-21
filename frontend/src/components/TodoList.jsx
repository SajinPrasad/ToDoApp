import React, { useEffect, useState } from "react";

import { bulkDestroyService, listTodoService } from "../services/todoServices";
import TodoFormModal from "./TodoFormModel";
import TodoCard from "./TodoCard";
import { FaPlus } from "react-icons/fa";

const TodoList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const [editingTodo, setEditingTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSettingTodoEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleTodoSelection = (todo) => {
    setSelectedTodos((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(todo.id)) {
        newSelected.delete(todo.id);
      } else {
        newSelected.add(todo.id);
      }
      return newSelected;
    });
  };

  const handleBulkDelete = async () => {
    const deleted = await bulkDestroyService([...selectedTodos]);

    if (deleted) {
      const deletedTodos = [...selectedTodos];
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => !deletedTodos.includes(todo.id))
      );
      setSelectedTodos(new Set());
    }
  };

  const handleTodoRemove = (todoId) => {
    const updatedTodos = todos.filter((todo) => todo.id != todoId);
    setTodos(updatedTodos);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOpenModel = () => {
    setIsEditing(false);
    openModal();
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const fetchedTodos = await listTodoService();

      if (fetchedTodos) {
        setTodos(fetchedTodos);
      }
    };

    fetchTodos();
  }, []);

  const handleTodoCreatedOrUpdated = (newTodo) => {
    // Find the index of the todo with the same id (if it exists)
    const existingTodoIndex = todos.findIndex((todo) => todo.id === newTodo.id);

    if (existingTodoIndex !== -1) {
      // Update the existing todo
      const updatedTodos = [...todos];
      updatedTodos[existingTodoIndex] = newTodo;
      setTodos(updatedTodos);
    } else {
      // Add a new todo
      setTodos([...todos, newTodo]);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header with Todo App title and Button */}
        <div className="flex items-center justify-evenly px-5 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Todo App</h1>
          <button
            onClick={handleOpenModel}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all ease-in-out duration-300 transform hover:scale-110 focus:outline-none"
          >
            <FaPlus className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-wrap gap-6 justify-center p-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onSelect={handleTodoSelection}
              setTodos={handleTodoRemove}
              selectedTodos={selectedTodos}
              setEditingTodo={handleSettingTodoEdit}
              setIsEditing={setIsEditing}
            />
          ))}
        </div>

        {selectedTodos.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="rounded px-6 py-3 mt-4 mx-auto text-white bg-red-600 shadow-md hover:bg-red-700 transition-all ease-in-out duration-300 transform hover:scale-105 focus:outline-none"
          >
            Delete Selected
          </button>
        )}

        {/* Modal for creating new Todo */}
        <TodoFormModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onTodoCreated={handleTodoCreatedOrUpdated}
          todo={editingTodo}
          isEditing={isEditing}
        />
      </div>
    </>
  );
};

export default TodoList;
