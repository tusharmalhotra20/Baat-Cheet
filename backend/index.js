const express = require("express");
const dotenv = require("dotenv");
const chats = require("./dummyData/data");
//imported connection to our database to our server
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");
const app = express();

dotenv.config();

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
app.use(cors(corsOptions));

connectDB(); //called connectDB to connect Database to our application

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Home route
// app.get("/", (req, res) => {
//   res.send("API is running!");
// });

// User route
app.use("/api/user", userRoutes);

// Chat route
app.use("/api/chat", chatRoutes);

// Message route
app.use("/api/message", messageRoutes);

// --------------------------DEPLOYMENT------------------------------

const __dirname1 = path.resolve();
// console.log(__dirname1);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------DEPLOYMENT------------------------------

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.recepient;
    // console.log(newMessageRecieved.recepient);
    if (!chat.users) return console.log("chat users not defined");

    // console.log(chat.users);
    // console.log(newMessageRecieved.sender._id);
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      } else {
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      }
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
