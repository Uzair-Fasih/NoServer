require('dotenv').config({ path: 'variables.env' });
const app = require('./app')
app.listen(process.env.PORT || 7777, process.env.LAN_IP, function(){
  console.log('NoServer is active at ' + process.env.LAN_IP + ':7777');
})