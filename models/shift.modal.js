import db from '../db/db.js'; // Import database connection

// Get all shifts
export const getAllShifts = async () => {
  try {
    const query = 'SELECT * FROM shift';
    const [results] = await db.query(query);

    // Ensure 'language' is parsed from JSON
    const formattedResults = results.map(shift => ({
      ...shift,
      language: shift.language ? JSON.parse(shift.language) : [] // Convert JSON string to array
    }));

    return formattedResults;
  } catch (err) {
    throw new Error('Failed to retrieve shifts');
  }
};


// Get shift by ID
export const getShiftById = async (shiftId) => {
  try {
    const query = 'SELECT * FROM shift WHERE shift_id = ?';
    const [results] = await db.query(query, [shiftId]);
    const formattedResults = results.map(shift => ({
      ...shift,
      language: shift.language ? JSON.parse(shift.language) : [] // Convert JSON string to array
    }));
    return formattedResults; // Return the first result (or null if not found)
  } catch (err) {
    throw new Error('Failed to retrieve shift');
  }
};

// Create a new shift
export const createShift = async (shift_name, year_id, shift_date_time, status, language) => {
  try {
    const query = `
      INSERT INTO shift (shift_name, year_id, shift_date_time, status, language) 
      VALUES (?, ?, ?, ?, ?)
    `;

    // Convert language array to JSON string
    const languageJson = JSON.stringify(language);

    const [results] = await db.query(query, [
      shift_name,
      year_id,
      shift_date_time,
      status,
      languageJson
    ]);

    return results;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create shift');
  }
};


// Update a shift by ID
export const updateShift = async (shiftId, shift_name, year_id, shift_date_time, status, language) => {
  try {
    // Check if shift exists
    const checkQuery = "SELECT shift_id FROM shift WHERE shift_id = ?";
    const [shiftResult] = await db.query(checkQuery, [shiftId]);
    if (shiftResult.length === 0) {
      throw new Error("Shift ID not found");
    }
    
    // Prepare update query
    const query = 'UPDATE shift SET shift_name = ?, year_id = ?, shift_date_time = ?, status = ?, language = ? WHERE shift_id = ?';

    // Ensure language is properly stored as JSON
    const languageJson = typeof language === 'object' ? JSON.stringify(language) : language;

    // Execute update query
    const [results] = await db.query(query, [
      shift_name,
      year_id,
      shift_date_time,
      status,
      languageJson,
      shiftId  // ✅ Now it's included!
    ]);

    return { success: true, message: "Shift updated successfully", affectedRows: results.affectedRows };
  } catch (err) {
    console.error("Update Shift Error:", err.message);
    throw new Error(`Failed to update shift: ${err.message}`);
  }
};


// Delete a shift by ID
export const deleteShift = async (shiftId) => {
  try {
    const query = 'DELETE FROM shift WHERE shift_id = ?';
    const [results] = await db.query(query, [shiftId]);
    return results;
  } catch (err) {
    throw new Error('Failed to delete shift');
  }
};


export const getQuestionsByShiftIdModal = async (shiftId) => {
  try {
    const query = `
      SELECT 
          questions.questions_id,    
          questions.questions_name,
          questions.explanation,
          options.option_id,
          options.option_text,
          options.is_correct,
          subject.subject_id,
          subject.subject_name
      FROM 
          questions
      LEFT JOIN options ON options.questions_id = questions.questions_id
      LEFT JOIN shift ON questions.shift_id = shift.shift_id
      LEFT JOIN previous_year ON shift.year_id = previous_year.year_id
      LEFT JOIN subject ON previous_year.subject_id = subject.subject_id
      WHERE 
          questions.shift_id = ?;
    `;

    const [rows] = await db.query(query, [shiftId]);

    // Organize data: group questions under subjects
    const subjectsMap = new Map();

    rows.forEach((row) => {
      // Check if subject already exists in the map
      if (!subjectsMap.has(row.subject_id)) {
        subjectsMap.set(row.subject_id, {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          questions: []  // Holds all questions for this subject
        });
      }

      // Find or create the question object under the correct subject
      const subject = subjectsMap.get(row.subject_id);
      let question = subject.questions.find(q => q.questions_id === row.questions_id);

      if (!question) {
        question = {
          questions_id: row.questions_id,
          question_name: row.questions_name,
          explanation: row.explanation,
          options: []
        };
        subject.questions.push(question);
      }

      // Add the option to the question's options array
      if (row.option_id) {
        question.options.push({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct
        });
      }
    });

    // Convert the Map to an array of subjects
    const formattedData = Array.from(subjectsMap.values());

    return formattedData;

  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};



