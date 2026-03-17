const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url)

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders })
        }

        try {
            if (url.pathname === '/tasks' && request.method === 'GET') {
                return await getTasks(env)
            }
            if (url.pathname === '/tasks' && request.method === 'POST') {
                return await createTask(request, env)
            }
            if (url.pathname.startsWith('/tasks/') && request.method === 'PATCH') {
                const id = url.pathname.split('/')[2]
                return await updateTask(id, request, env)
            }
            if (url.pathname.startsWith('/tasks/') && request.method === 'DELETE') {
                const id = url.pathname.split('/')[2]
                return await deleteTask(id, env)
            }

            return json({ error: 'not found' }, 404)

        } catch (err) {
            return json({ error: err.message }, 500)
        }
    }
}

async function getTasks(env) {
    const res = await sbFetch(env, 'GET', '/rest/v1/tasks?select=*&order=created_at.desc')
    return json(await res.json())
}

async function createTask(request, env) {
    const body = await request.json()
    if (!body.title) return json({ error: 'title is required' }, 400)
    const res = await sbFetch(env, 'POST', '/rest/v1/tasks', { title: body.title })
    return json(await res.json(), 201)
}

async function updateTask(id, request, env) {
    const body = await request.json()
    const res = await sbFetch(env, 'PATCH', `/rest/v1/tasks?id=eq.${id}`, body)
    return json(await res.json())
}

async function deleteTask(id, env) {
    await sbFetch(env, 'DELETE', `/rest/v1/tasks?id=eq.${id}`)
    return new Response(null, { status: 204, headers: corsHeaders })
}

function sbFetch(env, method, path, body) {
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
}