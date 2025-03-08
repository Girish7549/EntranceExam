import {
  createTopicModel,
  getTopicByIdModel,
  getAllTopicsModel,
  updateTopicModel,
  deleteTopicByIdModel,
  getQuestionsOptionsByTopicById
} from '../../models/topic.modal.js';

// Create Topic
export const createTopic = async (req, res) => {
  try {
    const { topicName, chapterId, status, description } = req.body;

    if (!topicName || !chapterId || !status || !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const result = await createTopicModel(topicName, chapterId, status, description);
    return res.status(201).json({ message: "Topic created successfully", data: result });
  } catch (error) {
    console.error("Create Topic Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Topic by ID
export const getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await getTopicByIdModel(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    return res.status(200).json({ data: topic });
  } catch (error) {
    console.error("Get Topic By ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get All Topics
export const getAllTopics = async (req, res) => {
  try {
    const topics = await getAllTopicsModel();
    return res.status(200).json(topics);
  } catch (error) {
    console.error("Get All Topics Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Topic
export const updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { topicName, chapterId, status, description } = req.body;

    if (!topicName || !chapterId || !status || !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updated = await updateTopicModel(topicId, topicName, chapterId, status, description);

    if (!updated) {
      return res.status(404).json({ message: "Topic not found or not updated" });
    }

    return res.status(200).json({ message: "Topic updated successfully" });
  } catch (error) {
    console.error("Update Topic Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Topic by ID
export const deleteTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;
    const deleted = await deleteTopicByIdModel(topicId);

    if (!deleted) {
      return res.status(404).json({ message: "Topic not found or not deleted" });
    }

    return res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Delete Topic Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




export const getQuestionsOptionsByTopicByIdController = async (req, res) => {
  try {
    // Extract topicId from route parameters
    const { topicId } = req.params;

    // Call the service function to get questions and options by topicId
    const result = await getQuestionsOptionsByTopicById(topicId);

    // If no data is returned, send a 404 response
    if (!result || result.questions.length === 0) {
      return res.status(404).json({
        message: 'No questions found for the given topic.'
      });
    }

    // Return the result with status 200 (OK)
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching questions and options:', error);

    // Send a 500 response for internal server errors
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
