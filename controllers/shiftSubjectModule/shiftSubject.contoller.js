import {createShiftSubjectModal, getShiftSubjectModel } from "../../models/shift_subjects.modal.js";

export const createShiftSubjectController = async (req, res) => {
    try {
        const { shiftId, status, shift_subjects_name } = req.body;

        if (!shiftId || !status || !shift_subjects_name) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const result = await createShiftSubjectModal(shiftId, status, shift_subjects_name);

        // Check for errors
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({ message: 'shiftSubject created successfully', data: result });
    } catch (error) {
        console.log('CreateSubcategory Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getAllShiftSubjectContoller = async (req, res) => {
  try {
    const result = await getShiftSubjectModel();

    if(!result) {
        return res.status(400).json({message : "shiftSubject is not present"})
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};