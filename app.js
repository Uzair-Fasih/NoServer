const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const SocketHandler = require('./Socket')

io.on('connection', function (socket) {
  SocketHandler(socket)
})

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)

module.exports = server
