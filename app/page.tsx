import TasksList from './components/TaskList';
import { getTasks } from './lib/tasks';

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div>
      <TasksList tasks={tasks} />
    </div>
  );
}
