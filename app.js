const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/users')
const eventRoute = require('./routes/events')
const commentRoute = require('./routes/comments')
const bodyParser = require ('body-parser')
const cors = require ('cors');
const PORT = 4000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

require('dotenv/config')
app.use(bodyParser.json())
app.use(cors());
app.use('/users',userRoute)
app.use('/events',eventRoute)
app.use('/comments',commentRoute)


app.get('/',(rep,res)=>{
    res.send("we are one home")
})
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("send", ({ senderId,text }) => {
        console.log(text,senderId)
      io.emit("get", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  

mongoose.connect(process.env.DB_CONNECTION ,{useNewUrlParser:true,useUnifiedTopology: true}
)
mongoose.connection
        .once('open',() => console.log('connected'))
        .on('error ', (error)=> {
            console.log('your error',error)
        })
server.listen(PORT, () => {
            console.log(`Our app is running on port ${ PORT }`);
        });