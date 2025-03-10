// answerModule.js
import db from '../db/db.js';

export const createOption = async (question_id, option_text, is_correct) => {
  try {
    const query = 'INSERT INTO options (questions_id, option_text, is_correct) VALUES (?, ?, ?)';
    const result = await db.query(query, [question_id, option_text, is_correct]);
    return result[0]; // MySQL returns results in an array
  } catch (err) {
    throw new Error('Failed to create option');
  }
};

//getAll Options
export const getAllOptions = async () => {
  try {
    const query = 'SELECT * FROM options';
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error('Failed to retrieve all options');
  }
};


// Get options by question ID
export const getOptionsByQuestionId = async (question_id) => {
  try {
    const query = 'SELECT * FROM options WHERE questions_id = ?';
    const [results] = await db.query(query, [question_id]);
    return results;
  } catch (err) {
    throw new Error('Failed to retrieve options');
  }
};

// Get a single option by its ID
export const getOptionById = async (option_id) => {
  try {
    const query = 'SELECT * FROM options WHERE option_id = ?';
    const [results] = await db.query(query, [option_id]);
    return results[0];
  } catch (err) {
    throw new Error('Failed to retrieve option');
  }
};

// Update an option (e.g., change option_text or is_correct)
export const updateOption = async (option_id, option_text, is_correct, question_id) => {
  try {
    const query = 'UPDATE options SET option_text = ?, is_correct = ?, questions_id = ? WHERE option_id = ?';
    const [result] = await db.query(query, [option_text, is_correct, question_id, option_id]);
    return result;
  } catch (err) {
    console.error('Error updating option:', err);
    throw new Error(`Failed to update option: ${err.message}`);
  }
};


// Delete an option
export const deleteOption = async (option_id) => {
  try {
    const query = 'DELETE FROM options WHERE option_id = ?';
    const [result] = await db.query(query, [option_id]);
    return result;
  } catch (err) {
    throw new Error('Failed to delete option');
  }
};

// Check if an option is correct
export const checkOptionCorrectness = async (option_id) => {
  try {
    const query = 'SELECT is_correct FROM options WHERE option_id = ?';
    const [results] = await db.query(query, [option_id]);
    return results[0] ? results[0].is_correct : null;
  } catch (err) {
    throw new Error('Failed to check option correctness');
  }
};