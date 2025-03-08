import {createQuestionModal,getAllQuestionsChapterModal, getAllQuestionsShiftModal, getQuestionByIdModal, updateQuestionModal, deleteQuestionModal, getAllQuestionsWithTheirOptionsModal, getQuestionsWithOptionsByTopicId} from '../../models/questions.modal.js';

export const createQuestion = async (req, res) => {
  try {
    const {questionsName, status, chapterId, explanation, subjectId, shiftId, questionTypeId, shiftSubjectsId} = req.body;

    if (!questionsName ||  !status || !explanation || !questionTypeId) {
      return res.status(400).json({ message: "All fields are required!" });
    } 
    const result = await createQuestionModal(questionsName, status, chapterId, explanation, subjectId, shiftId, questionTypeId, shiftSubjectsId);
    res.status(201).json({ message: 'Question created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error creating question' });
  }
};

// Controller function to get all questions
export const getAllQuestionsChapterController = async (req, res) => {
  try {
    const questions = await getAllQuestionsChapterModal();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error fetching questions' });
  }
};


export const getAllQuestionsShiftController = async (req, res) => {
  try {
    const questions = await getAllQuestionsShiftModal();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error fetching questions' });
  }
};


// Controller function to get a question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await getQuestionByIdModal(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error fetching question' });
  }
};

// Controller function to update a question
export const updateQuestion = async (req, res) => {
  try {
    const { questions_id } = req.params;
    const {questionsName, status, chapterId, explanation, subjectId, shiftId, questionTypeId, shiftSubjectsId} = req.body; // Assuming JSON payload
    const result = await updateQuestionModal(questions_id, questionsName, status, chapterId, explanation, subjectId, shiftId, questionTypeId, shiftSubjectsId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error updating question' });
  }
};

// Controller function to delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteQuestionModal(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error deleting question' });
  }
};


// Get all questions with their options
export const getAllQuestionsWithTheirOptions = async (req, res) => {
  try {
    const questionsWithOptions = await getAllQuestionsWithTheirOptionsModal();
    res.status(200).json(questionsWithOptions); // Send the grouped data as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve questions with options' });
  }
};


export const getQuestionsByTopicIdController = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId); // Assuming topicId is passed as a parameter in the URL
    
    if (isNaN(topicId)) {
      return res.status(400).json({ error: 'Invalid topic ID provided' });
    }

    // Call the service function to get questions and options for the given topic_id
    const data = await getQuestionsWithOptionsByTopicId(topicId);

    // Send the data back in the desired format
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in getQuestionsByTopicIdController:', error); // Log the detailed error
    res.status(500).json({ error: `An error occurred while fetching questions and options: ${error.message}` });
  }
};

