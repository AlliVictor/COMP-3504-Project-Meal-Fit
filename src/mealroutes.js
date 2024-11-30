const { generateMealPlan } = require('./models/meal');

const registerMealRoutes = (app, db) => {
  app.post('/api/meals/plan', async (req, res) => {
    const { dietRestrictions } = req.body; // Get restrictions from the request

    try {
      // Generate a meal plan based on restrictions
      const mealPlan = await generateMealPlan(db, dietRestrictions);
      res.status(200).json(mealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      res.status(500).json({
        message: 'Meal plan generation failed',
        error: error.message,
      });
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
