const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];
let roomsId;

let room1=[];
let room2=[];
let room3=[];
let room4=[];
let room5=[];

var allClients = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    var currentRoomId;

    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => {
        if (currentRoomId) {
            socket.broadcast.in(currentRoomId).emit('left', `user left`);
            let roomSelected = getRightRoom(currentRoomId);
            roomSelected.pop();
        }
        console.log(`user disconnect`);
    });

    socket.on(`getRoom`, (bol) => {
        io.emit(`rooms`, [room1, room2, room3, room4, room5]);
        roomsId = socket.rooms;
    })

    socket.on(`playerOne`, (bool)=> {
        if(socket.rooms.has(bool[1]) && socket.rooms.has(socket.id)) {
            io.to(bool[1]).emit('playerOneTrue', true);
        }
    });

    socket.on(`playerTwo`, (bool)=> {
        if(socket.rooms.has(bool[1]) && socket.rooms.has(socket.id)) {
            io.to(bool[1]).emit('playerTwoTrue', true);
        }
    });

    socket.on(`playerMissed`, (direction)=> {
        if(socket.rooms.has(direction[1]) && socket.rooms.has(socket.id)) {
            io.to(direction[1]).emit('playerMissed', direction[0]);
        }
    });

    socket.on(`arrowWasRight`, (direction)=> {
        if(socket.rooms.has(direction[1]) && socket.rooms.has(socket.id)) {
            io.to(direction[1]).emit('arrowWasRight', direction[0]);
        }
    });

    socket.on(`characterChosen`, (string) => {
        if(socket.rooms.has(string[1]) && socket.rooms.has(socket.id)) {
            io.to(string[1]).emit('disableCharacter', string[0]);
        }
    });

    const getRightRoom = (roomJoined) => { 
        if(roomJoined === `room1`) {
            return room1
        } else if (roomJoined === `room2`) {
            return room2
        }else if (roomJoined === `room3`) {
            return room3
        }else if (roomJoined=== `room4`) {
            return room4
        }else if (roomJoined === `room5`) {
            return room5
        }
    }

    socket.on(`room`, (room) => {
        currentRoomId = room;
        socket.join(room);

        let roomCounter = getRightRoom(room);
        roomCounter.push(`user`);
        if(roomCounter.length=== 2) {
            if(socket.rooms.has(room) && socket.rooms.has(socket.id)) {
                io.to(room).emit('twoPlayersInRoom', true);
                io.to(room).emit('playerInRoom', `not`);
            }     
        }
        if (roomCounter.length=== 1) {
            if(socket.rooms.has(room) && socket.rooms.has(socket.id)) {
                io.to(room).emit('twoPlayersInRoom', false);
            }
        }

        if(socket.rooms.has(room) && socket.rooms.has(socket.id)) {
            io.emit(`rooms`, [room1, room2, room3, room4, room5]);
            roomsId = socket.rooms;
        }
    })

    socket.on(`level`, (level) => {
        if(socket.rooms.has(level[1]) && socket.rooms.has(socket.id)) {
            io.to(level[1]).emit('level', level[0]);
        }
    });

    socket.on(`arrow`, (arrayInfo) => {
        if(socket.rooms.has(arrayInfo[1]) && socket.rooms.has(socket.id)) {
            io.to(arrayInfo[1]).emit('arrow', arrayInfo[0]);
        }
    });

    socket.on(`gameOver`, (bool)=>{
        if(bool[0]) {
            if(socket.rooms.has(bool[1]) && socket.rooms.has(socket.id)) {
                io.to(bool[1]).emit('gameWinner', `patient`);
            }
        } else {
            if(socket.rooms.has(bool[1]) && socket.rooms.has(socket.id)) {
                io.to(bool[1]).emit('gameWinner', `doctor`);
            }
        }
    });
});

// adds and deletes users of id

server.listen(3000, () => {
  console.log('listening on *:3000');
});