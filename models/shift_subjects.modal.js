import db from '../db/db.js';

export const createShiftSubjectModal = async (shiftId, status, shift_subjects_name) => {
  try {
    const query = `
        INSERT INTO shift_subjects (shift_id, status, shift_subjects_name) 
        VALUES (?, ?, ?)
      `;
    const [result] = await db.query(query, [shiftId, status, shift_subjects_name]);

    return result.length === 0 ? null : result;
  } catch (err) {
    console.error(err);
    throw new Error(`Category Model DB error ${err.message}`);
  }
};

export const getShiftSubjectModel = async () => {
  try {
    const query = "SELECT * FROM shift_subjects";
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`shift_subjects Model DB error ${error.message}`);
  }
};