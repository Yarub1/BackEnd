// File: back/Controllers/FolderController.js
import Folder from "../../Models/Folder/Folder.js";

export const createFolder = async (req, res) => {
  const { name, description, parentFolderId } = req.body;
  try {
    const newFolder = await Folder.create({
      name,
      description,
      parentFolderId,
    });
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create folder" });
  }
};

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};

export const getFolderById = async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await Folder.findByPk(id);
    if (folder) {
      res.status(200).json(folder);
    } else {
      res.status(404).json({ error: "Folder not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folder" });
  }
};

export const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name, description, parentFolderId } = req.body;
  try {
    const folder = await Folder.findByPk(id);
    if (folder) {
      folder.name = name;
      folder.description = description;
      folder.parentFolderId = parentFolderId;
      await folder.save();
      res.status(200).json(folder);
    } else {
      res.status(404).json({ error: "Folder not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update folder" });
  }
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await Folder.findByPk(id);
    if (folder) {
      await folder.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Folder not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete folder" });
  }
};
