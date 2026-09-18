import axios from "axios";
import { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/toast";

type UpdateTodoProps = {
  id: number;
  currentTitle: string;
  currentDescription: string;
  onUpdate: () => void;
};

export function UpdateTodo({
  id,
  currentTitle,
  currentDescription,
  onUpdate,
}: UpdateTodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  const updateTodo = async () => {
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

      await axios.put(
        `http://localhost:3000/todos/${id}`,
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

      toast.add({
        type: "success",
        description: "Todo updated successfully",
      });

      setIsEditing(false);

      onUpdate();
    } catch (err) {
      console.log("Update failed", err);

      if (axios.isAxiosError(err)) {
        toast.add({
          type: "error",
          description:
            err.response?.data?.message ||
            "Failed to update todo",
        });
      } else {
        toast.add({
          type: "error",
          description: "Something went wrong",
        });
      }
    }
  };

  if (isEditing) {
    return (
      <div className="w-full space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title"
          className="h-11"
        />

        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Todo description"
          className="h-11"
        />

        <div className="flex gap-3">
          <Button
            onClick={updateTodo}
            className="flex-1"
          >
            Save
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsEditing(true)}
      className="flex-1"
    >
      Update
    </Button>
  );
}