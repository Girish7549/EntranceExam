import db from "../db/db.js";

export const createCategoryModel = async (
  categoryName,
  description,
  status,
) => {
  try {
    const query =
      "INSERT INTO categories (category_name, description,  status) VALUES (?,  ?, ?)";
    const [result] = await db.query(query, [categoryName, description, status]);

    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getAllCategoryModel = async (page = 1) => {

  try {
    const limit = 10;
    const offset = (page - 1) * limit;
    const dataQuery = `SELECT * FROM categories LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) AS total FROM categories`;

    const [dataResult] = await db.query(dataQuery, [limit, offset]);
    const [[{ total }]] = await db.query(countQuery);

    return {
      data: dataResult,
      total,
    };
  } catch (error) {
    console.error("CategoryModel Model Error:", error);
    throw new Error(`CategoryModel Model DB error ${error.message}`);
  }
};

export const getAllCategoryAdminModel = async () => {
  try {
    const query = "SELECT * FROM categories";
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

// Edit
export const getCategoryByIdModel = async (categoryId) => {
  try {
    const query = "SELECT * FROM categories WHERE category_id = ?";
    const [rows] = await db.query(query, [categoryId]);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const editCategoryByIdModel = async (
  categoryName,
  description,
  status,
  categoryId
) => {
  try {
    const query =
      "UPDATE categories SET category_name = ?, description = ?,  status = ? WHERE category_id = ?";
    const [result] = await db.query(query, [
      categoryName,
      description,
      status,
      categoryId,
    ]);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const deleteCategoryByIdModel = async (categoryId) => {
  try {
    const query = "DELETE FROM categories WHERE category_id = ?";
    const [result] = await db.query(query, [categoryId]);

    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getAllCategorySubCategorySubject = async (req, res) => {
  try {
    // Raw SQL query to fetch data
    const [result] = await db.query(
      `SELECT 
        c.category_id, c.category_name, 
        sc.subcategory_id, sc.subcategory_name, 
        s.subject_id, s.subject_name
      FROM categories c
      JOIN subcategories sc ON c.category_id = sc.category_id
      JOIN subject s ON sc.subcategory_id = s.subcategory_id;`
    );

    // If no results, send response early
    if (result.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Process the data to group it by category, subcategory, and subject
    const categories = {};

    result.forEach(row => {
      // Check if category already exists in the categories object
      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          category_id: row.category_id,
          category_name: row.category_name,
          subcategory: []
        };
      }

      // Find or create the subcategory for the category
      const subcategory = categories[row.category_id].subcategory.find(
        sub => sub.subcategory_id === row.subcategory_id
      );

      if (!subcategory) {
        categories[row.category_id].subcategory.push({
          subcategory_id: row.subcategory_id,
          subcategory_name: row.subcategory_name,
          subject: []
        });
      }

      // Add the subject to the correct subcategory
      const subCategoryIndex = categories[row.category_id].subcategory.findIndex(
        sub => sub.subcategory_id === row.subcategory_id
      );

      categories[row.category_id].subcategory[subCategoryIndex].subject.push({
        subject_id: row.subject_id,
        subject_name: row.subject_name
      });
    });

    // Convert to array format and send the response
    return Object.values(categories);

  } catch (error) {
    console.error("Error fetching categories:", error);

    // Handle the error gracefully and ensure headers are not sent multiple times
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};


export const getAllCategories_SubcategoryModal = async (req, res) => {
  try {
    // Fetch all categories and subcategories
    const [result] = await db.query(`
      SELECT 
        c.category_id, 
        c.category_name, 
        sc.subcategory_id, 
        sc.subcategory_name,
        sc.subcategory_text
      FROM categories c
      JOIN subcategories sc ON c.category_id = sc.category_id;
    `);

    // If no results, send response early
    if (result.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Process and group data
    const categories = {};

    result.forEach(row => {
      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          category_id: row.category_id,
          category_name: row.category_name,
          subcategory: []
        };
      }
      categories[row.category_id].subcategory.push({
        subcategory_id: row.subcategory_id,
        subcategory_name: row.subcategory_name,
        subcategory_text: row.subcategory_text
      });
    });

    // Convert to array format
    return Object.values(categories);


  } catch (error) {
    console.log("Error in getAllCategoriesCatwithSubcategory:", error);

    // Check if headers are already sent before responding with an error
    if (!res.headersSent) {
      return res.status(500).json({ message: `Database error: ${error.message}` });
    }
  }
};




