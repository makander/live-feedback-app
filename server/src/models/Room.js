import mongoose, { Schema } from "mongoose";

// Create Schemasession Data: Object,
const RoomSchema = new Schema({
  room_name: {
    type: String,
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room_data: [
    {
      x: String,
      y: String
    }
  ],
  room_config: {
    type: { type: String },
    properties: {
      min_label: String,
      max_label: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
