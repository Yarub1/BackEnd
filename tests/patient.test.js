import { expect } from "chai";
import sequelize from "../config/database.js";
import Patient from "../Models/Patient/Patient.js";

describe("Patient Model", () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  it("should create a new patient", async () => {
    const patientData = {
      fullName: "John Doe",
      dateOfBirth: new Date(1980, 1, 1),
      address: "123 Main St",
      phoneNumber: "555-1234",
      email: "john@example.com",
      maritalStatus: "Single",
      gender: "Male",
      patientType: "Outpatient",
      idNumber: "123456",
      insuranceInfo: "Insured",
      additionalNotes: "No additional notes",
    };

    const patient = await Patient.create(patientData);
    expect(patient).to.have.property("id");
    expect(patient.fullName).to.equal("John Doe");
  });

  it("should create a patient with role 'Guardian'", async () => {
    const guardianData = {
      fullName: "Jane Smith",
      dateOfBirth: new Date(1975, 1, 1),
      address: "456 Elm St",
      phoneNumber: "555-5678",
      email: "jane@example.com",
      maritalStatus: "Married",
      gender: "Female",
      patientType: "Guardian",
      idNumber: "789012",
      insuranceInfo: "Insured",
      additionalNotes: "Guardian role",
    };

    const guardian = await Patient.create(guardianData);
    expect(guardian).to.have.property("id");
    expect(guardian.fullName).to.equal("Jane Smith");
  });

  it("should create a patient with role 'Child'", async () => {
    const childData = {
      fullName: "Tom Brown",
      dateOfBirth: new Date(2010, 1, 1),
      address: "789 Oak St",
      phoneNumber: "555-9012",
      email: "tom@example.com",
      maritalStatus: "Single",
      gender: "Male",
      patientType: "Child",
      idNumber: "345678",
      insuranceInfo: "Insured",
      additionalNotes: "Child role",
    };

    const child = await Patient.create(childData);
    expect(child).to.have.property("id");
    expect(child.fullName).to.equal("Tom Brown");
  });

  it("should not create a patient without required fields", async () => {
    try {
      await Patient.create({});
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
