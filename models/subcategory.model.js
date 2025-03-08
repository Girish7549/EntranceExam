import db from "../db/db.js";

export const createSubcategoryModel = async (
    subcategoryName,
    description,
    categoryId,
    subcatText,
    status
) => {
    try {
        const checkCategoryQuery = "SELECT * FROM categories WHERE category_id = ?";
        const [category] = await db.query(checkCategoryQuery, [categoryId]);

        if (!category || category.length === 0) {
            return { error: "Category does not exist" };
        }

        const query =
            "INSERT INTO subcategories (subcategory_name, category_id, status, description, subcategory_text) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [
            subcategoryName,
            categoryId,
            status,
            description,
            subcatText
        ]);

        return result.affectedRows > 0 ? result : { error: "Subcategory creation failed" };
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};



export const getAllSubcategoryModel = async () => {
    try {
        const query = `
            SELECT subcategories.*, categories.category_name
            FROM subcategories
            JOIN categories ON subcategories.category_id = categories.category_id
        `;

        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const getSubcategoryByIdModel = async (subcategoryId) => {
    try {
        const query = `SELECT * FROM subcategories WHERE subcategory_id = ?`;

        const [result] = await db.query(query, [subcategoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const editSubcategoryByIdModel = async (
    subcategoryId,
    subcategoryName,
    description,
    status,
    subcatText,
    categoryId
) => {
    try {
        // Correct query order
        const query =
            "UPDATE subcategories SET subcategory_name=?, description=?, status=?, subcategory_text=?, category_id=? WHERE subcategory_id=?";

        // Pass parameters in the correct order
        const [result] = await db.query(query, [
            subcategoryName,
            description,
            status,
            subcatText,
            categoryId,
            subcategoryId,  // `subcategoryId` should be the last parameter
        ]);

        // Check if rows were affected
        return result.affectedRows > 0 ? result : null; // Return result if affectedRows > 0, else return null
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};



export const deleteSubcategoryByIdModel = async (subcategoryId) => {
    try {
        const query = "DELETE FROM subcategories WHERE subcategory_id = ?";
        const [result] = await db.query(query, [subcategoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const filterSubcategoryByIdModel = async (categoryId) => {
    try {
        const query = "SELECT * FROM subcategories WHERE category_id = ?";
        const [result] = await db.query(query, [categoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};


// Function to get subcategory data
export const getSubcategoryByIdSub_unit_chapter = async (subcategoryId) => {
    try {
        if (!subcategoryId) {
            throw new Error('Invalid subcategory ID');
        }

        const query = `
      SELECT
  subcategories.subcategory_id,
  subcategories.subcategory_name,
  subject.subject_id,
  subject.subject_name,
  unit.unit_id,
  unit.unit_name,
  chapter.chapter_id,
  chapter.chapter_name,
  chapter.year,
  chapter.total,
  chapter.avg,
  chapter.weightage_first,
  chapter.weightage_second
FROM
  subcategories
  LEFT JOIN subject ON subject.subcategory_id = subcategories.subcategory_id
  LEFT JOIN unit ON unit.subject_id = subject.subject_id
  LEFT JOIN chapter ON chapter.unit_id = unit.unit_id
WHERE
  subcategories.subcategory_id = ?;

    `;

        // Execute the query and get the results
        const [rows] = await db.query(query, [subcategoryId]);

        // If no rows found, return an empty object
        if (rows.length === 0) {
            return { subcategory_id: subcategoryId, subject: [] };
        }

        // Process the results into the desired structure
        const subcategoryData = {
            subcategory_id: subcategoryId,
            subject: [],
        };

        // Populate subjects, units, and chapters
        rows.forEach((row) => {
            // Find subject or create a new one
            const subject = subcategoryData.subject.find(
                (sub) => sub.subject_id === row.subject_id
            );
            if (!subject) {
                subcategoryData.subject.push({
                    subject_id: row.subject_id,
                    subject_name: row.subject_name,
                    unit: [],
                });
            }

            // Find unit for the subject or create a new one
            const unit = subcategoryData.subject
                .find((sub) => sub.subject_id === row.subject_id)
                .unit.find((u) => u.unit_id === row.unit_id);

            if (!unit) {
                subcategoryData.subject
                    .find((sub) => sub.subject_id === row.subject_id)
                    .unit.push({
                        unit_id: row.unit_id,
                        unit_name: row.unit_name,
                        chapter: [],
                    });
            }

            // Push chapter into the correct unit
            subcategoryData.subject
                .find((sub) => sub.subject_id === row.subject_id)
                .unit.find((u) => u.unit_id === row.unit_id)
                .chapter.push({
                    chapter_id: row.chapter_id,
                    chapter_name: row.chapter_name,
                    year: row.year,
                    total: row.total,
                    avg: row.avg,
                    weightage_first: row.weightage_first,
                    weightage_second: row.weightage_second,
                });
        });

        return subcategoryData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data from the database');
    }
};


export const getAllSubcategoryYearShiftShiftSubjectsModal = async () => {
    try {
        const query = `
            SELECT 
                subcategories.subcategory_id,
                subcategories.subcategory_name,
                previous_year.year_id,
                previous_year.year,
                shift.shift_id,
                shift.shift_name,
                shift_subjects.shift_subjects_id,
                shift_subjects.shift_subjects_name
            FROM 
                subcategories
            JOIN 
                previous_year ON subcategories.subcategory_id = previous_year.subcategory_id
            JOIN 
                shift ON previous_year.year_id = shift.year_id
            JOIN 
                shift_subjects ON shift.shift_id = shift_subjects.shift_id;
        `;

        const [result] = await db.query(query);

        // If no data, return null
        if (result.length === 0) {
            return null;
        }

        // Format the response
        const formattedResult = result.reduce((acc, row) => {
            // Find the subcategory group in the accumulator
            let subcategory = acc.find(subcat => subcat.subcategory_id === row.subcategory_id);

            if (!subcategory) {
                // Create new subcategory group if it doesn't exist
                subcategory = {
                    subcategory_id: row.subcategory_id,
                    subcategory_name: row.subcategory_name,
                    years: []
                };
                acc.push(subcategory);
            }

            // Find the year group within the subcategory group
            let years = subcategory.years.find(y => y.year_id === row.year_id);

            if (!years) {
                // Create new year group if it doesn't exist
                years = {
                    year_id: row.year_id,
                    year: row.year,
                    shifts: []
                };
                subcategory.years.push(years);
            }

            // Find the shift group within the year
            let shift = years.shifts.find(s => s.shift_id === row.shift_id);

            if (!shift) {
                // Create new shift group if it doesn't exist
                shift = {
                    shift_id: row.shift_id,
                    shift_name: row.shift_name,
                    shift_subjects: []
                };
                years.shifts.push(shift);
            }

            // Add shift_subject to the shift
            shift.shift_subjects.push({
                shift_subjects_id: row.shift_subjects_id,
                shift_subjects_name: row.shift_subjects_name
            });

            return acc;
        }, []);

        return formattedResult;

    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};
