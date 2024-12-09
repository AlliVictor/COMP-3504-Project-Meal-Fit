document.addEventListener('DOMContentLoaded', () => {

    updateNavButtons();
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
      <section class="intro">
                             <h2>Welcome to MealFIT</h2>
                             <p>Your personalized meal planning companion that helps you eat healthier and smarter.</p>
                             <img src="./images/kkmm.png" alt="Healthy Meal Plan" width="540" height="326"  class="intro-image">
                         </section>

                        <h3 class="whymealfit">Why MealFIT?</h3>
                         <p class="homepagedescription">
                              Meal Fit is your ultimate solution for hassle-free meal planning. Designed to cater to your unique dietary needs,
                              Meal Fit generates personalized weekly meal plans tailored specifically for you. Whether you have specific dietary
                              restrictions or simply want to maintain a balanced diet, our app ensures every meal is perfectly suited to your lifestyle.
                              With Meal Fit, you'll receive detailed ingredient lists for each meal, making grocery shopping a breeze. Say goodbye to
                               meal-planning stress and hello to a healthier, more organized you. Start your journey to effortless meal planning with Meal Fit today!
                         </p>

                         <section class="features">
                             <div class="feature-container">
                             <div class="feature-item">
                                <img src="./images/personalized-meals.jpg" alt="Personalized Meals" class="feature-image">
                                <p>Personalized meal plans based on your dietary needs.</p>
                             </div>

                             <div class="feature-item">
                                 <img src="./images/healthy-recipes.jpg" alt="Healthy Recipes" class="feature-image">
                                 <p>Healthy, easy-to-follow recipes with all the nutrition information you need.</p>
                             </div>
                             </div>
                         </section>
    `;
    }

    async function renderMealPlan() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        let dietRestrictions = '';

        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            dietRestrictions = user.user_dietrestrictions || '';
        }

        // Render the initial meal plan page with the input box and button
        mainContent.innerHTML = `
       <h2>Generate a Meal Plan</h2>
       <input type="text" id="dietRestrictions" value="${dietRestrictions}" placeholder="Enter dietary restrictions">
       <button id="generatePlanBtn">Generate Plan</button>
       <div id="mealPlanListContainer">
         <ul id="mealPlanList"></ul>
       </div>
     `;

        // Function to fetch and display a meal plan
        async function fetchAndDisplayMealPlan(restrictions) {
            const mealPlanList = document.getElementById('mealPlanList');
            mealPlanList.innerHTML = '<li>Loading...</li>'; // Show a loading message

            try {
                // Fetch meal plan from the server
                const response = await fetch('http://35.208.93.54:8080/api/meals/plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dietRestrictions: restrictions }),
                });

                const mealPlan = await response.json();
                mealPlanList.innerHTML = ''; // Clear previous results

                if (mealPlan.length > 0) {
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
                } else {
                    mealPlanList.innerHTML = '<li>No meals found for the given restrictions.</li>';
                }
            } catch (error) {
                console.error('Failed to fetch meal plan:', error);
                mealPlanList.innerHTML = '<li>Failed to load meal plan. Please try again later.</li>';
            }
        }

        // Automatically fetch and display the meal plan for the user's current restrictions
        if (dietRestrictions) {
            fetchAndDisplayMealPlan(dietRestrictions);
        }

        // Add event listener to the "Generate Plan" button for fetching new meal plans
        document.getElementById('generatePlanBtn').addEventListener('click', () => {
            const newRestrictions = document.getElementById('dietRestrictions').value.trim();
            fetchAndDisplayMealPlan(newRestrictions);
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
                // Send registration request
                const response = await fetch('http://35.208.93.54:8080/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);

                    // Automatically log the user in
                    const loginData = {
                        identifier: userData.user_email, // Assuming email is used for login
                        user_pass: userData.user_pass,
                    };

                    const loginResponse = await fetch('http://35.208.93.54:8080/api/users/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(loginData),
                    });

                    const loginResult = await loginResponse.json();

                    if (loginResponse.ok) {
                        // Save user data in localStorage and render profile
                        localStorage.setItem('loggedInUser', JSON.stringify(loginResult.user));
                        alert('Registration successful! You are now logged in.');
                        updateNavButtons(); // Update navigation buttons
                        renderProfile(loginResult.user); // Render the profile view
                    } else {
                        alert('Registration successful, but failed to log in. Please log in manually.');
                        renderLogin();
                    }
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Failed to register user.');
                console.error('Registration error:', error);
            }
        });
    }


    // Function to update navigation buttons based on login state
    function updateNavButtons() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const loginButton = document.getElementById('loginBtn');
        const registerButton = document.getElementById('usersBtn'); // Corrected Register button ID
        const nav = document.querySelector('nav');

        if (!nav) {
            console.error('Navigation bar element not found!');
            return;
        }

        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);

            // Update Login Button to Profile
            loginButton.textContent = 'Profile';
            loginButton.onclick = () => renderProfile(user);

            // Hide the Register Button
            if (registerButton) {
                registerButton.style.display = 'none';
            }

            // Add Logout Button
            let logoutButton = document.getElementById('logoutBtn');
            if (!logoutButton) {
                logoutButton = document.createElement('button');
                logoutButton.id = 'logoutBtn';
                logoutButton.textContent = 'Logout';
                logoutButton.onclick = () => {
                    localStorage.removeItem('loggedInUser'); // Clear session
                    updateNavButtons(); // Update navigation buttons
                    renderLogin(); // Redirect to login page
                };
                nav.appendChild(logoutButton);
            }
        } else {
            // User is not logged in
            loginButton.textContent = 'Login';
            loginButton.onclick = renderLogin;

            // Show the Register Button
            if (registerButton) {
                registerButton.style.display = 'inline';
            }

            // Remove Logout Button if it exists
            const logoutButton = document.getElementById('logoutBtn');
            if (logoutButton) logoutButton.remove();
        }
    }




    function renderLogin() {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            renderProfile(JSON.parse(storedUser));
            return;
        }

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
                    localStorage.setItem('loggedInUser', JSON.stringify(result.user));
                    updateNavButtons(); // Update the navigation buttons
                    renderProfile(result.user);
                } else {
                    document.getElementById('loginMessage').textContent = result.message;
                }
            } catch (error) {
                document.getElementById('loginMessage').textContent = 'Login failed. Try again.';
                console.error('Login error:', error);
            }
        });
    }

    function renderProfile(user) {
        mainContent.innerHTML = `
        <h2>User Profile</h2>
        <ul>
          <li><strong>Name:</strong> ${user.user_name}</li>
          <li><strong>Email:</strong> ${user.user_email}</li>
          <li><strong>Age:</strong> ${user.user_age}</li>
          <li><strong>Gender:</strong> ${user.user_gender}</li>
          <li><strong>Dietary Restrictions:</strong> ${user.user_dietrestrictions}</li>
          <li><strong>Allergies:</strong> ${user.allergies}</li>
        </ul>
      `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Clear user session
            updateNavButtons(); // Update navigation buttons
            renderLogin(); // Redirect to login screen
        });
    }

    // Initial setup
    document.addEventListener('DOMContentLoaded', () => {
        updateNavButtons(); // Set up navigation buttons on page load
    });


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