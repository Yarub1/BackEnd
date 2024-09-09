// File: Models/Family/Family.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Patient from "../Patient/Patient.js";

const Family = sequelize.define("Family", {
  familyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: "id",
    },
  },
  childId: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: "id",
    },
  },
});

export default Family;
//