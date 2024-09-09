// File: back/Controllers/PurchaseController.js
import Purchase from "../../Models/Purchase/Purchase.js";

export const createPurchase = async (req, res) => {
  const { supplyId, quantity, date, supplierId } = req.body;
  try {
    const newPurchase = await Purchase.create({
      supplyId,
      quantity,
      date,
      supplierId,
    });
    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(500).json({ error: "Failed to create purchase" });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

export const getPurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id);
    if (purchase) {
      res.status(200).json(purchase);
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
};

export const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const { supplyId, quantity, date, supplierId } = req.body;
  try {
    const purchase = await Purchase.findByPk(id);
    if (purchase) {
      purchase.supplyId = supplyId;
      purchase.quantity = quantity;
      purchase.date = date;
      purchase.supplierId = supplierId;
      await purchase.save();
      res.status(200).json(purchase);
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update purchase" });
  }
};

export const deletePurchase = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id);
    if (purchase) {
      await purchase.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};
