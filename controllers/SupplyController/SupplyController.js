// File: back/Controllers/SupplyController.js
import Supply from "../../Models/Supply/Supply.js";

export const createSupply = async (req, res) => {
  const { name, quantity, category, dateReceived, supplierId } = req.body;
  try {
    const newSupply = await Supply.create({
      name,
      quantity,
      category,
      dateReceived,
      supplierId,
    });
    res.status(201).json(newSupply);
  } catch (error) {
    res.status(500).json({ error: "Failed to create supply" });
  }
};

export const getSupplies = async (req, res) => {
  try {
    const supplies = await Supply.findAll();
    res.status(200).json(supplies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supplies" });
  }
};

export const getSupplyById = async (req, res) => {
  const { id } = req.params;
  try {
    const supply = await Supply.findByPk(id);
    if (supply) {
      res.status(200).json(supply);
    } else {
      res.status(404).json({ error: "Supply not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supply" });
  }
};

export const updateSupply = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, dateReceived, supplierId } = req.body;
  try {
    const supply = await Supply.findByPk(id);
    if (supply) {
      supply.name = name;
      supply.quantity = quantity;
      supply.category = category;
      supply.dateReceived = dateReceived;
      supply.supplierId = supplierId;
      await supply.save();
      res.status(200).json(supply);
    } else {
      res.status(404).json({ error: "Supply not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update supply" });
  }
};

export const deleteSupply = async (req, res) => {
  const { id } = req.params;
  try {
    const supply = await Supply.findByPk(id);
    if (supply) {
      await supply.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Supply not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete supply" });
  }
};
