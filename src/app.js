/* eslint-disable import/first */
require('dotenv').config()

import express from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import YAML from 'yamljs'
import passport from 'passport'
import errorHandler from './common/middlewares/error.handler'
import routeNotFoundHandler from './common/middlewares/not-found.handler'
import constants from '../constants'
import apiRouter from './routes/api'
import webRouter from './routes/web'
import './common/passport/local.strategy'
import './common/passport/jwt.strategy'

const port = 3000
const app = express()

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yml'))

/**
 * Config
 */
app.use(morgan('dev'))
app.use(express.json({ extend: true }))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(fileUpload())

app.use('/api/v1', apiRouter)
app.use('/', webRouter)

app.use(
  '/api/documentation',
  (req, res, next) => {
    swaggerDocument.info.title = process.env.APP_NAME
    swaggerDocument.servers = [
      {
        url: constants.apiBaseUrl(),
        description: "Base url for API's",
      },
    ]
    req.swaggerDoc = swaggerDocument
    next()
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

app.use(errorHandler)
app.use('*', routeNotFoundHandler)

app.listen(port, () => console.log(`Listening on port ${port}`))
