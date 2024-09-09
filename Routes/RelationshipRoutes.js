import express from "express";
import RelationshipController from "../controllers/RelationshipController/RelationshipController.js";

const router = express.Router();

router.post("/relationships", RelationshipController.createRelationship);
router.get("/relationships", RelationshipController.getRelationships);
router.get("/relationships/:id", RelationshipController.getRelationshipById);
router.put("/relationships/:id", RelationshipController.updateRelationship);
router.delete("/relationships/:id", RelationshipController.deleteRelationship);

router.get(
  "/relationships/:childId/guardians",
  RelationshipController.getGuardiansForChild
);
router.get(
  "/relationships/:guardianId/children",
  RelationshipController.getChildrenForGuardian
);

export default router;
