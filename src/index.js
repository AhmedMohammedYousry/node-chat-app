const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

    

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id:socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room) // only available in the server
        // socket.emit io.emit io.broadcast.emit
        // io.to.emit socket.broadcast.to.emit
        socket.emit('message', generateMessage('Admin', 'Weclome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback("Location shared!")
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left.`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
       
    })
})

server.listen(port, () => {
    console.log('Server is up and running on port ' + port);
})