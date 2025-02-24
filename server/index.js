require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./users/route.js");
const adminRoutes = require("./admin/route.js");

const app = express();
const PORT = process.env.PORT || 3000;

async function startMongo() {
  await mongoose.connect(process.env.MONGODB_URI + "course-dukaan");
  console.log("DB Connected Successfully.");
}

app.use(express.json());

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, async () => {
  console.log(`Server is listening on PORT ${PORT}.`);
  await startMongo();
});
