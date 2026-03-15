import { useState, useEffect } from "react";

const BASE = import.meta.env.VITE_WORKER_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${BASE}`)
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  return (
    <div>
      <h1>TaskFlow</h1>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
}
