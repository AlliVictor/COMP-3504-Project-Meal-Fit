document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const homeBtn = document.getElementById('homeBtn');
    const mealPlanBtn = document.getElementById('mealPlanBtn');
    const usersBtn = document.getElementById('usersBtn');
    const mealBtn = document.getElementById('mealBtn');
    const loginBtn = document.getElementById('loginBtn');

    // Event Listeners
    homeBtn.addEventListener('click', renderHome);
    mealPlanBtn.addEventListener('click', renderMealPlan);
    usersBtn.addEventListener('click', renderUsers);
    mealBtn.addEventListener('click', renderMealsTable);
    loginBtn.addEventListener('click', renderLogin);

    // Home Page
    function renderHome() {
        mainContent.innerHTML = `
      <h2>Welcome to the Meal Plan App</h2>
      <p>Navigate using the buttons above.</p>
    `;
    }

   function renderMealPlan() {
       mainContent.innerHTML = `
         <h2>Generate a Meal Plan</h2>
         <input type="text" id="dietRestrictions" placeholder="Enter dietary restrictions">
         <button id="generatePlanBtn">Generate Plan</button>
         <div id="mealPlanListContainer">
           <ul id="mealPlanList"></ul>
         </div>
       `;

       document.getElementById('generatePlanBtn').addEventListener('click', async () => {
           const restrictions = document.getElementById('dietRestrictions').value;
           try {
               const response = await fetch('http://35.208.93.54:8080/api/meals/plan', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ dietRestrictions: restrictions }),
               });
               const mealPlan = await response.json();
               const mealPlanList = document.getElementById('mealPlanList');
               mealPlanList.innerHTML = '';
               mealPlan.forEach((day) => {
                   const dayItem = document.createElement('li');
                   dayItem.innerHTML = `<strong>${day.day}</strong>`;
                   const mealList = document.createElement('ul');
                   day.meals.forEach((meal) => {
                       const mealItem = document.createElement('li');
                       mealItem.textContent = meal.meal_name || 'Meal name missing';

                       // Add click event to show detailed meal info
                       mealItem.addEventListener('click', () => showMealDetails(meal));
                       mealList.appendChild(mealItem);
                   });
                   dayItem.appendChild(mealList);
                   mealPlanList.appendChild(dayItem);
               });

           } catch (error) {
               alert('Failed to generate meal plan');
           }
       });
   }

   // Global variable to keep track of the current meal details container
   let currentMealDetails = null;

   // Function to show detailed information of a meal
   async function showMealDetails(meal) {
       // If there's already a meal details container open, close it
       if (currentMealDetails && mainContent.contains(currentMealDetails)) {
           mainContent.removeChild(currentMealDetails);
       }

       // Create a new meal details container
       const mealDetailsContainer = document.createElement('div');
       mealDetailsContainer.classList.add('meal-details-container');

       // Fetch and extract data for each nutrient group (carbs, proteins, etc.)
       const nutrients = extractNutrients(meal);

       // Convert the description to an array of lines for bullet points
       const descriptionLines = (meal.description || 'No description available').split('\n');

       const mealDetailsHTML = `
           <h3>Meal Details</h3>
           <p><strong>Meal Name:</strong> ${meal.meal_name}</p>
           <img src="${meal.image_url || 'default_image.jpg'}" alt="Meal Image"/>

           <div class="details-container">
               <!-- Description Section (Left) -->
               <div class="description">
                   <h4>Description</h4>
                   <ul>
                       ${descriptionLines.map(line => `<li>${line}</li>`).join('')}
                   </ul>
                   <p><strong>Calories:</strong> ${meal.calories || 'N/A'}</p>
               </div>

               <!-- Nutritional Information Section (Right) -->
               <div class="nutritional-info">
                   <h4>Nutritional Information</h4>
                   <ul>
                       ${nutrients.map(nutrient => `<li><strong>${nutrient.type}:</strong> ${nutrient.value || 'N/A'}</li>`).join('')}
                   </ul>
               </div>
           </div>

           <h4>Dietary Restrictions</h4>
           <p><strong>Restriction(s):</strong> ${meal.restriction_name || 'No dietary restrictions'}</p>

           <button id="closeMealDetails">Close</button>
       `;

       mealDetailsContainer.innerHTML = mealDetailsHTML;

       // Append the new meal details container to the main content
       mainContent.appendChild(mealDetailsContainer);

       // Set the current meal details for easy removal later
       currentMealDetails = mealDetailsContainer;

       // Show the meal details container
       mealDetailsContainer.style.display = 'block';

       // Close meal details when the close button is clicked
       document.getElementById('closeMealDetails').addEventListener('click', () => {
           mainContent.removeChild(mealDetailsContainer);
           currentMealDetails = null; // Reset the current meal details tracker
       });
   }


   // Function to extract nutrients from the meal data
   function extractNutrients(meal) {
       // Define nutrient fields and their display names
       const nutrientFields = [
           { type: 'Carbs', field: 'carb_name' },
           { type: 'Proteins', field: 'protein_name' },
           { type: 'Fats', field: 'fat_name' },
           { type: 'Fibers', field: 'fiber_name' },
           { type: 'Vitamins', field: 'vitamin_name' },
           { type: 'Minerals', field: 'mineral_name' },
           { type: 'Drinks', field: 'drink_name' }
       ];

       // Extract nutrients from the meal object and return them
       return nutrientFields.map(nutrient => ({
           type: nutrient.type,
           value: meal[nutrient.field] || 'N/A' // Use 'N/A' if the nutrient name is missing
       }));
   }



   // Users Page
       function renderUsers() {
           mainContent.innerHTML = `
         <h2>User Registration</h2>
         <form id="userForm">
           <input type="text" name="user_name" placeholder="Name" required>
           <input type="email" name="user_email" placeholder="Email" required>
           <input type="password" name="user_pass" placeholder="Password" required>
           <input type="number" name="user_age" placeholder="Age" required>
           <select name="user_gender" required>
             <option value="male">Male</option>
             <option value="female">Female</option>
           </select>
           <input type="text" name="user_dietrestrictions" placeholder="Dietary Restrictions">
           <input type="text" name="allergies" placeholder="Allergies">
           <button type="submit">Register</button>
         </form>
       `;

           document.getElementById('userForm').addEventListener('submit', async (e) => {
               e.preventDefault();
               const formData = new FormData(e.target);
               const userData = Object.fromEntries(formData.entries());
               try {
                   const response = await fetch('http://35.208.93.54:8080/api/users/register', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(userData),
                   });
                   const result = await response.json();
                   alert(result.message);
               } catch (error) {
                   alert('Failed to register user');
               }
           });
       }

       // Login Page
       function renderLogin() {
           mainContent.innerHTML = `
         <h2>User Login</h2>
         <form id="loginForm">
           <input type="text" name="identifier" placeholder="Username or Email" required>
           <input type="password" name="user_pass" placeholder="Password" required>
           <button type="submit">Login</button>
         </form>
         <p id="loginMessage"></p>
       `;

           document.getElementById('loginForm').addEventListener('submit', async (e) => {
               e.preventDefault();
               const formData = new FormData(e.target);
               const loginData = Object.fromEntries(formData.entries());

               try {
                   const response = await fetch('http://35.208.93.54:8080/api/users/login', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(loginData),
                   });

                   const result = await response.json();

                   if (response.ok) {
                       document.getElementById('loginMessage').textContent = 'Login successful!';
                       console.log('Logged in as:', result.userId);
                   } else {
                       document.getElementById('loginMessage').textContent = result.message;
                   }
               } catch (error) {
                   document.getElementById('loginMessage').textContent = 'Login failed. Try again.';
                   console.error('Login error:', error);
               }
           });
       }


    // Search Page
    function renderMealsTable() {
        const hiddenColumns = [
            'meal_id',
            'carb_name',
            'protein_name',
            'fat_name',
            'fiber_name',
            'vitamin_name',
            'mineral_name',
            'description',
        ];

        // Map backend column names to frontend display names
        const columnDisplayNames = {
            meal_name: 'Meal Name',
            drink_name: 'Drink',
            restriction_name: 'Diet Restriction',
            calories: 'Calories (Kcal)',
        };

        mainContent.innerHTML = `
            <h2>Meals Table</h2>
            <div id="mealsTableContainer">
                <table id="mealsTable" border="1">
                    <thead>
                        <tr id="mealsTableHeader"></tr>
                    </thead>
                    <tbody id="mealsTableBody"></tbody>
                </table>
            </div>
        `;

        async function fetchMeals() {
            try {
                // Fetch data for the meals table
                const response = await fetch(`http://35.208.93.54:8080/api/search/meals`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', response.status, errorText);
                    throw new Error('Failed to fetch meals data');
                }

                const results = await response.json();
                console.log('Result from backend:', results);

                const headerRow = document.getElementById('mealsTableHeader');
                const body = document.getElementById('mealsTableBody');

                // Clear previous results
                headerRow.innerHTML = '';
                body.innerHTML = '';

                if (results.length > 0) {
                    // Dynamically create table headers, excluding hidden columns
                    const headers = Object.keys(results[0]).filter(
                        (header) => !hiddenColumns.includes(header)
                    );

                    headers.forEach((header) => {
                        const th = document.createElement('th');
                        th.textContent = columnDisplayNames[header] || header; // Use display name or fallback to raw name
                        headerRow.appendChild(th);
                    });

                    // Populate table rows, excluding hidden columns
                    results.forEach((record) => {
                        const tr = document.createElement('tr');
                        headers.forEach((header) => {
                            const td = document.createElement('td');
                            td.textContent = record[header];
                            tr.appendChild(td);
                        });

                        // Add a click event listener to show details
                        tr.addEventListener('click', () => showMealDetails(record));
                        body.appendChild(tr);
                    });
                } else {
                    const noDataRow = document.createElement('tr');
                    const noDataCell = document.createElement('td');
                    noDataCell.colSpan = 1;
                    noDataCell.textContent = 'No records found';
                    noDataRow.appendChild(noDataCell);
                    body.appendChild(noDataRow);
                }
            } catch (error) {
                alert('Failed to fetch meals data');
                console.error('Error:', error);
            }
        }

        fetchMeals();
    }



    // Initialize the app by rendering the home page
    renderHome();
});