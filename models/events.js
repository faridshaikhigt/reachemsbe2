import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  
  company: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
    index: true,
    select: false,
  },
  admin: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
    index: true,
    select: false,
  },
  status: {
    type: String,
    default: "inactive",
  },
  stime: {
    type: String,
    required: true,
  },
  etime: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  influencers: [
    {
      id: {
        type: mongoose.ObjectId,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
