import mongoose from "mongoose";
import User from "./models/User";
import Room from "./models/Room";

const { ObjectId } = mongoose.Types.ObjectId;

/**
 * Iniate the socket listeners.
 */

export default function ioInit(io, socket, role) {
  // Connect to session - if authenticated via JWT as admin Create room
  // if not authenticated join room as guest, if room exists
  socket.on("connectToNewSession", data => {
    const { roomId, userId, roomConfig } = data;
    console.log(roomConfig);
    if (role === "admin") {
      // @IDEA: Make this completely configurable from the client side

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
            hej: "hej",
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
          console.log("existingroom", existingRoom.room_config);
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

  // When a quests submits his voting options this function will recieve it
  // and emit it to the admin of the room
  socket.on("votingInput", (checkedItems, roomId) => {
    io.to(roomId).emit("votingInputs", checkedItems);
  });

  // When guest leaves room emit and event to host with user id
  // to remove this user from the average score calculation
  socket.on("feedbackSessionLeave", data => {
    const { inputUserId, roomId } = data;
    io.to(roomId).emit("userLeftRoom", inputUserId);
  });

  // When a guest connected to the room changes the slider the new value along with the
  // user id will be passed to the host of the room
  socket.on("changeSlider", (sliderValue, roomId, userId) => {
    io.to(roomId).emit("roomAverageValue", { sliderValue, userId });
    // Waiting 500ms before closing the socket connection saves us from console-errors
  });

  // General disconnect event
  socket.on("disconnect", () => console.log("user disconnected", socket.id));

  // Triggered by button in LiveSession, establishes connection to mongoDB
  // and saves room data for specicied room, on an interval
  socket.on("sendToDB", data => {
    const { roomId, roomAverageValue, timeStamp } = data;
    const updateRoom = async () => {
      const room = await Room.findOneAndUpdate(
        { room_name: roomId },
        {
          $push: {
            room_data: {
              x: timeStamp,
              y: roomAverageValue
            }
          }
        }
      );
      room.save();
    };
    updateRoom();
  });
}
