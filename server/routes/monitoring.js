import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateMonitoringAnalysis } from '../services/deepseek.js';

const router = express.Router();

router.use(authenticateToken);

// Obtener todos los registros de monitoreo
router.get('/', (req, res) => {
  try {
    const records = db.prepare(`
      SELECT * FROM monitoring_records 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.id);

    const parsedRecords = records.map(record => ({
      ...record,
      recommendations: JSON.parse(record.recommendations || '[]'),
      analysis_data: JSON.parse(record.analysis_data || '{}')
    }));

    res.json(parsedRecords);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ error: 'Error al obtener registros de monitoreo' });
  }
});

// Generar análisis con IA
router.post('/analyze', async (req, res) => {
  try {
    const { patientName } = req.body;

    // Obtener evaluaciones del paciente
    const evaluations = db.prepare(`
      SELECT * FROM evaluations 
      WHERE user_id = ? AND patient_name = ?
      ORDER BY created_at DESC
    `).all(req.user.id, patientName);

    // Obtener planes del paciente
    const mealPlans = db.prepare(`
      SELECT * FROM meal_plans 
      WHERE user_id = ? AND patient_name = ?
      ORDER BY created_at DESC
    `).all(req.user.id, patientName);

    // Obtener tracking del paciente
    const trackingRecords = db.prepare(`
      SELECT * FROM tracking 
      WHERE user_id = ? AND patient_name = ?
      ORDER BY created_at DESC
    `).all(req.user.id, patientName);

    // Parsear datos
    const parsedEvaluations = evaluations.map(e => ({
      ...e,
      evaluation_data: JSON.parse(e.evaluation_data || '{}')
    }));

    const parsedMealPlans = mealPlans.map(p => ({
      ...p,
      plan_data: JSON.parse(p.plan_data || '{}')
    }));

    // Generar análisis con IA
    const analysis = await generateMonitoringAnalysis(
      { patientName },
      parsedEvaluations,
      parsedMealPlans,
      trackingRecords
    );

    // Guardar análisis en la base de datos
    const result = db.prepare(`
      INSERT INTO monitoring_records (
        user_id, patient_name, evaluation_count, plan_count, tracking_count,
        current_status, weight_trend, glucose_trend, adherence_level,
        current_weight, current_glucose, current_bmi, current_plan,
        recommendations, analysis_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      analysis.patientName,
      analysis.evaluationCount,
      analysis.planCount,
      analysis.trackingCount,
      analysis.currentStatus,
      analysis.weightTrend,
      analysis.glucoseTrend,
      analysis.adherenceLevel,
      analysis.currentWeight,
      analysis.currentGlucose,
      analysis.currentBMI,
      analysis.currentPlan,
      JSON.stringify(analysis.recommendations),
      JSON.stringify(analysis)
    );

    const savedRecord = db.prepare('SELECT * FROM monitoring_records WHERE id = ?').get(result.lastInsertRowid);
    savedRecord.recommendations = JSON.parse(savedRecord.recommendations);
    savedRecord.analysis_data = JSON.parse(savedRecord.analysis_data);

    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error al generar análisis:', error);
    res.status(500).json({ 
      error: 'Error al generar análisis',
      details: error.message 
    });
  }
});

// Guardar tracking
router.post('/tracking', (req, res) => {
  try {
    const { patientName, trackingData } = req.body;

    const result = db.prepare(`
      INSERT INTO tracking (user_id, patient_name, tracking_data)
      VALUES (?, ?, ?)
    `).run(
      req.user.id,
      patientName,
      JSON.stringify(trackingData)
    );

    const savedTracking = db.prepare('SELECT * FROM tracking WHERE id = ?').get(result.lastInsertRowid);
    savedTracking.tracking_data = JSON.parse(savedTracking.tracking_data);

    res.status(201).json(savedTracking);
  } catch (error) {
    console.error('Error al guardar tracking:', error);
    res.status(500).json({ error: 'Error al guardar tracking' });
  }
});

// Obtener pacientes únicos
router.get('/patients', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT DISTINCT patient_name, 
             MAX(created_at) as last_evaluation,
             COUNT(*) as evaluation_count
      FROM evaluations 
      WHERE user_id = ?
      GROUP BY patient_name
      ORDER BY last_evaluation DESC
    `).all(req.user.id);

    res.json(patients);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

export default router;

