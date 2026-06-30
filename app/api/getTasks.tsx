import { NextResponse } from 'next/server';
import clientPromise from '../lib/mongodb';
// import { ObjectId } from 'mongodb';

export interface Task {
  _id: string;
  name: string;
  priority: string;
}

// type TaskDb = {
//   _id: ObjectId;
//   name: string;
//   priority: string;
// };

export async function getTasks() {
  try {
    const client = await clientPromise;
    const db = client.db('kanban_board');
    const tasks = await db.collection('tasks').find({}).toArray();

    return tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      name: task.name,
      priority: task.priority,
    }));
  } catch (e) {
    console.error('Failed to fetch data from MongoDB', e);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 },
    );
  }
}
