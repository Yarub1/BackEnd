// File: Models/File.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const File = sequelize.define("File", {
  fileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM("outgoing", "incoming"),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

File.associate = (models) => {
  File.belongsTo(models.Folder, { foreignKey: "folderId" });
  File.belongsTo(models.Patient, { foreignKey: "patientId" });
};

export default File;
