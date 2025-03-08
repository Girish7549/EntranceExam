import db from "../db/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create Admin User with email existence check
export const createAdminUser = async (first_name, last_name, phone, email, password, profile_pic, status) => {
    try {
        // Check if user already exists
        const checkQuery = "SELECT id FROM admin_users WHERE email = ?";
        const [existingUser] = await db.query(checkQuery, [email]);
        if (existingUser.length > 0) {
            throw new Error("User already registered");
        }

        // Hash the password using bcrypt with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const query = `
        INSERT INTO admin_users (first_name, last_name, phone, email, password, profile_pic, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
        const [result] = await db.query(query, [first_name, last_name, phone, email, hashedPassword, profile_pic, status]);

        return { success: true, message: "Admin user created successfully", id: result.insertId };
    } catch (error) {
        console.error(error);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};

export const authenticateAdminUserModal = async (email, password) => {
    try {
        // Check if user exists
        const query = "SELECT id, first_name, last_name, phone, email, password, profile_pic FROM admin_users WHERE email = ?";
        const [result] = await db.query(query, [email]);

        if (result.length === 0) {
            throw new Error("Invalid email or password");
        }
        
        const adminUser = result[0];
        // Compare the entered password with the hashed password from the database
        const isMatch = await bcrypt.compare(password, adminUser.password);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        return {
            success: true,
            message: "Login successfully",
            id: adminUser.id,
            email: adminUser.email,
            first_name: adminUser.first_name,
            last_name: adminUser.last_name,
            phone: adminUser.phone,
            profile_pic: adminUser.profile_pic
        };
    } catch (error) {
        console.error("❌ Error:", error.message);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};



// Get all admin users
export const getAllAdminUsers = async () => {
    try {
        const query = "SELECT * FROM admin_users";
        const [result] = await db.query(query);

        return result.length === 0 ? null : result;
    } catch (error) {
        console.error(error);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};

// Get admin user by ID
export const getAdminUserById = async (id) => {
    try {
        const query = "SELECT * FROM admin_users WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            throw new Error("Admin user not found");
        }

        return result[0];
    } catch (error) {
        console.error(error);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};

// Update admin user
export const updateAdminUser = async (id, first_name, last_name, phone, email, profile_pic, status) => {
    try {
        // Check if the user exists
        const checkQuery = "SELECT id FROM admin_users WHERE id = ?";
        const [existingUser] = await db.query(checkQuery, [id]);
        if (existingUser.length === 0) {
            throw new Error("Admin user not found");
        }

        // Update user details
        const query = `
      UPDATE admin_users 
      SET first_name = ?, last_name = ?, phone = ?, email = ?, profile_pic = ?, status = ?, updated_at = NOW() 
      WHERE id = ?
    `;
        await db.query(query, [first_name, last_name, phone, email, profile_pic, status, id]);

        return { success: true, message: "Admin user updated successfully" };
    } catch (error) {
        console.error(error);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};

// Delete admin user
export const deleteAdminUser = async (id) => {
    try {
        // Check if the user exists
        const checkQuery = "SELECT id FROM admin_users WHERE id = ?";
        const [existingUser] = await db.query(checkQuery, [id]);
        if (existingUser.length === 0) {
            throw new Error("Admin user not found");
        }

        // Delete user
        const query = "DELETE FROM admin_users WHERE id = ?";
        await db.query(query, [id]);

        return { success: true, message: "Admin user deleted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error(`AdminUser Model DB error: ${error.message}`);
    }
};

