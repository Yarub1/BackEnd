import { encrypt, decrypt } from "./encryption";
import mockFs from "mock-fs";
import dotenv from "dotenv";

describe("Encryption Module with Database Reconnection", () => {
  const plainText = "Hello, World!";
  let encryptedText;

  beforeAll(() => {
    // Mock .env file
    mockFs({
      ".env": "ENCRYPTION_KEY=mysecretkeymysecretkeymysecretkey12",
    });
    dotenv.config();
  });

  afterAll(() => {
    mockFs.restore();
  });

  it("should encrypt text correctly", () => {
    encryptedText = encrypt(plainText);
    expect(encryptedText).not.toBe(plainText);
    expect(encryptedText).toContain(":"); // Ensure it contains IV and encrypted text separated by colon
  });

  it("should decrypt text correctly", () => {
    const decryptedText = decrypt(encryptedText);
    expect(decryptedText).toBe(plainText);
  });

  it("should handle empty input for encrypt", () => {
    expect(encrypt("")).toBe("");
  });

  it("should handle empty input for decrypt", () => {
    expect(decrypt("")).toBe("");
  });

  it("should throw error for invalid input format in decrypt", () => {
    expect(() => decrypt("invalid_format")).toThrow("Invalid input format");
  });

  it("should throw error for invalid IV length in decrypt", () => {
    const invalidIvText = "00".repeat(15); // 30 hex characters = 15 bytes, should be 16 bytes
    expect(() => decrypt(`${invalidIvText}:invalid_encrypted_text`)).toThrow(
      "Invalid initialization vector length"
    );
  });

  it("should reinitialize encryption key after reconnecting", () => {
    // Simulate database/server reconnection by reloading .env
    mockFs({
      ".env": "ENCRYPTION_KEY=mynewsecretkeymynewsecretkeymynewsecretkey34",
    });
    dotenv.config();
    // Reinitialize the encryption module with the new key
    const newEncryptedText = encrypt(plainText);
    const newDecryptedText = decrypt(newEncryptedText);
    expect(newDecryptedText).toBe(plainText);
  });
});
