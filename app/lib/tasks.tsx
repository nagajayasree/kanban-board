import clientPromise from './mongodb';
import { Task } from '../components/TaskList';
import { ObjectId } from 'mongodb';

export async function getTasks(): Promise<Task[]> {
  const client = await clientPromise;
  const db = client.db('kanban_board');

  const tasks = await db
    .collection<Omit<Task, '_id'>>('tasks') // tell MongoDB the document shape
    .find({})
    .toArray();

  return tasks.map((task) => ({
    _id: task._id.toString(),
    name: task.name,
    priority: task.priority,
    // description: task.description,
    status: task.status,
  }));
}

export async function deleteTask(id: string) {
  const client = await clientPromise;
  const db = client.db('kanban_board');

  const result = await db
    .collection<Omit<Task, '_id'>>('tasks')
    .findOneAndDelete({ _id: new ObjectId(id) });

  return result;
}
