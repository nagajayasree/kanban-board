'use client';

import { useState } from 'react';

export type Task = {
  _id: string;
  name: string;
  // description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
};

type Column = {
  id: Task['status'];
  label: string;
};

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const [items, setItems] = useState<Task[]>(tasks);

  const getByStatus = (status: Task['status']) =>
    items.filter((task) => task.status === status);

  return (
    <div className="flex gap-4 p-6 min-h-screen bg-gray-50">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="flex-1 bg-gray-100 rounded-xl p-4 min-h-[500px]"
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">{col.label}</h2>
            <span className="text-sm bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
              {getByStatus(col.id).length}
            </span>
          </div>

          {/* Task cards */}
          <div className="flex flex-col gap-2">
            {getByStatus(col.id).map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
              >
                <p className="font-medium text-gray-800">{task.name}</p>
                {/* {task.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {task.description}
                  </p>
                )} */}
                <span
                  className="text-sm rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor:
                      task.priority === 'low'
                        ? '#cc3300'
                        : task.priority === 'medium'
                          ? '#cc9900'
                          : '#009933',
                  }}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
