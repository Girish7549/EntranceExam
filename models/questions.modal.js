import db from "../db/db.js";

// Function to create a new question
export const createQuestionModal = async (
  questionsName,
  status,
  chapterId,
  explanation,
  subjectId,
  shiftId,
  questionTypeId,
  shiftSubjectsId
) => {
  try {
    const query =
      "INSERT INTO questions (questions_name, status, chapter_id, explanation, subject_id, shift_id, id, shift_subjects_id) VALUES (?, ?, ?, ?, ?,?,?, ?)";
    const [result] = await db.query(query, [
      questionsName,
      status,
      chapterId,
      explanation,
      subjectId,
      shiftId,
      questionTypeId,
      shiftSubjectsId,
    ]);
    return result;
  } catch (error) {
    throw new Error("Error while creating question: " + error.message);
  }
};

// Function to get all questions
export const getAllQuestionsChapterModal = async (page = 1) => {
  try {
    const limit = 40;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT 
        questions.questions_id,
        questions.questions_name,
        questions.status, 
        questions.created_at,
        questions.updated_at,
        questions.explanation,

        subject.subject_id,
        subject.subject_name,

        question_types.id AS type_id,
        question_types.type_name,

        chapter.chapter_id,
        chapter.chapter_name,
        chapter.unit_id,

        unit.unit_name,

        subcategories.subcategory_id,
        subcategories.subcategory_name,

        options.option_id,
        options.option_text,
        options.is_correct

      FROM questions

      JOIN chapter ON questions.chapter_id = chapter.chapter_id
      JOIN subject ON questions.subject_id = subject.subject_id
      JOIN question_types ON questions.id = question_types.id -- ✅ fixed join
      JOIN unit ON chapter.unit_id = unit.unit_id
      JOIN subcategories ON subject.subcategory_id = subcategories.subcategory_id
      LEFT JOIN options ON options.questions_id = questions.questions_id

      ORDER BY questions.questions_id, options.option_id
      LIMIT ? OFFSET ?;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM questions 
      WHERE chapter_id IS NOT NULL;
    `;

    const [rows] = await db.query(dataQuery, [limit, offset]);
    const [[{ total }]] = await db.query(countQuery);

    const formattedResponse = rows.reduce((acc, row) => {
      let question = acc.find(q => q.questions_id === row.questions_id);

      if (!question) {
        question = {
          questions_id: row.questions_id,
          questions_name: row.questions_name,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          explanation: row.explanation,

          subject_id: row.subject_id,
          subject_name: row.subject_name,

          type_id: row.type_id,
          type_name: row.type_name,

          chapter_id: row.chapter_id,
          chapter_name: row.chapter_name,

          unit_id: row.unit_id,
          unit_name: row.unit_name,

          subcategory_id: row.subcategory_id,
          subcategory_name: row.subcategory_name,

          options: [],
        };

        acc.push(question);
      }

      if (row.option_id !== null && row.option_id !== undefined) {
        question.options.push({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct,
        });
      }

      return acc;
    }, []);

    return {
      data: formattedResponse,
      total,
      page,
      pageSize: limit,
    };
  } catch (error) {
    throw new Error("Error while fetching questions: " + error.message);
  }
};



export const getAllQuestionsShiftModal = async () => {
  try {
    const query = `
    SELECT 
      questions.questions_id,
      questions.questions_name,
      questions.status, 
      questions.created_at,
      questions.updated_at,
      questions.explanation,
      shift.shift_id,
      shift.shift_name,
      question_types.id AS type_id,
      question_types.type_name,
      shift_subjects.shift_subjects_id,
      shift_subjects.shift_subjects_name,
      shift.year_id,
      previous_year.year,
      subcategories.subcategory_id,
      subcategories.subcategory_name,
      options.option_id,
      options.option_text,
      options.is_correct
    FROM 
      questions
    JOIN 
      shift ON questions.shift_id = shift.shift_id
    JOIN 
      shift_subjects ON questions.shift_subjects_id = shift_subjects.shift_subjects_id
    JOIN 
      question_types ON questions.id = question_types.id
    JOIN 
      previous_year ON shift.year_id = previous_year.year_id
    JOIN 
      subcategories ON previous_year.subcategory_id = subcategories.subcategory_id
    LEFT JOIN
      options ON options.questions_id = questions.questions_id
    ORDER BY 
      questions.questions_id, options.option_id;
    `;

    const [rows] = await db.query(query);

    // Format only the options for each question
    const formattedResponse = rows.reduce((acc, row) => {
      let question = acc.find((q) => q.questions_id === row.questions_id);

      if (!question) {
        // If the question doesn't exist in the accumulator, create a new one
        question = {
          questions_id: row.questions_id,
          questions_name: row.questions_name,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          explanation: row.explanation,
          shift_id: row.shift_id,
          shift_name: row.shift_name,
          type_id: row.type_id,
          type_name: row.type_name,
          shift_subjects_id: row.shift_subjects_id,
          shift_subjects_name: row.shift_subjects_name,
          year_id: row.year_id,
          year: row.year,
          subcategory_id: row.subcategory_id,
          subcategory_name: row.subcategory_name,
          options: [], // Initialize an empty options array
        };

        acc.push(question);
      }

      // Only add option if it exists (i.e., if row.option_id is not undefined)
      if (row.option_id !== null && row.option_id !== undefined) {
        question.options.push({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct,
        });
      }

      return acc;
    }, []);

    return formattedResponse;
  } catch (error) {
    throw new Error("Error while fetching questions: " + error.message);
  }
};

// Function to get a question by ID
export const getQuestionByIdModal = async (id) => {
  try {
    const query = "SELECT * FROM questions WHERE questions_id = ?";
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) {
      throw new Error("Question not found");
    }
    return rows[0]; // Return the first matching question
  } catch (error) {
    throw new Error("Error while fetching question: " + error.message);
  }
};

// Function to update a question
export const updateQuestionModal = async (
  questionsName,
  status,
  chapterId,
  explanation,
  subjectId,
  shiftId,
  questionTypeId,
  shiftSubjectsId,
  questionId
) => {
  try {
    // Update the query, making sure the values are correctly mapped to the placeholders
    const query = `UPDATE questions SET 
                      questions_name = ?, 
                      status = ?, 
                      chapter_id = ?, 
                      explanation = ?, 
                      subject_id = ?, 
                      shift_id = ?, 
                      id = ?,  -- Assuming this is a valid column in the questions table (e.g., question_type_id)
                      shift_subjects_id = ? 
                    WHERE questions_id = ?`;
    // Execute the query with the correct values in the same order as placeholders
    const [result] = await db.query(query, [
      questionsName,        // questions_name
      status,               // status
      chapterId,            // chapter_id
      explanation,          // explanation
      subjectId,            // subject_id
      shiftId,              // shift_id
      questionTypeId,       // id (assuming this is the column representing question type ID or a similar reference)
      shiftSubjectsId,      // shift_subjects_id
      questionId,           // questions_id (this is the ID of the question to update)
    ]);

    // Check if any rows were affected (updated)
    if (result.affectedRows === 0) {
      throw new Error("Question not found for update");
    }

    // Return the result of the update operation
    return result;
  } catch (error) {
    // Handle any errors during the update process
    throw new Error("Error while updating question: " + error.message);
  }
};



// Function to delete a question
export const deleteQuestionModal = async (id) => {
  try {
    const query = "DELETE FROM questions WHERE questions_id = ?";
    const [result] = await db.query(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error("Question not found for deletion");
    }
    return result;
  } catch (error) {
    throw new Error("Error while deleting question: " + error.message);
  }
};

// Get all questions with their options
export const getAllQuestionsWithTheirOptionsModal = async () => {
  try {
    const query = `
      SELECT 
        q.questions_id, 
        q.shift,
        q.questions_name, 
        q.difficulty,  
        o.option_id, 
        o.option_text, 
        o.is_correct
      FROM 
        Questions q
      LEFT JOIN 
        options o ON q.questions_id = o.questions_id;
    `;
    const [results] = await db.query(query);

    // Grouping the results by question_id
    const questionsWithOptions = results.reduce((acc, row) => {
      const {
        questions_id,
        shift,
        questions_name,
        difficulty,
        option_id,
        option_text,
        is_correct,
      } = row;

      // Find if the question already exists in the accumulator
      let question = acc.find((q) => q.questions_id === questions_id);

      if (!question) {
        // If not, create a new question object
        question = {
          questions_id,
          shift,
          questions_name,
          difficulty,
          options: [],
        };
        acc.push(question); // Add the question to the accumulator
      }

      // Add the option to the options array for this question
      if (option_id) {
        question.options.push({
          option_id,
          option_text,
          is_correct,
        });
      }

      return acc;
    }, []);

    return questionsWithOptions; // Return the grouped result
  } catch (err) {
    throw new Error("Failed to retrieve questions with options");
  }
};

export const getQuestionsWithOptionsByTopicId = async (topicId) => {
  try {
    // SQL query to fetch questions with their options for a given topic_id
    const query = `
      SELECT 
          q.questions_id, 
          q.questions_name, 
          o.option_id, 
          o.option_text, 
          o.is_correct
      FROM 
          questions q
      JOIN 
          options o ON q.questions_id = o.questions_id
      WHERE 
          q.topic_id = ?
      ORDER BY 
          q.questions_id, o.option_id;
    `;

    const [rows] = await db.execute(query, [topicId]);

    if (rows.length === 0) {
      throw new Error(`No questions found for topic_id: ${topicId}`);
    }

    const formattedData = {};

    rows.forEach((row) => {
      const { question_id, question_name, option_id, option_text, is_correct } =
        row;

      if (!formattedData[question_id]) {
        formattedData[question_id] = {
          question_name,
          options: [],
        };
      }

      formattedData[question_id].options.push({
        option_id,
        option_text,
        is_correct,
      });
    });

    return formattedData;
  } catch (error) {
    console.error("Error fetching questions and options:", error);
    throw new Error(
      `An error occurred while fetching questions and options: ${error.message}`
    );
  }
};
