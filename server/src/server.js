/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

import users from "./routes/api/users";
import { errorLogger, logger } from "./loggers";

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

const roomParticipants = [];

// eslint-disable-next-line no-shadow
io.on("connection", socket => {
  // Check if user is admin- if true create new session
  // Otherwise check rooms to see if the user is connecting
  // to an existing room.
  socket.on("connectToNewSession", (roomId, isAdmin) => {
    if (isAdmin) {
      socket.join(roomId);
      // NOT DRY SEE LINE 92 REFACTOR INTO SINGLE FUNCTION WITH CALLBACK HERE
      roomParticipants.push({
        userId: socket.id,
        value: null,
        room: roomId,
        role: isAdmin ? "teacher" : "student"
      });
      socket.emit("newSessionCreated");
    } else {
      roomParticipants.forEach(data => {
        if (data.room === roomId) {
          socket.join(roomId);
          roomParticipants.push({
            userId: socket.id,
            value: null,
            room: roomId,
            role: isAdmin ? "teacher" : "student"
          });
          socket.emit("joinedRoom");
          console.log("joined room triggeraction");
        }
      });
    }
  });

  socket.on("changeSlider", sliderValue => {
    console.log(sliderValue);
    console.log(roomParticipants);
  });
});
//--------------------------------------------------
