// File: back/Routes/PurchaseRoutes.js
import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} from "../controllers/PurchaseController/PurchaseController.js";

const router = express.Router();

router.post("/purchases", createPurchase);
router.get("/purchases", getPurchases);
router.get("/purchases/:id", getPurchaseById);
router.put("/purchases/:id", updatePurchase);
router.delete("/purchases/:id", deletePurchase);

export default router;
