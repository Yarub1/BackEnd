// File: Models/Folder.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Folder = sequelize.define("Folder", {
  folderId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  dateCreated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  parentFolderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Folder.associate = (models) => {
  Folder.hasMany(models.File, { foreignKey: "folderId" });
  Folder.belongsTo(models.Folder, {
    as: "ParentFolder",
    foreignKey: "parentFolderId",
  });
};

export default Folder;
