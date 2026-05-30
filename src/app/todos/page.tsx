import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Supabase Connection Test: Todos</h1>
      {todos && todos.length > 0 ? (
        <ul className="divide-y divide-slate-100 dark:divide-navy-800 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 shadow-sm">
          {todos.map((todo) => (
            <li key={todo.id} className="py-3 text-sm text-slate-700 dark:text-slate-350 first:pt-0 last:pb-0">
              {todo.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-850 p-6 rounded-2xl text-center text-xs text-slate-500">
          No todos found. Make sure you have a <code className="font-mono text-blue-500">todos</code> table in Supabase with a <code className="font-mono text-blue-500">name</code> column.
        </div>
      )}
    </div>
  );
}
