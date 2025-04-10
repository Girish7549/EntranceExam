import {
  createCategoryModel,
  deleteCategoryByIdModel,
  editCategoryByIdModel,
  getAllCategoryAdminModel,
  getAllCategoryModel,
  getCategoryByIdModel,
  getAllCategorySubCategorySubject,
  getAllCategories_SubcategoryModal
} from "../../models/category.model.js";

export const createCategory = async (req, res) => {
  const { categoryName, description, status } = req.body;

  if (!categoryName || !description || !status) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (categoryName.length > 100) {
    return res.status(400).json({ message: "Category name must be less than 100 characters!" });
  }

  try {

    const result = await createCategoryModel(categoryName, description, status);

    return res.status(201).json("Category Created Successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const result = await getAllCategoryModel(page);

    if (!result || result.data.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({
      message: "categories fetched successfully",
      ...result
    });
  } catch (error) {
    console.error("category Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getAllCategoryAdmin = async (req, res) => {
  try {
    const result = await getAllCategoryAdminModel();

    if (!result) {
      return res.status(400).json({ message: "Category is not present" })
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required!" })
    }

    const result = await getCategoryByIdModel(categoryId);

    if (!result) {
      return res.status(400).json({ message: "Category is not present" })
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const editCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({ message: "categoryId is required!" });
  }

  const { categoryName, description, status } = req.body;

  try {
    // Fetch the current category details from the model
    const existingCategory = await editCategoryByIdModel(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Use the existing values if they are not provided in the request body
    const updatedCategoryName = categoryName || existingCategory.category_name;
    const updatedDescription = description || existingCategory.description;
    const updatedStatus = status || existingCategory.status;

    const result = await editCategoryByIdModel(
      updatedCategoryName,
      updatedDescription,
      updatedStatus,
      categoryId
    );

    return res.status(201).json("Category updated successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const deleteCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required!" })
    }

    const result = await deleteCategoryByIdModel(categoryId);

    if (!result) {
      return res.status(400).json({ message: "Category is not present" });
    }

    return res.status(200).json({ message: "Category Deleted Successfully!" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getCategoriesCat_sub_subject = async (req, res) => {
  try {
    // Call the method from the categoryModal to fetch the data
    const data = await getAllCategorySubCategorySubject(req, res);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getAllCategoriesCatwithSubcategory = async (req, res) => {
  try {
    // Call the method from the categoryModal to fetch the data
    const data = await getAllCategories_SubcategoryModal(req, res);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



