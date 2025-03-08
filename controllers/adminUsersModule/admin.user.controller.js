import { createAdminUser, getAllAdminUsers, getAdminUserById, updateAdminUser, deleteAdminUser, authenticateAdminUserModal } from '../../models/admin.user.modal.js';

// Create Admin User
export const createAdminUserController = async (req, res) => {
    try {
        const { first_name, last_name, phone, email, hashedPassword, profile_pic, status } = req.body;
        if (!first_name || !last_name || !phone || !email || !hashedPassword || !status) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await createAdminUser(first_name, last_name, phone, email, hashedPassword, profile_pic, status);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const loginAdminUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Authenticate user
        const result = await authenticateAdminUserModal(email, password);

        // Send success response
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

// Get All Admin Users
export const getAllAdminUsersController = async (req, res) => {
    try {
        const users = await getAllAdminUsers();
        if (!users) {
            return res.status(404).json({ success: false, message: "No admin users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Admin User by ID
export const getAdminUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getAdminUserById(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

// Update Admin User
export const updateAdminUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, email, profile_pic, status } = req.body;

        if (!first_name || !last_name || !phone || !email || !status) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await updateAdminUser(id, first_name, last_name, phone, email, profile_pic, status);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Admin User
export const deleteAdminUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteAdminUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
