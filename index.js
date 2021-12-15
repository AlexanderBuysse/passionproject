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
    userList(`${socket.id}`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        rooms = [];
        userList(socket.id);
    });

    socket.on(`getRoom`, (bol) => {
        console.log(rooms[0]);
        const object = {
            room: rooms[0],
            addCounter:false
        };
        if (rooms[0] !== undefined) {
            io.emit(`rooms`, object);
        }
    })

    socket.on(`playerOne`, (bool)=> {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('playerOneTrue', true);
        }
    });

    socket.on(`playerTwo`, (bool)=> {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('playerTwoTrue', true);
        }
    });

    socket.on(`playerMissed`, (direction)=> {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('playerMissed', direction);
        }
    });

    socket.on(`room`, (room) => {
        console.log(room);
        socket.join(room);
        roomSelected= room;
        if(!rooms.includes(room)) {
            rooms.push(room);
        }

        const object = {
            room :roomSelected,
            socketId: socket.id,
            addCounter: true
        };

        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.emit(`rooms`, object);
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

    socket.on(`gameOver`, (bool)=>{
        console.log(bool);
        if(bool) {
            if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
                io.to(roomSelected).emit('gameWinner', `patient`);
            }
        } else {
            if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
                io.to(roomSelected).emit('gameWinner', `doctor`);
            }
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