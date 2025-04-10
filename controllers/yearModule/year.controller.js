import * as yearModel from '../../models/year.model.js';

// Get all years
export const getAllYears = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const result = await yearModel.getAllYears(page);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No Year found" });
    }

    return res.status(200).json({
      message: "Year fetched successfully",
      ...result
    });
  } catch (error) {
    console.error("Year Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllSubcategoryYearShiftController = async (req, res) => {
  try {
    const years = await yearModel.getAllSubcategoryYearShiftModal();
    res.status(200).json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve years' });
  }
};

// Get year by ID
export const getYearById = async (req, res) => {
  const { yearId } = req.params;
  try {
    const year = await yearModel.getYearById(yearId);
    if (year) {
      res.status(200).json(year);
    } else {
      res.status(404).json({ error: 'Year not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve year' });
  }
};

// Create a new year
export const createYear = async (req, res) => {
  const { year, status, subcategoryId } = req.body;
  try {
    const result = await yearModel.createYear(year, status, subcategoryId);
    res.status(201).json({ message: 'Year created successfully', year_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create year' });
  }
};

// Update a year by ID
export const updateYear = async (req, res) => {
  const { yearId } = req.params;
  const { year, subject_id, status } = req.body;
  try {
    const result = await yearModel.updateYear(yearId, year, subject_id, status);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Year updated successfully' });
    } else {
      res.status(404).json({ error: 'Year not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update year' });
  }
};

// Delete a year by ID
export const deleteYear = async (req, res) => {
  const { yearId } = req.params;
  try {
    const result = await yearModel.deleteYear(yearId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Year deleted successfully' });
    } else {
      res.status(404).json({ error: 'Year not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete year' });
  }
};


export const getYearShift = async (req, res) => {
  try {
    const data = await yearModel.getAllYearShiftModal();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Year not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve year' });
  }
};


export const getYearShiftDataController = async (req, res) => {
  try {
    // Retrieve the subcategoryId from the request parameters (or body, depending on where it's coming from)
    const { subcategoryId } = req.params; // Assuming the subcategoryId is passed in the URL as a parameter

    // Get the year shift data using the model function
    const data = await yearModel.getYearShiftDataModal(subcategoryId);

    // Check if data was found
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the given subcategoryId' });
    }

    // Respond with the formatted data
    return res.status(200).json(data);
  } catch (error) {
    // Log the error and send an error response
    console.error('Error in getYearShiftDataController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

