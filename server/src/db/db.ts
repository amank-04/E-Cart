import { Pool } from "pg";
import { config } from "dotenv";

config();

const { PGHOST: host, PGUSER: user, PGPASSWORD: password, PGDATABASE: database } = process.env;

export const db = new Pool({ host, port: 5432, user, password, database, ssl: true });
