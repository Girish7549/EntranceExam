import express from 'express';
import { createSubcategory, deleteSubcategoryById, editSubcategoryById, filterSubcategoryById, getAllSubcategory, getSubcategoryById, getSubcategoryByIdDataController, getAllSubcategoryYearShiftShiftSubjectsController } from '../controllers/subcategoryModule/subcategory.controller.js';

const router = express.Router();

router.post('/create/subcategory/:categoryId', createSubcategory);
router.get('/getAllSubcategory', getAllSubcategory);
router.get('/getSubcategoryById/:subcategoryId', getSubcategoryById);
router.put('/editSubcategoryById/:subcategoryId', editSubcategoryById);
router.delete('/deleteSubcategoryById/:subcategoryId', deleteSubcategoryById);
router.get('/subcategories/:categoryId', filterSubcategoryById);
router.get('/subcategory/subject_unit_chapter/:subcategoryId', getSubcategoryByIdDataController);
router.get('/getAllSubcategoryYearShift/ShiftSubject', getAllSubcategoryYearShiftShiftSubjectsController);


export default router;

