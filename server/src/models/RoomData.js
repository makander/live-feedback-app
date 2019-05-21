import mongoose, { Schema } from "mongoose";

// Create Schemasession Data: Object,
const RoomSchema = new Schema({
  session_data: {
    type: Array,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});

export default mongoose.model("RoomData", RoomSchema);
