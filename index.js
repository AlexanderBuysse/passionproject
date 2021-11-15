const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    
    console.log(`${socket.id} connected`);
    //socket.join("some room");
    userList(`${socket.id}`);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        userList(socket.id);
    });
    socket.on('chat message', (msg) => {
      io.to("some room").emit('chat message', msg);
    });
    socket.on(`join room`, (room) => {
        console.log(room);
        socket.join("some room");
    })
});

// adds and deletes users of id
const userList = (id) => {
    if(!users.includes(id)){
        users.push(id);
    } else {
        users = users.filter(e => e !== id);
    }
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});