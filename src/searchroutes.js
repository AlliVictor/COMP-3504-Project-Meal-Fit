"use strict";

module.exports.register = (app, database) => {

    app.get('/searchroutes', async (req, res) => {
        res.status(200).send("This is running!").end();
    });


app.get('/api/search', async (req, res) => {
    const { table, name } = req.query;

    try {
        if (!table || !name) {
            return res.status(400).send({ error: 'Please provide both table and name to search' });
        }

        // Whitelist of valid table names to prevent SQL injection
        const validTables = ['carbs', 'diet_restrictions', 'fats', 'fibers', 'meals', 'minerals', 'proteins', 'users', 'vitamins', 'water'];
        if (!validTables.includes(table)) {
            return res.status(400).send({ error: 'Invalid table name' });
        }

        // Remove the trailing "s" to construct the column name
        const columnName = table.slice(0, -1) + '_name';

        // Construct the query dynamically with a case-insensitive search
        const query = `SELECT * FROM ${table} WHERE LOWER(${columnName}) LIKE LOWER(?)`;
        const params = [`%${name}%`];

        // Execute the query
        const [records] = await database.query(query, params);

        // Check if any records were found
        if (records.length === 0) {
            return res.status(404).send({ error: `${table} does not contain a record with the specified name` });
        }

        // Send the found records as the response
        res.status(200).send(records);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).send({ error: 'Failed to search for records' });
    }
});

}
