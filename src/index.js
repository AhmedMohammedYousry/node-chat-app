const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
// create a new instance of socket.io to configure web sockets to work with our server
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

//  we're going to use the Express static middleware to serve up what's ever in this directory
app.use(express.static(publicDirectoryPath))

// So right here we're using socket.io library on the server 
// We're also going to use it on the client inside of our web application.
io.on('connection', (socket) => {
    console.log('new web socket connection.');

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
    })
})

server.listen(port, () => {
    console.log('Server is up and running on port ' + port);
})