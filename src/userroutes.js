"use strict";
//
//module.exports.register = (app, database) => {
//app.get ('/api/usercreate', async (req, res) => {
//	res.status(200).send("This is running").end();
// });
//
//// Route to search for a user by name, ID, or both
//app.get('/api/users/search', async (req, res) => {
//    const { userid, username } = req.query;
//    try {
//        let query;
//        let params;
//        if (userid && username) {
//            // Query with both user_id and user_name
//            query = 'SELECT * FROM users WHERE user_id = ? AND user_name LIKE ?';
//            params = [userid, `%${username}%`];
//        } else if (userid) {
//            // Query with only user_id
//            query = 'SELECT * FROM users WHERE user_id = ?';
//            params = [userid];
//        } else if (username) {
//            // Query with only user_name
//            query = 'SELECT * FROM users WHERE user_name LIKE ?';
//            params = [`%${username}%`];
//        } else {
//            // No query parameters provided
//            return res.status(400).send({ error: 'Please provide either User ID or User name to search' });
//        }
//        // Execute the query
//        const [records] = await database.query(query, params);
//        // Check if any records were found
//        if (records.length === 0) {
//            return res.status(404).send({ error: 'No user found' });
//        }
//        // Send the found records as the response
//        res.status(200).send(records);
//    } catch (error) {
//        console.error('Error searching for user:', error);
//        res.status(500).send({ error: 'Failed to search for user' });
//    }
//});
//
//app.post('/api/adduser', async (req, res) => {
//    const { user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies } = req.body;
//    if (!user_id || !user_name || !user_age || !user_gender || !user_dietrestrictions || !allergies) {
//        return res.status(400).send({ error: 'All fields are required' });
//    }
//    try {
//        await database.query(' INSERT INTO users (user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies) VALUES (?, ?, ?, ?, ?, ?)',
//	[user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies]);
//        res.status(201).send({ message: 'User created successfully' });
//    } catch (error) {
//        console.error('Error while adding user:', error);
//        res.status(500).send({ error: 'Failed to create user' });
//    }
//});
//}

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
    res.status(500).json({ message: 'Registration failed', error: error.message });
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