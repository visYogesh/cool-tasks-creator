
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCheck, List } from "lucide-react";
import { toast } from "sonner";
import { Todo, fetchTodos, createTodo, updateTodo, deleteTodo } from "@/services/api";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showForm, setShowForm] = useState(true);
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load todos. Please check if your server is running.");
    }
  }, [error]);

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task created successfully");
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task updated successfully");
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task deleted successfully");
    },
  });

  // Complete all todos
  const completeAllTodos = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);
    
    if (incompleteTodos.length === 0) {
      toast.info("All tasks are already completed!");
      return;
    }
    
    // Update each incomplete todo
    incompleteTodos.forEach(todo => {
      const updatedTodo = { ...todo, completed: true };
      updateTodoMutation.mutate(updatedTodo);
    });
  };

  // Handler functions
  const handleAddTodo = (todo: Omit<Todo, "id">) => {
    createTodoMutation.mutate(todo);
  };

  const handleUpdateTodo = (todo: Todo) => {
    updateTodoMutation.mutate(todo);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    updateTodoMutation.mutate(updatedTodo);
  };

  // Stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Button 
                  variant={showForm ? "secondary" : "default"}
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center"
                >
                  {showForm ? <List className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {showForm ? "Hide Form" : "Add Task"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={completeAllTodos}
                  className="flex items-center"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Complete All
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                {isLoading 
                  ? "Loading your tasks..." 
                  : `${totalTodos} task${totalTodos !== 1 ? "s" : ""} • ${completedTodos} completed`
                }
              </p>
            </div>
          </header>

          {showForm && <TodoForm onAdd={handleAddTodo} />}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
