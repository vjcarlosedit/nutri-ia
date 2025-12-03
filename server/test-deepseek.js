// Script para probar DeepSeek AI
require('dotenv').config();
const axios = require('axios');

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

console.log('🤖 Probando integración con DeepSeek AI...\n');

if (!DEEPSEEK_API_KEY) {
  console.error('❌ DEEPSEEK_API_KEY no está configurada en el archivo .env');
  process.exit(1);
}

console.log('✅ API Key encontrada');
console.log('📡 URL:', DEEPSEEK_API_URL);
console.log('🔑 API Key:', DEEPSEEK_API_KEY.substring(0, 10) + '...\n');

// Test 1: Llamada simple a DeepSeek
async function testSimpleCall() {
  console.log('🧪 Test 1: Llamada simple a DeepSeek...');
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Responde solo con "OK" si puedes leer este mensaje.'
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    console.log('✅ Respuesta recibida:', content);
    return true;
  } catch (error) {
    console.error('❌ Error en llamada simple:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Generar plan alimenticio
async function testMealPlanGeneration() {
  console.log('\n🧪 Test 2: Generar plan alimenticio...');
  try {
    const patientData = {
      full_name: 'Juan Pérez',
      age: 35,
      gender: 'Masculino'
    };

    const evaluationData = {
      bmi: 25.5,
      glucose_level: 95,
      glucose_status: 'Normal',
      activity_level: 'Moderado',
      medical_conditions: 'Ninguna',
      medications: 'Ninguno',
      allergies: 'Ninguna',
      dietary_preferences: 'Vegetariano'
    };

    const systemPrompt = `Eres un nutricionista experto especializado en crear planes alimenticios personalizados. 
Debes generar planes alimenticios completos, balanceados y adaptados a las necesidades específicas de cada paciente.
Responde SOLO con un JSON válido, sin texto adicional.`;

    const userPrompt = `Genera un plan alimenticio completo para una semana (7 días) para el siguiente paciente:

Datos del paciente:
- Nombre: ${patientData.full_name}
- Edad: ${patientData.age}
- Género: ${patientData.gender}
- IMC: ${evaluationData.bmi}
- Nivel de glucosa: ${evaluationData.glucose_level} (Estado: ${evaluationData.glucose_status})
- Nivel de actividad: ${evaluationData.activity_level}
- Condiciones médicas: ${evaluationData.medical_conditions}
- Medicamentos: ${evaluationData.medications}
- Alergias: ${evaluationData.allergies}
- Preferencias dietéticas: ${evaluationData.dietary_preferences}

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

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    console.log('✅ Plan generado (primeros 500 caracteres):');
    console.log(content.substring(0, 500) + '...\n');

    // Intentar parsear JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON válido parseado');
        console.log('📋 Semana:', plan.week);
        console.log('🍽️ Días con comidas:', Object.keys(plan.meals || {}).length);
        console.log('💡 Recomendaciones:', plan.recommendations?.substring(0, 100) || 'N/A');
        return true;
      } else {
        console.log('⚠️ No se encontró JSON en la respuesta, pero la llamada fue exitosa');
        return true;
      }
    } catch (parseError) {
      console.log('⚠️ No se pudo parsear JSON, pero la respuesta fue recibida');
      return true;
    }
  } catch (error) {
    console.error('❌ Error al generar plan:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('🔑 Error de autenticación: Verifica que tu API key sea válida');
    }
    return false;
  }
}

// Test 3: Análisis de monitoreo
async function testMonitoringAnalysis() {
  console.log('\n🧪 Test 3: Análisis de monitoreo...');
  try {
    const systemPrompt = `Eres un nutricionista experto que analiza la evolución de pacientes.
Proporciona análisis detallados, recomendaciones específicas y sugerencias de ajuste al plan alimenticio.`;

    const userPrompt = `Analiza la evolución del siguiente paciente:

Datos del paciente:
- Nombre: María González
- Edad: 28
- Género: Femenino

Historial de evaluaciones: 2 evaluaciones en los últimos 3 meses
Planes alimenticios asignados: 1 plan
Registros de seguimiento: 3 registros

Proporciona un análisis completo que incluya:
1. Evolución de indicadores clave (peso, glucosa, etc.)
2. Adherencia al plan alimenticio
3. Recomendaciones de ajuste
4. Alertas o preocupaciones
5. Próximos pasos sugeridos

Responde en formato de texto estructurado y profesional.`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    console.log('✅ Análisis generado (primeros 300 caracteres):');
    console.log(content.substring(0, 300) + '...\n');
    return true;
  } catch (error) {
    console.error('❌ Error en análisis:', error.response?.data || error.message);
    return false;
  }
}

// Ejecutar todos los tests
(async () => {
  console.log('='.repeat(50));
  const results = {
    simple: await testSimpleCall(),
    mealPlan: await testMealPlanGeneration(),
    monitoring: await testMonitoringAnalysis()
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen de Tests:');
  console.log('='.repeat(50));
  console.log('✅ Llamada simple:', results.simple ? 'PASÓ' : 'FALLÓ');
  console.log('✅ Generación de plan:', results.mealPlan ? 'PASÓ' : 'FALLÓ');
  console.log('✅ Análisis de monitoreo:', results.monitoring ? 'PASÓ' : 'FALLÓ');
  console.log('='.repeat(50));

  const allPassed = Object.values(results).every(r => r);
  if (allPassed) {
    console.log('\n🎉 ¡Todos los tests pasaron! DeepSeek AI está funcionando correctamente.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Algunos tests fallaron. Revisa los errores arriba.');
    process.exit(1);
  }
})();

