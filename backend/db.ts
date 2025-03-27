import * as mysql from 'mysql2/promise';


// Funktion som returnerar en anslutning
export async function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'marvel_movies',
  });
}
