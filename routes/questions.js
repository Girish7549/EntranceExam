import {createQuestion, getAllQuestionsChapterController, getAllQuestionsShiftController,  getQuestionById, updateQuestion, deleteQuestion, getAllQuestionsWithTheirOptions, getQuestionsByTopicIdController} from '../controllers/questionsModule/questions.Controller.js';
import  express from 'express';
const router = express.Router();

router.post('/create/Question', createQuestion);

// Route to get all questions
router.get('/getAllQuestionsChapter', getAllQuestionsChapterController);
router.get('/getAllQuestionShift', getAllQuestionsShiftController);

// Route to get a question by ID
router.get('/getQuestionById/:id', getQuestionById);

// Route to update a question
router.put('/updateQuestion/:id', updateQuestion);

// Route to delete a question
router.delete('/deleteQuestion/:id', deleteQuestion);

// Get all questions with their options
router.get('/questions-with-options', getAllQuestionsWithTheirOptions);

router.get('/topics/:topicId/questions', getQuestionsByTopicIdController);

export default router;
