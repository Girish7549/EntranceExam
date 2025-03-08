import express from 'express';
import { createCategory,
     deleteCategoryById, 
     editCategoryById, 
     getAllCategory, 
     getAllCategoryAdmin, 
     getCategoryById, 
     getCategoriesCat_sub_subject,
     getAllCategoriesCatwithSubcategory } from '../controllers/categoryModule/category.controller.js';


const  router = express.Router();

router.post('/create/category', createCategory);
router.get('/getAllCategories', getAllCategory);
router.get('/getAllCategoryAdmin', getAllCategoryAdmin);
router.get('/getCategoryById/:categoryId', getCategoryById);
router.put('/editCategoryById/:categoryId', editCategoryById);
router.delete('/deleteCategoryById/:categoryId', deleteCategoryById);
router.get('/getCategories_subcat_subject', getCategoriesCat_sub_subject);
router.get('/getCategories_subcat', getAllCategoriesCatwithSubcategory);

export default router;