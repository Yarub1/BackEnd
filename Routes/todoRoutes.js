import express from "express";
import multer from "multer";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from "../controllers/todoController/todoController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/todos", getTodos);
router.get("/todos/:id", getTodoById);
router.post("/todos", upload.single("image"), addTodo);
router.put("/todos/:id", upload.single("image"), updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;
