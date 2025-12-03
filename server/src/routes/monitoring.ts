import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { query, queryOne, run } from '../db/database';
import { analyzeMonitoring } from '../services/deepseek';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todos los registros de monitoreo
router.get('/', (req: AuthRequest, res) => {
  try {
    const records = query('SELECT * FROM monitoring WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);

    res.json(records.map((record: any) => ({
      ...record,
      analysis_result: record.analysis_result ? JSON.parse(record.analysis_result) : null,
    })));
  } catch (error: any) {
    console.error('Error al obtener registros de monitoreo:', error);
    res.status(500).json({ error: 'Error al obtener registros de monitoreo' });
  }
});

// Obtener pacientes únicos
router.get('/patients', (req: AuthRequest, res) => {
  try {
    const patients = query(`
      SELECT DISTINCT 
        patient_name as name,
        first_name,
        paternal_last_name,
        maternal_last_name,
        age,
        gender,
        MAX(e.date) as lastEvaluation
      FROM evaluations e
      WHERE e.user_id = ?
      GROUP BY patient_name
      ORDER BY lastEvaluation DESC
    `, [req.userId]);

    res.json(patients);
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Analizar paciente con IA
router.post('/analyze', async (req: AuthRequest, res) => {
  try {
    const { patientName } = req.body;

    if (!patientName) {
      return res.status(400).json({ error: 'Nombre del paciente es requerido' });
    }

    // Obtener datos del paciente
    const patient = queryOne('SELECT * FROM patients WHERE user_id = ? AND full_name = ?', [req.userId, patientName]) as any;

    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    // Obtener evaluaciones
    const evaluations = query('SELECT * FROM evaluations WHERE user_id = ? AND patient_name = ? ORDER BY date DESC', [req.userId, patientName]);

    // Obtener planes alimenticios
    const mealPlans = query('SELECT * FROM meal_plans WHERE user_id = ? AND patient_name = ? ORDER BY created_at DESC', [req.userId, patientName]);

    // Obtener registros de seguimiento
    const trackingRecords = query('SELECT * FROM monitoring WHERE user_id = ? AND patient_name = ? ORDER BY created_at DESC', [req.userId, patientName]);

    // Analizar con DeepSeek
    const analysis = await analyzeMonitoring(
      patient,
      evaluations,
      mealPlans.map((p: any) => ({ ...p, plan_data: p.plan_data ? JSON.parse(p.plan_data) : null })),
      trackingRecords
    );

    // Guardar análisis
    const result = run(`
      INSERT INTO monitoring (
        user_id, patient_id, patient_name, analysis_result
      ) VALUES (?, ?, ?, ?)
    `, [
      req.userId,
      patient.id,
      patientName,
      JSON.stringify({ analysis, timestamp: new Date().toISOString() })
    ]);

    const savedRecord = queryOne('SELECT * FROM monitoring WHERE id = ?', [result.lastInsertRowid]) as any;

    res.json({
      ...savedRecord,
      analysis_result: JSON.parse(savedRecord.analysis_result),
    });
  } catch (error: any) {
    console.error('Error al analizar paciente:', error);
    res.status(500).json({ error: error.message || 'Error al analizar paciente' });
  }
});

// Guardar registro de seguimiento
router.post('/tracking', (req: AuthRequest, res) => {
  try {
    const { patientName, trackingData } = req.body;

    if (!patientName) {
      return res.status(400).json({ error: 'Nombre del paciente es requerido' });
    }

    const patient = queryOne('SELECT id FROM patients WHERE user_id = ? AND full_name = ?', [req.userId, patientName]) as any;

    const result = run(`
      INSERT INTO monitoring (
        user_id, patient_id, patient_name, weight, glucose_level, blood_pressure, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId,
      patient ? patient.id : null,
      patientName,
      trackingData.weight || null,
      trackingData.glucoseLevel || null,
      trackingData.bloodPressure || null,
      trackingData.notes || null
    ]);

    const savedRecord = queryOne('SELECT * FROM monitoring WHERE id = ?', [result.lastInsertRowid]) as any;

    res.status(201).json(savedRecord);
  } catch (error: any) {
    console.error('Error al guardar seguimiento:', error);
    res.status(500).json({ error: 'Error al guardar seguimiento' });
  }
});

export default router;

