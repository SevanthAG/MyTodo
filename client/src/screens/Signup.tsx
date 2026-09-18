import { useState } from "react"
import axios from "axios"

const Signup = () => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const handleSignup = async () => {
        await axios.post("http://localhost:3000/signup",
            { username, password }
        )
    }
  return (
    <div>
      <h1>Signup</h1>

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
        <button onClick={handleSignup}>Signup</button>
    </div>
  )
}

export default Signup
