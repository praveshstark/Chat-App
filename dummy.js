const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { on } = require('stream')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
})

//server(emit) -> client(recieve) = countUpdated
//client(emit) -> server(recieve) = increment

// let count = 0;

io.on('connection', (socket) => {
    console.log('Connect with Web Socket')

    socket.emit('message', 'Welcome!')

    // socket.emit('countUpdate', count)
    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdate', count)
    //     io.emit('countUpdate', count)
    // })

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
    })

})

server.listen(port, () => {
    console.log('connected to server 80000')
})






<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;500&display=swap');

        * {
            font-family: 'Raleway', sans-serif;
        }

        .container {
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Chat App</h1>
        <form action="" id="form">
            <input type="text" id="input" required="true" placeholder="Type your message">
            <button id="btn">Message Send</button>
        </form>
    </div>
    <!-- <button id="increment">+1</button> -->
    <script src="/socket.io/socket.io.js"></script>

    <!-- Client end -->
    <script>
        var socket = io();

        // socket.on('countUpdate', (count) => {
        //     console.log('count updated', count)
        // })
        socket.on('message', (message) => {
            console.log(message)
        })
        
        var form = document.getElementById('form')
        
        // document.querySelector('#form').addEventListener('submit', (e)=>{
        //     e.preventDefault();

        //     const msg=document.querySelector('input').value
            
        //     socket.emit('sendMessage', msg)
        // })

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            var input = document.getElementById('input')
        var msg = input.value
            if (msg) {
                socket.emit('sendMessage', msg)
                input.value = ''
            }
        })

        // document.querySelector('#increment').addEventListener('click', () => {
        //     console.log('Clicked');

        //     socket.emit('increment')
        // })

    </script>
</body>

</html>