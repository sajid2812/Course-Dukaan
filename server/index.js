require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin.js");
const userRoutes = require("./routes/user.js");
const courseRoutes = require("./routes/course.js");

const app = express();
const PORT = process.env.PORT || 3000;

async function startMongo() {
  await mongoose.connect(process.env.MONGODB_URI + "course-dukaan");
  console.log("DB Connected Successfully.");
}

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/purchases", purchaseRoutes);

app.listen(PORT, async () => {
  console.log(`Server is listening on PORT ${PORT}.`);
  await startMongo();
});
