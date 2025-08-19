const fs = require('fs');
const path  = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// IMPORTANT: Import all your Mongoose models
// I am assuming your model names. Please adjust them to match your actual files.
const User = require('./models/userModel');
const Brand = require('./models/brandModel');
const Model = require('./models/modelModel');
const Version = require('./models/versionModel');
const Question = require('./models/questionModel');
const Feature = require('./models/featureModel');
const Role = require('./models/roleModel');
const Permission = require('./models/permissionModel');

/**
 * Helper function to transform MongoDB Extended JSON ($oid, $date) to a plain object
 * that Mongoose can understand.
 */
const transformData = (records) => {
  return records.map(record => {
    const newRecord = {};
    for (const key in record) {
      if (typeof record[key] === 'object' && record[key] !== null) {
        if (record[key]['$oid']) {
          newRecord[key] = record[key]['$oid'];
        } else if (record[key]['$date']) {
          newRecord[key] = new Date(record[key]['$date']);
        } else {
          newRecord[key] = record[key];
        }
      } else {
        newRecord[key] = record[key];
      }
    }
    return newRecord;
  });
};

/**
 * Generic function to seed a collection from a JSON file.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {string} fileName - The name of the JSON file in the /data directory.
 * @param {string} modelName - A friendly name for logging.
 */
const seedCollection = async (model, fileName, modelName) => {
  try {
    const count = await model.countDocuments();
    if (count > 0) {
      console.log(`${modelName} collection is not empty. Seeding skipped.`);
      return;
    }

    const filePath = path.join(__dirname, 'data', fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = JSON.parse(fileContent);
    const transformedRecords = transformData(records);

    if (transformedRecords.length > 0) {
      await model.insertMany(transformedRecords);
      console.log(`${modelName} collection seeded successfully.`);
    } else {
      console.log(`No data to seed for ${modelName}.`);
    }
  } catch (error) {
    console.error(`Error seeding ${modelName}:`, error);
  }
};

/**
 * Seeds the admin user if they don't exist.
 */
const seedAdminUser = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists. Seeding skipped.");
            return;
        }

        // Find the admin role's _id
        const adminRole = await Role.findOne({ role: 'admin' });
        if (!adminRole) {
            console.error("Admin role not found. Please seed roles first. Cannot create admin user.");
            return;
        }

        const hashedPassword = await bcrypt.hash("Admin1234!", 12);

        const adminUser = new User({
            fullName: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: adminRole._id,
        });

        await adminUser.save();
        console.log("Admin user created successfully.");

    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
}

/**
 * Main function to orchestrate the seeding process.
 * The order is important due to references between documents (e.g., permissions needs roles and features).
 */
const seedDatabase = async () => {
  console.log("--- Starting database seeding ---");

  // Seed data with no dependencies first
  await seedCollection(Role, 'quizCars.roles.json', 'Roles');
  await seedCollection(Feature, 'quizCars.features.json', 'Features');
  await seedCollection(Question, 'quizCars.questions.json', 'Questions');
  await seedCollection(Brand, 'quizCars.brands.json', 'Brands');
  
  // Now seed data that has dependencies
  await seedCollection(Permission, 'quizCars.permissions.json', 'Permissions');
  await seedCollection(Model, 'quizCars.models.json', 'Models');
  await seedCollection(Version, 'quizCars.versions.json', 'Versions');

  // Finally, seed the admin user who depends on the 'admin' role
  await seedAdminUser();

  console.log("--- Database seeding finished ---");
};

module.exports = seedDatabase;