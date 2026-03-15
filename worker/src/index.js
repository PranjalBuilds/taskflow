export default {
    async fetch(request, env) {

        const res = await fetch(`${env.SUPABASE_URL}/rest/v1/tasks?select=*`, {
            headers: {
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
            }
        })

        const data = await res.json()
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })

    }
}