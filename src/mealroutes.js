const { generateMealPlan } = require('./models/meal');

const registerMealRoutes = (app, db) => {
   app.post('/api/meals/plan', async (req, res) => {
    const { dietRestrictions } = req.body;

    try {
        // Split the restrictions into an array
        const restrictionsArray = dietRestrictions
            ? dietRestrictions.split(',').map((r) => r.trim())
            : [];

        let query;
        let params = [];

        if (restrictionsArray.length > 0) {
            // Create placeholders for query parameters
            const placeholders = restrictionsArray.map(() => '?').join(', ');

            // Query to fetch meals matching the dietary restrictions
            query = `
                SELECT DISTINCT meals.*
                FROM meals
                LEFT JOIN dietrestrictions ON meals.meal_id = dietrestrictions.meal_id
                WHERE dietrestrictions.restriction_name IN (${placeholders})
                ORDER BY RAND()
                LIMIT 21; -- 3 meals per day for 7 days
            `;
            params = restrictionsArray;
        } else {
            // Query to fetch all meals when no restrictions are provided
            query = `
                SELECT DISTINCT meals.*
                FROM meals
                ORDER BY RAND()
                LIMIT 21; -- 3 meals per day for 7 days
            `;
        }

        console.log('Executing query:', query, 'with params:', params);

        // Execute the query
        const [meals] = await db.query(query, params);

        // Split meals into 7 days, 3 meals each
        const mealPlan = [];
        for (let i = 0; i < 7; i++) {
            mealPlan.push({
                day: `Day ${i + 1}`,
                meals: meals.slice(i * 3, i * 3 + 3),
            });
        }

        res.status(200).json(mealPlan);
    } catch (error) {
        console.error('Error generating meal plan:', error);
        res.status(500).send({ error: 'Failed to generate meal plan' });
    }
});

  app.get('/api/meals', async (req, res) => {
    try {
      // Fetch all meals
      const meals = await getMeals(db);
      res.status(200).json(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      res.status(500).json({ message: 'Failed to fetch meals', error: error.message });
    }
  });
};

module.exports = { register: registerMealRoutes };
