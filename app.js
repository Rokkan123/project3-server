import express from "express";
import morgan from "morgan";
import connectDB from "./config/mongoose.config.js";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import stratagemRouter from "./routes/stratagems.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const logger = morgan("dev");
app.use(express.json());
app.use(logger);
app.use(cors({ origin: [process.env.REACT_URL] }));

app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/stratagems", stratagemRouter);

app.listen(process.env.PORT, () => {
  console.clear();
  console.log("server running on port", process.env.PORT);
  connectDB();
});
