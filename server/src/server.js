/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

import users from "./routes/api/users";
import mysession from "./routes/api/mysession";
import { errorLogger, logger } from "./loggers";
import User from "./models/User";
import Room from "./models/Room";

config({ path: "./deploy/.env" });

const app = express();
const router = express.Router();
const { ObjectId } = mongoose.Types.ObjectId;
const dbName = process.env.NODE_ENV === "test" ? "database-test" : "database";
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
    origin: process.env.ALLOW_ORIGIN,
    credentials: true,
    allowedHeaders:
      "X-Requested-With, Content-Type, Authorization, If-None-Match",
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  })
);

app.options("*", cors());

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

const port = process.env.PORT || 5005;

const server = app.listen(port, () =>
  console.log(`Server up and running on port ${port} test!`)
);

// ----------------SOCKET.IO------------------------
// THIS SHOULD GO INTO A SEPARTE FILE FOR IMPORT
const socket = require("socket.io");

socket.heartbeatTimeout = 3;

const io = socket(server);
io.origins("*:*");

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
          console.log("PAYLOAD ID FETCH: ", payload._id);
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
      return done();
    }
  )
);

const roomArrays = [];

// eslint-disable-next-line no-shadow
io.on("connection", socket => {
  const role = socket.request.user.logged_in ? "admin" : "guest";
  console.log("you are connected as a: ", role);

  // Connect to session - if authenticated via JWT as admin Create room
  // if not authenticated join room as guest, if room exists
  socket.on("connectToNewSession", data => {
    const { roomId, userId, xInput, yInput } = data;

    if (role === "admin") {
      console.log("Teacher created room");
      socket.join(roomId);

      // @IDEA: Make this completely configurable from the client side
      const roomConfig = {
        type: "voting",
        properties: {
          min: xInput,
          max: yInput,
          min_label: "Label för minsta här",
          max_label: "Label för högsta värdet här"
        }
      };

      const newRoom = {
        id: roomId,
        users: [],
        room_data: [],
        room_config: roomConfig
      };

      const createRoom = async () => {
        try {
          const existingRoom = await Room.findOne({ room_name: roomId });

          if (existingRoom) {
            console.log("Room already exists");
            return null;
          }
          const mongoRoom = new Room({
            room_name: roomId,
            author_id: ObjectId(userId),
            room_data: [],
            room_config: roomConfig
          });

          const updatedUser = await User.findOne({
            _id: ObjectId(userId)
          });
          updatedUser.rooms.push(mongoRoom);
          await updatedUser.save();
          await mongoRoom.save();

          roomArrays.push(newRoom);
          io.to(roomId).emit("sessionCreationCheck", true, newRoom);
          return null;
        } catch (err) {
          io.to(roomId).emit("databaseError", err);
          io.to(roomId).emit("sessionCreationCheck", false);
          return null;
        }
      };
      createRoom();

      //---------------------------------------------------
    } else {
      const joinRoom = async () => {
        try {
          const existingRoom = await Room.findOne({ room_name: roomId });

          if (!existingRoom) {
            console.log("User attempted to join non-existing room");
            return null;
          }
          // emits to guest
          socket.emit("joinedRoom", socket.id, existingRoom.room_config);
          return null;
        } catch (err) {
          // emits to guest
          io.to(roomId).emit("databaseError", err);

          // emits to host
          io.to(roomId).emit("sessionCreationCheck", false);
          return null;
        }
      };
      joinRoom();
      const newUser = {
        userId: socket.id,
        value: 50,
        role
      };
      // emits to host
      io.to(roomId).emit("newUserJoinedRoom", newUser);
    }
  });

  socket.on("feedbackSessionLeave", data => {
    const { inputUserId, roomId } = data;
    io.to(roomId).emit("userLeftRoom", inputUserId);
  });

  // When guest connected to room changes the slider users value property will updated
  socket.on("changeSlider", (sliderValue, roomId, userId) => {
    console.log("changeslider ", sliderValue, roomId, userId);
    io.to(roomId).emit("roomAverageValue", { sliderValue, userId });
    socket.disconnect();
  });

  socket.on("disconnect", () => console.log("user disconnected", socket.id));

  // Triggered by button in LiveSession, establishes connection to mongoDB
  // and saves room data for specicied room, on an interval
  socket.on("sendToDB", data => {
    // DB Config¨¨

    const { roomId, roomAverageValue, timeStamp } = data;

    // Connect to MongoDB
    const dbz = db;
    console.log("dbz: ", dbz, "data", data);
    mongoose
      .connect(dbz, { useNewUrlParser: true })
      .then(() => console.log("MongoDB connected!"))
      .catch(err => console.log(err));

    const dbs = mongoose.connection;

    console.log("this is data", data);
    dbs.on("error", console.error.bind(console, "connection error:"));

    dbs.once("open", function() {
      Room.update(
        { room_name: roomId },
        {
          $push: {
            room_data: {
              x: timeStamp,
              y: roomAverageValue
            }
          }
        },
        () => console.log("one room found and updated")
      );
    });
  });
});

module.exports = server;
