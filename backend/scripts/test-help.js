const { sequelize, Competition, Judge, Room, HelpRequest } = require('../models/index.js');

async function test() {
  try {
    console.log("Testing Sequelize connection & HelpRequest model...");
    await sequelize.authenticate();
    console.log("DB connected successfully.");

    await HelpRequest.sync({ alter: true });
    console.log("HelpRequest table synced successfully!");

    const count = await HelpRequest.count();
    console.log("Current HelpRequests in DB:", count);

    const all = await HelpRequest.findAll();
    console.log("All records:", JSON.stringify(all, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Test failed with error:", err);
    process.exit(1);
  }
}

test();
