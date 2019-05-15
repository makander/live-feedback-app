/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

import users from "./routes/api/users";
import { errorLogger, logger } from "./loggers";
import User from "./models/User";

config({ path: "./deploy/.env" });

const app = express();
const router = express.Router();

const dbName = process.env.NODE_ENV === "dev" ? "database-test" : "database";
const db = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${
  process.env.MONGO_INITDB_ROOT_PASSWORD
}@database:27017/${dbName}?authMechanism=SCRAM-SHA-1&authSource=admin`;

if (db === undefined) {
  throw Error("No Mongo URI set");
}

app.use(logger);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN
  })
);

app.use(bodyParser.json());

mongoose.connect(db, { useNewUrlParser: true });
mongoose.connection.on("error", error => console.log(error));
mongoose.Promise = global.Promise;

app.use(router);

// API Routes goes here
router.use("/api/users", users);

app.use(errorLogger);

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  console.error(err); // Log error message in our server's console
  // eslint-disable-next-line no-param-reassign
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server up and running on port ${port} test!`)
);

// ----------------SOCKET.IO------------------------
// THIS SHOULD GO INTO A SEPARTE FILE FOR IMPORT
const socket = require("socket.io");

const io = socket(server);
io.origins('*:*')

const jwtAuth = require("socketio-jwt-auth");

io.use(
  jwtAuth.authenticate(
    {
      secret: process.env.JWT_SECRET,
      succeedWithoutToken: true
    },
    function(payload, done) {
      if (payload && payload._id) {
        User.findOne({ _id: payload._id }, function(err, user) {
          if (err) {
            console.log("error: ", err);
            return done(err);
          }
          if (!user) {
            console.log("user does not exist: ", user);
            return done(null, false, "user does not exist!");
          }
          console.log("USER TYPE ADMIN");
          return done(null, user);
        });
      } else {
        console.log("USER TYPE GUEST");
        return done(); 
      }
    }
  )
);

let roomArrays = [];
const roomParticipants = [];

// eslint-disable-next-line no-shadow
io.on("connection", socket => {
  const role= (socket.request.user.logged_in) ? "admin" : "guest"
  console.log("you are connected as a: ", role);

  // Connect to session - if authenticated via JWT as admin Create room
  // if not authenticated join room as guest, if room exists
  socket.on("connectToNewSession", (roomId) => {
    if (role === "admin") {
      console.log("Teacher created room");
      socket.join(roomId);
      roomParticipants.push({
        userId: socket.id,
        value: null,
        room_id: roomId,
        role
      });
      const newRoom = {
        id: roomId,
        isActive: false,
        users: roomParticipants
      };
      roomArrays.push(newRoom);
      console.log("Current rooms: ", roomArrays);
      socket.emit("newSessionCreated");
    } else  {
      roomArrays.forEach(room => {
        if (room.id === roomId) {
          socket.join(roomId);
          room.users.push({
            userId: socket.id,
            value: null,
            room_id: roomId,
            role
          });
          console.log(`${role  } joined ${  roomId}`)
          socket.emit("joinedRoom");
        }
      });
    }
    return roomArrays;
  });


// When admin starts session the room value is updated and emitted to 
// the Guest page via sessoinStatusChanged
  socket.on("sessionStart", roomId => {
    roomArrays = roomArrays.map(room => {
      if (room.id === roomId) {
        console.log("Start");
        socket.emit("sessionStatusChanged", true);
        return { ...room, isActive: true };
      }
      return room;
    });
    return roomArrays;
  });

  // When admin stops session the room value is updated and emitted to 
// the Guest page via sessoinStatusChanged
  socket.on("sessionStop", roomId => {
    roomArrays = roomArrays.map(room => {
      if (room.id === roomId) {
        console.log("Stop");
        socket.emit("sessionStatusChanged", false);
        return { ...room, isActive: false };
      }
      return room;
    });
    return roomArrays;
  });

  // When guest connected to room changes the slider users value property will updated
  socket.on("changeSlider", (sliderValue) => {
    console.log("slider: ", sliderValue);
  });
});
//--------------------------------------------------
