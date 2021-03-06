const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let users = []
let connections = []

server.listen(3000)

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

io.on('connection', socket => {
  connections.push(socket)
  console.log('connected')
  console.log(`${connections.length}`)

  socket.on('disconnect', data => {
    //Disconnect
    if (socket.username)  {
      users.splice(users.indexOf(socket.username))
      updateUsernames()
    }

    connections.splice(connections.indexOf(socket), 1)
    console.log(`Disconnected: ${connections.length} sockets connected`)
  })

  socket.on('send message', data => {
    console.log(`mensagem: ${data}`)
    io.sockets.emit('new message', {msg : data, user : socket.username})
  })

  socket.on('user logged in', data => {
    console.log(`${data} está logado`)
    socket.username = data
    users.push(data)
    updateUsernames()
  })

  function updateUsernames() {
    io.sockets.emit('get users', users)
  }

})
