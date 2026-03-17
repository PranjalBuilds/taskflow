import { useState, useEffect } from "react";
import { api } from './api.js';


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    api.getTasks().then(setTasks);
  }, []);

  async function addTask() {
    if (!input.trim()) return 
    const result = await api.createTask(input);
    setTasks(prev => [result[0], ...prev]);
    setInput[''];
  }

  async function toggleDone(task) {
    await api.updateTask(task.id, {done : !task.done})
    setTasks(prev => 
      prev.map(t => t.id === task.id ? { ...t, done: !t.done} : t)
    )
  }

  async function removeTask(id) {
    await api.deleteTask(id) 
    setTasks(prev => prev.filter(t => t.id !== id))
    
  }

  return (
     <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>TaskFlow</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add your new task here"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex', alignItems: 'center',
          gap: 10, padding: '10px 0',
          borderBottom: '1px solid #eee'
        }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleDone(task)}
          />
          <span style={{
            flex: 1,
            textDecoration: task.done ? 'line-through' : 'none',
            color: task.done ? '#aaa' : '#000'
          }}>
            {task.title}
          </span>
          <button onClick={() => removeTask(task.id)}>delete</button>
        </div>
      ))}
    </div>
  );
}
