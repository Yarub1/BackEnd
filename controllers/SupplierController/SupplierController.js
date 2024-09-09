// File: back/Controllers/SupplierController.js
import Supplier from "../../Models/Supplier/Supplier.js";

export const createSupplier = async (req, res) => {
  const { name, contactInfo } = req.body;
  try {
    const newSupplier = await Supplier.create({ name, contactInfo });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

export const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findByPk(id);
    if (supplier) {
      res.status(200).json(supplier);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contactInfo } = req.body;
  try {
    const supplier = await Supplier.findByPk(id);
    if (supplier) {
      supplier.name = name;
      supplier.contactInfo = contactInfo;
      await supplier.save();
      res.status(200).json(supplier);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findByPk(id);
    if (supplier) {
      await supplier.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete supplier" });
  }
};
