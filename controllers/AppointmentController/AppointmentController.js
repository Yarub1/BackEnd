// File: controllers/AppointmentController.js
// File: controllers/AppointmentController.js
import Appointment from "../../Models/Appointment/Appointment.js";
import Invoice from "../../Models/Invoice/Invoice.js"; // 
import Patient from "../../Models/Patient/Patient.js"; // 
import xss from "xss";


export const createAppointment = async (req, res) => {
  try {
    const { patientId, date, startTime, endTime, description, status, notes } =
      req.body;

    // Sanitize input
    const sanitizedPatientId = xss(patientId);
    const sanitizedDate = xss(date);
    const sanitizedStartTime = xss(startTime);
    const sanitizedEndTime = xss(endTime);
    const sanitizedDescription = xss(description);
    const sanitizedStatus = xss(status);
    const sanitizedNotes = xss(notes);

    // Create new appointment
    const newAppointment = await Appointment.create({
      patientId: sanitizedPatientId,
      date: sanitizedDate,
      startTime: sanitizedStartTime,
      endTime: sanitizedEndTime,
      description: sanitizedDescription,
      status: sanitizedStatus,
      notes: sanitizedNotes,
    });

    // Fetch patient information
    const patient = await Patient.findByPk(sanitizedPatientId, {
      attributes: ["fullName"],
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Create new invoice
    const newInvoice = await Invoice.create({
      patientId: sanitizedPatientId,
      appointmentId: newAppointment.id,
      date: sanitizedDate,
      items: [], // Assuming an empty array initially
      subtotal: 0, // Assuming 0 initially
      tax: 0, // Assuming 0 initially
      total: 0, // Assuming 0 initially
      paymentInfo: {}, // Assuming an empty object initially
      status: "Pending",
    });

    res.status(201).json({
      appointment: newAppointment,
      invoice: {
        id: newInvoice.id,
        patientName: patient.fullName,
        patientId: sanitizedPatientId,
        date: sanitizedDate,
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error.errors) {
      res
        .status(500)
        .json({ error: error.errors.map((e) => e.message).join(", ") });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, date, startTime, endTime, description, status, notes } =
      req.body;

    const sanitizedPatientId = xss(patientId);
    const sanitizedDate = xss(date);
    const sanitizedStartTime = xss(startTime);
    const sanitizedEndTime = xss(endTime);
    const sanitizedDescription = xss(description);
    const sanitizedStatus = xss(status);
    const sanitizedNotes = xss(notes);

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.patientId = sanitizedPatientId;
    appointment.date = sanitizedDate;
    appointment.startTime = sanitizedStartTime;
    appointment.endTime = sanitizedEndTime;
    appointment.description = sanitizedDescription;
    appointment.status = sanitizedStatus;
    appointment.notes = sanitizedNotes;

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const appointments = await Appointment.findAll({ where: { date } });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//


export const completeAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed' }, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//
