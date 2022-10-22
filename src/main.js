import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import connect from './database.js'
import padletRouter from './routes/padletsRoutes.js'
import userRouter from './routes/userRoutes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();

// MIDDLEWARES

app.use(cors({ origin: "https://padletclone.vercel.app" }));
app.use(express.json());
app.use(morgan("common"));

// CREATING THE SERVER

const server = createServer(app);

// ROUTES

app.get("/", (req, res) => res.send("Welcome to the padlet clone app."))
app.use('/padlet', padletRouter);
app.use('/auth', userRouter)

// CREATING THE SOCKET SERVER AND HANDING THE EVENTS

const io = new Server(server, {
    cors: {
        origin: "https://padletclone.vercel.app", 
        methods: ["GET", "POST"]
    }
});


// HANDLING THE EVENTS OF THE SOCKET

global.onlineRooms = new Map();

io.on("connection", (socket) => {

    socket.on("join_room", (room) => {
        socket.join(room);
    })

    socket.on("create_padlet", (padlet) => {
        socket.to(padlet.code).emit("add_padlet", padlet)
    }) 

    socket.on("delete_padlet", (obj) => {
        socket.to(obj.room).emit("remove_recieved", obj.id)
    })
})



// CONNECTING THE DATABASE AND RUNNING THE SERVER
 
connect().then(() => {
    server.listen(process.env.PORT || 5000 , () => console.log("server runing"))
});

