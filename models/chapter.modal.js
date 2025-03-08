import db from '../db/db.js'; // Assuming you have a DB connection setup

// Create Chapter
export const createChapterModel = async (chapterName, unitId, year, total, avg, weightageFirst, weightageSecond) => {
  try {
    const query =
      "INSERT INTO chapter (chapter_name, unit_id, year, total, avg, weightage_first, weightage_second) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [chapterName, unitId, year, total, avg, weightageFirst, weightageSecond]);
    return result;
  } catch (error) {
    throw new Error(`Error creating chapter: ${error.message}`);
  }
};

// Get Chapter by ID
export const getChapterByIdModel = async (chapterId) => {
  try {
    const query = "SELECT * FROM chapter WHERE chapter_id = ?";
    const [chapter] = await db.query(query, [chapterId]);
    return chapter.length > 0 ? chapter[0] : null; // Return the chapter or null if not found
  } catch (error) {
    throw new Error(`Error fetching chapter: ${error.message}`);
  }
};

// Get All Chapters
export const getAllChaptersModel = async () => {
  try {
    const query = "SELECT * FROM chapter";
    const [chapters] = await db.query(query);
    return chapters;
  } catch (error) {
    throw new Error(`Error fetching all chapters: ${error.message}`);
  }
};

// Update Chapter
export const updateChapterModel = async (chapterId, chapterName, unitId, year, total, avg, weightageFirst, weightageSecond, status) => {
  try {
    const query =
      "UPDATE chapter SET chapter_name = ?, unit_id = ?, year = ?, total = ?, avg = ?, weightage_first = ?, weightage_second = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE chapter_id = ?";
    const [result] = await db.query(query, [chapterName, unitId, year, total, avg, weightageFirst, weightageSecond, status, chapterId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating chapter: ${error.message}`);
  }
};

// Delete Chapter
export const deleteChapterByIdModel = async (chapterId) => {
  try {
    const query = "DELETE FROM chapter WHERE chapter_id = ?";
    const [result] = await db.query(query, [chapterId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting chapter: ${error.message}`);
  }
};


export const getTopicFromChapterModal = async (chapterId) => {
  try {
    // SQL query to get topics based on chapter_id
    const query = `
      SELECT t.topic_id, t.topic_name, c.chapter_id, c.chapter_name
      FROM topic t
      JOIN chapter c ON t.chapter_id = c.chapter_id
      WHERE t.chapter_id = ?
    `;

    // Execute the query and pass chapterId as a parameter to prevent SQL injection
    const [rows] = await db.execute(query, [chapterId]);

    // Return the rows directly as an array (which is already in array format)
    return rows;
  } catch (error) {
    console.error('Error fetching data from chapter model:', error);
    throw error; // Rethrow the error so it can be handled at a higher level
  }
};


export const getChapterByIdQuestionsOptionsModal = async (chapterId) => {
  try {
    // SQL query to fetch the required data
    const query = `
      SELECT 
        chapter.chapter_id,
        chapter.chapter_name,
        questions.questions_id,    
        questions.questions_name,
        questions.explanation,
        options.option_id,
        options.option_text,
        options.is_correct
      FROM 
        chapter
      LEFT JOIN questions ON questions.chapter_id = chapter.chapter_id
      LEFT JOIN options ON options.questions_id = questions.questions_id
      WHERE 
        chapter.chapter_id = ?;
    `;

    // Execute the query and get the results
    const [rows] = await db.query(query, [chapterId]);

    // Structure the data as per the requirement
    const chapterData = {
      chapter_id: chapterId,
      questions: []
    };

    // Loop through the rows to structure the data
    rows.forEach(row => {
      // Check if the question already exists in the chapterData
      let question = chapterData.questions.find(q => q.question_id === row.questions_id);
      
      if (!question) {
        // If the question doesn't exist, create a new entry
        question = {
          question_id: row.questions_id,        // Correct field name here
          question_name: row.questions_name,    // Correct field name here
          explanation: row.explanation, // Default explanation
          options: []
        };
        chapterData.questions.push(question);
      }

      // Add the option to the corresponding question
      question.options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    });

    // Return the structured data
    return chapterData;

  } catch (error) {
    console.error('Error fetching chapter data:', error);
    return null;
  }
};




