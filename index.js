import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan"

// routers
import authRouter from "./routers/auth.js";
import eventRouter from "./routers/events.js";
import influencerRouter from "./routers/influencers.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("content"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// app.use(
//   cors('*')
// )

// app.use(cors({
//   origin:"*",
//   // credentials: true,
// }))
console.log(`${process.env.FRONT_END_URL}/*`) 

// app.use(cors())
app.use(morgan("dev"))

// middlewares
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/events/", eventRouter);
app.use("/api/v1/influencers/", influencerRouter);

