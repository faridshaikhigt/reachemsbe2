import Event from "../models/events.js";
import Influencer from "../models/influencers.js";
import { add_to_eventsList } from "./influencers.js";
import { getAllEvents } from "./middleware.js";

import * as dotenv from "dotenv";
dotenv.config();

export const createEvent = async (req, res) => {
  try {
    const id = req.id;
    const admin = req.admin;
    const { name, location, stime, etime, date, company, influencers } =
      req.body;
    const newEvent = new Event({
      name,
      location,
      stime,
      etime,
      date,
      company: company || id,
      admin,
      influencers,
    });
    await newEvent.save();
    await influencers.map(async (influencer) => {
      // console.log(influencer)
      await add_to_eventsList(newEvent._id, influencer.id);
    });
    return res.status(202).json({ msg: "New event was created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const getEvent = async (req, res, next) => {
  try {
    // console.log(req.headers.cookie.split("=")[1])
    const events = await getAllEvents(req.id, req.role, req.admin);
    return res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const getEventbyId = async (req, res) => {
  try {
    const id = req.id;
    const role = req.role;
    const admin = req.admin;
    const event_id = req.params.id;

    const event = await Event.findById(event_id)
      .select("+admin")
      .select("+company")
      .populate({
        path: "company",
        select: "name",
      });

    if (
      (role === "company" && event.company._id != id) ||
      (role === "admin" && event.admin != admin)
    )
      throw "you are not authorized to view this event";

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
};

export const deleteEventbyId = async (req, res) => {
  try {
    const admin = req.admin;
    const event_id = req.params.id;
    const event = await Event.findById(event_id).select("+admin");
    if (!event) throw "No such event exists";
    if (event.admin != admin) throw "you are not authorized to view this event";
    await Event.findByIdAndDelete(event_id);
    return res.status(200).json({ msg: "Event deleted from database" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const admin = req.admin;
    const event_id = req.params.id;
    const { name, type, location, timeAndDate, company } = req.body;
    const event = await Event.findById(event_id).select("+admin");

    if (admin != event.admin) throw "You are not authorized for this action";

    const newEvent = {
      name,
      type,
      location,
      timeAndDate,
      stime,
      etime,
      location,
      company: company || event.company,
    };
    await Event.findByIdAndUpdate(event_id, newEvent);
    return res.status(202).json({ msg: "Event was updated" });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const admin = req.admin;
    const event_id = req.params.id;
    const { status } = req.body;
    const event = await Event.findById(event_id).select("+admin");

    if (admin != event.admin)
      throw "You are not auhttps://www.figma.com/file/JBBaTq1rJ8gTiLwxfF0ABH?node-id=27:167&mode=design#490766318thorized for this action";

    await Event.findByIdAndUpdate(event_id, { status });
    return res.status(202).json({ msg: "Event was updated" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
