import * as optionsModel from '../../models/options.modal.js';

// Create a new option
export const createOption = async (req, res) => {
  const { question_id, option_text, is_correct} = req.body;
  
  try {
    const result = await optionsModel.createOption(question_id, option_text, is_correct);
    res.status(201).json({ message: 'Option created successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create option' });
  }
};

// Get all options
export const getAllOptions = async (req, res) => {
  try {
    const options = await optionsModel.getAllOptions();
    if (options.length === 0) {
      return res.status(404).json({ message: 'No options found' });
    }
    res.status(200).json(options);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve all options' });
  }
};

// Get options by question ID
export const getOptionsByQuestionId = async (req, res) => {
  const { question_id } = req.params;

  try {
    const options = await optionsModel.getOptionsByQuestionId(question_id);
    if (options.length === 0) {
      return res.status(404).json({ message: 'No options found for this question' });
    }
    res.status(200).json(options);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve options' });
  }
};

// Get a single option by its ID
export const getOptionById = async (req, res) => {
  const { option_id } = req.params;

  try {
    const option = await optionsModel.getOptionById(option_id);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.status(200).json(option);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve option' });
  }
};

// Update an option
export const updateOptionController = async (req, res) => {
  const { option_id } = req.params;
  const { option_text, is_correct, question_id } = req.body;

  try {
    const result = await optionsModel.updateOption(option_id, option_text, is_correct, question_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Option not found' });
    }

    res.status(200).json({ message: 'Option updated successfully', updatedOption: result });
  } catch (err) {
    console.error('Error in updateOptionController:', err);
    res.status(500).json({ error: 'Failed to update option', details: err.message });
  }
};


// Delete an option
export const deleteOption = async (req, res) => {
  const { option_id } = req.params;

  try {
    const result = await optionsModel.deleteOption(option_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.status(200).json({ message: 'Option deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete option' });
  }
};

// Check if an option is correct
export const checkOptionCorrectness = async (req, res) => {
  const { option_id } = req.params;

  try {
    const isCorrect = await optionsModel.checkOptionCorrectness(option_id);
    if (isCorrect === null) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.status(200).json({ is_correct: isCorrect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check option correctness' });
  }
};
