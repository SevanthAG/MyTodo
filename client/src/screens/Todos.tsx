import axios from "axios";
import { useState } from "react";

type Todo = {
    id: number;
    title: string;
    description: string;
}

const Todos = () => {
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");

    const [todos, settodos] = useState<Todo[]>([]);

    const addTodo = async () => {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/todos",
            { title, description },
            {
                headers: {
                    token: token,
                }
            }
        )
    }

    const getTodos = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/todos",
            {
                headers: {
                    token: token,
                }
            }
        )

        settodos(response.data.todos);
    }

    const deleteTodo = async (id: number) => {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/todos/${id}`,
            {
                headers: {
                    token: token,
                }
            }
        )
    }

    const updateTodo = async (id: number) => {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:3000/todos/${id}`,
            { title, description },
            {
                headers: {
                    token: token,
                }
            }
        )
    }

    return (
        <div>
            <h1>MyTodo</h1>

            <input
                type="text"
                placeholder="Add a new todo..."
                value={title}
                onChange={(e) => settitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
            />

            <button onClick={addTodo}>Add Todo</button>

            <div>
                <h2>ALL TODOS</h2>
                <button onClick={getTodos}>Get Todos</button>
                {todos.map((todo) => (
                    <div key={todo.id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <button onClick={() => updateTodo(todo.id)}>Update</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todos
