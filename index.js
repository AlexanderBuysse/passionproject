const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    //socket.join("some room");
    userList(`${socket.id}`);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        userList(socket.id);
    });
    socket.on('chat message', (msg) => {
            if(socket.rooms.has(`some room`) && socket.rooms.has(socket.id)) {
                console.log(`user is in room 1`);
                io.to("some room").emit('chat message', msg);
            }
    });
    socket.on(`join room`, (room) => {
        console.log(room);
        socket.join("some room");
    })
    socket.on(`left`, (bool) => {
        io.emit('left', bool);
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