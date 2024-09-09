// File: back/Routes/FileRoutes.js
import express from "express";
import {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
} from "../controllers/FileController/FileController.js";

const router = express.Router();

router.post("/files", createFile);
router.get("/files", getFiles);
router.get("/files/:id", getFileById);
router.put("/files/:id", updateFile);
router.delete("/files/:id", deleteFile);

export default router;
