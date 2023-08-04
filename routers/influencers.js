import { Router } from "express";
import { findInfluencer, logout, verifyLogin } from "../controllers/middleware.js";
import {
  addEvent,
  addInfluencer,
  checkDetails,
  checkin,
  createToken,
  deleteEvent,
  deleteInfluencer,
  getAllInfluencers,
  getInfluencerById,
  login,
  sendEmail,
  updateInfluencer,
} from "../controllers/influencers.js";

const influencerRouter = Router();

influencerRouter.post("/add", verifyLogin, addInfluencer);
influencerRouter.get("/", verifyLogin, getAllInfluencers);
influencerRouter.get("/id/:id", verifyLogin, getInfluencerById);
influencerRouter.post("/login", login, createToken);
influencerRouter.get("/logout", logout);
influencerRouter.post("/find", findInfluencer);
influencerRouter.delete("/id/:id", verifyLogin, deleteInfluencer);
influencerRouter.put("/id/:id", verifyLogin, updateInfluencer);
influencerRouter.post("/checkin", checkin);
influencerRouter.post("/resend", checkDetails, sendEmail);
influencerRouter.post("/add/id/:id", verifyLogin, addEvent);
influencerRouter.post("/delete/id/:id", verifyLogin, deleteEvent);

export default influencerRouter;
