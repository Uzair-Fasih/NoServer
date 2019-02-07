const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/test.html'))
})

router.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/client_test.html'))
})

router.get('/Game/2048/:chatroomId', (req, res) => {
  res.sendFile(path.join(__dirname + '/Library/2048/index.html'))
})

module.exports = router