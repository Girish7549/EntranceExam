import {
  createUnitModel,
  getUnitByIdModel,
  getAllUnitsModel,
  updateUnitModel,
  deleteUnitByIdModel,
  getAllUnit_Subject_SubcategoryModal
} from "../../models/unit.modal.js";

// Create Unit
export const createUnit = async (req, res) => {
  try {
    const { unitName, subjectId, description, status } = req.body;

    if (!unitName || !subjectId || !description || !status) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const result = await createUnitModel(unitName, subjectId, description, status);
    return res.status(201).json({ message: "Unit created successfully", data: result });
  } catch (error) {
    console.error("Create Unit Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Unit by ID
export const getUnitById = async (req, res) => {
  try {
    const { unitId } = req.params;
    const unit = await getUnitByIdModel(unitId);

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    return res.status(200).json({ data: unit });
  } catch (error) {
    console.error("Get Unit By ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get All Units
export const getAllUnits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const result = await getAllUnitsModel(page);

    if (!result || result.data.length === 0) {
      return res.status(404).json({ message: "No unit found" });
    }

    return res.status(200).json({
      message: "Unit fetched successfully",
      ...result
    });
  } catch (error) {
    console.error("Unit Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getAllUnitSubjectSubcategoryController = async (req, res) => {
  try {
    const units = await getAllUnit_Subject_SubcategoryModal();
    return res.status(200).json(units);
  } catch (error) {
    console.error("Get All Units Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Unit
export const updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { unitName, description, status, subjectId } = req.body;

    if (!unitName || !description || !status || !subjectId) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updated = await updateUnitModel(unitId, unitName, description, status, subjectId);

    if (!updated) {
      return res.status(404).json({ message: "Unit not found or not updated" });
    }

    return res.status(200).json({ message: "Unit updated successfully" });
  } catch (error) {
    console.error("Update Unit Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Unit by ID
export const deleteUnitById = async (req, res) => {
  try {
    const { unitId } = req.params;
    const deleted = await deleteUnitByIdModel(unitId);

    if (!deleted) {
      return res.status(404).json({ message: "Unit not found or not deleted" });
    }

    return res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Delete Unit Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
