const quickSettings = {
  maxPlayers: 2
}

var sessions = []

const consoleStartup = (res, socket, noConsoleId) => {
  console.log('Console Startup')
  const sessionsId = sessions.length
  sessions.push([socket])
  noConsoleId = '' + sessionsId + '|0' // Screen
  socket.emit('SET_SESSION_ID', { status: true, data: { sessionsId } })
  return noConsoleId
}

const controllerStartup = (res, socket, noConsoleId) => {
  console.log('Controller Startup')
  const sessionsId = res.sessionId
  if (sessions[sessionsId]) {
    const controllerId = sessions[sessionsId].length
    if (controllerId >= quickSettings.maxPlayers + 1) {
      socket.send({ status: false, error: 'Max Players in Session' })
      socket.disconnect();
      return
    }
    sessions[sessionsId].push(socket)
    noConsoleId = '' + sessionsId + '|' + controllerId // Controller
    sessions[sessionsId][0].emit('STATUS_INFO', { playerCount: sessions[sessionsId].filter(controller => controller).length - 1 })
    socket.send({ status: true, data: { controllerId }})
    return noConsoleId
  } else {
    socket.send({ status: false, error: 'Session is invalid' })
  }
}

const disconnectedDevice = (res, socket, noConsoleId) => {
  console.log('Disconnected Device')
  if (noConsoleId && noConsoleId.length > 0) {
    const sessionsId = Number(noConsoleId.split('|')[0])
    const deviceId = Number(noConsoleId.split('|')[1])
    const limit = sessions[sessionsId].length
    if (deviceId === 1) {
      // Device is console, drop all players
      for (let i = deviceId + 1; i < limit; i++) {
        if (sessions[sessionsId] && sessions[sessionsId][i]) {
          sessions[sessionsId][i].emit('STATUS_INFO', { message: 'Console has been terminated' } )
          sessions[sessionsId][i].disconnect()
        }
      }
      // if (deviceId === 1)
        sessions[sessionsId][1] === null
        console.log(sessions[sessionsId].filter(controller => controller).length - 2)
        sessions[sessionsId][0].emit('STATUS_INFO', { playerCount: sessions[sessionsId].filter(controller => controller).length - 2 })
    } else if (deviceId !== 0) {
      // Drop controller, notify console
      sessions[sessionsId][deviceId] = null
      sessions[sessionsId][0].emit('STATUS_INFO', { playerCount: sessions[sessionsId].filter(controller => controller).length - 1 })
    }
  }
}

const consoleRedirect = (res, socket, noConsoleId) => {
  const sessionsId = res.sessionId
  sessions[sessionsId][0] = socket
  sessions[sessionsId][0].emit('STATUS_INFO', { playerCount: sessions[sessionsId].filter(controller => controller).length - 1 })
  const limit = sessions[sessionsId].length
  for (let i = 1; i < limit; i++) {
    if (sessions[sessionsId] && sessions[sessionsId][i]) {
      sessions[sessionsId][i].emit('LAYOUT', { layout: res.layout } )
    }
  }
}

const controllerControl = (res, socket, noConsoleId) => {
  if (noConsoleId.length > 0) {
    console.log('Controller Control', res)
    const sessionsId = Number(noConsoleId.split('|')[0])
    const deviceId = Number(noConsoleId.split('|')[1])
    sessions[sessionsId][0].emit('CONTROL_INFO', { keyCode: res.data.keyCode, controllerId: deviceId })
  }
}

const SocketHandler = socket => {
  // var noConsoleId = '-chatroomid-|-index-'
  var noConsoleId = ''
  
  // Begin and End 
  socket.on('CONSOLE_START_UP', res => noConsoleId = consoleStartup(res, socket, noConsoleId))
  socket.on('CONTROLLER_START_UP', res => noConsoleId = controllerStartup(res, socket, noConsoleId))
  socket.on('disconnect', res => disconnectedDevice(res, socket, noConsoleId))

  // Reconnecting
  socket.on('CONSOLE_REDIRECT', res => consoleRedirect(res, socket, noConsoleId))

  // Controls
  socket.on('CONTROLLER_CONTROL', res => controllerControl(res, socket, noConsoleId))
}

module.exports = SocketHandler