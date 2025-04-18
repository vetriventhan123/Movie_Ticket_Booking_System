import mysql from 'mysql2/promise';

// !! IMPORTANT: Replace with your actual MySQL credentials !!
const pool = mysql.createPool({
    host: 'localhost',          // Your MySQL host (often 'localhost')
    user: 'root',    // Your MySQL username
    password: ' ', // Your MySQL password
    database: 'moviee', // The name of the database you created
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;