import * as shiftModel from '../../models/shift.modal.js';

// Get all shifts
export const getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftModel.getAllShifts();
    res.status(200).json(shifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve shifts' });
  }
};

// Get shift by ID
export const getShiftById = async (req, res) => {
  const { shiftId } = req.params;
  try {
    const shift = await shiftModel.getShiftById(shiftId);
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(404).json({ error: 'Shift not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve shift' });
  }
};

// Create a new shift
export const createShift = async (req, res) => {
  const { shift_name, year_id, shift_date_time, status, languageJson } = req.body;
  try {
    const result = await shiftModel.createShift(shift_name, year_id, shift_date_time, status, languageJson);
    res.status(201).json({ message: 'Shift created successfully', shift_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create shift' });
  }
};

// Update a shift by ID
export const updateShift = async (req, res) => {
  const { shiftId } = req.params;
  const { shift_name, year_id, shift_date_time, status, languageJson } = req.body;
  try {
    const result = await shiftModel.updateShift(shiftId, shift_name, year_id, shift_date_time, status, languageJson);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Shift updated successfully' });
    } else {
      res.status(404).json({ error: 'Shift not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update shift' });
  }
};

// Delete a shift by ID
export const deleteShift = async (req, res) => {
  const { shiftId } = req.params;
  try {
    const result = await shiftModel.deleteShift(shiftId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Shift deleted successfully' });
    } else {
      res.status(404).json({ error: 'Shift not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete shift' });
  }
};


export const getQuestionsByShiftIdController = async (req, res) => {
  try {
      const { shiftId } = req.params;
      if (!shiftId) {
          return res.status(400).json({ message: 'Shift ID is required' });
      }

      const questions = await shiftModel.getQuestionsByShiftIdModal(shiftId);
      res.status(200).json(questions);
  } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

