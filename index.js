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

    socket.on(`room1`, (room) => {
        console.log(room);
        socket.join("room1");
    })

    socket.on(`room2`, (room) => {
        console.log(room);
        socket.join("room2");
    })

    socket.on(`arrow`, (arrayInfo) => {
        if(socket.rooms.has(`room1`) && socket.rooms.has(socket.id)) {
            io.to("room1").emit('arrow', arrayInfo);
        }
        if(socket.rooms.has(`room2`) && socket.rooms.has(socket.id)) {
            io.to("room2").emit('arrow', arrayInfo);
        }
    });

    socket.on(`level`, (level) => {
        if(socket.rooms.has(`room1`) && socket.rooms.has(socket.id)) {
            io.to("room1").emit('level', level);
        }
        if(socket.rooms.has(`room2`) && socket.rooms.has(socket.id)) {
            io.to("room2").emit('level', level);
        }
    });
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