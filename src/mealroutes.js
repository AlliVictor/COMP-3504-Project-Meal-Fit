const { generateMealPlan } = require('./models/meal');

const registerMealRoutes = (app, db) => {
  app.post('/api/meals/plan', async (req, res) => {
    const { dietrestrictions, allergies } = req.body;

    try {
      const mealPlan = await generateMealPlan(db, dietrestrictions, allergies);
      res.status(200).json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: 'Meal plan generation failed', error: error.message });
    }
  });
};

module.exports = { register: registerMealRoutes };