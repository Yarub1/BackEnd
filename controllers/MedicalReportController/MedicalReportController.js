// File: back/Controllers/MedicalReportController.js
import MedicalReport from "../../Models/MedicalReport/MedicalReport.js";

export const createMedicalReport = async (req, res) => {
  const {
    patientName,
    diagnosis,
    treatment,
    date,
    doctorName,
    fileId,
    patientId,
  } = req.body;
  try {
    const newMedicalReport = await MedicalReport.create({
      patientName,
      diagnosis,
      treatment,
      date,
      doctorName,
      fileId,
      patientId,
    });
    res.status(201).json(newMedicalReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to create medical report" });
  }
};

export const getMedicalReports = async (req, res) => {
  try {
    const medicalReports = await MedicalReport.findAll();
    res.status(200).json(medicalReports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medical reports" });
  }
};

export const getMedicalReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const medicalReport = await MedicalReport.findByPk(id);
    if (medicalReport) {
      res.status(200).json(medicalReport);
    } else {
      res.status(404).json({ error: "Medical report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medical report" });
  }
};

export const updateMedicalReport = async (req, res) => {
  const { id } = req.params;
  const {
    patientName,
    diagnosis,
    treatment,
    date,
    doctorName,
    fileId,
    patientId,
  } = req.body;
  try {
    const medicalReport = await MedicalReport.findByPk(id);
    if (medicalReport) {
      medicalReport.patientName = patientName;
      medicalReport.diagnosis = diagnosis;
      medicalReport.treatment = treatment;
      medicalReport.date = date;
      medicalReport.doctorName = doctorName;
      medicalReport.fileId = fileId;
      medicalReport.patientId = patientId;
      await medicalReport.save();
      res.status(200).json(medicalReport);
    } else {
      res.status(404).json({ error: "Medical report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update medical report" });
  }
};

export const deleteMedicalReport = async (req, res) => {
  const { id } = req.params;
  try {
    const medicalReport = await MedicalReport.findByPk(id);
    if (medicalReport) {
      await medicalReport.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Medical report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete medical report" });
  }
};
