"use strict";

module.exports.register = (app, database) => {
    
    app.get('/', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

    // API endpoint to fetch data from the meals table
    app.get('/api/meals', async (req, res) => {
        const query = `SELECT * FROM meals`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from meals:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the users table
    app.get('/api/users', async (req, res) => {
        const query = `SELECT * FROM users`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the carbs table
    app.get('/api/carbs', async (req, res) => {
        const query = `SELECT * FROM carbs`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from carbs:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the diet_restrictions table
    app.get('/api/dietrestrictions', async (req, res) => {
        const query = `SELECT * FROM dietrestrictions`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from dietrestrictions:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the fats table
    app.get('/api/fats', async (req, res) => {
        const query = `SELECT * FROM fats`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from fats:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the fibers table
    app.get('/api/fibers', async (req, res) => {
        const query = `SELECT * FROM fibers`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from fibers:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the minerals table
    app.get('/api/minerals', async (req, res) => {
        const query = `SELECT * FROM minerals`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from minerals:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the proteins table
    app.get('/api/proteins', async (req, res) => {
        const query = `SELECT * FROM proteins`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from proteins:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the vitamins table
    app.get('/api/vitamins', async (req, res) => {
        const query = `SELECT * FROM vitamins`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from vitamins:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to fetch data from the drinks table
    app.get('/api/drinks', async (req, res) => {
        const query = `SELECT * FROM drinks`;
        try {
            const [results] = await database.execute(query);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error fetching data from drinks:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

