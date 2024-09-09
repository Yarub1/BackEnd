// File: Models/MedicalReport.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const MedicalReport = sequelize.define("MedicalReport", {
  reportId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  treatment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

MedicalReport.associate = (models) => {
  MedicalReport.belongsTo(models.File, { foreignKey: "fileId" });
  MedicalReport.belongsTo(models.Patient, { foreignKey: "patientId" });
};

export default MedicalReport;
