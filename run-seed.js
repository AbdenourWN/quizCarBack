require("dotenv").config();
const mongoose = require("mongoose");
const seedDatabase = require('./seed');

console.log("Connecting to database to run seeder...");
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected. Running seed function...");
    await seedDatabase();
    console.log("Seeding complete. Disconnecting.");
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error during seeding process:", err);
    mongoose.disconnect();
  });