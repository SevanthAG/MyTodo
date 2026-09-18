import axios from "axios";
import { useEffect, useState } from "react";

import { DeleteTodo } from "../components/DeleteTodo";
import { UpdateTodo } from "@/components/UpdateTodo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Todo = {
    id: number;
    title: string;
    description: string;
};

const Todos = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);

    // GET TODOS
    const getTodos = async () => {
        const url = import.meta.env.VITE_API_URL
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.add({
                    type: "error",
                    description: "You are not logged in",
                });

                return;
            }

            const response = await axios.get(
                `${url}/todos`,
                {
                    headers: {
                        token,
                    },
                }
            );

            setTodos(response.data.todos);

        } catch (err) {
            console.log("Failed to get todos", err);

            if (axios.isAxiosError(err)) {
                toast.add({
                    type: "error",
                    description:
                        err.response?.data?.message ||
                        "Failed to load todos",
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Something went wrong",
                });
            }
        }
    };

    // ADD TODO
    const addTodo = async () => {
        const url = import.meta.env.VITE_API_URL
        try {
            if (!title.trim()) {
                toast.add({
                    type: "error",
                    description: "Todo title cannot be empty",
                });

                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                toast.add({
                    type: "error",
                    description: "You are not logged in",
                });

                return;
            }

            const response = await axios.post(
                `${url}/todos`,
                {
                    title,
                    description,
                },
                {
                    headers: {
                        token,
                    },
                }
            );

            setTitle("");
            setDescription("");

            await getTodos();

            toast.add({
                type: "success",
                description:
                    response.data.message || "Todo added successfully",
            });

        } catch (err) {
            console.log("Failed to add todo", err);

            if (axios.isAxiosError(err)) {
                toast.add({
                    type: "error",
                    description:
                        err.response?.data?.message ||
                        "Failed to add todo",
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Something went wrong",
                });
            }
        }
    };

    // GET TODOS WHEN PAGE LOADS
    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-3xl">

                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        MyTodo
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Organize your tasks and stay productive.
                    </p>
                </div>

                {/* ADD TODO CARD */}
                <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-semibold text-slate-900">
                        Add a new todo
                    </h2>

                    <div className="space-y-4">

                        <Input
                            type="text"
                            placeholder="What do you need to do?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12"
                        />

                        <Input
                            type="text"
                            placeholder="Add a description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-12"
                        />

                        <Button
                            onClick={addTodo}
                            className="h-11 w-full"
                        >
                            Add Todo
                        </Button>

                    </div>
                </div>

                {/* TODOS HEADER */}
                <div className="mb-4 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-slate-900">
                        All Todos
                    </h2>

                    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-600">
                        {todos.length}{" "}
                        {todos.length === 1 ? "Todo" : "Todos"}
                    </span>

                </div>

                {/* TODO LIST */}
                <div className="space-y-4">

                    {todos.length === 0 ? (

                        <div className="rounded-2xl border border-dashed bg-white p-10 text-center">

                            <h3 className="text-lg font-medium text-slate-700">
                                No todos yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first todo above.
                            </p>

                        </div>

                    ) : (

                        todos.map((todo) => (

                            <div
                                key={todo.id}
                                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >

                                {/* TODO CONTENT */}
                                <div className="mb-5">

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {todo.title}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {todo.description || "No description"}
                                    </p>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-3">

                                    <DeleteTodo
                                        id={todo.id}
                                        onDelete={getTodos}
                                    />

                                    <UpdateTodo
                                        id={todo.id}
                                        currentTitle={todo.title}
                                        currentDescription={todo.description}
                                        onUpdate={getTodos}
                                    />

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>
        </div>
    );
};

export default Todos;