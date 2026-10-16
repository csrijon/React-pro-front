// Entry point: load config, build the provider, start listening.
import { loadConfig } from './config.js'
import { createProvider } from './providers/adapter.js'
import { createApp } from './server.js'

const config = loadConfig()
const provider = createProvider(config)
const app = createApp({ config, provider })

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`)
  console.log(`Provider: ${provider.name}${provider.isMock ? ' (DEMO MODE — no real LLM)' : ''}`)
  console.log(`CORS origin: ${config.corsOrigin}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${config.port} is already in use.\n` +
        `Either stop the other process, or start with a different port:\n` +
        `  PORT=4001 npm start`
    )
    process.exit(1)
  }
  console.error('Server failed to start:', err.message)
  process.exit(1)
})
