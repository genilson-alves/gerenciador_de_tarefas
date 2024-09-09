import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tasks"
            element={<ProtectedRoute element={<TasksPage></TasksPage>} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
