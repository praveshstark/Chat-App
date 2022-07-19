const path = require('path');
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./src/utils/users')

const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8000;
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// app.get('/', (req, res) => {
//     res.sendFile('public/index.html', { root: __dirname })
// })
app.use(express.static(publicPath));

//server(emit) -> client(recieve) = acknowledge --> server
//client(emit) -> server(recieve) = acknowledge --> client

io.on('connection', (socket) => {
    console.log('Connect with WebSocket')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        console.log('username is ' + username)
        console.log('username is ' + room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!!`))

        callback()
        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (msg, callback) => {
        var user = getUser(socket.id)
        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!!!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('sendLocation', (coords) => {
        var user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
        }
        // io.emit('message', generateMessage(`a user has left`))
    })
})

server.listen(port, () => {
    console.log('connected to server 80000')
})