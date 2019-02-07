let chatrooms = []

const Startup = (res, socket) => {
  let data = res.data
  const chatroom = getChatroom(data.chatroomId)

  if (data.user === 'screen' &&  !chatroom) {
    console.log('A screen has joined the connection.')
    chatrooms.push({
      chatroomId: data.chatroomId,
      server: socket,
      players: [],
      users: [],
      game: null
    })
    console.log('Chatrooms: ' + chatrooms.length)
    socket.emit('message', { status: true, data: { playersConnected: 0, users: [] } })
  } else if (data.user === 'player' && chatroom && chatroom.users.length < 4) {
    // Add Player to the chatroom
    chatroom.players.push(socket)
    // // Add User details to the chatroom
    chatroom.users.push(data.personalDetails)

    console.log('A player has joined the connection. Current Player Count: ' + (chatroom.players.length + 1))
    // Send status info to server
    chatroom.server.emit('message', { status: true, data: { playersConnected: chatroom.players.length, users: chatroom.users } })
    //Acknowledgement to player
    socket.send({ status: true })
  } else {
    socket.send({ status: false })
    console.log('Rejected')
    socket.disconnect()
  }
}

const control = (res, socket) => {

}

const SocketHandler = socket => {
  socket.on('startup', res => Startup(res, socket))
  socket.on('control', function (res) {
    let data = res.data
    const chatroom = getChatroom(data.chatroomId)
    console.log(data)
    chatroom.server.emit('control', { keyCode: data.keyCode })
    if (chatroom.game) {
      console.log('sending controls to game')
      chatroom.game.emit('control', { keyCode: data.keyCode })
    }
  })
  
  socket.on('gameConnect', function (res) {
    let data = res.data
    const chatroom = getChatroom(data.chatroomId)
    chatroom.game = socket
    console.log('A game session has been established')
    socket.emit('control', { status: true })
  })
}

const getChatroom = chatroomId => {
  for (let i = 0; i < chatrooms.length; i++) {
    if (chatrooms[i].chatroomId === chatroomId)
      return chatrooms[i]
  }
  return null
}

module.exports = SocketHandler