import express from 'express';
import {
  createChapter,
  getChapterById,
  getAllChapters,
  updateChapter,
  deleteChapterById,
  getTopicsFromChapter,
  getChapterByIdQuestionOptionController
} from '../controllers/chapterModule/chapter.controller.js';

const router = express.Router();

// Create Chapter
router.post('/create/chapter', createChapter);

// Get All Chapters
router.get('/getAllChapters', getAllChapters);

// Get Chapter by ID
router.get('/getChapterById/:chapterId', getChapterById);

// Update Chapter by ID
router.put('/updateChapterById/:chapterId', updateChapter);

// Delete Chapter by ID
router.delete('/deleteChapterById/:chapterId', deleteChapterById);

router.get('/getTopicsByChapterId/:chapterId', getTopicsFromChapter);
router.get('/getChapterByIdQuestionOptions/:chapterId', getChapterByIdQuestionOptionController);

export default router;
