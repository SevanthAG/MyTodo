import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Todos from "./screens/Todos";
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  return (
    <div className="bg-gray-900">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;