import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Todos from "./screens/Todos";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";


function App() {
  const token = localStorage.getItem("token");


  return (
    <div className="min-h-screen bg-gray-900">
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to={token ? "/todos" : "/login"}
                replace
              />
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;