import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: Database | null = null;
let dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/nutriia.db');
const dbDir = path.dirname(dbPath);

// Crear directorio si no existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar base de datos
export async function initDatabase() {
  try {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });

    // Cargar base de datos existente o crear nueva
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
      console.log('✅ Base de datos cargada desde:', dbPath);
    } else {
      db = new SQL.Database();
      console.log('✅ Nueva base de datos creada');
    }

    // Crear tablas si no existen
    createTables();

    // Guardar base de datos periódicamente
    setInterval(() => {
      if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
      }
    }, 5000); // Guardar cada 5 segundos

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
}

function createTables() {
  if (!db) return;

  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de pacientes
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      paternal_last_name TEXT,
      maternal_last_name TEXT,
      full_name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabla de evaluaciones nutricionales
  db.run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      patient_id INTEGER,
      patient_name TEXT NOT NULL,
      first_name TEXT,
      paternal_last_name TEXT,
      maternal_last_name TEXT,
      age INTEGER,
      gender TEXT,
      weight REAL,
      height REAL,
      bmi REAL,
      glucose_level REAL,
      glucose_status TEXT,
      blood_pressure TEXT,
      activity_level TEXT,
      medical_conditions TEXT,
      medications TEXT,
      allergies TEXT,
      dietary_preferences TEXT,
      evaluation_data TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
    )
  `);

  // Tabla de planes alimenticios
  db.run(`
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      patient_id INTEGER,
      patient_name TEXT NOT NULL,
      evaluation_id INTEGER,
      week_number INTEGER DEFAULT 1,
      menu_type INTEGER DEFAULT 0,
      considerations TEXT,
      plan_data TEXT NOT NULL,
      generated_by_ai BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
      FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE SET NULL
    )
  `);

  // Tabla de monitoreo/seguimiento
  db.run(`
    CREATE TABLE IF NOT EXISTS monitoring (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      patient_id INTEGER,
      patient_name TEXT NOT NULL,
      weight REAL,
      glucose_level REAL,
      blood_pressure TEXT,
      notes TEXT,
      analysis_result TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
    )
  `);
}

// Función helper para ejecutar queries
export function query(sql: string, params: any[] = []): any[] {
  if (!db) throw new Error('Base de datos no inicializada');
  const stmt = db.prepare(sql);
  const result: any[] = [];
  stmt.bind(params);
  while (stmt.step()) {
    result.push(stmt.getAsObject());
  }
  stmt.free();
  return result;
}

// Función helper para ejecutar queries que retornan un solo resultado
export function queryOne(sql: string, params: any[] = []): any {
  if (!db) throw new Error('Base de datos no inicializada');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

// Función helper para ejecutar INSERT/UPDATE/DELETE
export function run(sql: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
  if (!db) throw new Error('Base de datos no inicializada');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  const changes = db.getRowsModified();
  
  // Obtener el último ID insertado
  const lastIdResult = db.exec("SELECT last_insert_rowid() as id");
  const lastInsertRowid = lastIdResult.length > 0 && lastIdResult[0].values.length > 0 
    ? lastIdResult[0].values[0][0] as number 
    : 0;
  
  stmt.free();
  
  // Guardar inmediatamente
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.warn('No se pudo guardar la base de datos:', error);
  }
  
  return { lastInsertRowid, changes };
}

// Exportar db para compatibilidad
export { db };
