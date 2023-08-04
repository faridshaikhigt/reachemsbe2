import * as dotenv from "dotenv";
import { app } from "./index.js";
import { connect_db } from "./database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async function db() {
  await connect_db();
})();
app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
