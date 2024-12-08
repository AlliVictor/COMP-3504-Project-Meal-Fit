const bcrypt = require('bcrypt');
const setup = require('../src/database').setup; // Import the setup function

async function rehashPasswords() {
  try {
    const db = await setup(); // Await the connection pool

    // Query to get user_id and user_pass for all users
    const [users] = await db.execute('SELECT user_id, user_pass FROM users');

    for (const user of users) {
      // Check if password is not already hashed (bcrypt hashes are ~60 characters long)
      if (user.user_pass.length < 60) {
        // Hash the plaintext password
        const hashedPassword = await bcrypt.hash(user.user_pass, 10);

        // Update the database with the hashed password
        await db.execute('UPDATE users SET user_pass = ? WHERE user_id = ?', [hashedPassword, user.user_id]);

        console.log(`Password rehashed for user_id: ${user.user_id}`);
      }
    }

    console.log('All passwords rehashed');
    process.exit(0);
  } catch (err) {
    console.error('Error rehashing passwords:', err);
    process.exit(1);
  }
}

rehashPasswords();
