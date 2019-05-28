/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

// room imports
// import RoomData from "./models/RoomData";

// import mysession from "./routes/api/mysession";
import users from "./routes/api/users";
import { errorLogger, logger } from "./loggers";
import User from "./models/User";
import Room from "./models/Room";

config({ path: "./deploy/.env" });

const app = express();
const router = express.Router();

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
// router.use("/api/my-sessions", mysession);

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

let roomArrays = [];
const roomParticipants = [];

// eslint-disable-next-line no-shadow
io.on("connection", socket => {
  const role = socket.request.user.logged_in ? "admin" : "guest";
  console.log("you are connected as a: ", role);

  // Connect to session - if authenticated via JWT as admin Create room
  // if not authenticated join room as guest, if room exists
  socket.on("connectToNewSession", data => {
    const { roomId, userId, roomConfig } = data;
    console.log("data", data);
    console.log("roomconfig", roomConfig);
    if (role === "admin") {
      console.log("Teacher created room");
      socket.join(roomId);
      roomParticipants.push({
        userId: socket.id,
        value: 5,
        room_id: roomId,
        role
      });

      /* data.lectureSpeed.xInput ? () : ()
      data.room_config.map(data => {
        data.types === "voting" ? roomConfigs.push(data) : null
        data.types === "lecture" =
      }) */

      // @IDEA: Make this completely configurable from the client side
      /* const roomConfig = {
        type: "voting",
        properties: {
          min: xInput,
          max: yInput,
          min_label: "Label för minsta här",
          max_label: "Label för högsta värdet här"
        }
      }; */

      const newRoom = {
        id: roomId,
        users: roomParticipants,
        room_data: [],
        room_config: roomConfig
      };

<<<<<<< HEAD
      console.log("newRoom", newRoom);

      //---------------------------------------------------
      // CHECK IF ROOM IF with id
=======
>>>>>>> a4031941785ec585084819a3dcc851809cad5174
      const { ObjectId } = mongoose.Types.ObjectId;
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
          socket.emit("sessionCreationCheck", true);
          roomParticipants.splice(0);
          return null;
        } catch (err) {
          socket.emit("databaseError", err);
          socket.emit("sessionCreationCheck", false);
          return null;
        }
      };
      createRoom();

      //---------------------------------------------------
    } else {
      roomArrays.forEach(room => {
        if (room.id === roomId) {
          console.log("room id before join", roomId);
          socket.join(roomId);
          room.users.push({
            userId: socket.id,
            value: 5,
            room_id: roomId,
            role
          });
          console.log(`${role} joined ${roomId}`);
          socket.emit("joinedRoom", socket.id, room.room_config);
        } else {
          console.log("room not found");
        }
      });
    }
    return roomArrays;
  });

  socket.on("feedbackSessionLeave", inputUserId => {
    roomArrays = roomArrays.map(room => {
      return {
        ...room,
        users: room.users.filter(user => user.userId !== inputUserId)
      };
    });
  });

  const averageUserValue = roomId => {
    const arrayToSum = [];
    const matchingRoom = roomArrays.filter(room => room.id === roomId);
    if (matchingRoom.length) {
      console.log("matchingRoom", matchingRoom, "roomArrays", roomArrays);
      const guests = matchingRoom[0].users.filter(
        user => user.role === "guest"
      );
      guests.forEach(guest => {
        arrayToSum.push(parseInt(guest.value, 10));
      });
      const userCount = guests.length;
      if (arrayToSum.length) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        const valueArrayTot = arrayToSum.reduce(reducer);
        const roomAverageValue = (valueArrayTot / userCount).toFixed(1);
        arrayToSum.splice(0);
        return roomAverageValue;
      }
    }
    return null;
  };

  // When guest connected to room changes the slider users value property will updated
  socket.on("changeSlider", (sliderValue, roomId, userId) => {
    // console.log(Object.keys(io.nsps["/"].adapter.rooms));
    roomArrays = roomArrays.map(room => {
      if (room.id === roomId) {
        room.users.map(user => {
          if (user.userId === userId) {
            const loser = user;
            loser.value = sliderValue;
            return loser;
          }
          return user;
        });
      }
      return room;
    });
    const averageVal = averageUserValue(roomId);
    console.log(averageVal);
    io.to(roomId).emit("roomAverageValue", averageVal);
    socket.disconnect();
  });

  socket.on("disconnect", () => console.log("user disconnected", socket.id));

  // Triggered by button in LiveSession, establishes connection to mongoDB
  // and saves room data for specicied room
  socket.on("sendToDB", data => {
    // DB Config¨¨

    // eslint-disable-next-line camelcase
    const { roomId } = data;
    const dbz = db;
    console.log("dbz: ", dbz, "data", data);

    // Connect to MongoDB
    mongoose
      .connect(dbz, { useNewUrlParser: true })
      .then(() => console.log("MongoDB connected!"))
      .catch(err => console.log(err));

    const dbs = mongoose.connection;

    console.log("this is data", data);
    dbs.on("error", console.error.bind(console, "connection error:"));
    dbs.once("open", function() {
      console.log(roomArrays);
      const sessionData = roomArrays.map(room => {
        if (room.id === roomId) {
          const averageScore = averageUserValue(roomId);
          console.log(averageScore);
          // eslint-disable-next-line no-extend-native
          Date.prototype.addHours = function(h) {
            this.setHours(this.getHours() + h);
            return this;
          };
          const date = new Date().addHours(2);
          console.log(date);
          const timestr = date.toLocaleTimeString("en-GB");
          const formatedtime = timestr.slice(0, timestr.lastIndexOf(":"));
          const formattime = formatedtime.replace(":", ".");
          console.log(formattime);
          room.room_data.push({ x: formattime, y: averageScore });
        }
        return room;
      });
      console.log("session_data for room model: ", sessionData);
    });
  });
});

module.exports = server;
