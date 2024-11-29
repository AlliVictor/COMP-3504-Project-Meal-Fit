"use strict";

// Model for User
const createUser = async (db, userData) => {
  const query = `INSERT INTO users (user_name, user_email, user_pass, user_age, user_gender, user_dietrestrictions, allergies) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const result = await db.query(query, [
                     userData.user_name,
                     userData.user_email,
                     userData.user_pass,
                     userData.user_age,
                     userData.user_gender,
                     userData.user_dietrestrictions,
                     userData.allergies,
                   ]);
  return result.insertId; // Returns the newly created user ID
};

const findUserByUsername = async (db, identifier) => {
  const query = `SELECT * FROM users WHERE user_name = ? OR user_email = ?`;
  const [user] = await db.query(query, [identifier, identifier]);
  return user || null;
};

module.exports = { createUser, findUserByUsername };
