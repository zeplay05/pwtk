import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const B64_KEY = 'b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNjbGtmb3JhajZhdXBmbWpiN3l4NGN1eTYyaHA1d2t3Y3htNHpyNG4zZnVoeG0yN2tkY3Fqc2VsaWNjZmdqejVweTJ2Nm5neWh6aHdta3k='

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-push',
      configureServer(server) {
        server.middlewares.use('/api/push', (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}')
                const defaultKey = Buffer.from(B64_KEY, 'base64').toString('utf-8')
                const apiKey = (parsed.osApiKey && parsed.osApiKey.startsWith('os_v2_'))
                  ? parsed.osApiKey
                  : defaultKey
                const appId = parsed.osAppId || 'eb4b1635-e279-4622-8add-2c563886e5d8'

                const payload = {
                  app_id: appId,
                  headings: { en: parsed.title },
                  contents: { en: parsed.message },
                  ...(parsed.url ? { url: parsed.url } : {}),
                }

                if (parsed.grade && parsed.grade !== 'all') {
                  payload.filters = [
                    { field: 'tag', key: 'level', relation: '=', value: parsed.grade },
                    { operator: 'OR' },
                    { field: 'tag', key: 'level', relation: '=', value: 'all' },
                  ]
                } else {
                  payload.included_segments = ['Subscribed Users']
                }

                const r = await fetch('https://api.onesignal.com/notifications', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${apiKey}`,
                  },
                  body: JSON.stringify(payload),
                })
                const data = await r.json()
                res.writeHead(r.status, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          } else {
            res.writeHead(405)
            res.end()
          }
        })
      },
    },
  ],
})
