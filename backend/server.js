const express = require('express')
const app = express();
const bodyParser = require('body-parser')
var cors = require('cors')
const { Server } = require("socket.io");





app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const PORT = process.env.PORT || 5000;
let expressServer = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {

    socket.emit('me', socket.id)
    console.log("user are connected")

    socket.on('disconnect', () => {
        socket.broadcast.emit("callend")
    })

    socket.on('callUser', ({ signalData, name, userToCall, from }) => {
        io.to(userToCall).emit({ signal: signalData, from, name })
    })

    socket.on('ansercall', (data) => {
        io.to(data.to).emit("callacepted", data.signal)
    })
})






