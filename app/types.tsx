export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
};

export type Column = {
  id: Task['status'];
  label: string;
};

export interface TaskListProps {
  tasks: Task[];
}
