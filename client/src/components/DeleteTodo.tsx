import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "./ui/toast";

type DeleteTodoProps = {
  id: number;
  onDelete: () => void;
};

export function DeleteTodo({
  id,
  onDelete,
}: DeleteTodoProps) {
  const deleteTodo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.add({
          type: "error",
          description: "You are not logged in",
        });

        return;
      }

      await axios.delete(
        `http://localhost:3000/todos/${id}`,
        {
          headers: {
            token,
          },
        }
      );

      toast.add({
        type: "success",
        description: "Todo deleted successfully",
      });

      onDelete();

    } catch (err) {
      console.log("Delete failed", err);

      if (axios.isAxiosError(err)) {
        toast.add({
          type: "error",
          description:
            err.response?.data?.message ||
            "Failed to delete todo",
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
    <Button
      variant="destructive"
      onClick={deleteTodo}
    >
      Delete
    </Button>
  );
}