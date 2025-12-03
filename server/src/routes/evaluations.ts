import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { query, queryOne, run } from '../db/database';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todas las evaluaciones del usuario
router.get('/', (req: AuthRequest, res) => {
  try {
    const evaluations = query('SELECT * FROM evaluations WHERE user_id = ? ORDER BY date DESC', [req.userId]);

    res.json(evaluations.map((eval: any) => ({
      ...eval,
      evaluation_data: eval.evaluation_data ? JSON.parse(eval.evaluation_data) : null,
    })));
  } catch (error: any) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// Obtener evaluaciones por paciente
router.get('/patient/:patientName', (req: AuthRequest, res) => {
  try {
    const { patientName } = req.params;
    const evaluations = query(
      'SELECT * FROM evaluations WHERE user_id = ? AND patient_name = ? ORDER BY date DESC',
      [req.userId, patientName]
    );

    res.json(evaluations.map((eval: any) => ({
      ...eval,
      evaluation_data: eval.evaluation_data ? JSON.parse(eval.evaluation_data) : null,
    })));
  } catch (error: any) {
    console.error('Error al obtener evaluaciones del paciente:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones del paciente' });
  }
});

// Crear nueva evaluación
router.post('/', (req: AuthRequest, res) => {
  try {
    const evaluationData = req.body;
    const {
      patientName,
      firstName,
      paternalLastName,
      maternalLastName,
      age,
      gender,
      weight,
      height,
      bmi,
      glucoseLevel,
      glucoseStatus,
      bloodPressure,
      activityLevel,
      medicalConditions,
      medications,
      allergies,
      dietaryPreferences,
      evaluation_data,
    } = evaluationData;

    // Buscar o crear paciente
    let patientId = null;
    if (patientName) {
      const existingPatient = queryOne('SELECT id FROM patients WHERE user_id = ? AND full_name = ?', [req.userId, patientName]);

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const patientResult = run(
          'INSERT INTO patients (user_id, first_name, paternal_last_name, maternal_last_name, full_name, age, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [req.userId, firstName || '', paternalLastName || '', maternalLastName || '', patientName, age || null, gender || null]
        );
        patientId = patientResult.lastInsertRowid;
      }
    }

    // Insertar evaluación
    const result = run(`
      INSERT INTO evaluations (
        user_id, patient_id, patient_name, first_name, paternal_last_name, maternal_last_name,
        age, gender, weight, height, bmi, glucose_level, glucose_status, blood_pressure,
        activity_level, medical_conditions, medications, allergies, dietary_preferences, evaluation_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId,
      patientId,
      patientName || '',
      firstName || '',
      paternalLastName || '',
      maternalLastName || '',
      age || null,
      gender || null,
      weight || null,
      height || null,
      bmi || null,
      glucoseLevel || null,
      glucoseStatus || null,
      bloodPressure || null,
      activityLevel || null,
      medicalConditions || null,
      medications || null,
      allergies || null,
      dietaryPreferences || null,
      evaluation_data ? JSON.stringify(evaluation_data) : null
    ]);

    const evaluation = queryOne('SELECT * FROM evaluations WHERE id = ?', [result.lastInsertRowid]) as any;

    res.status(201).json({
      ...evaluation,
      evaluation_data: evaluation.evaluation_data ? JSON.parse(evaluation.evaluation_data) : null,
    });
  } catch (error: any) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({ error: 'Error al crear evaluación' });
  }
});

// Obtener estadísticas
router.get('/stats', (req: AuthRequest, res) => {
  try {
    const totalEvaluations = queryOne('SELECT COUNT(*) as count FROM evaluations WHERE user_id = ?', [req.userId]) as any;

    const today = new Date().toISOString().split('T')[0];
    const todayEvaluations = queryOne('SELECT COUNT(*) as count FROM evaluations WHERE user_id = ? AND date(date) = ?', [req.userId, today]) as any;

    const todayMealPlans = queryOne('SELECT COUNT(*) as count FROM meal_plans WHERE user_id = ? AND date(created_at) = ?', [req.userId, today]) as any;

    const activePatients = queryOne('SELECT COUNT(DISTINCT patient_name) as count FROM evaluations WHERE user_id = ?', [req.userId]) as any;

    res.json({
      totalEvaluations: totalEvaluations?.count || 0,
      todayConsultations: (todayEvaluations?.count || 0) + (todayMealPlans?.count || 0),
      activePatients: activePatients?.count || 0,
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;

