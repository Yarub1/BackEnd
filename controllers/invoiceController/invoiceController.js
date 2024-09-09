import Invoice from "../../Models/Invoice/Invoice.js";
import Patient from "../../Models/Patient/Patient.js";
import Appointment from "../../Models/Appointment/Appointment.js";
import Customer from "../../Models/Customer/Customer.js";
import CircularJSON from "circular-json";
import { v4 as uuidv4 } from "uuid";

const generateCustomerId = () => {
  const uniqueId = uuidv4().split("-")[0];
  return `CUS${uniqueId}`;
};

export const createInvoice = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      date,
      items,
      taxRate,
      discount,
      status,
      customerType,
      customerName,
      companyName,
      companyPhoneNumber,
      companyAddress,
      notes,
      currency,
    } = req.body;

    if (!date || !items || items.length === 0 || !customerName) {
      return res.status(400).json({
        error: "Invalid data: Date, items, and customerName are required.",
      });
    }

    let customerId = null;

    if (customerType === "Regular") {
      const customer = await Customer.create({
        name: customerName,
        address: companyAddress,
        phoneNumber: companyPhoneNumber,
        email: null,
      });
      customerId = customer.id;
    } else if (customerType === "Patient") {
  
      if (patientId) {
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
          return res
            .status(400)
            .json({ error: "Invalid patientId: Patient not found." });
        }
      }

     
      if (appointmentId) {
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
          return res
            .status(400)
            .json({ error: "Invalid appointmentId: Appointment not found." });
        }
      }
    }

    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    const tax = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + tax - discount;
    const finalPrice = grandTotal;

    const invoice = await Invoice.create({
      patientId: customerType === "Patient" ? patientId : null,
      appointmentId: customerType === "Patient" ? appointmentId : null,
      customerId,
      date,
      taxRate,
      discount,
      status,
      customerType,
      customerName,
      companyName,
      companyPhoneNumber,
      companyAddress,
      notes,
      subtotal,
      tax,
      grandTotal,
      finalPrice,
      items,
      currency,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Patient, as: "patientInvoice" },
        { model: Appointment, as: "appointmentInvoice" },
        { model: Customer, as: "customerInvoice" }, 
      ],
    });
    res.status(200).json(CircularJSON.stringify(invoices));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};//

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Patient, as: "patientInvoice" },
        { model: Appointment, as: "appointmentInvoice" },
        { model: Customer, as: "customerInvoice" }, 
      ],
    });
    if (invoice) {
      res.status(200).json(CircularJSON.stringify(invoice));
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (invoice) {
      const {
        patientId,
        appointmentId,
        date,
        items,
        taxRate,
        discount,
        status,
        customerType,
        customerName,
        customerAddress,
        customerPhoneNumber,
        customerEmail,
        companyName,
        companyPhoneNumber,
        companyAddress,
        notes,
        subtotal,
        tax,
        grandTotal,
        finalPrice,
        currency,
      } = req.body;

      await invoice.update({
        patientId,
        appointmentId,
        date,
        items,
        taxRate,
        discount,
        status,
        customerType,
        customerName,
        customerAddress,
        customerPhoneNumber,
        customerEmail,
        companyName,
        companyPhoneNumber,
        companyAddress,
        notes,
        subtotal,
        tax,
        grandTotal,
        finalPrice,
        currency,
      });

      res.status(200).json(CircularJSON.stringify(invoice));
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (invoice) {
      await invoice.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
//