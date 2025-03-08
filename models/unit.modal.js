import db from '../db/db.js'; // Assuming you have a DB connection setup

// Create Unit
export const createUnitModel = async (unitName, subjectId, description, status) => {
  try {
    const query =
      "INSERT INTO unit (unit_name, subject_id, description, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [unitName, subjectId, description, status]);
    return result;
  } catch (error) {
    throw new Error(`Error creating unit: ${error.message}`);
  }
};

// Get Unit by ID
export const getUnitByIdModel = async (unitId) => {
  try {
    const query = "SELECT * FROM unit WHERE unit_id = ?";
    const [unit] = await db.query(query, [unitId]);
    return unit.length > 0 ? unit[0] : null; // Return the unit or null if not found
  } catch (error) {
    throw new Error(`Error fetching unit: ${error.message}`);
  }
};

// Get All Units
export const getAllUnitsModel = async () => {
  try {
    const query = `SELECT 
    unit.*, 
    subject.subject_name, 
    subcategories.subcategory_name, 
    subject.subcategory_id
FROM 
    unit
JOIN 
    subject ON unit.subject_id = subject.subject_id
JOIN 
    subcategories ON subject.subcategory_id = subcategories.subcategory_id;
`;
    const [units] = await db.query(query);
    return units;
  } catch (error) {
    throw new Error(`Error fetching all units: ${error.message}`);
  }
};


export const getAllUnit_Subject_SubcategoryModal = async () => {
  try {
    const query = `SELECT 
    unit.unit_id,
    unit.unit_name, 
    subject.subject_id,
    subject.subject_name, 
    subcategories.subcategory_name, 
    subject.subcategory_id
    FROM 
    unit
    JOIN 
    subject ON unit.subject_id = subject.subject_id
    JOIN 
    subcategories ON subject.subcategory_id = subcategories.subcategory_id;
    `;
    
    const [units] = await db.query(query);

    // Initialize an empty object to store the formatted data
    const formattedData = [];

    // Iterate through each row of the query results
    units.forEach((row) => {
      // Check if the subcategory already exists in the formattedData
      let subcategory = formattedData.find(
        (item) => item.subcategory_id === row.subcategory_id
      );

      // If the subcategory does not exist, create a new one
      if (!subcategory) {
        subcategory = {
          subcategory_id: row.subcategory_id,
          subcategory_name: row.subcategory_name,
          subjects: [],
        };
        formattedData.push(subcategory);
      }

      // Check if the subject already exists within the subcategory
      let subject = subcategory.subjects.find(
        (subject) => subject.subject_id === row.subject_id
      );

      // If the subject does not exist, create a new one
      if (!subject) {
        subject = {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          units: [],
        };
        subcategory.subjects.push(subject);
      }

      // Add the unit to the subject
      subject.units.push({
        unit_id: row.unit_id,
        unit_name: row.unit_name,
      });
    });

    return formattedData;
  } catch (error) {
    throw new Error(`Error fetching all units: ${error.message}`);
  }
};


// Update Unit
export const updateUnitModel = async (unitId, unitName, description, status, subjectId) => {
  try {
    const query =
      "UPDATE unit SET unit_name = ?, description = ?, status = ?, subject_id = ?, updated_date = CURRENT_TIMESTAMP WHERE unit_id = ?";
    const [result] = await db.query(query, [unitName, description, status, subjectId, unitId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating unit: ${error.message}`);
  }
};

// Delete Unit
export const deleteUnitByIdModel = async (unitId) => {
  try {
    const query = "DELETE FROM unit WHERE unit_id = ?";
    const [result] = await db.query(query, [unitId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting unit: ${error.message}`);
  }
};
