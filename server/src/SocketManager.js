import mongoose from "mongoose";
import User from "./models/User";
import Room from "./models/Room";

const { ObjectId } = mongoose.Types.ObjectId;

/**
 * Iniate the socket listeners.
 */

export default function ioInit(io, socket, role, db) {
  const disconnectHelper = socketToClose => {
    setTimeout(() => {
      socketToClose.disconnect();
    }, 3000);
  };
  // Connect to session - if authenticated via JWT as admin Create room
  // if not authenticated join room as guest, if room exists
  socket.on("connectToNewSession", data => {
    const { roomId, userId, xInput, yInput } = data;

    if (role === "admin") {
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

      // Check if room exists in database Room collection
      // if no matching room is found push new room to User (as a ref)
      // and Room collections. Upon completion emit a sessionCreated event
      // back to host letting them know if it succeded or not
      const createRoom = async () => {
        try {
          const existingRoom = await Room.findOne({ room_name: roomId });

          if (existingRoom) {
            return null;
          }
          socket.join(roomId);
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

          io.to(roomId).emit("sessionCreationCheck", true);
          return null;
        } catch (err) {
          io.to(roomId).emit("databaseError", err);
          io.to(roomId).emit("sessionCreationCheck", false);
          return null;
        }
      };
      createRoom();
    } else {
      const joinRoom = async () => {
        try {
          const existingRoom = await Room.findOne({ room_name: roomId });

          if (!existingRoom) {
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

  // When guest leaves room emit and event to host with user id
  // to remove this user from the average score calculation
  socket.on("feedbackSessionLeave", data => {
    const { inputUserId, roomId } = data;
    io.to(roomId).emit("userLeftRoom", inputUserId);
    disconnectHelper(socket);
  });

  // When a guest connected to the room changes the slider the new value along with the
  // user id will be passed to the host of the room
  socket.on("changeSlider", (sliderValue, roomId, userId) => {
    io.to(roomId).emit("roomAverageValue", { sliderValue, userId });
    // Waiting 500ms before closing the socket connection saves us from console-errors
    disconnectHelper(socket);
  });

  // General disconnect event
  socket.on("disconnect", () => console.log("user disconnected", socket.id));

  // Triggered by button in LiveSession, establishes connection to mongoDB
  // and saves room data for specicied room, on an interval
  socket.on("sendToDB", data => {
    const { roomId, roomAverageValue, timeStamp } = data;
    const dbz = db;
    mongoose
      .connect(dbz, { useNewUrlParser: true })
      .then(() => console.log("MongoDB connected!"))
      .catch(err => console.log(err));

    const dbs = mongoose.connection;

    dbs.on("error", console.error.bind(console, "connection error:"));

    dbs.once("open", () => {
      Room.findOneAndUpdate(
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
    disconnectHelper(socket);

    // dbs.close();
  });
}
