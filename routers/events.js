import { Router } from "express";
import { verifyAdmin, verifyLogin } from "../controllers/middleware.js";
import {
  createEvent,
  deleteEventbyId,
  getEvent,
  getEventbyId,
  updateEvent,
  updateEventStatus,
} from "../controllers/events.js";

const eventRouter = Router();

eventRouter.get("/", verifyLogin, getEvent); // get all event details
eventRouter.post("/", verifyLogin, verifyAdmin, createEvent); // create new event
eventRouter.get("/id/:id", verifyLogin, getEventbyId); // view event by id

// activate, inactivate, archieve delete 
eventRouter.delete("/id/:id", verifyLogin, verifyAdmin, deleteEventbyId);
eventRouter.put("/id/:id", verifyLogin, verifyAdmin, updateEvent); // update event details
eventRouter.patch("/id/:id", verifyLogin, verifyAdmin, updateEventStatus); // update event status


export default eventRouter;