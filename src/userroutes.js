"use strict";

module.exports.register = (app, database) => {

app.get ('/api/usercreate', async (req, res) => {
	res.status(200).send("This is running").end();
 });


// Route to search for a user by name, ID, or both
app.get('/api/users/search', async (req, res) => {
    const { userid, username } = req.query;

    try {
        let query;
        let params;

        if (userid && username) {
            // Query with both user_id and user_name
            query = 'SELECT * FROM users WHERE user_id = ? AND user_name LIKE ?';
            params = [userid, `%${username}%`];
        } else if (userid) {
            // Query with only user_id
            query = 'SELECT * FROM users WHERE user_id = ?';
            params = [userid];
        } else if (username) {
            // Query with only user_name
            query = 'SELECT * FROM users WHERE user_name LIKE ?';
            params = [`%${username}%`];
        } else {
            // No query parameters provided
            return res.status(400).send({ error: 'Please provide either User ID or User name to search' });
        }

        // Execute the query
        const [records] = await database.query(query, params);

        // Check if any records were found
        if (records.length === 0) {
            return res.status(404).send({ error: 'No user found' });
        }

        // Send the found records as the response
        res.status(200).send(records);
    } catch (error) {
        console.error('Error searching for user:', error);
        res.status(500).send({ error: 'Failed to search for user' });
    }
});


app.post('/api/adduser', async (req, res) => {

    const { user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies } = req.body;

    if (!user_id || !user_name || !user_age || !user_gender || !user_dietrestrictions || !allergies) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        await database.query(' INSERT INTO users (user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies) VALUES (?, ?, ?, ?, ?, ?)',
	[user_id, user_name, user_age, user_gender, user_dietrestrictions, allergies]);

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error while adding user:', error);
        res.status(500).send({ error: 'Failed to create user' });
    }
});

}
