const mysql = require('mysql2');

/**
 * Configuration de la connexion MySQL pour leitner_db
 * Pool de connexions pour de meilleures performances
 */
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'leitner_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Erreur de connexion MySQL:', err.message);
    return;
  }
  console.log(' Connexion MySQL réussie !');
  connection.release();
});

module.exports = pool.promise();