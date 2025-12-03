import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las evaluaciones del usuario
router.get('/', (req, res) => {
  try {
    const evaluations = db.prepare(`
      SELECT * FROM evaluations 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.id);

    // Parsear JSON almacenado
    const parsedEvaluations = evaluations.map(eval => ({
      ...eval,
      evaluation_data: JSON.parse(eval.evaluation_data || '{}')
    }));

    res.json(parsedEvaluations);
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// Obtener evaluaciones por paciente
router.get('/patient/:patientName', (req, res) => {
  try {
    const { patientName } = req.params;
    const evaluations = db.prepare(`
      SELECT * FROM evaluations 
      WHERE user_id = ? AND patient_name = ?
      ORDER BY created_at DESC
    `).all(req.user.id, patientName);

    const parsedEvaluations = evaluations.map(eval => ({
      ...eval,
      evaluation_data: JSON.parse(eval.evaluation_data || '{}')
    }));

    res.json(parsedEvaluations);
  } catch (error) {
    console.error('Error al obtener evaluaciones del paciente:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// Crear nueva evaluación
router.post('/', (req, res) => {
  try {
    const {
      patientName,
      firstName,
      paternalLastName,
      maternalLastName,
      age,
      gender,
      weight,
      height,
      imc,
      glucoseFasting,
      glucoseStatus,
      bmi,
      ...evaluationData
    } = req.body;

    const fullEvaluationData = {
      ...req.body,
      date: new Date().toISOString()
    };

    const result = db.prepare(`
      INSERT INTO evaluations (
        user_id, patient_name, first_name, paternal_last_name, maternal_last_name,
        age, gender, weight, height, imc, glucose_fasting, glucose_status, bmi, evaluation_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      patientName,
      firstName,
      paternalLastName,
      maternalLastName,
      age,
      gender,
      weight,
      height,
      imc,
      glucoseFasting,
      glucoseStatus,
      bmi,
      JSON.stringify(fullEvaluationData)
    );

    const newEvaluation = db.prepare('SELECT * FROM evaluations WHERE id = ?').get(result.lastInsertRowid);
    newEvaluation.evaluation_data = JSON.parse(newEvaluation.evaluation_data);

    res.status(201).json(newEvaluation);
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({ error: 'Error al crear evaluación' });
  }
});

// Obtener estadísticas
router.get('/stats', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalEvaluations = db.prepare(`
      SELECT COUNT(*) as count FROM evaluations WHERE user_id = ?
    `).get(req.user.id).count;

    const todayEvaluations = db.prepare(`
      SELECT COUNT(*) as count FROM evaluations 
      WHERE user_id = ? AND DATE(created_at) = ?
    `).get(req.user.id, today).count;

    const uniquePatients = db.prepare(`
      SELECT COUNT(DISTINCT patient_name) as count 
      FROM evaluations WHERE user_id = ?
    `).get(req.user.id).count;

    res.json({
      totalEvaluations,
      todayConsultations: todayEvaluations,
      activePatients: uniquePatients
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;

