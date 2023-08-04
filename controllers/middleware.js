import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Event from "../models/events.js";
import Influencer from "../models/influencers.js";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const createToken = (req, res) => {
  const { id, role, user } = req;
  const admin = req.admin;
  // if (req.cookies.user) res.clearCookie("user");
  const token = jwt.sign({ id, role, admin }, JWT_SECRET_KEY, {
    expiresIn: "30d",
    
  });
  console.log(process.env.NODE_ENV==='development')
  // res.cookie("user", token, {
  //   httpOnly:true,
  //   expire: new Date(Date.now() + 10000 * 180),
  //   sameSite: process.env.NODE_ENV==='development'?"lax":"none",
  //   secure: process.env.NODE_ENV==='development'?false:true,
  // });
  return res.status(200).json({ msg: "Successfully logged in", role, user, token });
};

export const verifyLogin = async (req, res, next) => {
  // console.log(req.headers.authorization)
  // if(!req.headers.authorization) throw "No login token"
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ err: "No login token was found" });
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    req.id = user?.id;
    req.role = user?.role;
    req.admin = user?.admin;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.role !== "admin") throw "You are not an admin";
    next();
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};

export const getAllEvents = async (id, role, admin) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query;
      if (role === "admin") query = { admin };
      else query = { company: id };
      const events = await Event.find(query).select("+company").populate({
        path:'company',
        select:'name'
      });
      resolve(events);
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyDetails = async (req, res, next) => {
  try {
    const { role, admin } = req;
    const event_id = req.params.id;
    if (role !== "admin") throw "You are not authorized for this action";
    const event = await Event.findById(event_id).select("+admin");
    if (event.admin != admin) throw "You are not authorized for this action";
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const logout = (req, res) => {
  if (req.cookies.user) res.clearCookie("user");
  return res.status(200).json({ err: "Logged out successfully!" });
};

export const findInfluencer = async (req, res) => {
  try {
    const { data } = req.body;
    let query;
    if (data.includes("@")) query = { email: data };
    else query = { username: data };
    const influencer = await Influencer.findOne(query);
    if (!influencer)
      return res.status(404).json({ err: "Influencer not found" });
    return res.status(200).json(influencer);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};


// export const adminDashboard =  async(req, res) => {
  
// }


