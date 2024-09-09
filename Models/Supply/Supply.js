// File: Models/Supply.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Supply = sequelize.define("Supply", {
  supplyId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateReceived: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Supply.associate = (models) => {
  Supply.belongsTo(models.Supplier, { foreignKey: "supplierId" });
};

export default Supply;
