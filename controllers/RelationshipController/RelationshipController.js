import Relationship from "../../Models/Relationship/Relationship.js";
import Patient from "../../Models/Patient/Patient.js";

const createRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.create(req.body);
    res.status(201).json(relationship);
  } catch (error) {
    console.error("Error creating relationship:", error);
    res.status(400).json({ error: error.message });
  }
};

const getRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.findAll();
    res.status(200).json(relationships);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRelationshipById = async (req, res) => {
  try {
    const relationship = await Relationship.findByPk(req.params.id);
    if (relationship) {
      res.status(200).json(relationship);
    } else {
      res.status(404).json({ error: "Relationship not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.findByPk(req.params.id);
    if (relationship) {
      await relationship.update(req.body);
      res.status(200).json(relationship);
    } else {
      res.status(404).json({ error: "Relationship not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRelationship = async (req, res) => {
  try {
    console.log(`Attempting to delete relationship with ID: ${req.params.id}`);
    const relationship = await Relationship.findByPk(req.params.id);
    if (relationship) {
      await relationship.destroy();
      console.log(`Successfully deleted relationship with ID: ${req.params.id}`);
      res.status(200).json({ message: "Relationship deleted" });
    } else {
      console.log(`Relationship not found with ID: ${req.params.id}, considering it already deleted.`);
      res.status(200).json({ message: "Relationship deleted" });
    }
  } catch (error) {
    console.error(`Error deleting relationship with ID ${req.params.id}:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

const getGuardiansForChild = async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    return res.status(400).json({ error: "Invalid childId parameter" });
  }

  try {
    const relationships = await Relationship.findAll({
      where: { childId },
      include: [
        {
          model: Patient,
          as: "Guardian",
        },
      ],
    });

    if (!relationships || relationships.length === 0) {
      return res.status(404).json({ error: "No guardians found for this child" });
    }

    const guardians = relationships.map((rel) => rel.Guardian);
    res.status(200).json(guardians);
  } catch (error) {
    console.error(`Error fetching guardians for child with ID ${childId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getChildrenForGuardian = async (req, res) => {
  const { guardianId } = req.params;

  if (!guardianId) {
    return res.status(400).json({ error: "Invalid guardianId parameter" });
  }

  try {
    const relationships = await Relationship.findAll({
      where: { guardianId },
      include: [
        {
          model: Patient,
          as: "Child",
        },
      ],
    });

    if (!relationships || relationships.length === 0) {
      return res
        .status(404)
        .json({ error: "No children found for this guardian" });
    }

    const children = relationships.map((rel) => rel.Child);
    res.status(200).json(children); // Correcting the response status and format
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the children" }); // Handling unexpected errors
  }
};


export default {
  createRelationship,
  getRelationships,
  getRelationshipById,
  updateRelationship,
  deleteRelationship,
  getGuardiansForChild,
  getChildrenForGuardian,
};

///