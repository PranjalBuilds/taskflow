const BASE = import.meta.env.VITE_WORKER_URL

export const api = {
    getTasks: () =>
    fetch(`${BASE}/tasks`).then(r => r.json()),
    
    createTask: (title) => 
        fetch(`${BASE}/tasks`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({title})
        }).then(r => r.json()),
    
    updateTask: (id, updates) => 
        fetch(`${BASE}/tasks/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updates)
        }).then(r => r.json()),

    deleteTask: (id) => 
        fetch(`${BASE}/tasks/${id}`, {method: 'DELETE'})
}