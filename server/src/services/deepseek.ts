import axios from 'axios';

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  temperature: number = 0.7
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY no está configurada');
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
        temperature,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error al llamar a DeepSeek:', error.response?.data || error.message);
    throw new Error(`Error de DeepSeek: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function generateMealPlan(
  patientData: any,
  evaluationData: any,
  considerations?: string
): Promise<any> {
  const systemPrompt = `Eres un nutricionista experto especializado en crear planes alimenticios personalizados. 
Debes generar planes alimenticios completos, balanceados y adaptados a las necesidades específicas de cada paciente.
Responde SOLO con un JSON válido, sin texto adicional.`;

  const userPrompt = `Genera un plan alimenticio completo para una semana (7 días) para el siguiente paciente:

Datos del paciente:
- Nombre: ${patientData.full_name || patientData.patientName}
- Edad: ${patientData.age || 'No especificada'}
- Género: ${patientData.gender || 'No especificado'}
- IMC: ${evaluationData.bmi || 'No calculado'}
- Nivel de glucosa: ${evaluationData.glucose_level || 'No especificado'} (Estado: ${evaluationData.glucose_status || 'Normal'})
- Nivel de actividad: ${evaluationData.activity_level || 'Moderado'}
- Condiciones médicas: ${evaluationData.medical_conditions || 'Ninguna'}
- Medicamentos: ${evaluationData.medications || 'Ninguno'}
- Alergias: ${evaluationData.allergies || 'Ninguna'}
- Preferencias dietéticas: ${evaluationData.dietary_preferences || 'Ninguna'}
${considerations ? `\nConsideraciones adicionales: ${considerations}` : ''}

Genera un plan alimenticio con la siguiente estructura JSON:
{
  "week": 1,
  "menuType": 0,
  "meals": {
    "lunes": {
      "desayuno": ["comida1", "comida2", "bebida"],
      "comida": ["comida1", "comida2", "acompañamiento", "bebida"],
      "cena": ["comida1", "comida2", "acompañamiento"]
    },
    "martes": { ... },
    "miercoles": { ... },
    "jueves": { ... },
    "viernes": { ... },
    "sabado": { ... },
    "domingo": { ... }
  },
  "recommendations": "Recomendaciones generales para el paciente"
}

Asegúrate de que:
- Las comidas sean balanceadas nutricionalmente
- Consideres el estado de glucosa y ajustes los carbohidratos
- Incluyas alimentos apropiados para las condiciones médicas
- Respetes las alergias y preferencias dietéticas
- Las porciones sean apropiadas`;

  const response = await callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], 0.8);

  try {
    // Intentar extraer JSON de la respuesta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No se encontró JSON en la respuesta');
  } catch (error) {
    console.error('Error al parsear respuesta de DeepSeek:', error);
    // Si falla, devolver un plan por defecto estructurado
    return {
      week: 1,
      menuType: 0,
      meals: generateDefaultMealPlan(),
      recommendations: response.substring(0, 500) || 'Sigue las recomendaciones de tu nutricionista',
    };
  }
}

function generateDefaultMealPlan() {
  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const meals: any = {};
  
  days.forEach(day => {
    meals[day] = {
      desayuno: ['Avena con frutas', 'Yogurt', 'Té'],
      comida: ['Ensalada', 'Proteína', 'Carbohidrato', 'Agua'],
      cena: ['Sopa', 'Proteína ligera', 'Verduras'],
    };
  });
  
  return meals;
}

export async function analyzeMonitoring(
  patientData: any,
  evaluations: any[],
  mealPlans: any[],
  trackingRecords: any[]
): Promise<string> {
  const systemPrompt = `Eres un nutricionista experto que analiza la evolución de pacientes.
Proporciona análisis detallados, recomendaciones específicas y sugerencias de ajuste al plan alimenticio.`;

  const userPrompt = `Analiza la evolución del siguiente paciente:

Datos del paciente:
- Nombre: ${patientData.full_name || patientData.name}
- Edad: ${patientData.age || 'No especificada'}
- Género: ${patientData.gender || 'No especificado'}

Historial de evaluaciones: ${JSON.stringify(evaluations.slice(0, 3), null, 2)}
Planes alimenticios asignados: ${mealPlans.length} planes
Registros de seguimiento: ${trackingRecords.length} registros

Proporciona un análisis completo que incluya:
1. Evolución de indicadores clave (peso, glucosa, etc.)
2. Adherencia al plan alimenticio
3. Recomendaciones de ajuste
4. Alertas o preocupaciones
5. Próximos pasos sugeridos

Responde en formato de texto estructurado y profesional.`;

  return await callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], 0.7);
}

