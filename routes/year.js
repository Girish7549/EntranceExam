import express from 'express';
import {
  getAllYears,
  getYearById,
  createYear,
  updateYear,
  deleteYear,
  getYearShift,
  getYearShiftDataController,
  getAllSubcategoryYearShiftController
} from '../controllers/yearModule/year.controller.js';

const router = express.Router();

// Get all years
router.get('/years', getAllYears);

router.get('/getAllSubcategoryYearShift', getAllSubcategoryYearShiftController);

// Get year by ID
router.get('/years/:yearId', getYearById);

// Create a new year
router.post('/years', createYear);

// Update a year by ID
router.put('/years/:yearId', updateYear);

// Delete a year by ID
router.delete('/years/:yearId', deleteYear);

router.get('/getAllYearShift', getYearShift);

router.get('/getSubcategoryId/year-shifts/:subcategoryId', getYearShiftDataController);

export default router;
