// File: Models/Purchase.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Purchase = sequelize.define("Purchase", {
  purchaseId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Purchase.associate = (models) => {
  Purchase.belongsTo(models.Supply, { foreignKey: "supplyId" });
  Purchase.belongsTo(models.Supplier, { foreignKey: "supplierId" });
};

export default Purchase;
