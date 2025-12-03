import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

/**
 * Genera un plan alimenticio personalizado usando DeepSeek
 */
export async function generateMealPlan(patientData, evaluationData, considerations = '') {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY no está configurada');
  }

  const prompt = `Eres un nutricionista experto especializado en diabetes y control glucémico. 
Genera un plan alimenticio personalizado de 7 días (lunes a domingo) para el siguiente paciente:

Datos del paciente:
- Nombre: ${patientData.patientName}
- Edad: ${evaluationData.age || 'N/A'} años
- Peso: ${evaluationData.weight || 'N/A'} kg
- Altura: ${evaluationData.height || 'N/A'} cm
- IMC: ${evaluationData.imc || 'N/A'}
- Glucosa en ayunas: ${evaluationData.glucoseFasting || 'N/A'} mg/dL
- Estado glucémico: ${evaluationData.glucoseStatus || 'N/A'}

Consideraciones especiales: ${considerations || 'Ninguna'}

Genera un plan alimenticio completo con:
1. Desayuno, comida y cena para cada día de la semana
2. Alimentos apropiados para el control glucémico
3. Porciones adecuadas
4. Bebidas recomendadas

Responde SOLO con un JSON válido en este formato:
{
  "menuType": "Plan Personalizado",
  "description": "Descripción del plan",
  "meals": {
    "lunes": {
      "desayuno": ["alimento1", "alimento2"],
      "comida": ["alimento1", "alimento2"],
      "cena": ["alimento1", "alimento2"]
    },
    ... (para todos los días)
  }
}`;

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Eres un nutricionista experto. Responde siempre en formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Intentar extraer JSON del contenido
    let jsonContent = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }

    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error al generar plan con DeepSeek:', error.response?.data || error.message);
    throw new Error('Error al generar plan alimenticio con IA');
  }
}

/**
 * Genera análisis y recomendaciones usando DeepSeek
 */
export async function generateMonitoringAnalysis(patientData, evaluations, mealPlans, trackingRecords) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY no está configurada');
  }

  const latestEvaluation = evaluations[0] || {};
  const latestPlan = mealPlans[0] || {};

  // Análisis de tendencias
  let weightTrend = 'estable';
  let glucoseTrend = 'estable';
  
  if (evaluations.length >= 2) {
    const currentWeight = parseFloat(evaluations[0].weight);
    const previousWeight = parseFloat(evaluations[1].weight);
    const weightDiff = currentWeight - previousWeight;
    
    if (weightDiff > 1) weightTrend = 'aumento';
    else if (weightDiff < -1) weightTrend = 'descenso';
    
    const currentGlucose = parseFloat(evaluations[0].glucoseFasting);
    const previousGlucose = parseFloat(evaluations[1].glucoseFasting);
    const glucoseDiff = currentGlucose - previousGlucose;
    
    if (glucoseDiff > 10) glucoseTrend = 'aumento';
    else if (glucoseDiff < -10) glucoseTrend = 'descenso';
  }

  const prompt = `Eres un nutricionista experto. Analiza el siguiente historial de un paciente y genera recomendaciones personalizadas:

Paciente: ${patientData.patientName}
Número de evaluaciones: ${evaluations.length}
Número de planes alimenticios: ${mealPlans.length}
Estado glucémico actual: ${latestEvaluation.glucoseStatus || 'Sin evaluar'}
Peso actual: ${latestEvaluation.weight || 'N/A'} kg
Glucosa actual: ${latestEvaluation.glucoseFasting || 'N/A'} mg/dL
IMC actual: ${latestEvaluation.bmi || 'N/A'}
Tendencia de peso: ${weightTrend}
Tendencia de glucosa: ${glucoseTrend}

Genera un análisis con recomendaciones específicas y accionables. Responde SOLO con un JSON válido:
{
  "recommendations": ["recomendación1", "recomendación2", ...],
  "analysis": "Análisis detallado del estado del paciente",
  "priority": "alta|media|baja"
}`;

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Eres un nutricionista experto. Responde siempre en formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Intentar extraer JSON del contenido
    let jsonContent = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }

    const aiAnalysis = JSON.parse(jsonContent);

    return {
      patientName: patientData.patientName,
      evaluationCount: evaluations.length,
      planCount: mealPlans.length,
      trackingCount: trackingRecords.length,
      currentStatus: latestEvaluation.glucoseStatus || 'Sin evaluar',
      weightTrend,
      glucoseTrend,
      adherenceLevel: mealPlans.length > 0 ? 'buena' : 'sin plan asignado',
      currentWeight: latestEvaluation.weight || 'N/A',
      currentGlucose: latestEvaluation.glucoseFasting || 'N/A',
      currentBMI: latestEvaluation.bmi || 'N/A',
      currentPlan: latestPlan.menuTypeName || 'Sin plan asignado',
      recommendations: aiAnalysis.recommendations || [],
      aiAnalysis: aiAnalysis.analysis || '',
      priority: aiAnalysis.priority || 'media',
      createdDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error al generar análisis con DeepSeek:', error.response?.data || error.message);
    
    // Fallback a análisis básico si falla la IA
    return {
      patientName: patientData.patientName,
      evaluationCount: evaluations.length,
      planCount: mealPlans.length,
      trackingCount: trackingRecords.length,
      currentStatus: latestEvaluation.glucoseStatus || 'Sin evaluar',
      weightTrend,
      glucoseTrend,
      adherenceLevel: mealPlans.length > 0 ? 'buena' : 'sin plan asignado',
      currentWeight: latestEvaluation.weight || 'N/A',
      currentGlucose: latestEvaluation.glucoseFasting || 'N/A',
      currentBMI: latestEvaluation.bmi || 'N/A',
      currentPlan: latestPlan.menuTypeName || 'Sin plan asignado',
      recommendations: [
        'Continuar con el plan alimenticio actual',
        'Mantener monitoreo regular',
        'Seguir las recomendaciones del nutricionista'
      ],
      createdDate: new Date().toISOString()
    };
  }
}

