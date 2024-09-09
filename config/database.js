import { Sequelize } from "sequelize";

// Define your database configuration
const sequelize = new Sequelize("database", "user", "pass", {
  dialect: "sqlite", // Change this according to your database type
  storage: "../db/DB.sqlite", // Corrected property name for specifying the database file path
  /*
  alter: true, // This will update the database schema automatically
  */
});

// Test the connection and sync the models with the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync(); // Sync the models with the database
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
//