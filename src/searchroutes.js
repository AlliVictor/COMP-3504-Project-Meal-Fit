"use strict";

module.exports.register = (app, database) => {

    app.get('/searchroutes', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

  // Route to search for a meal by name
app.get('/api/meals/search', async (req, res) => {
    const { mealname }  = req.query;

    try {
        if (!mealname) {
            return res.status(400).send({ error: 'Please provide a meal name to search' });
        }

        // Query to search for meals by name
        const query = 'SELECT * FROM meal_details WHERE meal_name LIKE ?';
        const params = [`%${mealname}%`];

        // Execute the query
        const [records] = await database.query(query, params);

        // Check if any records were found
        if (records.length === 0) {
            return res.status(404).send({ error: 'Meal does not exist' });
        }

        // Send the found records as the response
        res.status(200).send(records);
    } catch (error) {
        console.error('Error searching for meals:', error);
        res.status(500).send({ error: 'Failed to search for meals' });
    }
});
}
