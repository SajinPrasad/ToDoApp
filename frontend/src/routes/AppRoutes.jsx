import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoList from "../components/TodoList";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoList />} />
      </Routes>
    </Router>
  );
};
