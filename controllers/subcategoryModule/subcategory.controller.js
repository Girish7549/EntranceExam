import { createSubcategoryModel, deleteSubcategoryByIdModel, editSubcategoryByIdModel, filterSubcategoryByIdModel, getAllSubcategoryModel, getSubcategoryByIdModel, getSubcategoryByIdSub_unit_chapter, getAllSubcategoryYearShiftShiftSubjectsModal } from "../../models/subcategory.model.js";

export const createSubcategory = async (req, res) => {
    try {
        const { subcategoryName, description, status, subcatText } = req.body;
        const { categoryId } = req.params;

        if (isNaN(categoryId) || categoryId <= 0) {
            return res.status(400).json({ message: "Invalid Category ID" });
        }

        if (!subcategoryName || !description ||  !subcatText || !status) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (status !== 'active' && status !== 'inactive') {
            return res.status(400).json({ message: "Invalid status value. Should be 'active' or 'inactive'" });
        }

        // Call the model function
        const result = await createSubcategoryModel(subcategoryName, description, categoryId, subcatText, status);

        // Check for errors
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({ message: 'Subcategory created successfully', data: result });
    } catch (error) {
        console.log('CreateSubcategory Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




export const getAllSubcategory = async (req, res) => {
    try {
        const result = await getAllSubcategoryModel();

        if(!result) {
            return res.status(400).json({message : "Subcategory is not available"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getSubcategoryById = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        if(!subcategoryId) {
            return res.status(400).json({message : "Subcategory Id is Invalid"});
        }

        const result = await getSubcategoryByIdModel(subcategoryId);

        if(!result) {
            return res.status(400).json({message : "Subcategory is empty"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editSubcategoryById = async (req, res) => {
    try {
        // Extract subcategoryId from the URL parameters
        const { subcategoryId } = req.params;

        // Extract other parameters from the request body
        const { subcategoryName, description, status, subcatText, categoryId } = req.body;

        // Call the model function with the extracted values
        const result = await editSubcategoryByIdModel(
            subcategoryId,   // subcategoryId comes from req.params
            subcategoryName,
            description,
            status,
            subcatText,
            categoryId
        );

        // Check if the result is null (i.e., no rows were affected)
        if (!result) {
            return res.status(400).json({ message: "Subcategory not updated" });
        }

        return res.status(200).json({ message: "Subcategory updated successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const deleteSubcategoryById = async (req, res) => {
    try {
        const {subcategoryId} = req.params;

        if(!subcategoryId) {
            return res.status(400).json({message : "Subcategory Id in Invalid"})
        }

        const result = deleteSubcategoryByIdModel(subcategoryId);

        if(!result) {
            return res.status(400).json({message : "Subcategory not present"});
        }

        return res.status(200).json({message : "Subcategory deleted Successfully!"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const filterSubcategoryById = async (req, res) => {
    try {
        const {categoryId} = req.params;       

        if(!categoryId) {
            return res.status(400).json({message : "category Id in Invalid"})
        }

        const result = await filterSubcategoryByIdModel(categoryId);

        if(!result) {
            return res.status(400).json({message : "category not present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


export const getSubcategoryByIdDataController = async (req, res) => {
  const { subcategoryId } = req.params; // Get subcategoryId from URL params
  
  try {
    // Call the function to get data from the database
    const subcategoryData = await getSubcategoryByIdSub_unit_chapter(subcategoryId);

    // If no data was found for this subcategoryId
    if (!subcategoryData || subcategoryData.subject.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found or no data available' });
    }

    // Send the fetched data as JSON response
    res.json(subcategoryData);
    
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error in getSubcategoryController:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};


export const getAllSubcategoryYearShiftShiftSubjectsController = async (req, res) => {
    try {
        const result = await getAllSubcategoryYearShiftShiftSubjectsModal();

        if(!result) {
            return res.status(400).json({message : "SubcategoryYearShiftShift_Subjects is not available"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}