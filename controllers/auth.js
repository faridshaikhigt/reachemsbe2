import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/user.js";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validators.js";
import generateP from "../utils/password-generator.js";
import { sendLoginDetails } from "../utils/mail.js";
import Event from "../models/events.js";

dotenv.config();

export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ error: "No user found" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email) || !validatePassword(password))
      throw "Invalid Credentials";

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw "No matching accounts found";

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) throw "Incorrect password";

    req.id = user._id;
    req.role = user.role;
    req.user = user;
    if (user.role === "admin") req.admin = user._id;
    else req.admin = user.admin;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: error });
  }
};

export const createUser = async (req, res) => {
  try {
    const { id, role } = req;
    if (role !== "admin") throw "You are not an admin";
    const { name, email, address, location } = req.body;
    if (!validateName(name) || !validateEmail(email)) throw "Invalid Details";

    const user = await User.findOne({ email }) ;
    if (user) throw "User already exists";
    const password = generateP();
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      admin: id,
      address,
      location,
    });
    sendLoginDetails(email, { email, password });
    await newUser.save();
    return res.status(202).json({ msg: "Account created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const forgotPassword = async (req, res) => {};

export const getAllCompany = async (req, res) => {
  try {
    const { role, id } = req;
    if (role !== "admin") throw "Not authorized";
    const company = await User.find({ admin: id, role: "company" });
    return res.status(200).json(company);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteCompany = async (req, res) => {
  try {
    if (req.role !== "admin") throw "not authorized";
    const id = req.params.id;
    const company = await User.findById(id);
    if (!company) throw "No such company found";
    await Promise.all([
      Event.deleteMany({ company: id }),
      User.findByIdAndDelete(id),
    ]);
    return res.status(200).json({ msg: "Company deleted!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateDetails = async (req, res) => {
  try {
    if (req.role !== "admin") throw "not authorized";
    const id = req.params.id;
    const company = await User.findById(id);
    const { name, email, password, address, location } = req.body;
    if (!validateEmail(email)) throw "Please enter proper email id";
    await User.findByIdAndUpdate(id, {
      name: name || company.name,
      email: email || company.email,
      password: password || company.password,
      address: address || company.address,
      location: location || company.location,
    });
    return res.status(200).json({ msg: "Company details updated" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
