import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Patient from "../Patient/Patient.js";
import Appointment from "../Appointment/Appointment.js";
import Customer from "../Customer/Customer.js"; // استيراد نموذج الزبون
import moment from "moment";

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: "id",
    },
    allowNull: true,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Appointment,
      key: "id",
    },
    allowNull: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: "id",
    },
    allowNull: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("date");
      return moment(rawValue).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  taxRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  finalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  finalPaymentDate: {

    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("finalPaymentDate");
      return rawValue ? moment(rawValue).format("YYYY-MM-DD") : null;
    },
  },
  status: {
    type: DataTypes.ENUM,
    values: ["In Progress", "Completed", "Cancelled", "Pending"],
    allowNull: false,
    defaultValue: "In Progress",
  },
  customerType: {
    type: DataTypes.ENUM("Patient", "Regular"),
    allowNull: false,
    defaultValue: "Patient",
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "USD",
  },
});

Invoice.belongsTo(Patient, { foreignKey: "patientId", as: "patientInvoice" });
Invoice.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointmentInvoice",
});

export default Invoice;
