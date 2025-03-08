import express from 'express';
import {
  createUnit,
  getUnitById,
  getAllUnits,
  updateUnit,
  deleteUnitById,
  getAllUnitSubjectSubcategoryController
} from '../controllers/unitModule/unit.controller.js';

const router = express.Router();

// Create Unit
router.post('/create/unit', createUnit);

// Get All Units
router.get('/getAllUnits', getAllUnits);

router.get('/getAllUnitSubjectSubcategory', getAllUnitSubjectSubcategoryController);

// Get Unit by ID
router.get('/getUnitById/:unitId', getUnitById);

// Update Unit by ID
router.put('/updateUnitById/:unitId', updateUnit);

// Delete Unit by ID
router.delete('/deleteUnitById/:unitId', deleteUnitById);

export default router;
