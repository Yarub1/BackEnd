import { expect } from "chai";
import sequelize from "../config/database.js";
import Patient from "../Models/Patient/Patient.js";
import Family from "../Models/Family/Family.js";

describe("Family Model", () => {
  before(async () => {
    await sequelize.sync({ force: true });

    // Create dummy patients
    await Patient.create({
      fullName: "Parent",
      dateOfBirth: new Date(1970, 1, 1),
      patientType: "Parent",
    });
    await Patient.create({
      fullName: "Child",
      dateOfBirth: new Date(2000, 1, 1),
      patientType: "Child",
    });
    await Patient.create({
      fullName: "Sibling",
      dateOfBirth: new Date(1995, 1, 1),
      patientType: "Sibling",
    });
  });

  it("should create a family with multiple members", async () => {
    const parent = await Patient.findOne({ where: { fullName: "Parent" } });
    const child = await Patient.findOne({ where: { fullName: "Child" } });
    const sibling = await Patient.findOne({ where: { fullName: "Sibling" } });

    const family1 = await Family.create({
      familyName: "Doe Family",
      parentId: parent.id,
      childId: child.id,
    });

    const family2 = await Family.create({
      familyName: "Doe Family",
      parentId: parent.id,
      childId: sibling.id,
    });

    expect(family1).to.have.property("id");
    expect(family2).to.have.property("id");
  });
});
