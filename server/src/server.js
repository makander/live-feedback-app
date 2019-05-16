/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

// room imports
import roomData from "./models/roomData";

import mysession from "./routes/api/mysession";
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

// Session Route
router.use("/api/my-sessions", mysession);

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

const roomArrays = [];
const roomParticipants = [];

// eslint-disable-next-line no-shadow
io.on("connection", socket => {
  // Check if user is admin- if true create new session
  // Otherwise check rooms to see if the user is connecting
  // to an existing room.
  socket.on("connectToNewSession", (roomId, isAdmin) => {
    if (isAdmin) {
      socket.join(roomId);
      roomParticipants.push({
        userId: socket.id,
        value: null,
        room_id: roomId,
        role: "teacher"
      });
      const newRoom = {
        id: roomId,
        isActive: false,
        users: roomParticipants
      };
      roomArrays.push(newRoom);
      console.log("Current rooms: ", roomArrays);
      socket.emit("newSessionCreated");
    } else {
      roomArrays.map(room => {
        if (room.id === roomId) {
          socket.join(roomId);
          room.users.push({
            userId: socket.id,
            value: null,
            room_id: roomId,
            role: "student"
          });
          socket.emit("joinedRoom");
        }
        return room;
      });
    }
  });

  socket.on("sessionStart", roomId => {
    console.log("Start");
    roomArrays.map(room => {
      if (room.id === roomId) {
        room.isActive = true;
      }
    });
    return roomArrays;
  });

  socket.on("sessionStop", roomId => {
    console.log("Stop");
    roomArrays.map(room => {
      if (room.id === roomId) {
        room.isActive = false;
      }
    });
    return roomArrays;
  });

  socket.on("changeSlider", sliderValue => {
    console.log(sliderValue);
    console.log(roomArrays);
  });

  // Load all sessions
  socket.on("loadSessions", () => {
    console.log("hej");
    const connection =
      "mongodb+srv://ruben:ruben@devconnector-k3pw0.mongodb.net/chatapp?retryWrites=true";

    // Connect to MongoDB
    mongoose
      .connect(connection, { useNewUrlParser: true })
      .then(() => console.log("MongoDB connected!"))
      .catch(err => console.log(err));

    const dbs = mongoose.connection;

    dbs.on("error", console.error.bind(console, "connection error:"));

    const getSessionData = async function(req, res) {
      try {
        const result = await roomData.find({}, function(err, docs) {
          if (!err) {
            console.log(docs);
            process.exit();
          } else {
            throw err;
          }
        });

        return res
          .status(200)
          .json({ ok: true, data: result.data.toRegJSON() });
      } catch (error) {
        return res.json(error);
      }
    };

    /* const allRoomData = roomData.find({
      roomId: "5cdad654848207005215643d-1234"
    }); */

    socket.emit("sendData", getSessionData);
    console.log(getSessionData);
  });

  // Triggered by button in LiveSession, establishes connection to mongoDB
  // and saves room data for specicied room
  socket.on("sendToDB", roomId => {
    // DB Config

    const dbz =
      "mongodb+srv://ruben:ruben@devconnector-k3pw0.mongodb.net/chatapp?retryWrites=true";

    // Connect to MongoDB
    mongoose
      .connect(dbz, { useNewUrlParser: true })
      .then(() => console.log("MongoDB connected!"))
      .catch(err => console.log(err));

    const dbs = mongoose.connection;

    dbs.on("error", console.error.bind(console, "connection error:"));
    dbs.once("open", function(data) {
      console.log("inside once");
      console.log(roomArrays);
      console.log("Connection Successful!");

      const sessionData = [];
      roomArrays.map(room => {
        if (room.id === roomId) {
          console.log("här kommer room inuti map");
          console.log(room);
          sessionData.push(room);
        }
      });
      console.log("här kommer session data");
      console.log(sessionData);

      const roomSession = new roomData({
        sessionData,
        roomId
      });
      console.log("här kommer ett nytt room document");
      console.log(roomSession);

      // save model to database
      roomSession.save(function(err, test) {
        if (err) return console.error(err);
        console.log(`${test.name} saved to bookstore collection.`);
      });
    });
  });
});
//--------------------------------------------------
