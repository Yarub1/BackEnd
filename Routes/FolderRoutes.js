// File: back/Routes/FolderRoutes.js
import express from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/FolderController/FolderController.js";

const router = express.Router();

router.post("/folders", createFolder);
router.get("/folders", getFolders);
router.get("/folders/:id", getFolderById);
router.put("/folders/:id", updateFolder);
router.delete("/folders/:id", deleteFolder);

export default router;
