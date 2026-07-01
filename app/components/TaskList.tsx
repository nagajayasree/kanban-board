'use client';

import { useState } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { TbArrowRight } from 'react-icons/tb';
import { TbEdit } from 'react-icons/tb';
import { TbTrash } from 'react-icons/tb';

import { Task, Column, TaskListProps } from '../types';

import { useRouter } from 'next/navigation';

import { deleteTask, addTask } from '../actions/tasks';

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export default function TaskList({ tasks }: TaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const router = useRouter();

  function handleAddTask(colId: Task['status']) {
    setActiveColumn(colId);
    setNewTitle('');
    router.refresh();
  }

  function handleCancel() {
    setActiveColumn(null);
    setNewTitle('');
    router.refresh();
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setItems((prev) => prev.filter((task) => task._id !== id));
    router.refresh();
  };

  const handleSubmit = async (status: Task['status']) => {
    if (newTitle.trim() === '') return;

    const tempId = crypto.randomUUID();

    setItems((prev) => [
      ...prev,
      { _id: tempId, title: newTitle.trim(), status },
    ]);
    setNewTitle('');
    setActiveColumn(null);

    try {
      const { insertedId } = await addTask(newTitle.trim(), status);

      // Replace temp UUID with real MongoDB _id
      setItems((prev) =>
        prev.map((t) => (t._id === tempId ? { ...t, _id: insertedId } : t)),
      );
    } catch (error) {
      setItems((prev) => prev.filter((t) => t._id !== tempId));
      console.error('Error adding task:', error);
    }

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
              ))}{' '}
          </div>

          {/* Add task form */}
          {activeColumn === col.id ? (
            <div className="mt-3 bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(col.id);
                  if (e.key === 'Escape') handleCancel();
                }}
                className="w-full text-sm text-gray-700 border border-gray-200 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit(col.id)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={handleCancel}
                  className="text-sm text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddTask(col.id)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg py-2 transition-colors"
            >
              + Add a task
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
