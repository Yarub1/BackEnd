import argon2 from "argon2";
import xssFilters from "xss-filters";
import validator from "validator";
import Admin from "../../Models/Admin/AdminModel.js";
import { Op } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";


export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    const sanitizedAdmins = admins.map((admin) => ({
      id: admin.id,
      username: xssFilters.inHTMLData(admin.username),
      email: xssFilters.inHTMLData(admin.email),
      role: xssFilters.inHTMLData(admin.role),
      firstName: xssFilters.inHTMLData(admin.firstName),
      lastName: xssFilters.inHTMLData(admin.lastName),
      profile_image: xssFilters.inHTMLData(admin.profile_image),
    }));
    res.json(sanitizedAdmins);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admins" });
  }
};


export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validator.isInt(id, { min: 1 })) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const sanitizedAdmin = {
      id: admin.id,
      username: xssFilters.inHTMLData(admin.username),
      email: xssFilters.inHTMLData(admin.email),
      role: xssFilters.inHTMLData(admin.role),
      firstName: xssFilters.inHTMLData(admin.firstName),
      lastName: xssFilters.inHTMLData(admin.lastName),
      profile_image: xssFilters.inHTMLData(admin.profile_image),
    };
    res.json(sanitizedAdmin);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin" });
  }
};


export const addAdmin = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (!validator.isLength(username, { min: 3 })) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    let imageName = null; //Assume there is no image at the beginning
    if (req.files && req.files.profile_image) {
      const profileImage = req.files.profile_image;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const uploadDir = path.join(__dirname, "../../uploads");
      imageName = `${Date.now()}_${profileImage.name}`;
      const uploadPath = path.join(uploadDir, imageName);

      profileImage.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error uploading file" });
        }
      });
    }

    const hashedPassword = await argon2.hash(password);

    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      profile_image: imageName, // The image name will be saved if it exists, otherwise the value will be null
    });

    const sanitizedAdmin = {
      id: newAdmin.id,
      username: xssFilters.inHTMLData(newAdmin.username),
      email: xssFilters.inHTMLData(newAdmin.email),
      role: xssFilters.inHTMLData(newAdmin.role),
      firstName: xssFilters.inHTMLData(newAdmin.firstName),
      lastName: xssFilters.inHTMLData(newAdmin.lastName),
      profile_image: xssFilters.inHTMLData(imageName), // Use image name or null
    };
    res.status(201).json(sanitizedAdmin);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json({ error: "Error adding admin" });
  }
};


export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, firstName, lastName } = req.body;

    if (!validator.isInt(id, { min: 1 })) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password && !validator.isLength(password, { min: 8 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (username && !validator.isLength(username, { min: 3 })) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    if (username !== admin.username || email !== admin.email) {
      const existingAdmin = await Admin.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
          [Op.not]: [{ id }],
        },
      });

      if (existingAdmin) {
        if (existingAdmin.username === username) {
          return res.status(400).json({ message: "Username already exists" });
        }
        if (existingAdmin.email === email) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
    }

    const hashedPassword = password
      ? await argon2.hash(password)
      : admin.password;

    await admin.update({
      username: username !== undefined ? username : admin.username,
      email: email !== undefined ? email : admin.email,
      password: hashedPassword,
      role: role !== undefined ? role : admin.role,
    });

    // Updating firstName and lastName to trigger the VIRTUAL setters
    admin.firstName = firstName !== undefined ? firstName : admin.firstName;
    admin.lastName = lastName !== undefined ? lastName : admin.lastName;
    await admin.save();

    const sanitizedAdmin = {
      id: admin.id,
      username: xssFilters.inHTMLData(admin.username),
      email: xssFilters.inHTMLData(admin.email),
      role: xssFilters.inHTMLData(admin.role),
      firstName: xssFilters.inHTMLData(admin.firstName),
      lastName: xssFilters.inHTMLData(admin.lastName),
      profile_image: xssFilters.inHTMLData(admin.profile_image),
    };

    res.json(sanitizedAdmin);
  } catch (error) {
    res.status(500).json({ error: "Error updating admin" });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!validator.isInt(id, { min: 1 })) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (!validator.isLength(newPassword, { min: 8 })) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    const validOldPassword = await argon2.verify(admin.password, oldPassword);
    if (!validOldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await argon2.hash(newPassword);

    await admin.update({
      password: hashedNewPassword,
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isInt(id, { min: 1 })) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    await admin.destroy();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: "Error deleting admin" });
  }
};

export const updateAdminImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isInt(id, { min: 1 })) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (!req.files || !req.files.profile_image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const profileImage = req.files.profile_image;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.join(__dirname, "../../uploads");
    const uploadPath = path.join(uploadDir, `${admin.id}_${profileImage.name}`);

    profileImage.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file" });
      }

      admin.profile_image = `${admin.id}_${profileImage.name}`;
      await admin.save();

      const sanitizedAdmin = {
        id: admin.id,
        username: xssFilters.inHTMLData(admin.username),
        email: xssFilters.inHTMLData(admin.email),
        role: xssFilters.inHTMLData(admin.role),
        firstName: xssFilters.inHTMLData(admin.firstName),
        lastName: xssFilters.inHTMLData(admin.lastName),
        profile_image: xssFilters.inHTMLData(admin.profile_image),
      };

      res.json(sanitizedAdmin);
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating admin image" });
  }
};//

