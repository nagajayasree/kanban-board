'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export { ObjectId };

export async function addTask(title: string, status: string) {
  const client = await clientPromise;
  const db = client.db('kanban_board');

  const result = await db.collection('tasks').insertOne({ title, status });

  return { insertedId: result.insertedId.toString() };
}

export async function deleteTask(id: string) {
  const client = await clientPromise;
  const db = client.db('kanban_board');
  const result = await db
    .collection('tasks')
    .deleteOne({ _id: new ObjectId(id) });

  console.log('deleteTask id:', id);
  console.log('deletedCount:', result.deletedCount);
  revalidatePath('/');
}
