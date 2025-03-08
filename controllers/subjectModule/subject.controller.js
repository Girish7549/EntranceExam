import { createSubject, getAllSubjects, getSubjectById, updateSubjectById, deleteSubjectById, getSubjectUnitChapterModal, getAllSubjectWithSubcategoryModal, getAllSubcategorySubjectUnitChapterModal, getAllSubcategorySubjectUnitModal } from '../../models/subject.modal.js';

// Create a new subject
export const createSubjectController = async (req, res) => {
  try {
    const { subjectName, subcategoryId, description, status } = req.body;
    if (!subjectName || !subcategoryId || !description || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const result = await createSubject(subjectName, subcategoryId, description, status);
    res.status(201).json({ message: 'Subject created successfully', data: result });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get all subjects
export const getAllSubjectsController = async (req, res) => {
  try {
    const subjects = await getAllSubjects();
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export const getAllSubcategorySubjectUnitChapterController = async (req, res) => {
  try {
    const subjects = await getAllSubcategorySubjectUnitChapterModal();
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export const getAllSubcategorySubjectUnitController = async (req, res) => {
  try {
    const subjects = await getAllSubcategorySubjectUnitModal();
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export const getAllSubjectWithSubcategoryController = async (req, res) => {
  try {
    const subjects = await getAllSubjectWithSubcategoryModal();
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get subject by ID
export const getSubjectByIdController = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await getSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ data: subject });
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Update subject by ID
export const updateSubjectController = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { subjectName, description, status, subcategoryId } = req.body;

    const result = await updateSubjectById(subjectId, subjectName, description, status, subcategoryId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject updated successfully', data: result });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete subject by ID
export const deleteSubjectController = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const result = await deleteSubjectById(subjectId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export const getAllSubjectsUnitsChaptersController = async (req, res) => {
  try {
    // Fetch data from the model function
    const data = await getSubjectUnitChapterModal(); // Renaming to a clearer function name
    res.status(200).json(data);
  } catch (error) {
    // Log the error with a descriptive message
    console.error('Error fetching subjects and chapters:', error);
    res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
    });
  }
};
