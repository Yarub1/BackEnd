// File: back\Models\index.js
import Patient from "./Patient/Patient.js";
import Relationship from "./Relationship/Relationship.js";
import Family from "./Family/Family.js";
import EyeExam from "./EyeExam/EyeExam.js";
import Appointment from "./Appointment/Appointment.js";
import Invoice from "./Invoice/Invoice.js";
import Customer from "./Customer/Customer.js";

import Folder from "./Folder/Folder.js";
import File from "./File/File.js";
import Supply from "./Supply/Supply.js";
import Supplier from "./Supplier/Supplier.js";
import Purchase from "./Purchase/Purchase.js";
import MedicalReport from "./MedicalReport/MedicalReport.js";

// علاقات المرضى
Patient.hasMany(Relationship, {
  foreignKey: "guardianId",
  as: "Children",
});
Patient.hasMany(Relationship, {
  foreignKey: "childId",
  as: "Guardians",
});
Patient.hasMany(EyeExam, {
  foreignKey: "patientId",
  as: "eyeExams",
});
Patient.hasMany(Appointment, {
  foreignKey: "patientId",
  as: "appointments",
});
Appointment.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});
Patient.hasMany(Invoice, {
  foreignKey: "patientId",
  as: "patientInvoices",
});
Invoice.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patientInvoices",
});
Appointment.hasMany(Invoice, {
  foreignKey: "appointmentId",
  as: "appointmentInvoices",
});
Invoice.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointmentInvoices",
});
Customer.hasMany(Invoice, {
  foreignKey: "customerId",
  as: "customerInvoices",
});
Invoice.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customerInvoice",
});
Relationship.belongsTo(Patient, { foreignKey: "guardianId", as: "Guardian" });
Relationship.belongsTo(Patient, { foreignKey: "childId", as: "Child" });
Family.belongsTo(Patient, { foreignKey: "parentId", as: "Parent" });
Family.belongsTo(Patient, { foreignKey: "childId", as: "Child" });

// علاقات الملفات والمجلدات
Folder.hasMany(File, { foreignKey: "folderId" });
File.belongsTo(Folder, { foreignKey: "folderId" });

Folder.belongsTo(Folder, { as: "ParentFolder", foreignKey: "parentFolderId" });

// علاقات الملفات والتقارير الطبية
File.hasMany(MedicalReport, { foreignKey: "fileId" });
MedicalReport.belongsTo(File, { foreignKey: "fileId" });

// علاقات المرضى مع الملفات والتقارير الطبية
Patient.hasMany(File, { foreignKey: "patientId" });
File.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(MedicalReport, { foreignKey: "patientId" });
MedicalReport.belongsTo(Patient, { foreignKey: "patientId" });

// علاقات المستلزمات والموردين
Supply.belongsTo(Supplier, { foreignKey: "supplierId" });
Supplier.hasMany(Supply, { foreignKey: "supplierId" });

// علاقات المشتريات
Purchase.belongsTo(Supply, { foreignKey: "supplyId" });
Supply.hasMany(Purchase, { foreignKey: "supplyId" });

Purchase.belongsTo(Supplier, { foreignKey: "supplierId" });
Supplier.hasMany(Purchase, { foreignKey: "supplierId" });

export {
  Patient,
  Relationship,
  Family,
  EyeExam,
  Appointment,
  Invoice,
  Customer,
  Folder,
  File,
  Supply,
  Supplier,
  Purchase,
  MedicalReport,
};
