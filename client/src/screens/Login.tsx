import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "" || password === "") {
      toast.add({
        type: "error",
        description: "Please enter username and password",
      });

      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      toast.add({
        type: "success",
        description: response.data.message,
      });

      navigate("/todos");
    } catch (err) {
      console.log("Login failed");

      if (axios.isAxiosError(err)) {
        toast.add({
          type: "error",
          description:
            err.response?.data?.message || "Login failed",
        });
      } else {
        toast.add({
          type: "error",
          description: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        <div className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full h-11 text-base"
          >
            Login
          </Button>

        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}

          <button
            onClick={() => navigate("/Signup")}
            className="text-blue-600 font-medium hover:underline"
          >
            Signup
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;