import express from 'express';
import {
  createTopic,
  getTopicById,
  getAllTopics,
  updateTopic,
  deleteTopicById,
  getQuestionsOptionsByTopicByIdController,
} from '../controllers/topicModule/topic.controller.js';

const router = express.Router();

// Create Topic
router.post('/create/topic', createTopic);

// Get All Topics
router.get('/getAllTopics', getAllTopics);

// Get Topic by ID
router.get('/getTopicById/:topicId', getTopicById);

// Update Topic by ID
router.put('/updateTopicById/:topicId', updateTopic);

// Delete Topic by ID
router.delete('/deleteTopicById/:topicId', deleteTopicById);

router.get('/topics/:topicId/questions', getQuestionsOptionsByTopicByIdController);

export default router;
