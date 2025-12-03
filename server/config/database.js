import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, '../database/nutriia.db');

// Crear conexión a la base de datos
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Configurar para mejor rendimiento
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

console.log('✅ Base de datos conectada:', dbPath);

export default db;

