const app = require('./app')
// app.set('port', process.env.PORT || 7777)
// const server = app.listen(app.get('port'), () => {
//   console.log(`Express running → PORT ${server.address().port}`)
// })
app.listen(process.env.PORT || 7777, "192.168.43.80", function(){
  console.log('listening on *:3000');
})