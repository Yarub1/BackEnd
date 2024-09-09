// File: src/controllers/EyeExamController.test.js

import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import SequelizeMock from "sequelize-mock";
import { updateEyeExam } from "../controllers/EyeExamController/EyeExamController"; // Import the updateEyeExam controller function

// Initialize the express app
const app = express();
app.use(bodyParser.json());

// Mock the models
const DBConnectionMock = new SequelizeMock();
const EyeExamMock = DBConnectionMock.define("EyeExam", {
  patientId: 1,
  rightEyeWithoutCorrection: "20/20",
  rightEyeWithCorrection: "20/15",
});

jest.mock("../../models", () => ({
  EyeExam: EyeExamMock,
}));

// Define the route for the test
app.put("/eyeExams/:eyeExamId", updateEyeExam);

describe("EyeExamController", () => {
  describe("updateEyeExam", () => {
    it("should update an existing eye exam", async () => {
      const eyeExamData = {
        rightEyeWithoutCorrection: "20/20",
        rightEyeWithCorrection: "20/15",
      };

      // Mock the findByPk method
      EyeExamMock.findByPk = jest.fn().mockResolvedValue(
        EyeExamMock.build({
          id: 1,
          patientId: 1,
        })
      );

      const response = await request(app)
        .put("/eyeExams/1")
        .send(eyeExamData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toMatchObject(eyeExamData);
      expect(EyeExamMock.findByPk).toHaveBeenCalledWith(1);
    });

    it("should return 404 if eye exam not found", async () => {
      // Mock the findByPk method
      EyeExamMock.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put("/eyeExams/1")
        .send({})
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toEqual({ error: "EyeExam not found" });
    });

    it("should return 400 if there is an error updating", async () => {
      const eyeExamData = {
        rightEyeWithoutCorrection: "20/20",
        rightEyeWithCorrection: "20/15",
      };

      // Mock the findByPk method
      EyeExamMock.findByPk = jest.fn().mockResolvedValue(
        EyeExamMock.build({
          id: 1,
          patientId: 1,
        })
      );

      // Mock the update method to throw an error
      EyeExamMock.prototype.update = jest
        .fn()
        .mockRejectedValue(new Error("Update error"));

      const response = await request(app)
        .put("/eyeExams/1")
        .send(eyeExamData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({ error: "Update error" });
    });
  });
});
