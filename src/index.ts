import 'module-alias/register'
import 'reflect-metadata'

import express from 'express'
import morgan from 'morgan'
import { startServer } from './app'

import { PORT, HOST, NODE_ENV, LOG_LEVEL } from '@/configs/index'

import { loadConsumers } from '@/mq/consumers'

loadConsumers().then(() => {
  console.log('MQ consumers loaded')
}).catch((error) => {
  console.error('MQ consumers failed to load', error)
})

const app = express()

// Setup logging
app.use(morgan(LOG_LEVEL))

// Setup graphql
startServer()
  .then(server => {
    server.applyMiddleware({ app, path: '/graphql' })

    app.listen(PORT, () => {
      console.log(`Server running on ${NODE_ENV} mode at http://${HOST}:${PORT}/graphql`)
    })
  })
  .catch(err => {
    console.error('Error starting server', err)
  })
