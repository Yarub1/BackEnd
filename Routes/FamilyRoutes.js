import express from "express";
import FamilyController from "../controllers/FamilyController/FamilyController.js";

const router = express.Router();

router.post("/families", FamilyController.createFamily);
router.get("/families", FamilyController.getFamilies);
router.get("/families/:id", FamilyController.getFamilyById);
router.put("/families/:id", FamilyController.updateFamily);
router.delete("/families/:id", FamilyController.deleteFamily);

export default router;
