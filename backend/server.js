const express = require('express')
const app = express();
const http = require("http");
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./Config/db');
// const socketIo = require('socket.io')
var cors = require('cors')
const Auth = require('./routes/auth')
const User = require('./routes/user')
const Post = require('./routes/posts')
const Conversation = require('./routes/conversation')
const Messages = require('./routes/message')
const Notification = require('./model/notification')
const Story = require('./routes/story')

const { Server } = require("socket.io");

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);



app.use(cors());
app.use('/uploads', express.static(__dirname + '/Images'))

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



// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept, Authorization");
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, PUT');
//         return res.status(200).json({})
//     }
//     next()
// })



// app.use('/api/register', User);
app.use('/api/auth', Auth);
app.use('/api/users', User);
app.use('/api/posts', Post);
app.use('/api/conversation', Conversation);
app.use('/api/message', Messages);
app.use('/api/story' , Story )





// const io = socketIo(app);

let Users = []


const AddUsers = (userId, SocketId) => {
    !Users.some(user => user.userId === userId) &&
        Users.push({ userId, SocketId })

}


const RemoveUser = (SocketId) => {
    Users = Users.filter((user) => user.SocketId !== SocketId)

}

const CheckUser = (userId) => {
    console.log("user are connected", userId)
    return Users.find((user) => user.userId === userId)

}



io.on('connection', (socket) => {

    //CONNECT THE USERS 

    socket.on("addUser", (userId) => {
        console.log("user connected ")

        AddUsers(userId, socket.id);
        io.emit("getUsers", Users)
    })
    //    FETCH AND GET MESSAGES
    socket.on('sendMessage', ({ senderId, recieverId, text }) => {
        const user = CheckUser(recieverId)
        io.to(user ? user.SocketId : null).emit('getMessage', {
            senderId,
            text
        })
    })

    // FETCH AND GET NOTIFICATION

    socket.on('sendNotification', async ({ senderId, recieverId, username, type, profilePicture }) => {
        try {

            const newNotifi = new Notification({
                sender: senderId,
                recipient: recieverId,
                username: username,
                type: type,
                profilePicture: profilePicture,
            })

            await newNotifi.save()



        }
        catch (error) {


        }
        const user = CheckUser(recieverId)
        io.to(user ? user.SocketId : null).emit('getNotification', {
            senderId,
            username,
            type
        })

    })

    // DISCONNET THE USERS IF LOGOUT

    socket.on('discon', (socketId) => {
        console.log("socketId", socketId)
        console.log("user are disconnected", );
        RemoveUser(socket.id)
        io.emit("getUsers", Users)


    })
    // DISCONNET THE USERS IF CLOSE TAB
    socket.on('disconnect', (socketId) => {
        console.log("socketId", socketId)
        console.log("user are disconnected close tab", );
        RemoveUser(socket.id)
        io.emit("getUsers", Users)


    })

})






