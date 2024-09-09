

import Patient from "../../Models/Patient/Patient.js";
import Relationship from "../../Models/Relationship/Relationship.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { htmlToText } from "html-to-text";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadImage = (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const imageFile = req.files.image;
  const validExtensions = [".png", ".jpg", ".jpeg", ".gif"];
  const extension = path.extname(imageFile.name).toLowerCase();

  if (!validExtensions.includes(extension)) {
    return res.status(400).json({ message: "Invalid file type." });
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    return res.status(400).json({ message: "File is too large." });
  }

  const imageName = uuidv4() + extension;
  const uploadPath = path.join(uploadsDir, imageName);

  fs.readFile(imageFile.tempFilePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading file." });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "File data is empty." });
    }

    sharp(data)
      .metadata()
      .then((metadata) => {
        if (!validExtensions.includes(`.${metadata.format}`)) {
          throw new Error("Invalid image file.");
        }

        return sharp(data).toFile(uploadPath);
      })
      .then(() => {
        const fullUrl = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${imageName}`;
        res.status(200).json({
          message: "File uploaded successfully!",
          url: fullUrl,
        });
      })
      .catch((err) => {
        console.error("Error processing file:", err);
        res.status(500).json({ message: "Error processing file." });
      });
  });
};

const createPatient = async (req, res) => {
  const { guardianId, childId, ...patientData } = req.body;

  try {
    const patient = await Patient.create(patientData);

    if (guardianId) {
      await updatePatientRole(patient.id, "Child");
      await Relationship.create({ guardianId, childId: patient.id });
    }

    if (childId) {
      await updatePatientRole(patient.id, "Guardian");
      await Relationship.create({ guardianId: patient.id, childId });
    }

    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatientRole = async (patientId, role) => {
  try {
    await Patient.update({ patientType: role }, { where: { id: patientId } });
  } catch (error) {
    throw new Error("Error updating patient role");
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      const plainTextNotes = htmlToText(patient.additionalNotes || "", {
        wordwrap: 130,
      });
      res
        .status(200)
        .json({ ...patient.toJSON(), additionalNotes: plainTextNotes });
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientRole = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      res.status(200).json({ role: patient.patientType });
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      await patient.update(req.body);
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      await patient.destroy();
      res.status(200).json({ message: "Patient deleted" });
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteManyPatients = async (req, res) => {
  const { ids } = req.body;
  try {
    await Patient.destroy({
      where: {
        id: ids,
      },
    });
    res.status(200).json({ message: "Patients deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatientAndRole = async (req, res) => {
  const { role, ...patientData } = req.body;
  const patientId = req.params.id;

  try {
    if (role === "Regular") {
      await Relationship.destroy({ where: { guardianId: patientId } });
      await Relationship.destroy({ where: { childId: patientId } });
      await Patient.update(
        { patientType: "Regular" },
        { where: { id: patientId } }
      );
    } else {
      await Patient.update({ patientType: role }, { where: { id: patientId } });
    }

    const patient = await Patient.findByPk(patientId);
    if (patient) {
      await patient.update(patientData);
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updatePatientImage = async (req, res) => {
  const patientId = req.params.id;
  let { imageUrl } = req.body;
  const imageFile = req.files ? req.files.image : null;

  try {
   
    if (imageFile) {
      const imageName = uuidv4() + path.extname(imageFile.name).toLowerCase();
      const uploadPath = path.join(uploadsDir, imageName);

      const data = fs.readFileSync(imageFile.tempFilePath);

      sharp(data)
        .toFile(uploadPath)
        .then(() => {
          imageUrl = `${req.protocol}://${req.get(
            "host"
          )}/uploads/${imageName}`;
        })
        .catch((err) => {
          console.error("Error processing file:", err);
          return res.status(500).json({ message: "Error processing file." });
        });
    }

   
    const patient = await Patient.findByPk(patientId);
    if (patient) {
      patient.imageUrl = imageUrl;
      await patient.save();
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};







export const uploadDocument = (req, res) => {
  if (!req.files || !req.files.document) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const documentFile = req.files.document;
  const validExtensions = [".doc", ".docx", ".pdf"];
  const extension = path.extname(documentFile.name).toLowerCase();

  if (!validExtensions.includes(extension)) {
    return res.status(400).json({ message: "Invalid file type." });
  }

  if (documentFile.size > 10 * 1024 * 1024) {
    return res.status(400).json({ message: "File is too large." });
  }

  const documentName = uuidv4() + extension;
  const uploadPath = path.join(uploadsDir, documentName);

  fs.readFile(documentFile.tempFilePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading file." });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "File data is empty." });
    }

    fs.writeFile(uploadPath, data, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json({ message: "Error saving file." });
      }

      const fullUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${documentName}`;
      res.status(200).json({
        message: "File uploaded successfully!",
        url: fullUrl,
      });
    });
  });
};




export default {
  createPatient,
  getPatients,
  getPatientById,
  getPatientRole, 
  updatePatient,
  deletePatient,
  updatePatientAndRole,
  uploadImage,
  deleteManyPatients,
  updatePatientImage,
  uploadDocument,
};
//