// Laddar in miljövariabler från .env
import * as dotenv from "dotenv";
dotenv.config();

// Debug: skriver ut databas-URL:n vid uppstart (användbart lokalt)
console.log("🔧 DATABASE_URL:", process.env.DATABASE_URL);

// Importerar mysql2 med promise-stöd
import { createPool } from "mysql2/promise";

// Skapar en återanvändbar connection pool
export const pool = createPool({
  uri: process.env.DATABASE_URL,  // Använder värdet från .env
  waitForConnections: true,
  connectionLimit: 10,
});

// Exporterar en funktion som hämtar en ny klient från poolen
export function getClient() {
  return pool.getConnection(); 
}
