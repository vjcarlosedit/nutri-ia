-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de evaluaciones nutricionales
CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    first_name TEXT,
    paternal_last_name TEXT,
    maternal_last_name TEXT,
    age INTEGER,
    gender TEXT,
    weight REAL,
    height REAL,
    imc REAL,
    glucose_fasting REAL,
    glucose_status TEXT,
    bmi REAL,
    evaluation_data TEXT, -- JSON con todos los datos de la evaluación
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de planes alimenticios
CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    menu_type TEXT,
    menu_type_name TEXT,
    week_number INTEGER,
    plan_data TEXT, -- JSON con el plan completo
    considerations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de registros de monitoreo
CREATE TABLE IF NOT EXISTS monitoring_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    evaluation_count INTEGER,
    plan_count INTEGER,
    tracking_count INTEGER,
    current_status TEXT,
    weight_trend TEXT,
    glucose_trend TEXT,
    adherence_level TEXT,
    current_weight TEXT,
    current_glucose TEXT,
    current_bmi TEXT,
    current_plan TEXT,
    recommendations TEXT, -- JSON array
    analysis_data TEXT, -- JSON completo del análisis
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de tracking (seguimiento)
CREATE TABLE IF NOT EXISTS tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    tracking_data TEXT, -- JSON con datos del tracking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_patient_name ON evaluations(patient_name);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_patient_name ON meal_plans(patient_name);
CREATE INDEX IF NOT EXISTS idx_monitoring_user_id ON monitoring_records(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_user_id ON tracking(user_id);

