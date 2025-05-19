
import { toast } from "sonner";

// Todo interface to type our data
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}

// Update this URL to your hosted backend server address
const API_URL = "https://todoback-vcgb.onrender.com";

// Get all todos
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching todos:", error);
    toast.error("Could not load your tasks");
    return [];
  }
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo | null> => {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating todo:", error);
    toast.error("Could not create task");
    return null;
  }
};

// Update an existing todo
export const updateTodo = async (todo: Todo): Promise<Todo | null> => {
  try {
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Could not update task");
    return null;
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    toast.error("Could not delete task");
    return false;
  }
};
