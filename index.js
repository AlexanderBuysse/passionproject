const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];
let roomSelected;
let rooms = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    //socket.join("some room");
    userList(`${socket.id}`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        userList(socket.id);
    });

    socket.on(`room`, (room) => {
        console.log(room);
        socket.join(room);
        roomSelected= room;
        if(!rooms.includes(room)) {
            rooms.push(room);
        }
        if(!rooms.includes(room)) {
            io.emit(`rooms`, rooms);
        }
    })

    socket.on(`level`, (level) => {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('level', level);
        }
    });

    socket.on(`arrow`, (arrayInfo) => {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('arrow', arrayInfo);
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