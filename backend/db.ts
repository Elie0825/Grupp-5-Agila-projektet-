// backend/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Anslutningssträngen från Neon
const connectionString = process.env.DATABASE_URL || 
  "postgres://neondb_owner:npg_21khvAbDoBCW@ep-jolly-glitter-abo9crtx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

// Skapa en pool för att hantera flera samtidiga anslutningar
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Krav för Neon
  }
});

export default pool;