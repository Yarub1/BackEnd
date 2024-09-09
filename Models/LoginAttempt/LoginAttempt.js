// File: models/LoginAttempt.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const LoginAttempt = sequelize.define(
  "LoginAttempt",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default LoginAttempt;
//