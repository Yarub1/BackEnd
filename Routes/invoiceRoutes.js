
import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController/invoiceController.js";

const router = express.Router();

router.post("/invoices", createInvoice);

router.get("/invoices", getAllInvoices);

router.get("/invoices/:id", getInvoiceById);

router.put("/invoices/:id", updateInvoice);

router.delete("/invoices/:id", deleteInvoice);

export default router;
