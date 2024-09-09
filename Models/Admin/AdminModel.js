import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

// Define your model
const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["superadmin", "admin", "moderator"],
      defaultValue: "admin",
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    firstName: {
      type: DataTypes.VIRTUAL,
      get() {
        const username = this.getDataValue("username");
        return username ? username.split(" ")[0] : "";
      },
      set(value) {
        const username = `${value} ${this.lastName}`;
        this.setDataValue("username", username);
      },
    },
    lastName: {
      type: DataTypes.VIRTUAL,
      get() {
        const username = this.getDataValue("username");
        return username ? username.split(" ")[1] : "";
      },
      set(value) {
        const username = `${this.firstName} ${value}`;
        this.setDataValue("username", username);
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Function to check if index exists before creating it
async function ensureIndexes() {
  const queryInterface = sequelize.getQueryInterface();
  const indexes = await queryInterface.showIndex("Admins");

  const indexNames = indexes.map((index) => index.name);

  if (!indexNames.includes("admins_username")) {
    await queryInterface.addIndex("Admins", ["username"], {
      unique: true,
      name: "admins_username",
    });
  }

  if (!indexNames.includes("admins_email")) {
    await queryInterface.addIndex("Admins", ["email"], {
      unique: true,
      name: "admins_email",
    });
  }
}

// Sync the model and ensure indexes
sequelize
  .sync()
  .then(async () => {
    await ensureIndexes();
    console.log("Database synchronized and indexes ensured.");
  })
  .catch((err) => {
    console.error("Unable to synchronize the database:", err);
  });

export default Admin;
