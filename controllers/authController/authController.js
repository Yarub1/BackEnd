import jwt from "jsonwebtoken";
import argon2 from "argon2";
import crypto from "crypto";
import validator from "validator";
import Admin from "../../Models/Admin/AdminModel.js";
import LoginAttempt from "../../Models/LoginAttempt/LoginAttempt.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
const HMAC_SECRET = process.env.HMAC_SECRET;
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000;
let loginAttempts = {};

if (!HMAC_SECRET) {
  throw new Error(
    "HMAC_SECRET is not defined. Please set it in the environment variables."
  );
}

const logLoginAttempt = async (email, success, message, ip, req) => {
  try {
    await LoginAttempt.create({
      email,
      success,
      message,
      ip: ip || "unknown",
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("Error logging login attempt:", error);
  }
};

export const getClientIp = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error getting public IPv4:", error);
    return "127.0.0.1";
  }
};

const generateDeviceFingerprint = (ip, userAgent) => {
  return `${ip}_${userAgent}`;
};

const signToken = (token) => {
  const hmac = crypto.createHmac("sha256", HMAC_SECRET);
  hmac.update(token);
  return hmac.digest("hex");
};

const verifyHmac = (token, signature) => {
  const hmac = crypto.createHmac("sha256", HMAC_SECRET);
  hmac.update(token);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
};

export const login = async (req, res) => {
  try {
    const { email, password, persistent } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 2 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const clientIp = await getClientIp();
    const deviceFingerprint = generateDeviceFingerprint(
      clientIp,
      req.headers["user-agent"]
    );

    if (loginAttempts[email] && loginAttempts[email] >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = loginAttempts[`${email}_lockoutTime`];
      const currentTime = new Date().getTime();
      if (currentTime - lockoutTime < LOCKOUT_DURATION) {
        const remainingTime = LOCKOUT_DURATION - (currentTime - lockoutTime);
        logLoginAttempt(
          email,
          false,
          `Account locked. Try again after ${Math.ceil(
            remainingTime / 1000
          )} seconds`,
          clientIp,
          req
        );
        return res.status(429).json({
          message: `Account locked. Please try again after ${Math.ceil(
            remainingTime / 1000
          )} seconds`,
          ip: clientIp,
        });
      } else {
        loginAttempts[email] = 0;
      }
    }

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      incrementLoginAttempts(email);
      logLoginAttempt(email, false, "Invalid email or password", clientIp, req);
      return res
        .status(400)
        .json({ message: "Invalid email or password", ip: clientIp });
    }

    const passwordMatch = await argon2.verify(admin.password, password);
    if (!passwordMatch) {
      incrementLoginAttempts(email);
      logLoginAttempt(email, false, "Invalid email or password", clientIp, req);
      return res
        .status(400)
        .json({ message: "Invalid email or password", ip: clientIp });
    }

    const token = jwt.sign(
      { adminId: admin.id, deviceFingerprint },
      JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );
    const tokenSignature = signToken(token);
    const refreshToken = jwt.sign(
      { adminId: admin.id, deviceFingerprint },
      JWT_REFRESH_SECRET_KEY,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
    const refreshTokenSignature = signToken(refreshToken);

    const maxAge = persistent ? 30 * 24 * 60 * 60 * 1000 : 10 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge,
      sameSite: "strict",
    });
    res.cookie("tokenSignature", tokenSignature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.cookie("refreshTokenSignature", refreshTokenSignature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    loginAttempts[email] = 0;
    logLoginAttempt(email, true, "Login successful", clientIp, req);

    return res.status(200).json({ message: "Login successful", ip: clientIp });
  } catch (error) {
    console.error("Error logging in:", error);
    const clientIp = await getClientIp();
    const email = req.body.email;
    logLoginAttempt(email, false, "Server error", clientIp, req);
    return res.status(500).json({ error: "Error logging in", ip: clientIp });
  }
};

const incrementLoginAttempts = (email) => {
  loginAttempts[email] = (loginAttempts[email] || 0) + 1;
  if (loginAttempts[email] >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts[`${email}_lockoutTime`] = new Date().getTime();
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken, refreshTokenSignature } = req.cookies;
  if (!refreshToken || !refreshTokenSignature) {
    const clientIp = await getClientIp();
    logLoginAttempt(
      "unknown",
      false,
      "No refresh token provided",
      clientIp,
      req
    );
    return res.status(403).json({ message: "No refresh token provided" });
  }

  if (!verifyHmac(refreshToken, refreshTokenSignature)) {
    const clientIp = await getClientIp();
    logLoginAttempt(
      "unknown",
      false,
      "Invalid refresh token signature",
      clientIp,
      req
    );
    return res
      .status(403)
      .json({ message: "Invalid refresh token signature", ip: clientIp });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
    const clientIp = await getClientIp();
    const deviceFingerprint = generateDeviceFingerprint(
      clientIp,
      req.headers["user-agent"]
    );

    if (decoded.deviceFingerprint !== deviceFingerprint) {
      logLoginAttempt(
        decoded.adminId,
        false,
        "Device fingerprint mismatch",
        clientIp,
        req
      );
      return res
        .status(403)
        .json({ message: "Invalid refresh token", ip: clientIp });
    }

    const newToken = jwt.sign(
      { adminId: decoded.adminId, deviceFingerprint },
      JWT_SECRET_KEY,
      { expiresIn: "1m" }
    );
    const newTokenSignature = signToken(newToken);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.cookie("tokenSignature", newTokenSignature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
    });

    logLoginAttempt(
      decoded.adminId,
      true,
      "Token refreshed successfully",
      clientIp,
      req
    );
    return res
      .status(200)
      .json({ message: "Token refreshed successfully", ip: clientIp });
  } catch (error) {
    const clientIp = await getClientIp();
    logLoginAttempt("unknown", false, "Invalid refresh token", clientIp, req);
    return res
      .status(403)
      .json({ message: "Invalid refresh token", ip: clientIp });
  }
};

export const checkAuth = (req, res) => {
  const token = req.cookies.token;
  const tokenSignature = req.cookies.tokenSignature;

  if (!token || !tokenSignature) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  try {
    const hmac = crypto.createHmac("sha256", HMAC_SECRET);
    hmac.update(token);
    const digest = hmac.digest("hex");

    if (
      !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(tokenSignature))
    ) {
      throw new Error("Invalid token signature");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid token", error: err.message });
  }
};//

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("tokenSignature", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.clearCookie("refreshTokenSignature", { path: "/" });
  res.clearCookie("authState", { path: "/" });

  return res.status(200).json({ message: "Logout successful" });
};
//