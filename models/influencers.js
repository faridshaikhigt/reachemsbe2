import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    // required: true,
    // unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  events: {
    type: [
      {
        details: 
          { type: mongoose.ObjectId, ref:"Event" }
        ,
        qrcode: {
          type: String,
        },
        status: {
          type: String,
          default: "pending",
        },
      },
    ],
    // select: false,
  },
});

const Influencer = mongoose.model("Influencer", influencerSchema);

export default Influencer;
