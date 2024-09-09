// File: Models/Relationship/Relationship.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Patient from "../Patient/Patient.js";

const Relationship = sequelize.define("Relationship", {
  guardianId: {
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

export default Relationship;
//