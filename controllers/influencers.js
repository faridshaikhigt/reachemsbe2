import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Influencer from "../models/influencers.js";
import { sendLoginDetails, sendQRMail } from "../utils/mail.js";
import generateP from "../utils/password-generator.js";
import { validateEmail } from "../utils/validators.js";
import Event from "../models/events.js";

dotenv.config();

export const getAllInfluencers = async (req, res) => {
  try {
    const influencers = await Influencer.find().populate({
      path: "events.details",
      select: "name location company status stime etime date",
    });
    return res.status(200).json(influencers);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: "Can't load influencers list" });
  }
};

export const addInfluencer = async (req, res, next) => {
  try {
    const { name, email, phone, address, username, password } = req.body;
    const role = req.role;
    if (role !== "admin") throw "You can't add any influencer";
    if (!validateEmail(email)) throw "Please enter proper email id";
    const prevInfluencer = await Influencer.findOne({
      $or: [{ email }, { phone }],
    });
    if (!name || !email || !phone || !address || !password)
      throw "Incomplete information provided";
    const hashedPass = await bcrypt.hash(password, 10);
    if (prevInfluencer) throw "Influencer already exists";
    const newInfluencer = new Influencer({
      name,
      email,
      phone,
      address,
      username,
      password: hashedPass,
    });
    await newInfluencer.save();
    // sendLoginDetails(email, { email, password });
    res.status(202).json({ msg: "Influencer added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id).populate({
      path: "events.details",
      select: "name location company status stime etime date",
    });
    if (!influencer) throw "no suck influencer found";
    return res.status(200).json(influencer);
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) throw "Please enter proper email id";
    const prevInfluencer = await Influencer.findOne({ email })
      .select("+password")
      .select("+events")
      .populate({
        path: "events.details",
        select: "name location company status stime etime date",
      });
    if (!prevInfluencer) throw "No account found with these credentials";

    const pass = await bcrypt.compare(password, prevInfluencer.password);
    if (!pass) throw "Incorrect password";
    req.influencer = prevInfluencer;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const createToken = async (req, res) => {
  try {
    const influencer = req.influencer;
    // if (req.cookies.user) res.clearCookie("user");
    const token = jwt.sign({ id: influencer._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    // res.cookie("user", token, {
    //   httpOnly:true,
    //   expire: new Date(Date.now() + 10000 * 180),
    //   sameSite: process.env.NODE_ENV==='development'?"lax":"none",
    //   secure: process.env.NODE_ENV==='development'?false:true,
    // });

    return res.status(200).json({ msg: "Successfully logged in", influencer, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const add_to_eventsList = async (event_id, influencer_id) => {
  try {
    const influencer_data = await Influencer.findById(influencer_id).select(
      "+events"
    );
    if (!influencer_data) return;
    const secret = generateP();
    const qrcode = event_id + ";" + secret + ";" + influencer_id;
    const event = {
      id: event_id,
      name: event_name,
      qrcode,
      date,
      stime,
      etime,
      location,
    };
    await Influencer.findByIdAndUpdate(influencer_id, {
      events: [...influencer_data.events, event],
    });
  } catch (error) {
    console.error(error);
  }
};

export const checkin = async (req, res) => {
  try {
    const { qrcode } = req.body;
    const event_id = qrcode.split(";")[0];
    const user_id = qrcode.split(";")[2];
    const influencer = await Influencer.findById(user_id).select("+events");
    if (!influencer) throw "No such user was found";
    const event_details = await Event.findById(event_id);
    const { influencers } = event_details;
    influencers.map((inf) => {
      if (inf.id == user_id) inf.status = "checked in";
      return inf;
    });
    influencer.events.map((event) => {
      if (event.details == event_id) event.status = "checked in";
    });
    await Promise.all([
      Influencer.findByIdAndUpdate(user_id, { events: influencer.events }),
      Event.findByIdAndUpdate(event_id, { influencers }),
    ]);
    return res.status(200).json({ msg: "Check in successful" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const deleteInfluencer = async (req, res) => {
  try {
    await Influencer.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "Influencer removed" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const updateInfluencer = async (req, res) => {
  try {
    const { name, username, email, phone, address, password } = req.body;
    let hashedPass;
    if (!validateEmail(email)) throw "Please enter proper email id";
    const prevInfluencer = await Influencer.findById(req.params.id);
    if (password) {
      hashedPass = await bcrypt.hash(password, 10);
    }

    await Influencer.findByIdAndUpdate(req.params.id, {
      name: name || prevInfluencer.name,
      username: username || prevInfluencer.username,
      email: email || prevInfluencer.email,
      phone: phone || prevInfluencer.phone,
      address: address || prevInfluencer.address,
      password: hashedPass || prevInfluencer.password,
    });

    return res.status(200).json({ msg: "Details updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const checkDetails = async (req, res, next) => {
  try {
    const { user_id, event_id } = req.body;
    const user_details = await Influencer.findById(user_id).select("+events");
    if (!user_details) throw "can't resend the qrcode";
    let nf = true;
    user_details.events.map((event) => {
      if (event.id == event_id) {
        if (!user_details.email) throw "no email id found";
        else {
          res.email = user_details.email;
          res.qrcode = event.qrcode;
          nf = false;
          next();
          return;
        }
      }
    });
    if (nf) throw "not invited";
    // return res.status(404).json({ msg: "not invited" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const sendEmail = async (req, res) => {
  sendQRMail(res.email, res.qrcode);
  return res.status(200).json({ msg: "qr send" });
};

export const addEvent = async (req, res) => {
  try {
    const influencer_id = req.params.id;
    const { event_id } = req.body;
    const influencer = await Influencer.findById(influencer_id).select(
      "+events"
    );
    const event = await Event.findById(event_id);
    if (!influencer || !event) throw "Somthing went wrong";
    const event_influencer = {
      details: event_id,
      // name: event.name,
      qrcode: event_id + ";" + generateP() + ";" + influencer_id,
      // date: event.date,
      // stime: event.stime,
      // etime: event.etime,
      // location: event.location,
    };
    const influencer_event = {
      id: influencer_id,
      name: influencer.name,
      email: influencer.email,
    };

    await Promise.all([
      Influencer.findByIdAndUpdate(influencer_id, {
        events: [...influencer.events, event_influencer],
      }),
      Event.findByIdAndUpdate(event_id, {
        influencers: [...event.influencers, influencer_event],
      }),
    ]);

    return res.status(202).json({ msg: "Influencer was added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const influencer_id = req.params.id;
    const { event_id } = req.body;
    const influencer = await Influencer.findById(influencer_id).select(
      "+events"
    );
    const event = await Event.findById(event_id);
    if (!influencer || !event) throw "Somthing went wrong";

    const newInfluencers = event.influencers.filter(
      (influencer) => influencer.id != influencer_id
    );
    const newEvents = influencer.events.filter(
      (event) => event.details != event_id
    );
    await Promise.all([
      Influencer.findByIdAndUpdate(influencer_id, {
        events: newEvents,
      }),
      Event.findByIdAndUpdate(event_id, {
        influencers: newInfluencers,
      }),
    ]);

    return res.status(202).json({ msg: "Event access removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};
