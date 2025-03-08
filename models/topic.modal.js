import db from '../db/db.js'; // Assuming you have a DB connection setup

// Create Topic
export const createTopicModel = async (topicName, chapterId, status, description) => {
  try {
    const query =
      "INSERT INTO topic (topic_name, chapter_id, status, description) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [topicName, chapterId, status, description]);
    return result;
  } catch (error) {
    throw new Error(`Error creating topic: ${error.message}`);
  }
};

// Get Topic by ID
export const getTopicByIdModel = async (topicId) => {
  try {
    const query = "SELECT * FROM topic WHERE topic_id = ?";
    const [topic] = await db.query(query, [topicId]);
    return topic.length > 0 ? topic[0] : null; // Return the topic or null if not found
  } catch (error) {
    throw new Error(`Error fetching topic: ${error.message}`);
  }
};

// Get All Topics
export const getAllTopicsModel = async () => {
  try {
    const query = "SELECT * FROM topic";
    const [topics] = await db.query(query);
    return topics;
  } catch (error) {
    throw new Error(`Error fetching all topics: ${error.message}`);
  }
};

// Update Topic
export const updateTopicModel = async (topicId, topicName, chapterId, status, description) => {
  try {
    const query =
      "UPDATE topic SET topic_name = ?, chapter_id = ?, status = ?, description = ?, updated_date = CURRENT_TIMESTAMP WHERE topic_id = ?";
    const [result] = await db.query(query, [topicName, chapterId, status, description, topicId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating topic: ${error.message}`);
  }
};

// Delete Topic
export const deleteTopicByIdModel = async (topicId) => {
  try {
    const query = "DELETE FROM topic WHERE topic_id = ?";
    const [result] = await db.query(query, [topicId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting topic: ${error.message}`);
  }
};


export const getQuestionsOptionsByTopicById = async (topicId) => {
  const query = `
    SELECT t.topic_id, t.topic_name, q.questions_id, q.questions_name, o.option_id, o.option_text, o.is_correct
    FROM topic t
    JOIN questions q ON t.topic_id = q.topic_id
    JOIN options o ON q.questions_id = o.questions_id
    WHERE t.topic_id = ?;
  `;

  // Execute the query
  const [rows] = await db.query(query, [topicId]);

  if (rows.length === 0) {
    throw new Error("No data found");
  }

  const result = {
    topic_id: rows[0].topic_id,  // The topic_id is taken from the first row
    topic_name: rows[0].topic_name, // The topic_name is taken from the first row
    questions: [] // To store questions and their options
  };

  let currentQuestion = null;

  // Loop through the result rows and structure the data
  rows.forEach(row => {
    // If the question is different from the previous one, push the previous question
    if (!currentQuestion || currentQuestion.questions_id !== row.questions_id) {
      if (currentQuestion) {
        result.questions.push(currentQuestion);
      }

      // Initialize a new question object
      currentQuestion = {
        questions_id: row.questions_id,
        questions_name: row.questions_name,
        options: [] 
      };
    }

    // Add the current option to the current question
    currentQuestion.options.push({
      option_id: row.option_id,
      option_text: row.option_text,
      is_correct: row.is_correct
    });
  });

  // Push the last question after the loop
  if (currentQuestion) {
    result.questions.push(currentQuestion);
  }

  return result;
};






