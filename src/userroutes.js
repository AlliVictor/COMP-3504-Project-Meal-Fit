"use strict";
const { createUser, findUserByUsername} = require('./models/user');
const bcrypt = require('bcrypt');

const register = (app, db) => {

  // User registration
  app.post('/api/users/register', async (req, res) => {
    const {
      user_name,
      user_email,
      user_pass,
      user_age,
      user_gender,
      user_dietrestrictions,
      allergies,
    } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await findUserByUsername(db, user_name);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Check if the email already exists
      const existingEmail = await findUserByUsername(db, user_email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(user_pass, 10);

      // Create the user
      const userId = await createUser(db, {
        user_name,
        user_email,
        user_pass: hashedPassword,
        user_age,
        user_gender,
        user_dietrestrictions,
        allergies,
      });

      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred during registration', error: error.message });
    }
  });

  // User login
  app.post('/api/users/login', async (req, res) => {
    const { identifier, user_pass } = req.body;

    try {
      // Find user by username or email
      const user = await findUserByUsername(db, identifier) || await findUserByUsername(db, identifier);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Compare the provided password with the stored hash
      const isPasswordMatch = await bcrypt.compare(user_pass, user.user_pass);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      // Return user data excluding password
      res.status(200).json({ message: 'Login successful', user: { ...user, user_pass: undefined } });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });

};

module.exports = { register };

