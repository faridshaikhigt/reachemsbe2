import { Router } from "express";
import { createToken, logout, verifyLogin } from "../controllers/middleware.js";
import {
  createUser,
  deleteCompany,
  getAllCompany,
  login,
  profile,
  updateDetails,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.get("/", verifyLogin, profile);
authRouter.get("/company/", verifyLogin, getAllCompany);
authRouter.post("/login/", login, createToken);
authRouter.post("/create/", verifyLogin, createUser);
authRouter.get("/refresh-token/", verifyLogin, createToken);
authRouter.get("/logout", logout);
authRouter.put("/id/:id", verifyLogin, updateDetails);
authRouter.delete("/id/:id", verifyLogin, deleteCompany);

export default authRouter;
