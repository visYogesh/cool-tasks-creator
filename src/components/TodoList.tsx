
import { useState } from "react";
import { Todo } from "@/services/api";
import { TodoItem } from "./TodoItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  onToggleComplete: (todo: Todo) => void;
}

export const TodoList = ({
  todos,
  onDelete,
  onUpdate,
  onToggleComplete,
}: TodoListProps) => {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories from todos
  const categories = Array.from(new Set(todos.map((todo) => todo.category).filter(Boolean)));

  // Filter todos based on current filters
  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    if (filterStatus === "active" && todo.completed) return false;
    if (filterStatus === "completed" && !todo.completed) return false;
    
    // Filter by priority
    if (filterPriority !== "all" && todo.priority !== filterPriority) return false;
    
    // Filter by category
    if (filterCategory && todo.category !== filterCategory) return false;
    
    // Filter by search term
    if (
      searchTerm &&
      !todo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ) {
      return false;
    }
    
    return true;
  });

  // Sort todos: incomplete first, then by priority (high to low)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2"
          />
          
          <Select
            value={filterStatus}
            onValueChange={(value: "all" | "active" | "completed") => setFilterStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filterPriority}
            onValueChange={(value: "all" | "low" | "medium" | "high") => setFilterPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          
          {categories.length > 0 && (
            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value)}
              className="col-span-1 md:col-span-2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category as string}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || filterStatus !== "all" || filterPriority !== "all" || filterCategory 
              ? "No tasks match your filters" 
              : "No tasks yet. Add your first task!"}
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};
