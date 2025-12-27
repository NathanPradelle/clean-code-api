import mysql from 'mysql2/promise';

/**
 * Pool de connexions MySQL pour leitner_db
 * Configuration pour développement local (Laragon/XAMPP)
 */
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'leitner_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


pool
  .getConnection()
  .then((connection) => {
    console.log('✅ MySQL connecté (leitner_db)');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Erreur MySQL:', err.message);
    console.error('💡 Vérifiez que MySQL est démarré et que leitner_db existe');
  });

export default pool;