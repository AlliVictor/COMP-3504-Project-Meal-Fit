"use strict";

module.exports.register = (app, database) => {

    app.get('/', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

    // API endpoint to fetch data from the meal_view
    app.get('/api/meals', (req, res) => {
        const query = `SELECT * FROM meal_details`;

          database.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data from meal_details:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json(results);
        });
    });

// API endpoint to fetch data from the users table
app.get('/api/users', (req, res) => {
    const query = `SELECT * FROM users`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the carbs table
app.get('/api/carbs', (req, res) => {
    const query = `SELECT * FROM carbs`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from carbs:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the diet_restrictions table
app.get('/api/dietrestrictions', (req, res) => {
    const query = `SELECT * FROM diet_restrictions`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from diet_restrictions:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the fats table
app.get('/api/fats', (req, res) => {
    const query = `SELECT * FROM fats`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from fats:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the fibers table
app.get('/api/fibers', (req, res) => {
    const query = `SELECT * FROM fibers`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from fibers:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the minerals table
app.get('/api/minerals', (req, res) => {
    const query = `SELECT * FROM minerals`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from minerals:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the proteins table
app.get('/api/proteins', (req, res) => {
    const query = `SELECT * FROM proteins`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from proteins:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the vitamins table
app.get('/api/vitamins', (req, res) => {
    const query = `SELECT * FROM vitamins`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from vitamins:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch data from the water table
app.get('/api/drinks', (req, res) => {
    const query = `SELECT * FROM water`;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from water:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});


}
