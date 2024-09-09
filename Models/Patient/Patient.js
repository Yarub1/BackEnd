// File: Models/Patient/Patient.js


import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import EyeExam from "../EyeExam/EyeExam.js";

const Patient = sequelize.define("Patient", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  maritalStatus: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  patientType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idNumber: {
    type: DataTypes.STRING,
  },
  insuranceInfo: {
    type: DataTypes.STRING,
  },
  additionalNotes: {
    type: DataTypes.TEXT,
  },

  imageUrl: {
  
    type: DataTypes.STRING,
  },
});


Patient.associate = function (models) {
  Patient.hasMany(models.Relationship, {
    foreignKey: "guardianId",
    as: "Children",
  });
  Patient.hasMany(models.Relationship, {
    foreignKey: "childId",
    as: "Guardians",
  });
  Patient.hasMany(models.EyeExam, { foreignKey: "patientId", as: "eyeExams" });
};

export default Patient;

//
/*
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { encrypt, decrypt } from "../../utils/encryptionMediator.js";

const Patient = sequelize.define("Patient", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue("fullName", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("fullName");
      return decrypt(rawValue);
    },
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("address", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("address");
      return decrypt(rawValue);
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("phoneNumber", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("phoneNumber");
      return decrypt(rawValue);
    },
  },
  email: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("email", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("email");
      return decrypt(rawValue);
    },
  },
  maritalStatus: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  patientType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idNumber: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("idNumber", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("idNumber");
      return decrypt(rawValue);
    },
  },
  insuranceInfo: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue("insuranceInfo", encrypt(value));
    },
    get() {
      const rawValue = this.getDataValue("insuranceInfo");
      return decrypt(rawValue);
    },
  },
  additionalNotes: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
});

Patient.associate = function (models) {
  Patient.hasMany(models.Relationship, {
    foreignKey: "guardianId",
    as: "Children",
  });
  Patient.hasMany(models.Relationship, {
    foreignKey: "childId",
    as: "Guardians",
  });
  Patient.hasMany(models.EyeExam, { foreignKey: "patientId", as: "eyeExams" });
};

Patient.beforeCreate((patient) => {
  encryptPatientData(patient);
});

Patient.beforeUpdate((patient) => {
  encryptPatientData(patient);
});

Patient.afterFind((patients) => {
  if (Array.isArray(patients)) {
    patients.forEach(decryptPatientData);
  } else if (patients) {
    decryptPatientData(patients);
  }
});

const encryptPatientData = (patient) => {
  if (patient.fullName) patient.fullName = encrypt(patient.fullName);
  if (patient.address) patient.address = encrypt(patient.address);
  if (patient.phoneNumber) patient.phoneNumber = encrypt(patient.phoneNumber);
  if (patient.email) patient.email = encrypt(patient.email);
  if (patient.idNumber) patient.idNumber = encrypt(patient.idNumber);
  if (patient.insuranceInfo)
    patient.insuranceInfo = encrypt(patient.insuranceInfo);
};

const decryptPatientData = (patient) => {
  if (patient.fullName) patient.fullName = decrypt(patient.fullName);
  if (patient.address) patient.address = decrypt(patient.address);
  if (patient.phoneNumber) patient.phoneNumber = decrypt(patient.phoneNumber);
  if (patient.email) patient.email = decrypt(patient.email);
  if (patient.idNumber) patient.idNumber = decrypt(patient.idNumber);
  if (patient.insuranceInfo)
    patient.insuranceInfo = decrypt(patient.insuranceInfo);
};

export default Patient;
//

*/