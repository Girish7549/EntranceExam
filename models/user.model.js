import db from "../db/db.js";

export const getAllUsersModel = async () => {
  try {
    const query = "SELECT * FROM users";

    const [result] = await db.query(query);
    console.log('query', result);

    return result.length === 0 ? null : result;
  } catch (error) {
    throw new Error(`Error in getting all user ${error}`);
  }
};

export const createUserModel = async (first_name, last_name, email, password, phone, status) => {
  try {
    const query = 'INSERT INTO users (first_name, last_name, email, password, phone, status) VALUES (?, ?, ?, ?, ?,?)';
    const [result] = await db.query(query, [first_name, last_name, email, password, phone, status]);
    return result;
  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging purposes
    throw new Error('Failed to create user'); // Rethrow or throw a custom error
  }
};

export const getUserByIdModel = async (userId) => {
  try {
    const query = "SELECT * FROM users WHERE user_id = ?"
    const [result] = await db.query(query, [userId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error(error.message);
    throw new Error(`Error in getting user By Id ${error}`);
  }
};

export const editUserByIdModel = async (
  userId,
  firstName,
  lastName,
  middleName,
  email,
  password,
  phone
) => {
  try {
    const [updateResult] = await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, middle_name = ?, password = ?, email = ?, phone = ? WHERE user_id = ?",
      [firstName, lastName, middleName, email, password, phone, userId]
    );
    return updateResult;
  } catch (error) {
    console.log(error);
    throw new Error(`Error in updating user: ${error.message}`);
  }
};

export const deleteUserByIdModal = async (userId) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ? ", [
      userId,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Error in deleting user By Id ${error}`);
  }
};


// Model to get user carts
export const getUserCartsModel = async (userId) => {
  const query = `SELECT * FROM carts WHERE user_id = ?`;
  const [results] = await db.execute(query, [userId]);
  return results;
};


// Model to get user wishlist
export const getUserWishlistModel = async (userId) => {
  const query = `SELECT * FROM wishlist WHERE user_id = ?`;
  const [results] = await db.execute(query, [userId]);
  return results;
};


// Model to get User Count
export const getUserCountModel = async () => {
  try {
    const query = "SELECT COUNT(*) as count FROM users";

    const [result] = await db.query(query);

    return result.length === 0 ? null : result[0];
  } catch (error) {
    throw new Error(`Error in getting all user ${error}`);
  }
};

