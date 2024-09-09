const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app"); // Assuming the main express app is exported from app.js
const LoginAttempt = require("../Models/LoginAttempt/LoginAttempt.js");
const jwt = require("jsonwebtoken");

const { expect } = chai;
chai.use(chaiHttp);

describe("Auth Controller", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(LoginAttempt, "create").resolves();
    sandbox.stub(jwt, "sign").callsFake((payload, secret, options) => {
      return `mocked-jwt-token-${payload.adminId}`;
    });
    sandbox.stub(jwt, "verify").callsFake((token, secret) => {
      if (token.startsWith("mocked-jwt-token-")) {
        return {
          adminId: token.split("-")[3],
          deviceFingerprint: "mocked_device_fingerprint",
        };
      }
      throw new Error("Invalid token");
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should log login attempt and generate tokens", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Login successful");
        done();
      });
  });

  it("should log suspicious activity on device fingerprint mismatch during token refresh", (done) => {
    chai
      .request(app)
      .post("/auth/refresh-token")
      .set("cookie", "refreshToken=mocked-jwt-token-1")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property("message", "Invalid refresh token");
        done();
      });
  });

  it("should refresh token with valid device fingerprint", (done) => {
    sandbox.stub(jwt, "verify").callsFake((token, secret) => {
      return { adminId: "1", deviceFingerprint: "127.0.0.1_Mozilla/5.0" };
    });

    chai
      .request(app)
      .post("/auth/refresh-token")
      .set("cookie", "refreshToken=mocked-jwt-token-1")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          "message",
          "Token refreshed successfully"
        );
        done();
      });
  });
});
