
import { toast } from "sonner";

// Todo interface to type our data
export interface Todo {
  id: string | number;
  title: string;
  task?: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
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
    const data = await response.json();
    
    // Transform the data to match our Todo interface
    return data.map((item: any) => ({
      id: item.id,
      title: item.task || item.title || "Untitled task", 
      description: item.description || "",
      completed: item.completed || false,
      priority: item.priority || "medium", 
      category: item.category || "",
      dueDate: item.dueDate || ""
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    toast.error("Could not load your tasks");
    return [];
  }
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo | null> => {
  try {
    // Ensure priority is explicitly set to prevent defaults overriding user selection
    const priority = todo.priority || "medium";
    
    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: todo.title,
        completed: todo.completed,
        priority: priority,
        description: todo.description,
        category: todo.category,
        dueDate: todo.dueDate
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    
    const data = await response.json();
    
    // Ensure we use the priority that was sent in the request
    return {
      id: data.id,
      title: data.task || data.title || "Untitled task",
      description: data.description || "",
      completed: data.completed || false,
      priority: data.priority || priority, // Use original priority if not returned
      category: data.category || "",
      dueDate: data.dueDate || ""
    };
  } catch (error) {
    console.error("Error creating todo:", error);
    toast.error("Could not create task");
    return null;
  }
};

// Update an existing todo
export const updateTodo = async (todo: Todo): Promise<Todo | null> => {
  try {
    // Ensure priority is explicitly set to prevent defaults overriding user selection
    const priority = todo.priority || "medium";
    
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: todo.title,
        completed: todo.completed,
        priority: priority,
        description: todo.description,
        category: todo.category,
        dueDate: todo.dueDate
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    
    const data = await response.json();
    
    // Ensure we use the priority that was sent in the request
    return {
      id: data.id,
      title: data.task || data.title || "Untitled task",
      description: data.description || "",
      completed: data.completed || false,
      priority: data.priority || priority, // Use original priority if not returned
      category: data.category || "",
      dueDate: data.dueDate || ""
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Could not update task");
    return null;
  }
};

// Delete a todo
export const deleteTodo = async (id: string | number): Promise<boolean> => {
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
