import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Todos from "./components/Todos";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
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