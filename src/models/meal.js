const getMeals = async (db) => {
  const query = `SELECT * FROM meals_view`;
  const meals = await db.query(query);
  return meals;
};

const filterMeals = async (db, dietrestrictions) => {
  const query = `
    SELECT * FROM meals_view
    WHERE restriction_name NOT LIKE ?
  `;
  const meals = await db.query(query, ['%${dietrestrictions}%']);
  return meals;
};

const generateMealPlan = async (db, dietrestrictions) => {
  const query = `
    SELECT * FROM meals_view
    WHERE restriction_name NOT LIKE ?
    ORDER BY RAND()
    LIMIT 21; -- 3 meals per day for 7 days
  `;
  const meals = await db.query(query,['%${dietrestrictions}%']);
  // Split meals into 7 days, 3 meals each
  const mealPlan = [];
  for (let i = 0; i < 7; i++) {
    mealPlan.push({
      day: `Day ${i + 1}`,
      meals: meals.slice(i * 3, i * 3 + 3),
    });
  }

  return mealPlan;
};

module.exports = {
  getMeals,
  filterMeals,
  generateMealPlan,
};
