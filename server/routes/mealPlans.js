import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateMealPlan } from '../services/deepseek.js';

const router = express.Router();

router.use(authenticateToken);

// Obtener todos los planes alimenticios
router.get('/', (req, res) => {
  try {
    const mealPlans = db.prepare(`
      SELECT * FROM meal_plans 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.id);

    const parsedPlans = mealPlans.map(plan => ({
      ...plan,
      plan_data: JSON.parse(plan.plan_data || '{}')
    }));

    res.json(parsedPlans);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ error: 'Error al obtener planes alimenticios' });
  }
});

// Obtener planes por paciente
router.get('/patient/:patientName', (req, res) => {
  try {
    const { patientName } = req.params;
    const mealPlans = db.prepare(`
      SELECT * FROM meal_plans 
      WHERE user_id = ? AND patient_name = ?
      ORDER BY created_at DESC
    `).all(req.user.id, patientName);

    const parsedPlans = mealPlans.map(plan => ({
      ...plan,
      plan_data: JSON.parse(plan.plan_data || '{}')
    }));

    res.json(parsedPlans);
  } catch (error) {
    console.error('Error al obtener planes del paciente:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
});

// Generar nuevo plan alimenticio con IA
router.post('/generate', async (req, res) => {
  try {
    const { patientName, evaluationId, considerations } = req.body;

    // Obtener datos de la evaluación
    const evaluation = db.prepare(`
      SELECT * FROM evaluations 
      WHERE id = ? AND user_id = ?
    `).get(evaluationId, req.user.id);

    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }

    const evaluationData = JSON.parse(evaluation.evaluation_data);

    // Generar plan con DeepSeek
    const generatedPlan = await generateMealPlan(
      { patientName },
      evaluationData,
      considerations
    );

    // Guardar plan en la base de datos
    const result = db.prepare(`
      INSERT INTO meal_plans (
        user_id, patient_name, menu_type, menu_type_name, 
        week_number, plan_data, considerations
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      patientName,
      generatedPlan.menuType || 'Plan Personalizado',
      generatedPlan.menuType || 'Plan Personalizado',
      1,
      JSON.stringify(generatedPlan),
      considerations || ''
    );

    const savedPlan = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(result.lastInsertRowid);
    savedPlan.plan_data = JSON.parse(savedPlan.plan_data);

    res.status(201).json(savedPlan);
  } catch (error) {
    console.error('Error al generar plan:', error);
    res.status(500).json({ 
      error: 'Error al generar plan alimenticio',
      details: error.message 
    });
  }
});

// Crear plan manualmente
router.post('/', (req, res) => {
  try {
    const {
      patientName,
      menuType,
      menuTypeName,
      weekNumber,
      planData,
      considerations
    } = req.body;

    const result = db.prepare(`
      INSERT INTO meal_plans (
        user_id, patient_name, menu_type, menu_type_name,
        week_number, plan_data, considerations
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      patientName,
      menuType,
      menuTypeName,
      weekNumber || 1,
      JSON.stringify(planData),
      considerations || ''
    );

    const newPlan = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(result.lastInsertRowid);
    newPlan.plan_data = JSON.parse(newPlan.plan_data);

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ error: 'Error al crear plan alimenticio' });
  }
});

export default router;

