import {
  createChapterModel,
  getChapterByIdModel,
  getAllChaptersModel,
  updateChapterModel,
  deleteChapterByIdModel,
  getTopicFromChapterModal,
  getChapterByIdQuestionsOptionsModal
} from "../../models/chapter.modal.js";

// Create Chapter
export const createChapter = async (req, res) => {
  try {
    const { chapterName, unitId, year, total, avg, weightageFirst, weightageSecond } = req.body;

    if (!chapterName || !unitId || !year || total === undefined || avg === undefined || weightageFirst === undefined || weightageSecond === undefined) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const result = await createChapterModel(chapterName, unitId, year, total, avg, weightageFirst, weightageSecond);
    return res.status(201).json({ message: "Chapter created successfully", data: result });
  } catch (error) {
    console.error("Create Chapter Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Chapter by ID
export const getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await getChapterByIdModel(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    return res.status(200).json([chapter ]);
  } catch (error) {
    console.error("Get Chapter By ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get All Chapters
export const getAllChapters = async (req, res) => {
  try {
    const chapters = await getAllChaptersModel();
    return res.status(200).json(chapters);
  } catch (error) {
    console.error("Get All Chapters Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Chapter
export const updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { chapterName, unitId, year, total, avg, weightageFirst, weightageSecond, status } = req.body;

    if (!chapterName || !unitId || !year || total === undefined || avg === undefined || weightageFirst === undefined || weightageSecond === undefined || status === undefined) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updated = await updateChapterModel(chapterId, chapterName, unitId, year, total, avg, weightageFirst, weightageSecond, status);

    if (!updated) {
      return res.status(404).json({ message: "Chapter not found or not updated" });
    }

    return res.status(200).json({ message: "Chapter updated successfully" });
  } catch (error) {
    console.error("Update Chapter Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Chapter by ID
export const deleteChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const deleted = await deleteChapterByIdModel(chapterId);

    if (!deleted) {
      return res.status(404).json({ message: "Chapter not found or not deleted" });
    }

    return res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Delete Chapter Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getTopicsFromChapter = async (req, res) => {
  const { chapterId } = req.params; // Get chapterId from the route parameters
  try {
    // Call the model to get topics for the specific chapter
    const topics = await getTopicFromChapterModal(chapterId);

    if (topics.length === 0) {
      // If no topics found, return a 404
      return res.status(404).json({ message: 'No topics found for this chapter' });
    }

    // Return the topics in the response
    res.json( topics );
  } catch (error) {
    console.error('Error fetching topics:', error);
    // Return a 500 status for internal server errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Controller to handle fetching chapter data
export const getChapterByIdQuestionOptionController = async (req, res) => {
  try {
    // Extract chapterId from request parameters
    const { chapterId } = req.params;

    // Call the function to get chapter data from the database
    const chapterData = await getChapterByIdQuestionsOptionsModal(chapterId);

    // Check if the chapter data is found
    if (chapterData) {
      // Send the chapter data as a response
      res.json(chapterData);
    } else {
      // If no data found, return a 404 error
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the database call
    console.error('Error fetching chapter data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


