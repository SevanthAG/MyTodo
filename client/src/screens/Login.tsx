import { useState } from "react"
import axios from "axios"

const Login = () => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const handleLogin = async () => {
        const response = await axios.post("http://localhost:3000/login",
            { username, password }
        )

        localStorage.setItem("token", response.data.token);
    }
    return (
        <div>
            <h1>Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
