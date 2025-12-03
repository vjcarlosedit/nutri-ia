import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../database/nutriia.db');
const schemaPath = join(__dirname, '../database/schema.sql');

console.log('Inicializando base de datos...');

// Crear directorio si no existe
import { mkdirSync } from 'fs';
try {
  mkdirSync(join(__dirname, '../database'), { recursive: true });
} catch (error) {
  // El directorio ya existe
}

const db = new Database(dbPath);

// Leer y ejecutar el schema
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('Base de datos inicializada correctamente en:', dbPath);

// Crear usuario de prueba (opcional)
const defaultPassword = await bcrypt.hash('admin123', 10);
try {
  db.prepare(`
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `).run('Admin', 'admin@nutriia.com', defaultPassword);
  console.log('Usuario de prueba creado: admin@nutriia.com / admin123');
} catch (error) {
  console.log('Usuario de prueba ya existe o error al crearlo');
}

db.close();
console.log('✅ Base de datos lista!');

