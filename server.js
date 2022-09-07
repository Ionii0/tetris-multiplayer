// const http = require('http');
const express = require('express');
const socketio = require('socket.io');

// const app = express();

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: `${__dirname}/../public` }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

// app.use(express.static(`${__dirname}/../public`));

const io = socketio(server);

//Initialising number of users for the DEFAULT room
let numberOfUsers = 0;

io.on('connection', (socket) => {

//Add the user to DEFAULT room or deny when the room is full
    let defaultRoom = "default";
    if(numberOfUsers < 2){
        socket.join(defaultRoom);
        numberOfUsers++;
        console.log(`Socket id  ** ${socket.id} ** connected on room ${[...socket.rooms][1]}`);
    }
    else {
        socket.emit('room-is-full');
        console.log("Room is full");

    }

    //Update the enemy board
    socket.on('update-board', (canvas) => {
        if([...socket.rooms][1] === "default")
            socket.to("default").emit('update-board', canvas);
    })

    //Update the number of users when someone disconnects
    socket.on('disconnect', (socket) => {
        console.log(`${socket.id} disconnected`)
        numberOfUsers--;
    })
});


//
// server.on("error", (err) => {
//     console.error(err);
// });
//
// server.listen(process.env.PORT || 3000, () => {
//     console.log("Listening on port 3000...");
// });