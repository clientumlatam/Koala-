import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This is how you connect to a Neon serverless database
// Ensure that process.env.DATABASE_URL is set in your Vercel project settings
const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql, { schema });
