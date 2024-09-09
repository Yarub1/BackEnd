// File: back/Controllers/FileController.js
import File from "../../Models/File/File.js";

export const createFile = async (req, res) => {
  const { type, title, description, category, department, folderId, patientId } = req.body;
  try {
    const newFile = await File.create({ type, title, description, date: new Date(), category, department, folderId, patientId });
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create file' });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

export const updateFile = async (req, res) => {
  const { id } = req.params;
  const { type, title, description, category, department, folderId, patientId } = req.body;
  try {
    const file = await File.findByPk(id);
    if (file) {
      file.type = type;
      file.title = title;
      file.description = description;
      file.category = category;
      file.department = department;
      file.folderId = folderId;
      file.patientId = patientId;
      await file.save();
      res.status(200).json(file);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (file) {
      await file.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
