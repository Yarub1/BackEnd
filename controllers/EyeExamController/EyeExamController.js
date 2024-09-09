// File: Controllers/EyeExamController.js

import { EyeExam, Patient } from "../../Models/index.js";
import { htmlToText } from "html-to-text"; 

export const createEyeExam = async (req, res) => {
  try {
    const eyeExamData = req.body;
    const patientId = req.params.patientId;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    eyeExamData.patientId = patientId;
    const eyeExam = await EyeExam.create(eyeExamData);

    res.status(201).json(eyeExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllEyeExams = async (req, res) => {
  try {
    const eyeExams = await EyeExam.findAll();

    res.status(200).json(eyeExams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEyeExamsByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const patient = await Patient.findByPk(patientId, {
      include: {
        model: EyeExam,
        as: "eyeExams",
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // تحويل الحقول المهيأة من HTML إلى نص عادي
    const eyeExams = patient.eyeExams.map((exam) => {
      return {
        ...exam.toJSON(),
        eyeglassesPrescription: htmlToText(exam.eyeglassesPrescription || ""),
        contactLensesPrescription: htmlToText(
          exam.contactLensesPrescription || ""
        ),
        additionalTreatments: htmlToText(exam.additionalTreatments || ""),
        followUpInstructions: htmlToText(exam.followUpInstructions || ""),
      };
    });

    res.status(200).json(eyeExams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEyeExam = async (req, res) => {
  try {
    const eyeExamId = req.params.eyeExamId;
    const eyeExamData = req.body;

    const eyeExam = await EyeExam.findByPk(eyeExamId);
    if (!eyeExam) {
      return res.status(404).json({ error: "EyeExam not found" });
    }

    await eyeExam.update(eyeExamData);

    res.status(200).json(eyeExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEyeExam = async (req, res) => {
  try {
    const eyeExamId = req.params.eyeExamId;

    const eyeExam = await EyeExam.findByPk(eyeExamId);
    if (!eyeExam) {
      return res.status(404).json({ error: "EyeExam not found" });
    }

    await eyeExam.destroy();

    res.status(200).json({ message: "EyeExam deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createEyeExam,
  getEyeExamsByPatientId,
  updateEyeExam,
  deleteEyeExam,
};
