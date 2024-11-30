// Model for Meal

const getMeals = async (db) => {
  const query = `SELECT * FROM meals`;
  const meals = await db.query(query);
  return meals;
};

const filterMeals = async (db, dietrestrictions /*allergies*/) => {
  const query = `
    SELECT * FROM meals_view
    WHERE NOT FIND_IN_SET(?, restriction_name)
//AND NOT FIND_IN_SET(?, allergies)
  `;
  const meals = await db.query(query, [dietrestrictions /*allergies*/]);
  return meals;
};

const generateMealPlan = async (db, dietrestrictions /*allergies*/) => {
  const query = `
    SELECT * FROM meals_view
    WHERE NOT FIND_IN_SET(?, restriction_name)
    //AND NOT FIND_IN_SET(?, allergies)
    ORDER BY RAND()
    LIMIT 21; -- 3 meals a day for 7 days
  `;
  const meals = await db.query(query, [dietrestrictions /*allergies*/]);

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
