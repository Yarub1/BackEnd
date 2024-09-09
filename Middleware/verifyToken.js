import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const HMAC_SECRET = process.env.HMAC_SECRET;

const verifyHmac = (token, signature) => {
  const hmac = crypto.createHmac("sha256", HMAC_SECRET);
  hmac.update(token);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  const tokenSignature = req.cookies.tokenSignature;

  if (!token || !tokenSignature) {
    return res.status(403).json({ message: "No token provided" });
  }

  if (!verifyHmac(token, tokenSignature)) {
    return res.status(403).json({ message: "Invalid token signature" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please log in again" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to authenticate token" });
      }
    }

    req.adminId = decoded.adminId;
    next();
  });
};

export default verifyToken;
