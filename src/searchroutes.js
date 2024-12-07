"use strict";

module.exports.register = (app, database) => {

    app.get('/searchroutes', async (req, res) => {
        res.status(200).send("This is running!").end();
    });


// Define the dynamic route to fetch records for a given table
app.get('/api/search/:table/:idOrName?', async (req, res) => {
    const { table, idOrName } = req.params;

    try {
        // Map table names to their respective column names
        const tableMappings = {
            carbs: { id: 'carb_id', name: 'carb_name' },
            dietrestrictions: { id: 'dietrestriction_id', name: 'dietrestriction_name' },
            fats: { id: 'fat_id', name: 'fat_name' },
            fibers: { id: 'fiber_id', name: 'fiber_name' },
            meals: { id: 'meal_id', name: 'meal_name' },
            minerals: { id: 'mineral_id', name: 'mineral_name' },
            proteins: { id: 'protein_id', name: 'protein_name' },
            vitamins: { id: 'vitamin_id', name: 'vitamin_name' },
            drinks: { id: 'drink_id', name: 'drink_name' },
        };

        // Validate table name
        if (!tableMappings[table]) {
            return res.status(400).send({ error: 'Invalid table name' });
        }

        const { id: idColumn, name: nameColumn } = tableMappings[table];
        const dbName = 'project-meal-planner'; // Set your database name
        let query;
        let params = [];

        if (idOrName) {
            if (!isNaN(idOrName)) {
                // Numeric value: Assume it's `id`
                query = `SELECT * FROM \`${dbName}\`.\`${table}\` WHERE \`${idColumn}\` = ?`;
                params = [idOrName];
            } else {
                // Non-numeric value: Assume it's `name`
                query = `SELECT * FROM \`${dbName}\`.\`${table}\` WHERE \`${nameColumn}\` LIKE ?`;
                params = [`%${idOrName}%`];
            }
        } else {
            // Fetch all records if no `idOrName` is provided
            query = `SELECT * FROM \`${dbName}\`.\`${table}\``;
        }

        console.log('Executing query:', query, 'with params:', params);

        // Execute the query
        const [records] = await database.query(query, params);

        // Check if records were found
        if (!records || records.length === 0) {
            return res.status(404).send({ error: 'No records found' });
        }

        // Send the records as a response
        res.status(200).send(records);
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).send({ error: 'Failed to search records' });
    }
});

app.get('/api/test/proteins', async (req, res) => {
    try {
        const [records] = await database.query('SELECT * FROM `project-meal-planner`.`proteins`');
        console.log('Proteins table records:', records);
        res.status(200).send(records);
    } catch (error) {
        console.error('Error fetching proteins:', error);
        res.status(500).send({ error: 'Failed to fetch proteins' });
    }
});

}
