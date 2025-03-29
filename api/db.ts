import * as dotenv from "dotenv";
dotenv.config();

// Logga databasens URL (men dölj känslig info)
console.log("🔧 DATABASE_URL:", process.env.DATABASE_URL ? "Finns" : "Saknas");

// Identifiera miljön
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
console.log(`Kör i ${isProduction ? 'produktionsmiljö (Vercel)' : 'utvecklingsmiljö (lokal)'}`);

// Gemensam executeQuery-funktion som används i alla filer
export async function executeQuery(query: string, params: any[] = []) {
  if (isProduction) {
    // PostgreSQL för Vercel
    const { Pool } = require('pg');
    const pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pgPool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  } else {
    // MySQL för lokal utveckling
    const { createPool } = require('mysql2/promise');
    const mysqlPool = createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10
    });
    
    const [rows] = await mysqlPool.execute(query, params);
    return rows;
  }
}

// För MySQL (lokalt)
import { createPool } from "mysql2/promise";

export const mysqlPool = createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

// För PostgreSQL (Vercel)
import { Pool } from 'pg';

export const pgPool = isProduction ? 
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }) :
  null;

// Exportera rätt pool baserat på miljö
export const pool = isProduction ? pgPool : mysqlPool;

// Exportera getClient-funktion
export async function getClient() {
  if (isProduction) {
    return await pgPool!.connect();
  } else {
    return await mysqlPool.getConnection();
  }
}