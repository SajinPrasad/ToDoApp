import React, { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaPencilAlt,
  FaTrashAlt,
  FaClock,
} from "react-icons/fa";
import { removeTodoService } from "../services/todoServices";

const TodoCard = ({
  todo,
  onSelect,
  isSelected,
  setTodos,
  selectedTodos,
  setEditingTodo,
  setIsEditing,
}) => {
  const { title, description, deadline, is_completed, created_at } = todo;
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate days left
  const calculateDaysLeft = (deadlineDate) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  // Simple date formatting
  const formatSimpleDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Improved date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Deadline calculation and formatting
  const daysLeft = useMemo(() => calculateDaysLeft(deadline), [deadline]);
  const formattedDeadline = formatDate(deadline);
  const formattedCreatedAt = formatSimpleDate(created_at);

  // Truncate description
  const truncateDescription = (text, wordLimit = 10) => {
    const words = text.split(" ");
    return {
      truncated:
        words.length > wordLimit
          ? words.slice(0, wordLimit).join(" ") + "..."
          : text,
      isTruncated: words.length > wordLimit,
    };
  };

  const { truncated: truncatedDescription, isTruncated } =
    truncateDescription(description);

  const handleDeleteTodo = async () => {
    const todoId = todo.id;
    const deleted = await removeTodoService(todo.id);

    if (deleted) {
      setTodos(todoId);
    }
  };

  const hanleSetingEditingTodo = () => {
    setEditingTodo(todo);
    setIsEditing(true);
  };

  return (
    <div
      className={`
      relative w-full bg-white border rounded-lg shadow-sm transition-all duration-300 
      ${isExpanded ? "mb-4 p-6" : "p-4"}
      ${isSelected ? "border-blue-500" : "border-gray-200"}
    `}
    >
      <div className="flex items-center space-x-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selectedTodos.has(todo.id)}
          onChange={() => onSelect(todo)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />

        {/* Status Indicator */}
        {is_completed && <FaCheckCircle className="text-green-500 text-xl" />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center space-x-16">
            {/* Title and Description */}
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {title}
                </h2>
              </div>

              {/* Description */}
              <div className="flex gap-1">
                {!isExpanded ? (
                  <p className="text-gray-600 text-sm mt-1">
                    {truncatedDescription}
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm mt-1">{description}</p>
                )}

                {/* Expanded Description Toggle */}
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Hide
                  </button>
                )}

                {isTruncated && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    See More
                  </button>
                )}
              </div>
            </div>

            {/* Deadline with Days Left */}
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-600" />
              <div>
                <div className="text-md font-bold text-gray-700">
                  {formattedDeadline}
                </div>
                <div
                  className={`text-sm font-medium ${
                    daysLeft.includes("overdue")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {daysLeft}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-10 ">
              <button
                onClick={hanleSetingEditingTodo}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={handleDeleteTodo}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>

          {/* Created At */}
          <div className="text-xs text-gray-500 mt-2 self-start">
            Created: {formattedCreatedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
