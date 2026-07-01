'use client';

import { useState } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { TbArrowRight } from 'react-icons/tb';
import { TbEdit } from 'react-icons/tb';
import { TbTrash } from 'react-icons/tb';

import { Task, Column, TaskListProps } from '../types';

import { useRouter } from 'next/navigation';

import { deleteTask } from '../actions/tasks';

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export default function TaskList({ tasks }: TaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);

  const router = useRouter();

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setItems((prev) => prev.filter((task) => task._id !== id));
    router.refresh();
  };

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
              {items.filter((task) => task.status === col.id).length}
            </span>
          </div>

          {/* Task cards */}
          <div className="flex flex-col gap-2">
            {items
              .filter((task) => task.status === col.id)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                >
                  <p className="font-medium text-gray-800">{task.title}</p>
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '10px',
                      gap: '4px',
                    }}
                  >
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-lg shadow transition duration-200">
                      <TbArrowLeft />
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-lg shadow transition duration-200">
                      <TbArrowRight />
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-lg shadow transition duration-200">
                      <TbEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-lg shadow transition duration-200"
                    >
                      <TbTrash />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
