import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
import requestIp from "request-ip";
import sequelize from "./config/database.js";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import helmet from "helmet";
import { fileURLToPath } from "url";
import fs from "fs";

// Routes
import patientRoutes from "./Routes/PatientRoutes.js";
import familyRoutes from "./Routes/FamilyRoutes.js";
import relationshipRoutes from "./Routes/RelationshipRoutes.js";
import eyeExamRoutes from "./Routes/EyeExamRoutes.js";
import AppointmentRoutes from "./Routes/AppointmentRoutes.js";
import invoiceRoutes from "./Routes/invoiceRoutes.js";
import customerRoutes from "./Routes/customerRoutes.js";
import todoRoutes from "./Routes/todoRoutes.js";
import authRoutes from "./Routes/auth.js";
import adminRoutes from "./Routes/adminRoutes.js";
import folderRoutes from "./Routes/FolderRoutes.js";
import fileRoutes from "./Routes/FileRoutes.js";
import supplyRoutes from "./Routes/SupplyRoutes.js";
import supplierRoutes from "./Routes/SupplierRoutes.js";
import purchaseRoutes from "./Routes/PurchaseRoutes.js";
import medicalReportRoutes from "./Routes/MedicalReportRoutes.js";

// Middleware
import verifyToken from "./Middleware/verifyToken.js";
import LoginAttempt from "./Models/LoginAttempt/LoginAttempt.js";
import { getClientIp } from "./controllers/authController/authController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const app = express();
const PORT = process.env.PORT || 5000;
const csrfProtection = csrf({ cookie: true });
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadsDir));
app.get("/uploads", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "uploads-page.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(requestIp.mw());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
    xssFilter: true,
  })
);
app.use(morgan("combined"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
  })
);

app.use(csrfProtection);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "csrf-token",
      "X-XSRF-TOKEN",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  next();
});

app.get("/api/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.use(async (err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  const clientIp = await getClientIp();

  const logCsrfAttempt = async () => {
    try {
      await LoginAttempt.create({
        email: "unknown",
        success: false,
        message: "Invalid CSRF token",
        ip: clientIp,
        userAgent: req.headers["user-agent"],
      });
    } catch (error) {
      console.error("Error logging CSRF attempt:", error);
    }
  };

  logCsrfAttempt();

  res.status(403).json({ message: "Invalid CSRF token", ip: clientIp });
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});
app.use("/auth/login", loginLimiter);

app.use("/api", verifyToken, patientRoutes);
app.use("/api", verifyToken, familyRoutes);
app.use("/api", verifyToken, relationshipRoutes);
app.use("/api", verifyToken, eyeExamRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", todoRoutes);
app.use("/api", invoiceRoutes);
app.use("/auth", authRoutes);
app.use("/api", folderRoutes);
app.use("/api", fileRoutes);
app.use("/api", supplyRoutes);
app.use("/api", supplierRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", medicalReportRoutes);
app.use("/api", verifyToken, adminRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "server-info.html"));
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
