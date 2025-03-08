import express from 'express';
import {
    createSubjectController,
    getAllSubjectsController,
    getSubjectByIdController,
    updateSubjectController,
    deleteSubjectController,
    getAllSubjectsUnitsChaptersController,
    getAllSubjectWithSubcategoryController,
    getAllSubcategorySubjectUnitChapterController,
    getAllSubcategorySubjectUnitController
} from '../controllers/subjectModule/subject.controller.js';

const router = express.Router();
 
// Route to create a subject
router.post('/create/subject', createSubjectController);

// Route to get all subjects
router.get('/getAllSubjects', getAllSubjectsController);

router.get('/getAllSubjectsWithSubcategory', getAllSubjectWithSubcategoryController);
router.get('/getAllSubcategorySubjectUnit', getAllSubcategorySubjectUnitController);

router.get('/getAllSubcatgorySubjectUnitChapter', getAllSubcategorySubjectUnitChapterController);

// Route to get a subject by ID
router.get('/getSubjectById/:subjectId', getSubjectByIdController);

// Route to update a subject by ID
router.put('/updateSubjectById/:subjectId', updateSubjectController);

// Route to delete a subject by ID
router.delete('/deleteSubjectById/:subjectId', deleteSubjectController);

router.get('/getAllSubject_unit_chapter', getAllSubjectsUnitsChaptersController);

export default router;
