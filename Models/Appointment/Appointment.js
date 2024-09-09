// File: Models/Appointment/Appointment.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Patient from "../Patient/Patient.js";
import { encrypt, decrypt } from "../../utils/encryptionMediator.js";

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: "id",
    },
  },
  date: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME, 
  },
  endTime: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      this.setDataValue("description", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("description");
      return decrypt(rawValue);
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "available",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue("notes", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("notes");
      return decrypt(rawValue);
    },
  },
});

Appointment.associate = function (models) {
  Appointment.belongsTo(models.Patient, {
    foreignKey: "patientId",
    as: "patient",
  });
};

export default Appointment;
