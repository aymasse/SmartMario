const express = require('express')
const compression = require('compression')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const router = require('./router')

// ENV variables
const port = process.env.SM_PORT || 8019
const viewsDir = process.env.SM_VIEWS_DIR || 'views'

app.use(express.static(path.resolve(__dirname, viewsDir)))
app.use(favicon(path.resolve(viewsDir, 'favicon.ico')))

app.set('view engine', 'pug')
app.set('views', viewsDir)

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// Use compression
app.use(compression())

app.use('/', router)

// 404 errors
app.use((req, res) => {
  console.error(`A request could not be fulfilled on ${req.path}`)
  res.render('404')
})

// Errors
app.use((err, req, res) => {
  console.error(`Error while receiving request : ${err}`)
  res.sendStatus(500)
})

// Start server
console.log(`Starting server on port ${port}`)
app.listen(port)
console.log(`Server listening on port ${port}`)
