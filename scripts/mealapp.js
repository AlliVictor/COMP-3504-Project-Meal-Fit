document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const homeBtn = document.getElementById('homeBtn');
    const mealPlanBtn = document.getElementById('mealPlanBtn');
    const usersBtn = document.getElementById('usersBtn');
    const searchBtn = document.getElementById('searchBtn');
    const loginBtn = document.getElementById('loginBtn');

    // Event Listeners
    homeBtn.addEventListener('click', renderHome);
    mealPlanBtn.addEventListener('click', renderMealPlan);
    usersBtn.addEventListener('click', renderUsers);
    searchBtn.addEventListener('click', renderSearch);
    loginBtn.addEventListener('click', renderLogin);

    // Home Page
    function renderHome() {
        mainContent.innerHTML = `
      <h2>Welcome to the Meal Plan App</h2>
      <p>Navigate using the buttons above.</p>
    `;
    }

    // Meal Plan Page
    function renderMealPlan() {
        mainContent.innerHTML = `
      <h2>Generate a Meal Plan</h2>
      <input type="text" id="dietRestrictions" placeholder="Enter dietary restrictions">
      <button id="generatePlanBtn">Generate Plan</button>
      <ul id="mealPlanList"></ul>
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
function renderSearch() {
    const tables = [
        'carbs',
        'dietrestrictions',
        'fats',
        'fibers',
        'meals',
        'minerals',
        'proteins',
        'vitamins',
        'drinks'
    ];

    // Create the dropdown options from the table names
    const tableOptions = tables
        .map(table => `<option value="${table}">${table}</option>`)
        .join('');

    mainContent.innerHTML = `
        <h2>Search Records</h2>
        <label for="searchTable">Select Table:</label>
        <select id="searchTable">${tableOptions}</select>
        <input type="text" id="searchName" placeholder="Search Name">
        <button id="searchBtn2">Search</button>
        <ul id="searchResults"></ul>
    `;

    document.getElementById('searchBtn2').addEventListener('click', async () => {
        const table = document.getElementById('searchTable').value;
        const name = document.getElementById('searchName').value;

        try {
            // Sending the request to the backend with the selected table and name
            const response = await fetch(`http://35.208.93.54:8080/api/search?table=${table}&name=${name}`);

            if (!response.ok) {
                console.error('Error response:', response.status);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error('Failed to search records');
            }

            // Parse the JSON response
            const result = await response.json();
            console.log('Result from backend:', result);

            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = ''; // Clear previous results

            // Format the result, excluding `id` fields
            if (result && typeof result === 'object') {
                for (const [key, value] of Object.entries(result)) {
                    if (!key.toLowerCase().includes('id')) { // Exclude any key containing 'id'
                        const item = document.createElement('li');
                        item.textContent = `${key}: ${value}`; // Format as "key: value"
                        searchResults.appendChild(item);
                    }
                }
            } else {
                searchResults.innerHTML = '<li>No records found</li>';
            }
        } catch (error) {
            alert('Failed to search records');
            console.error('Search error:', error);
        }
    });
}
    // Initialize the app by rendering the home page
    renderHome();
});