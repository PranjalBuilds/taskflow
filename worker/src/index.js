const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url)

        if (request.method === 'OPTIONS') return new Response(null, { headers: cors })

        try {
            // projects
            if (url.pathname === '/projects' && request.method === 'GET')
                return await getProjects(env)
            if (url.pathname === '/projects' && request.method === 'POST')
                return await createProject(request, env)

            // tasks
            if (url.pathname === '/tasks' && request.method === 'GET')
                return await getTasks(url, env)
            if (url.pathname === '/tasks' && request.method === 'POST')
                return await createTask(request, env)
            if (url.pathname.startsWith('/tasks/') && request.method === 'PATCH')
                return await updateTask(url.pathname.split('/')[2], request, env)
            if (url.pathname.startsWith('/tasks/') && request.method === 'DELETE')
                return await deleteTask(url.pathname.split('/')[2], env)

            return json({ error: 'not found' }, 404)
        } catch (err) {
            return json({ error: err.message }, 500)
        }
    }
}

async function getProjects(env) {
    const res = await sb(env, 'GET', '/rest/v1/projects?select=*&order=created_at.desc')
    return json(await res.json())
}

async function createProject(request, env) {
    const body = await request.json()
    if (!body.name) return json({ error: 'name is required' }, 400)
    const res = await sb(env, 'POST', '/rest/v1/projects', body)
    return json(await res.json(), 201)
}

async function getTasks(url, env) {
    const projectId = url.searchParams.get('project_id')
    let path = '/rest/v1/tasks?select=*&order=created_at.desc'
    if (projectId) path += `&project_id=eq.${projectId}`
    const res = await sb(env, 'GET', path)
    return json(await res.json())
}

async function createTask(request, env) {
    const body = await request.json()
    if (!body.title) return json({ error: 'title is required' }, 400)
    const res = await sb(env, 'POST', '/rest/v1/tasks', body)
    return json(await res.json(), 201)
}

async function updateTask(id, request, env) {
    const body = await request.json()
    const res = await sb(env, 'PATCH', `/rest/v1/tasks?id=eq.${id}`, body)
    return json(await res.json())
}

async function deleteTask(id, env) {
    await sb(env, 'DELETE', `/rest/v1/tasks?id=eq.${id}`)
    return new Response(null, { status: 204, headers: cors })
}

function sb(env, method, path, body) {
    return fetch(`${env.SUPABASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: body ? JSON.stringify(body) : undefined
    })
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...cors }
    })
}
