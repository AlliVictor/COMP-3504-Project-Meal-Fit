"use strict";

module.exports.register = (app, database) => {

    app.get('/', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

    // API endpoint to fetch data from the meal_view
    app.get('/api/meals', (req, res) => {
        const query = `SELECT * FROM project-meal-planner.meal_view`;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data from meal_view:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json(results);
        });
    });