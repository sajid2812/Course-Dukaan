require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");
const courseRouter = require("./routes/course.js");

const app = express();
const PORT = process.env.PORT || 3000;

async function startMongo() {
  await mongoose.connect(process.env.MONGODB_URI + "course-dukaan");
  console.log("DB Connected Successfully.");
}

app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

app.listen(PORT, async () => {
  console.log(`Server is listening on PORT ${PORT}.`);
  await startMongo();
});
