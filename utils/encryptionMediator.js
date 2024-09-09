// File: utils/encryptionMediator.js

import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const algorithm = "aes-256-cbc";
const keyLength = 32; // AES-256 requires a 32-byte key
const ivLength = 16; // AES-256-CBC requires a 16-byte IV

// Generate a fixed key from the environment variable
const key = crypto
  .createHash("sha256")
  .update(String(process.env.ENCRYPTION_KEY))
  .digest()
  .slice(0, keyLength);

export const encrypt = (text) => {
  if (text === null || text === undefined) return text; // Ensure the input text is not null or undefined
  const iv = crypto.randomBytes(ivLength); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (text) => {
  if (text === null || text === undefined) return text; // Ensure the input text is not null or undefined
  const [ivText, encrypted] = text.split(":");
  if (!ivText || !encrypted) throw new Error("Invalid input format");
  const iv = Buffer.from(ivText, "hex");
  if (iv.length !== ivLength)
    throw new Error("Invalid initialization vector length");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
