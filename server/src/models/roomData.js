import mongoose, { Schema } from "mongoose";

// Create Schemasession Data: Object,
const RoomSchema = new Schema({
  sessionData: {
    type: Object,
    required: true
  },
  roomId: {
    type: String,
    required: true
  }
});

export default mongoose.model("RoomSchema", RoomSchema, "RoomSchema");
