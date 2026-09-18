import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toast";

const Signup = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {

    if (username === "" || password === ""){
      toast.add({
        type: "error",
        description: "Please enter username and password"
      })
      
      return
    }

    try {
      const response = await axios.post<{message:string}>("http://localhost:3000/signup", {
        username,
        password,
      });

      navigate("/Login");
      toast.add({
        type: "success",
        description: response.data.message
      })
    } catch (err) {
      console.log("Signup failed");
      if(axios.isAxiosError(err)){
        toast.add({
          type: "error",
          description: err.message
        })
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Sign up to get started
          </p>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
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
              onChange={(e) => setpassword(e.target.value)}
              className="h-11"
            />
          </div>

          <Button
            onClick={handleSignup}
            className="w-full h-11 text-base"
          >
            Signup
          </Button>

        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/Login")}
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
};

export default Signup;