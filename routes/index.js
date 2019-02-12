const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/remote', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/client_test.html'))
})

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/NoConsole/index.html'))
})

router.get('/controller', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/Controller/index.html'))
})

router.get('/Game/:game/:chatroomId/:layout', (req, res) => {
  res.redirect(`/${req.params.game}/index.html?sessionId=${req.params.chatroomId}&layout=${req.params.layout}`)
})

module.exports = router