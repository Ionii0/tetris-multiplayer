const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(`${__dirname}/../public`));

const server = http.createServer(app);
const io = socketio(server);

//Initialising number of users for the DEFAULT room
let numberOfUsersInRoom = 0;

io.on('connection', (socket) => {

//Add the user to DEFAULT room or deny when the room is full
    let defaultRoom = "default";
    if (numberOfUsersInRoom < 2) {
        socket.join(defaultRoom);
        numberOfUsersInRoom++;
        console.log(`Socket id  ** ${socket.id} ** connected on room ${[...socket.rooms][1]}`);
    } else {
        socket.emit('room-is-full');
        console.log("Room is full");

    }

    //Update the enemy board
    socket.on('update-board', (data) => {
        if ([...socket.rooms][1] === "default")
            socket.to("default").emit('update-board', data);
    })

    //Update the number of users when someone disconnects
    socket.on('disconnect', (socket) => {
        if (io.sockets.adapter.rooms.get(defaultRoom).size > numberOfUsersInRoom) {
            console.log(`${socket.id} disconnected`);
            numberOfUsersInRoom--;
        }
    })
});


server.on("error", (err) => {
    console.error(err);
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000...");
});
