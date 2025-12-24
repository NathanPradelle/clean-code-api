const mysql = require('mysql2');

/**
 * Configuration de la connexion MySQL pour leitner_db
 * Pool de connexions pour de meilleures performances
 */
const pool = mysql.createPool({
  host: 'localhost',      // Serveur MySQL
  port: 3306,             // Port par défaut MySQL
  user: 'root',           // Utilisateur Laragon
  password: '',           // Pas de mot de passe par défaut sur Laragon
  database: 'leitner_db', // Nom de la base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Erreur de connexion MySQL:', err.message);
    return;
  }
  console.log(' Connexion MySQL réussie !');
  connection.release();
});

// Exportation en mode Promise pour utiliser async/await
module.exports = pool.promise();