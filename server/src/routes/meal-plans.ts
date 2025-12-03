import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { query, queryOne, run } from '../db/database';
import { generateMealPlan } from '../services/deepseek';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todos los planes alimenticios
router.get('/', (req: AuthRequest, res) => {
  try {
    const plans = query('SELECT * FROM meal_plans WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);

    res.json(plans.map((plan: any) => ({
      ...plan,
      plan_data: plan.plan_data ? JSON.parse(plan.plan_data) : null,
    })));
  } catch (error: any) {
    console.error('Error al obtener planes alimenticios:', error);
    res.status(500).json({ error: 'Error al obtener planes alimenticios' });
  }
});

// Obtener planes por paciente
router.get('/patient/:patientName', (req: AuthRequest, res) => {
  try {
    const { patientName } = req.params;
    const plans = query('SELECT * FROM meal_plans WHERE user_id = ? AND patient_name = ? ORDER BY created_at DESC', [req.userId, patientName]);

    res.json(plans.map((plan: any) => ({
      ...plan,
      plan_data: plan.plan_data ? JSON.parse(plan.plan_data) : null,
    })));
  } catch (error: any) {
    console.error('Error al obtener planes del paciente:', error);
    res.status(500).json({ error: 'Error al obtener planes del paciente' });
  }
});

// Generar plan alimenticio con IA
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const { patientName, evaluationId, considerations } = req.body;

    if (!patientName) {
      return res.status(400).json({ error: 'Nombre del paciente es requerido' });
    }

    // Obtener datos del paciente y evaluación
    let evaluation = null;
    let patientData = null;

    if (evaluationId) {
      evaluation = queryOne('SELECT * FROM evaluations WHERE id = ? AND user_id = ?', [evaluationId, req.userId]) as any;
    } else {
      // Obtener la evaluación más reciente del paciente
      const evaluations = query('SELECT * FROM evaluations WHERE user_id = ? AND patient_name = ? ORDER BY date DESC LIMIT 1', [req.userId, patientName]);
      evaluation = evaluations.length > 0 ? evaluations[0] : null;
    }

    if (!evaluation) {
      return res.status(404).json({ error: 'No se encontró evaluación para este paciente' });
    }

    // Obtener datos del paciente
    const patient = queryOne('SELECT * FROM patients WHERE user_id = ? AND full_name = ?', [req.userId, patientName]) as any;

    patientData = patient || {
      full_name: patientName,
      age: evaluation.age,
      gender: evaluation.gender,
    };

    // Generar plan con DeepSeek
    const generatedPlan = await generateMealPlan(patientData, evaluation, considerations);

    // Guardar plan en la base de datos
    const result = run(`
      INSERT INTO meal_plans (
        user_id, patient_id, patient_name, evaluation_id, week_number, menu_type,
        considerations, plan_data, generated_by_ai
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId,
      patient ? patient.id : null,
      patientName,
      evaluation.id,
      generatedPlan.week || 1,
      generatedPlan.menuType || 0,
      considerations || null,
      JSON.stringify(generatedPlan),
      true
    ]);

    const savedPlan = queryOne('SELECT * FROM meal_plans WHERE id = ?', [result.lastInsertRowid]) as any;

    res.status(201).json({
      ...savedPlan,
      plan_data: JSON.parse(savedPlan.plan_data),
    });
  } catch (error: any) {
    console.error('Error al generar plan alimenticio:', error);
    res.status(500).json({ error: error.message || 'Error al generar plan alimenticio' });
  }
});

// Crear plan alimenticio manualmente
router.post('/', (req: AuthRequest, res) => {
  try {
    const { patientName, evaluationId, weekNumber, menuType, planData } = req.body;

    if (!patientName || !planData) {
      return res.status(400).json({ error: 'Nombre del paciente y datos del plan son requeridos' });
    }

    const patient = queryOne('SELECT id FROM patients WHERE user_id = ? AND full_name = ?', [req.userId, patientName]) as any;

    const result = run(`
      INSERT INTO meal_plans (
        user_id, patient_id, patient_name, evaluation_id, week_number, menu_type, plan_data, generated_by_ai
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId,
      patient ? patient.id : null,
      patientName,
      evaluationId || null,
      weekNumber || 1,
      menuType || 0,
      JSON.stringify(planData),
      false
    ]);

    const savedPlan = queryOne('SELECT * FROM meal_plans WHERE id = ?', [result.lastInsertRowid]) as any;

    res.status(201).json({
      ...savedPlan,
      plan_data: JSON.parse(savedPlan.plan_data),
    });
  } catch (error: any) {
    console.error('Error al crear plan alimenticio:', error);
    res.status(500).json({ error: 'Error al crear plan alimenticio' });
  }
});

export default router;

