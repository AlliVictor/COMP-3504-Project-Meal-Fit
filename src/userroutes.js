"use strict";
const { createUser, findUserByUsername } = require('./models/user');

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
    const existingUser = await findUserByUsername(db, user_name);

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const userId = await createUser(db, {
      user_name,
      user_email,
      user_pass,
      user_age,
      user_gender,
      user_dietrestrictions,
      allergies,
    });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'This Email has an account already attached to it', error: error.message });
  }
});


  // User login
  app.post('/api/users/login', async (req, res) => {
    const { identifier, user_pass } = req.body; // Identifier can be username or email

    try {
      const user = await findUserByUsername(db, identifier);

      if (!user || user.user_pass !== user_pass) {
        return res.status(401).json({ message: 'Invalid username/email or password' });
      }

      res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });
};

module.exports = { register };