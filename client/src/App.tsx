import { useState } from "react";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Todos from "./screens/Todos";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-red-500">
      <h1>MyTodo</h1>

      {isLogin ? <Login /> : <Signup />}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>

      <Todos />
    </div>
  );
}

export default App;