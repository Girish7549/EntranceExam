import express from 'express';
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getQuestionsByShiftIdController
} from '../controllers/shiftModule/shift.controller.js';

const router = express.Router();

// Get all shifts
router.get('/shifts', getAllShifts);

// Get shift by ID
router.get('/shifts/:shiftId', getShiftById);

// Create a new shift
router.post('/shifts', createShift);

// Update a shift by ID
router.put('/shifts/:shiftId', updateShift);

// Delete a shift by ID
router.delete('/shifts/:shiftId', deleteShift);

router.get('/getQuestionsWithOptionsByShiftId/:shiftId', getQuestionsByShiftIdController);

export default router;
