import express from 'express';
import { 
  createOption,
  getOptionsByQuestionId,
  getAllOptions,
  getOptionById,
  updateOption,
  deleteOption,
  checkOptionCorrectness
} from '../controllers/optionsModule/options.controller.js';

const router = express.Router();

// Create a new option
router.post('/createOption', createOption);

router.get('/getAllOptions', getAllOptions);

// Get options by question ID
router.get('/getOptionsByQuestionId/:question_id', getOptionsByQuestionId);

// Get a single option by its ID
router.get('/getOptionById/:option_id', getOptionById);

// Update an option
router.put('/updateOption/:option_id', updateOption);

// Delete an option
router.delete('/deleteOption/:option_id', deleteOption);

// Check if an option is correct
router.get('/checkOptionCorrectness/:option_id', checkOptionCorrectness);

export default router;
