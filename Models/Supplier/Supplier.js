// File: Models/Supplier.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Supplier = sequelize.define("Supplier", {
  supplierId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactInfo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Supplier.associate = (models) => {
  Supplier.hasMany(models.Supply, { foreignKey: "supplierId" });
};

export default Supplier;
