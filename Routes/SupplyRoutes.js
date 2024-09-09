// File: back/Routes/SupplyRoutes.js
import express from "express";
import {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
} from "../controllers/SupplyController/SupplyController.js";

const router = express.Router();

router.post("/supplies", createSupply);
router.get("/supplies", getSupplies);
router.get("/supplies/:id", getSupplyById);
router.put("/supplies/:id", updateSupply);
router.delete("/supplies/:id", deleteSupply);

export default router;
