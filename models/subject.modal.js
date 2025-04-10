import db from "../db/db.js"; // Assuming you're using a database connection module

// Create a new subject
export const createSubject = async (
  subjectName,
  subcategoryId,
  description,
  status
) => {
  try {
    const query =
      "INSERT INTO subject (subject_name, subcategory_id, description, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [
      subjectName,
      subcategoryId,
      description,
      status,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get all subjects
export const getAllSubjects = async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const dataQuery = `SELECT subject.*, subcategories.subcategory_name FROM subject 
                   JOIN subcategories ON subject.subcategory_id = subcategories.subcategory_id 
                   LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total FROM subject`;
    const [dataResult] = await db.query(dataQuery, [limit, offset]);
    const [[{ total }]] = await db.query(countQuery);

    return {
      data: dataResult,
      total,
    };
  } catch (error) {
    console.error("SubjectModel Model Error:", error);
    throw new Error(`SubjectModel Model DB error ${error.message}`);
  }
};

export const getAllSubjectWithSubcategoryModal = async () => {
  try {
    const query = `SELECT 
      subject.subject_id, 
      subject.subject_name, 
      subject.subcategory_id,  
      subcategories.subcategory_name 
    FROM 
      subject 
    JOIN 
      subcategories 
      ON subject.subcategory_id = subcategories.subcategory_id;`;

    const [subjects] = await db.query(query);

    // Format the response
    const formattedResponse = subjects.reduce((acc, subject) => {
      // Check if subcategory already exists in the accumulator
      const existingSubcategory = acc.find(
        (item) => item.subcategory_id === subject.subcategory_id
      );

      if (existingSubcategory) {
        // If it exists, push the subject into the subjects array of that subcategory
        existingSubcategory.subjects.push({
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
        });
      } else {
        // If it doesn't exist, create a new subcategory entry
        acc.push({
          subcategory_id: subject.subcategory_id,
          subcategory_name: subject.subcategory_name,
          subjects: [
            {
              subject_id: subject.subject_id,
              subject_name: subject.subject_name,
            },
          ],
        });
      }

      return acc;
    }, []);

    return formattedResponse;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getAllSubcategorySubjectUnitChapterModal = async () => {
  try {
    const query = `SELECT 
    subject.subject_id, 
    subject.subject_name, 
    subject.subcategory_id,  
    subcategories.subcategory_name,
    unit.unit_id, 
    unit.unit_name, 
    chapter.chapter_id, 
    chapter.chapter_name
FROM 
    subject
JOIN 
    subcategories ON subject.subcategory_id = subcategories.subcategory_id
JOIN 
    unit ON subject.subject_id = unit.subject_id
JOIN 
    chapter ON unit.unit_id = chapter.unit_id;`;

    const [subjects] = await db.query(query);

    // Format the response
    const formattedResponse = subjects.reduce((acc, subject) => {
      // Check if subcategory already exists in the accumulator
      const existingSubcategory = acc.find(
        (item) => item.subcategory_id === subject.subcategory_id
      );

      if (existingSubcategory) {
        // Check if the subject already exists in the subcategory
        const existingSubject = existingSubcategory.subjects.find(
          (item) => item.subject_id === subject.subject_id
        );

        if (existingSubject) {
          // Check if the unit already exists in the subject
          const existingUnit = existingSubject.units.find(
            (item) => item.unit_id === subject.unit_id
          );

          if (existingUnit) {
            // Push the chapter to the existing unit
            existingUnit.chapters.push({
              chapter_id: subject.chapter_id,
              chapter_name: subject.chapter_name,
            });
          } else {
            // If unit doesn't exist, create a new unit entry with chapters
            existingSubject.units.push({
              unit_id: subject.unit_id,
              unit_name: subject.unit_name,
              chapters: [
                {
                  chapter_id: subject.chapter_id,
                  chapter_name: subject.chapter_name,
                },
              ],
            });
          }
        } else {
          // If subject doesn't exist, create a new subject entry with units and chapters
          existingSubcategory.subjects.push({
            subject_id: subject.subject_id,
            subject_name: subject.subject_name,
            units: [
              {
                unit_id: subject.unit_id,
                unit_name: subject.unit_name,
                chapters: [
                  {
                    chapter_id: subject.chapter_id,
                    chapter_name: subject.chapter_name,
                  },
                ],
              },
            ],
          });
        }
      } else {
        // If subcategory doesn't exist, create a new subcategory entry
        acc.push({
          subcategory_id: subject.subcategory_id,
          subcategory_name: subject.subcategory_name,
          subjects: [
            {
              subject_id: subject.subject_id,
              subject_name: subject.subject_name,
              units: [
                {
                  unit_id: subject.unit_id,
                  unit_name: subject.unit_name,
                  chapters: [
                    {
                      chapter_id: subject.chapter_id,
                      chapter_name: subject.chapter_name,
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      return acc;
    }, []);

    return formattedResponse;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getAllSubcategorySubjectUnitModal = async () => {
  try {
    const query = `SELECT 
    subject.subject_id, 
    subject.subject_name, 
    subject.subcategory_id,  
    subcategories.subcategory_name,
    unit.unit_id, 
    unit.unit_name
FROM 
    subcategories
JOIN 
    subject ON subcategories.subcategory_id = subject.subcategory_id
JOIN 
    unit ON subject.subject_id = unit.subject_id;`;

    const [subjects] = await db.query(query);

    // Format the response
    const formattedResponse = subjects.reduce((acc, subject) => {
      // Check if subcategory already exists in the accumulator
      const existingSubcategory = acc.find(
        (item) => item.subcategory_id === subject.subcategory_id
      );

      if (existingSubcategory) {
        // Check if the subject already exists in the subcategory
        const existingSubject = existingSubcategory.subjects.find(
          (item) => item.subject_id === subject.subject_id
        );

        if (existingSubject) {
          // Check if the unit already exists in the subject
          const existingUnit = existingSubject.units.find(
            (item) => item.unit_id === subject.unit_id
          );

          if (!existingUnit) {
            // If unit doesn't exist, create a new unit entry without chapters
            existingSubject.units.push({
              unit_id: subject.unit_id,
              unit_name: subject.unit_name,
            });
          }
        } else {
          // If subject doesn't exist, create a new subject entry with units
          existingSubcategory.subjects.push({
            subject_id: subject.subject_id,
            subject_name: subject.subject_name,
            units: [
              {
                unit_id: subject.unit_id,
                unit_name: subject.unit_name,
              },
            ],
          });
        }
      } else {
        // If subcategory doesn't exist, create a new subcategory entry
        acc.push({
          subcategory_id: subject.subcategory_id,
          subcategory_name: subject.subcategory_name,
          subjects: [
            {
              subject_id: subject.subject_id,
              subject_name: subject.subject_name,
              units: [
                {
                  unit_id: subject.unit_id,
                  unit_name: subject.unit_name,
                },
              ],
            },
          ],
        });
      }

      return acc;
    }, []);

    return formattedResponse;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};



// Get subject by ID
export const getSubjectById = async (subjectId) => {
  try {
    const query = "SELECT * FROM subject WHERE subject_id = ?";
    const [result] = await db.query(query, [subjectId]);
    return result[0]; // Return the first result (only one subject per ID)
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Update subject
export const updateSubjectById = async (
  subjectId,
  subjectName,
  description,
  status,
  subcategoryId
) => {
  try {
    const query =
      "UPDATE subject SET subject_name = ?, description = ?, status = ?, subcategory_id = ? WHERE subject_id = ?";
    const [result] = await db.query(query, [
      subjectName,
      description,
      status,
      subcategoryId,
      subjectId,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Delete subject by ID
export const deleteSubjectById = async (subjectId) => {
  try {
    const query = "DELETE FROM subject WHERE subject_id = ?";
    const [result] = await db.query(query, [subjectId]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getSubjectUnitChapterModal = async () => {
  try {
    const query = `
      SELECT s.subject_id, s.subject_name, u.unit_id, u.unit_name, c.chapter_id, c.chapter_name, c.year, c.total, c.avg, c.weightage_first, c.weightage_second
      FROM subject s
      JOIN unit u ON u.subject_id = s.subject_id
      JOIN chapter c ON c.unit_id = u.unit_id
      ORDER BY s.subject_name, u.unit_name, c.chapter_name;
    `;

    // Execute the query
    const [results] = await db.query(query);

    // Initialize the structure to store subject, unit, and chapter data
    const subjects = {};

    // Loop through the query results and build the object structure
    results.forEach((row) => {
      if (!subjects[row.subject_id]) {
        subjects[row.subject_id] = {
          subject_name: row.subject_name,
          units: {},
        };
      }

      if (!subjects[row.subject_id].units[row.unit_id]) {
        subjects[row.subject_id].units[row.unit_id] = {
          unit_name: row.unit_name,
          chapters: [],
        };
      }

      subjects[row.subject_id].units[row.unit_id].chapters.push({
        chapter_id: row.chapter_id,
        chapter_name: row.chapter_name,
        year: row.year,
        total: row.total,
        avg: row.avg,
        weightage_first: row.weightage_first,
        weightage_second: row.weightage_second,
      });
    });

    return Object.values(subjects); // Return the structured data
  } catch (err) {
    console.error("Error in getSubjectUnitChapterModal:", err); // Log the error with a descriptive message
    throw new Error("Error in fetching subject-unit-chapter data"); // Rethrow the error for the controller to handle
  }
};
