// File: auth.js
import express from "express";
import {
  login,
  refreshToken,
  checkAuth,
  logout,
} from "../controllers/authController/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/check", checkAuth);
router.post("/logout", logout);



export default router;
//qr


