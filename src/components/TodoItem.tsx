
import { useState } from "react";
import { Check, Edit, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  onToggleComplete: (todo: Todo) => void;
}

export const TodoItem = ({
  todo,
  onDelete,
  onUpdate,
  onToggleComplete,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState<Todo>({ ...todo });

  const handleEditSubmit = () => {
    onUpdate(editedTodo);
    setIsEditing(false);
  };

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  };

  return (
    <Card
      className={cn(
        "transform transition-all duration-300 hover:shadow-lg border-l-4",
        todo.completed ? "opacity-70 border-green-500" : `border-${priorityColors[todo.priority].replace('bg-', '')}`
      )}
    >
      {isEditing ? (
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Task Title"
            value={editedTodo.title}
            onChange={(e) =>
              setEditedTodo({ ...editedTodo, title: e.target.value })
            }
            className="text-lg font-medium"
          />
          <Textarea
            placeholder="Add a description"
            value={editedTodo.description || ""}
            onChange={(e) =>
              setEditedTodo({ ...editedTodo, description: e.target.value })
            }
            className="resize-none"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={editedTodo.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setEditedTodo({ ...editedTodo, priority: value })
              }
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Category"
              value={editedTodo.category || ""}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, category: e.target.value })
              }
              className="flex-grow"
            />
            <Input
              type="date"
              value={editedTodo.dueDate || ""}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, dueDate: e.target.value })
              }
              className="flex-grow"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full h-6 w-6 p-1",
                    todo.completed ? "bg-green-500 text-white" : "border border-gray-300"
                  )}
                  onClick={() => onToggleComplete(todo)}
                >
                  {todo.completed && <Check className="h-4 w-4" />}
                </Button>
                <div>
                  <h3 className={cn("text-lg font-medium", todo.completed && "line-through text-gray-500")}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {todo.dueDate && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
                <Badge className={priorityColors[todo.priority]}>
                  {todo.priority}
                </Badge>
                {todo.category && (
                  <Badge variant="outline">{todo.category}</Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
