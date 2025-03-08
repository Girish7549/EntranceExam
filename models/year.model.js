import db from "../db/db.js"; // Import database connection

// Get all years
export const getAllYears = async () => {
  try {
    const query = `
      SELECT py.*, s.subcategory_name 
      FROM previous_year py
      JOIN subcategories s ON py.subcategory_id = s.subcategory_id
    `;

    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error("Failed to retrieve years");
  }
};


export const getAllSubcategoryYearShiftModal = async () => {
  try {
    const query = `
      SELECT 
        subcategories.subcategory_id,
        subcategories.subcategory_name,
        previous_year.year_id,
        previous_year.year,
        shift.shift_id,
        shift.shift_name
      FROM 
        previous_year
      JOIN 
        subcategories ON previous_year.subcategory_id = subcategories.subcategory_id
      JOIN 
        shift ON previous_year.year_id = shift.year_id
    `;

    const [results] = await db.query(query);

    // Format the results into the desired structure
    const formattedResults = [];

    results.forEach((row) => {
      // Check if the subcategory already exists in the formatted results
      const subcategoryIndex = formattedResults.findIndex(
        (subcategory) => subcategory.subcategory_id === row.subcategory_id
      );

      if (subcategoryIndex === -1) {
        // If subcategory doesn't exist, add a new one
        formattedResults.push({
          subcategory_id: row.subcategory_id,
          subcategory_name: row.subcategory_name,
          year: [
            {
              year_id: row.year_id,
              year_name: row.year,
              shift: [
                {
                  shift_id: row.shift_id,
                  shift_name: row.shift_name,
                },
              ],
            },
          ],
        });
      } else {
        // If subcategory exists, check if the year exists
        const yearIndex = formattedResults[subcategoryIndex].year.findIndex(
          (year) => year.year_id === row.year_id
        );

        if (yearIndex === -1) {
          // If year doesn't exist, add a new one
          formattedResults[subcategoryIndex].year.push({
            year_id: row.year_id,
            year_name: row.year,
            shift: [
              {
                shift_id: row.shift_id,
                shift_name: row.shift_name,
              },
            ],
          });
        } else {
          // If year exists, add the shift to the corresponding year
          formattedResults[subcategoryIndex].year[yearIndex].shift.push({
            shift_id: row.shift_id,
            shift_name: row.shift_name,
          });
        }
      }
    });

    return formattedResults;

  } catch (err) {
    throw new Error("Failed to retrieve years");
  }
};


// Get a year by its ID
export const getYearById = async (yearId) => {
  try {
    const query = `
      SELECT py.*, s.subcategory_name 
      FROM previous_year py
      JOIN subcategories s ON py.subcategory_id = s.subcategory_id
      WHERE py.year_id = ?
    `;

    const [results] = await db.query(query, [yearId]);
    return results[0] || null; // Return the first result or null if not found
  } catch (err) {
    throw new Error("Failed to retrieve year");
  }
};


// Create a new year record
export const createYear = async (year, status, subcategoryId) => {
  try {
    const query =
      "INSERT INTO previous_year (year, status, subcategory_id) VALUES (?, ?, ?)";
    const [results] = await db.query(query, [year, status, subcategoryId]);
    return results;
  } catch (err) {
    throw new Error("Failed to create year");
  }
};

// Update a year record by ID
export const updateYear = async (yearId, year, subject_id, status) => {
  try {
    const query =
      "UPDATE previous_year SET year = ?, subject_id = ?, status = ? WHERE year_id = ?";
    const [results] = await db.query(query, [year, subject_id, status, yearId]);
    return results;
  } catch (err) {
    throw new Error("Failed to update year");
  }
};

// Delete a year record by ID
export const deleteYear = async (yearId) => {
  try {
    const query = "DELETE FROM previous_year WHERE year_id = ?";
    const [results] = await db.query(query, [yearId]);
    return results;
  } catch (err) {
    throw new Error("Failed to delete year");
  }
};

export const getAllYearShiftModal = async () => {
  try {
    const query = `
      SELECT y.year, 
             s.year_id, 
             s.shift_name, 
             s.shift_date_time 
      FROM previous_year y 
      INNER JOIN shift s ON y.year_id = s.year_id ORDER BY y.year
    `;

    // Execute the query
    const [results] = await db.query(query);

    if (results.length === 0) {
      throw new Error("No categories found");
    }

    // Transform the results into the desired structure
    const yearShift = results.reduce((acc, result) => {

      if (!result.year) {
        throw new Error("Year not found in the result");
      }

      // If the year doesn't exist in the accumulator, create it
      if (!acc[result.year]) {
        acc[result.year] = {
          year: result.year,    // Store the year in the object
          year_id: result.year_id, // Store the year_id in the object
          shifts: []            // Initialize the shifts array for this year
        };
      }

      // Add the shift details to the corresponding year
      acc[result.year].shifts.push({
        shift_name: result.shift_name,
        shift_date_time: result.shift_date_time
      });

      return acc;
    }, {});

    // Return the structured data as an array
    return Object.values(yearShift);

  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error occurred:", err);

    // Return a custom error message if necessary
    throw new Error("Failed to get all year shift");
  }
};


export const getYearShiftDataModal = async (subcategoryId) => {
  try {
    // SQL Query to execute
    const query = `
      SELECT 
        previous_year.year_id,
        previous_year.year,
        shift.shift_id,    
        shift.shift_name,
        shift.shift_date_time
      FROM 
        previous_year
      LEFT JOIN shift ON shift.year_id = previous_year.year_id
      WHERE 
        previous_year.subcategory_id = ?;
    `;

    // Execute query and get result
    const [rows] = await db.query(query, [subcategoryId]);

    // Formatting the data
    const formattedData = {};

    // Loop through the rows to organize the data
    rows.forEach((row) => {
      if (!formattedData[row.year]) {
        // If the year is not yet in the formattedData object, add it
        formattedData[row.year] = {
          year_id: row.year_id,
          year: row.year,
          shift: [],
        };
      }

      // Add the shift data under the correct year
      formattedData[row.year].shift.push({
        shift_id: row.shift_id,
        shift_name: row.shift_name,
        shift_date_time: row.shift_date_time,
      });
    });

    // Convert the formattedData object into an array of values (optional, for easier output)
    const result = Object.values(formattedData);

    return result;
  } catch (error) {
    // Log the error
    console.error('Error executing query:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};







