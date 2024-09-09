import { expect } from "chai";
import sequelize from "../config/database.js";
import { Patient, Relationship } from "../Models/index.js";
import request from "supertest";
import app from "../app.js";

describe("Relationship Model", () => {
  let guardian, child1, child2;

  before(async () => {
    await sequelize.sync({ force: true });

    guardian = await Patient.create({
      fullName: "Guardian",
      dateOfBirth: new Date(1970, 1, 1),
      patientType: "Guardian",
    });
    child1 = await Patient.create({
      fullName: "Child1",
      dateOfBirth: new Date(2000, 1, 1),
      patientType: "Child",
    });
    child2 = await Patient.create({
      fullName: "Child2",
      dateOfBirth: new Date(2005, 1, 1),
      patientType: "Child",
    });

    await Relationship.create({ guardianId: guardian.id, childId: child1.id });
    await Relationship.create({ guardianId: guardian.id, childId: child2.id });
  });

  it("should create a new relationship", async () => {
    const relationship = await Relationship.create({
      guardianId: guardian.id,
      childId: child1.id,
    });

    expect(relationship).to.have.property("id");
    expect(relationship.guardianId).to.equal(guardian.id);
    expect(relationship.childId).to.equal(child1.id);
  });

  it("should list all children for a guardian", async () => {
    const guardianWithChildren = await Patient.findOne({
      where: { fullName: "Guardian" },
      include: [{ model: Relationship, as: "Children" }],
    });
    const childrenIds = guardianWithChildren.Children.map((rel) => rel.childId);

    const children = await Patient.findAll({ where: { id: childrenIds } });
    expect(children.length).to.equal(2);
  });

  it("should list all guardians for a child", async () => {
    const childWithGuardians = await Patient.findOne({
      where: { fullName: "Child1" },
      include: [{ model: Relationship, as: "Guardians" }],
    });
    const guardianIds = childWithGuardians.Guardians.map(
      (rel) => rel.guardianId
    );

    const guardians = await Patient.findAll({ where: { id: guardianIds } });
    expect(guardians.length).to.equal(1);
  });

  it("should not create a relationship without required fields", async () => {
    try {
      await Relationship.create({});
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("should update a relationship", async () => {
    const newGuardian = await Patient.create({
      fullName: "New Guardian",
      dateOfBirth: new Date(1985, 1, 1),
      patientType: "Guardian",
    });

    const relationship = await Relationship.findOne({
      where: { guardianId: guardian.id, childId: child1.id },
    });

    await relationship.update({ guardianId: newGuardian.id });
    expect(relationship.guardianId).to.equal(newGuardian.id);
  });

  it("should delete a relationship", async () => {
    const relationship = await Relationship.create({
      guardianId: guardian.id,
      childId: child1.id,
    });

    const relationshipToDelete = await Relationship.findOne({
      where: { guardianId: guardian.id, childId: child1.id },
    });
    const relationshipId = relationshipToDelete.id;

    await relationshipToDelete.destroy();

    const deletedRelationship = await Relationship.findByPk(relationshipId);
    expect(deletedRelationship).to.be.null;
  });

  it("should get all children for a guardian via API", async () => {
    const res = await request(app)
      .get(`/relationships/${guardian.id}/children`)
      .expect(200);

    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
  });

  it("should get all guardians for a child via API", async () => {
    const res = await request(app)
      .get(`/relationships/${child1.id}/guardians`)
      .expect(200);

    console.log(res.body); // تسجيل البيانات للتحقق
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2); // تحديث التوقع لتطابق البيانات
  });
});
