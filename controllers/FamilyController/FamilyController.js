// File: FamilyController.js

import Family from "../../Models/Family/Family.js";

const createFamily = async (req, res) => {
  try {
    if (!req.body.name || !req.body.head) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name or head" });
    }
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFamilies = async (req, res) => {
  try {
    const families = await Family.findAll();
    res.status(200).json(families);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (family) {
      res.status(200).json(family);
    } else {
      res.status(404).json({ error: "Family not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFamily = async (req, res) => {
  try {
    if (!req.body.name && !req.body.head) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const family = await Family.findByPk(req.params.id);
    if (family) {
      await family.update(req.body);
      res.status(200).json(family);
    } else {
      res.status(404).json({ error: "Family not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (family) {
      await family.destroy();
      res.status(200).json({ message: "Family deleted" });
    } else {
      res.status(404).json({ error: "Family not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createFamily,
  getFamilies,
  getFamilyById,
  updateFamily,
  deleteFamily,
};
//