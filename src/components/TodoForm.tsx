
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Todo } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, "id">) => void;
}

export const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      category: category.trim() || undefined,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("");
    setDueDate("");
    setIsExpanded(false);
  };

  return (
    <Card className="shadow-md border-t-4 border-t-purple-500 mb-6">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isExpanded && e.target.value) setIsExpanded(true);
              }}
              className="flex-grow"
              autoFocus
            />
            {!isExpanded && (
              <Button
                type="button"
                onClick={() => setIsExpanded(true)}
                variant="outline"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Details
              </Button>
            )}
          </div>

          {isExpanded && (
            <>
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setPriority(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Category (optional)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {isExpanded && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="mr-2"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!title.trim()}>
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
