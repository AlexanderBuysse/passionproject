const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];
let roomSelected;
let rooms = [];

let room1=[];
let room2=[];
let room3=[];
let room4=[];
let room5=[];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    userList(`${socket.id}`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        //rooms = [];
        userList(socket.id);
        if(roomSelected) {
            let roomLeft= getRightRoom(roomSelected);
            roomLeft.pop();
            io.to(roomSelected).emit('twoPlayersInRoom', false);
        } 
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

    socket.on(`arrowWasRight`, (direction)=> {
        if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
            io.to(roomSelected).emit('arrowWasRight', direction);
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

        let roomCounter = getRightRoom(room);
        roomCounter.push(`user`);
        if(roomCounter.length=== 2) {
            if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
                io.to(roomSelected).emit('twoPlayersInRoom', true);
            }     
        }
        if (roomCounter.length=== 1 || roomCounter.length=== 0) {
            if(socket.rooms.has(roomSelected) && socket.rooms.has(socket.id)) {
                io.to(roomSelected).emit('twoPlayersInRoom', false);
            }     
        } 

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