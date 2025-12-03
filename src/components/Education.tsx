import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, BookOpen, Video, FileText, Utensils, Heart, Activity, CheckCircle, Calendar, Brain, Database, Settings, Save, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Footer } from './Footer';

interface EducationProps {
  onBack: () => void;
}

interface EducationalResource {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'article' | 'guide' | 'recipe';
  description: string;
  content: string[];
  tips: string[];
  icon: any;
  color: string;
  targetConditions: string[];
}

export function Education({ onBack }: EducationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [recommendedResources, setRecommendedResources] = useState<EducationalResource[]>([]);
  const [saved, setSaved] = useState(false);

  const processingSteps = [
    { icon: Database, text: 'Analizando perfil del paciente...', delay: 800 },
    { icon: Activity, text: 'Evaluando condiciones clínicas...', delay: 1000 },
    { icon: Brain, text: 'Seleccionando recursos apropiados...', delay: 1200 },
    { icon: Settings, text: 'Personalizando recomendaciones...', delay: 1000 },
    { icon: CheckCircle, text: 'Recursos educativos listos', delay: 600 }
  ];

  const categories = [
    { id: 'control-glucemico', name: 'Control Glucémico', icon: Activity, color: 'from-blue-500 to-cyan-500' },
    { id: 'nutricion-general', name: 'Nutrición General', icon: BookOpen, color: 'from-emerald-500 to-green-500' },
    { id: 'recetas-saludables', name: 'Recetas Saludables', icon: Utensils, color: 'from-orange-500 to-amber-500' },
    { id: 'prevencion', name: 'Prevención', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 'estilo-vida', name: 'Estilo de Vida', icon: Lightbulb, color: 'from-purple-500 to-indigo-500' }
  ];

  const educationalLibrary: EducationalResource[] = [
    // Control Glucémico
    {
      id: 'control-glucosa-1',
      title: 'Guía Completa de Control Glucémico',
      category: 'Control Glucémico',
      type: 'guide',
      description: 'Manual detallado para mantener niveles óptimos de glucosa en sangre',
      content: [
        'Niveles normales de glucosa: en ayunas 70-100 mg/dL, después de comer menos de 140 mg/dL',
        'Importancia del monitoreo regular para prevenir complicaciones',
        'Factores que afectan la glucosa: alimentación, ejercicio, estrés, medicamentos',
        'Horarios recomendados para medir glucosa: en ayunas, antes de comidas, 2 horas después de comer',
        'Qué hacer cuando los niveles están altos o bajos'
      ],
      tips: [
        'Lleva un registro diario de tus mediciones',
        'Mide tu glucosa siempre a la misma hora',
        'No olvides lavar tus manos antes de medir',
        'Consulta con tu médico si tienes lecturas fuera de rango'
      ],
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },
    {
      id: 'control-glucosa-2',
      title: 'Índice Glucémico de los Alimentos',
      category: 'Control Glucémico',
      type: 'article',
      description: 'Tabla completa de alimentos y su impacto en la glucosa',
      content: [
        'Alimentos de bajo índice glucémico (IG < 55): legumbres, vegetales sin almidón, frutos rojos',
        'Alimentos de IG medio (56-69): arroz integral, pan integral, plátano',
        'Alimentos de IG alto (> 70): pan blanco, arroz blanco, papas, dulces',
        'Cómo combinar alimentos para reducir el IG de las comidas',
        'Beneficios de elegir alimentos de bajo IG'
      ],
      tips: [
        'Prefiere granos enteros sobre refinados',
        'Agrega proteína y grasas saludables a tus comidas',
        'Cocina las pastas al dente para menor IG',
        'Las legumbres son excelentes opciones de bajo IG'
      ],
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      targetConditions: ['Diabetes', 'Prediabetes']
    },
    {
      id: 'control-glucosa-3',
      title: 'Manejo de Hipoglucemias',
      category: 'Control Glucémico',
      type: 'guide',
      description: 'Protocolo de emergencia para niveles bajos de glucosa',
      content: [
        'Síntomas de hipoglucemia: temblores, sudoración, mareos, confusión, hambre intensa',
        'Regla 15-15: consume 15g de carbohidratos rápidos y espera 15 minutos',
        'Carbohidratos de acción rápida: jugo, miel, tabletas de glucosa',
        'Cuándo buscar ayuda médica inmediata',
        'Prevención de hipoglucemias nocturnas'
      ],
      tips: [
        'Siempre lleva contigo una fuente de azúcar rápida',
        'Usa una pulsera de identificación médica',
        'Informa a familiares sobre cómo ayudarte',
        'No conduzcas si sospechas hipoglucemia'
      ],
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      targetConditions: ['Diabetes']
    },

    // Nutrición General
    {
      id: 'nutricion-1',
      title: 'Fundamentos de Nutrición para Diabéticos',
      category: 'Nutrición General',
      type: 'guide',
      description: 'Conceptos esenciales de macronutrientes y planificación',
      content: [
        'Carbohidratos: 45-60% de calorías diarias, preferir complejos',
        'Proteínas: 15-20% de calorías, esenciales para mantener masa muscular',
        'Grasas: 25-35% de calorías, priorizar insaturadas',
        'Fibra: mínimo 25-30g diarios para control glucémico',
        'Importancia de horarios regulares de comida'
      ],
      tips: [
        'Divide tus comidas en 5-6 tiempos al día',
        'Incluye proteína en cada comida',
        'No te saltes el desayuno',
        'Mantén porciones controladas'
      ],
      icon: BookOpen,
      color: 'from-emerald-500 to-green-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },
    {
      id: 'nutricion-2',
      title: 'El Plato del Bien Comer Adaptado',
      category: 'Nutrición General',
      type: 'article',
      description: 'Proporciones ideales para pacientes con diabetes',
      content: [
        '1/2 del plato: vegetales sin almidón (espinacas, brócoli, lechuga, tomate)',
        '1/4 del plato: proteínas magras (pollo, pescado, legumbres, tofu)',
        '1/4 del plato: carbohidratos complejos (arroz integral, quinoa, frijoles)',
        'Complementa con fruta pequeña y lácteo bajo en grasa',
        'Método visual para controlar porciones sin pesar'
      ],
      tips: [
        'Usa platos más pequeños para controlar porciones',
        'Llena primero con vegetales',
        'Varía los colores en tu plato',
        'Bebe agua durante las comidas'
      ],
      icon: FileText,
      color: 'from-emerald-500 to-green-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },
    {
      id: 'nutricion-3',
      title: 'Lectura de Etiquetas Nutricionales',
      category: 'Nutrición General',
      type: 'video',
      description: 'Aprende a identificar información clave en los productos',
      content: [
        'Tamaño de porción: base para todos los valores nutricionales',
        'Carbohidratos totales vs azúcares: importancia de la fibra',
        'Lista de ingredientes: los primeros 3 son los más abundantes',
        'Claims engañosos: "sin azúcar" puede tener carbohidratos',
        'Cómo identificar azúcares ocultos (jarabe, miel, dextrosa)'
      ],
      tips: [
        'Busca productos con menos de 5g de azúcar por porción',
        'Prefiere alimentos con más de 3g de fibra',
        'Evita grasas trans (aceites hidrogenados)',
        'Compara marcas antes de comprar'
      ],
      icon: Video,
      color: 'from-emerald-500 to-green-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },

    // Recetas Saludables
    {
      id: 'receta-1',
      title: '20 Desayunos para Diabéticos',
      category: 'Recetas Saludables',
      type: 'recipe',
      description: 'Opciones nutritivas y deliciosas para iniciar el día',
      content: [
        'Opción 1: Avena con frutos rojos y nueces',
        'Opción 2: Huevos revueltos con espinacas y aguacate',
        'Opción 3: Yogurt griego con semillas de chía',
        'Opción 4: Pan integral con queso panela y jitomate',
        'Opción 5: Smoothie verde con proteína',
        'Todas las opciones incluyen información nutricional completa'
      ],
      tips: [
        'Prepara ingredientes la noche anterior',
        'Incluye siempre proteína en el desayuno',
        'Evita jugos, prefiere fruta entera',
        'Desayuna dentro de la primera hora al despertar'
      ],
      icon: Utensils,
      color: 'from-orange-500 to-amber-500',
      targetConditions: ['Diabetes', 'Prediabetes']
    },
    {
      id: 'receta-2',
      title: 'Snacks Saludables Sin Azúcar',
      category: 'Recetas Saludables',
      type: 'recipe',
      description: 'Colaciones bajas en carbohidratos para control glucémico',
      content: [
        'Snack 1: Palitos de zanahoria con hummus (8g carbs)',
        'Snack 2: Almendras con queso (5g carbs)',
        'Snack 3: Pepino con tajín y limón (3g carbs)',
        'Snack 4: Rollitos de pavo con aguacate (2g carbs)',
        'Snack 5: Jícama con chile piquín (6g carbs)',
        'Porciones recomendadas y timing ideal'
      ],
      tips: [
        'Prepara porciones individuales con anticipación',
        'Ten snacks disponibles en casa y trabajo',
        'Come un snack cada 3-4 horas',
        'Combina siempre proteína con carbohidrato'
      ],
      icon: Utensils,
      color: 'from-orange-500 to-amber-500',
      targetConditions: ['Diabetes', 'Prediabetes']
    },
    {
      id: 'receta-3',
      title: 'Cenas Ligeras y Nutritivas',
      category: 'Recetas Saludables',
      type: 'recipe',
      description: '15 recetas de cenas balanceadas y bajas en calorías',
      content: [
        'Cena 1: Salmón al horno con vegetales asados',
        'Cena 2: Ensalada de pollo con aderezo ligero',
        'Cena 3: Calabacitas rellenas de carne molida',
        'Cena 4: Sopa de verduras con pollo deshebrado',
        'Cena 5: Tacos de lechuga con pescado',
        'Recetas completas con tiempo de preparación'
      ],
      tips: [
        'Cena al menos 2 horas antes de dormir',
        'Evita carbohidratos refinados en la noche',
        'Prefiere proteínas magras',
        'Incluye vegetales de hoja verde'
      ],
      icon: Utensils,
      color: 'from-orange-500 to-amber-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },

    // Prevención
    {
      id: 'prevencion-1',
      title: 'Prevención de Complicaciones Diabéticas',
      category: 'Prevención',
      type: 'guide',
      description: 'Cuidados esenciales para evitar complicaciones a largo plazo',
      content: [
        'Exámenes de la vista: revisión anual con oftalmólogo',
        'Cuidado renal: análisis de creatinina y microalbuminuria',
        'Salud cardiovascular: control de presión y colesterol',
        'Neuropatía: revisión de sensibilidad en pies',
        'Control de HbA1c: cada 3 meses para ajustar tratamiento'
      ],
      tips: [
        'Mantén un registro de todas tus citas médicas',
        'No faltes a tus revisiones periódicas',
        'Comunica cualquier síntoma nuevo a tu médico',
        'Mantén actualizada tu cartilla de vacunación'
      ],
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      targetConditions: ['Diabetes']
    },
    {
      id: 'prevencion-2',
      title: 'Cuidado Diario de los Pies',
      category: 'Prevención',
      type: 'article',
      description: 'Protocolo para prevenir pie diabético',
      content: [
        'Inspección diaria: revisa entre los dedos, plantas y talones',
        'Higiene: lava con agua tibia y jabón neutro, seca bien',
        'Hidratación: aplica crema excepto entre los dedos',
        'Calzado: usa zapatos cómodos, evita caminar descalzo',
        'Señales de alarma: heridas, cambios de color, dolor'
      ],
      tips: [
        'Usa un espejo para revisar las plantas',
        'Corta uñas en línea recta',
        'Usa calcetines de algodón sin costuras',
        'Acude al podólogo cada 2-3 meses'
      ],
      icon: FileText,
      color: 'from-red-500 to-pink-500',
      targetConditions: ['Diabetes']
    },
    {
      id: 'prevencion-3',
      title: 'Ejercicio Seguro para Diabéticos',
      category: 'Prevención',
      type: 'video',
      description: 'Rutinas de ejercicio adaptadas y seguras',
      content: [
        'Ejercicio aeróbico: 150 min/semana de intensidad moderada',
        'Entrenamiento de fuerza: 2-3 veces por semana',
        'Flexibilidad: estiramientos diarios',
        'Precauciones: medir glucosa antes y después',
        'Cuándo evitar ejercicio: glucosa >250 mg/dL con cetonas'
      ],
      tips: [
        'Empieza gradualmente y aumenta intensidad',
        'Lleva contigo fuente de carbohidratos',
        'Usa calzado deportivo adecuado',
        'Hidrátate antes, durante y después'
      ],
      icon: Video,
      color: 'from-red-500 to-pink-500',
      targetConditions: ['Diabetes', 'Prediabetes']
    },

    // Estilo de Vida
    {
      id: 'estilo-1',
      title: 'Manejo del Estrés y Diabetes',
      category: 'Estilo de Vida',
      type: 'article',
      description: 'Impacto del estrés en los niveles de glucosa',
      content: [
        'El estrés libera cortisol y adrenalina que elevan la glucosa',
        'Técnicas de relajación: respiración profunda, meditación',
        'Importancia del sueño: 7-9 horas por noche',
        'Actividades recreativas para reducir estrés',
        'Cuándo buscar apoyo psicológico profesional'
      ],
      tips: [
        'Practica 10 minutos de respiración diaria',
        'Establece horarios regulares de sueño',
        'Comparte tus preocupaciones con seres queridos',
        'Considera yoga o tai chi'
      ],
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },
    {
      id: 'estilo-2',
      title: 'Planificación de Comidas Semanales',
      category: 'Estilo de Vida',
      type: 'guide',
      description: 'Sistema práctico para organizar tu alimentación',
      content: [
        'Planifica el menú semanal cada domingo',
        'Haz lista de compras basada en el menú',
        'Batch cooking: cocina en lotes y congela',
        'Prepara vegetales cortados con anticipación',
        'Plantillas de menús semanales descargables'
      ],
      tips: [
        'Dedica 1-2 horas el fin de semana a preparar',
        'Invierte en contenedores para porciones',
        'Congela en porciones individuales',
        'Rota tus recetas para no aburrirte'
      ],
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    },
    {
      id: 'estilo-3',
      title: 'Comer Fuera con Diabetes',
      category: 'Estilo de Vida',
      type: 'video',
      description: 'Tips para elegir opciones saludables en restaurantes',
      content: [
        'Revisa el menú en línea antes de ir',
        'Pide aderezos y salsas aparte',
        'Sustituye papas fritas por ensalada',
        'Comparte postres o pide fruta fresca',
        'No llegues con hambre excesiva al restaurante'
      ],
      tips: [
        'Come un snack saludable antes de salir',
        'Pide que no traigan pan a la mesa',
        'Elige métodos de cocción saludables',
        'Toma mucha agua durante la comida'
      ],
      icon: Video,
      color: 'from-purple-500 to-indigo-500',
      targetConditions: ['Diabetes', 'Prediabetes', 'Normal']
    }
  ];

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const allEvaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    const patientsMap = new Map();
    
    allEvaluations.forEach((e: any) => {
      const patientKey = e.patientName;
      if (!patientsMap.has(patientKey) || new Date(e.date) > new Date(patientsMap.get(patientKey).lastEvaluation)) {
        patientsMap.set(patientKey, {
          name: e.patientName,
          firstName: e.firstName || '',
          paternalLastName: e.paternalLastName || '',
          maternalLastName: e.maternalLastName || '',
          age: e.age || '',
          gender: e.gender || '',
          glucoseStatus: e.glucoseStatus,
          bmi: e.bmi,
          bmiCategory: e.bmiCategory,
          lastEvaluation: e.date,
          evaluation: e
        });
      }
    });
    
    const uniquePatients = Array.from(patientsMap.values());
    setPatients(uniquePatients);
  };

  const handlePatientSelect = (patientName: string) => {
    setSelectedPatient(patientName);
    const patient = patients.find(p => p.name === patientName);
    setSelectedPatientData(patient);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedStep1 = () => {
    return selectedPatient !== '' && selectedCategory !== '';
  };

  const startAnalysis = async () => {
    setProcessing(true);
    setCurrentStep(3);

    // Simular procesamiento paso a paso
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].delay));
    }

    // Sistema experto selecciona recursos basándose en condiciones del paciente
    const patientCondition = selectedPatientData.glucoseStatus;
    
    // Filtrar recursos por categoría seleccionada
    let filteredByCategory = educationalLibrary.filter(
      resource => resource.category === categories.find(c => c.id === selectedCategory)?.name
    );

    // Filtrar por condiciones del paciente
    let recommendedList = filteredByCategory.filter(
      resource => resource.targetConditions.includes(patientCondition)
    );

    // Si no hay suficientes recursos, agregar algunos generales
    if (recommendedList.length < 2) {
      const generalResources = filteredByCategory.filter(
        resource => resource.targetConditions.includes('Normal')
      );
      recommendedList = [...recommendedList, ...generalResources];
    }

    // Limitar a 3-4 recursos principales
    recommendedList = recommendedList.slice(0, 4);

    setRecommendedResources(recommendedList);

    await new Promise(resolve => setTimeout(resolve, 500));
    setProcessing(false);
    setCurrentStep(4);
  };

  const handleSaveResources = () => {
    if (recommendedResources.length === 0) return;

    const assignment = {
      patientName: selectedPatient,
      category: categories.find(c => c.id === selectedCategory)?.name,
      resources: recommendedResources.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        type: r.type,
        description: r.description
      })),
      assignedDate: new Date().toISOString()
    };

    const allAssignments = JSON.parse(localStorage.getItem('nutriia_educational_resources') || '[]');
    allAssignments.push(assignment);
    localStorage.setItem('nutriia_educational_resources', JSON.stringify(allAssignments));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleNewEducation = () => {
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedPatientData(null);
    setSelectedCategory('');
    setRecommendedResources([]);
    setProcessingStep(0);
    setSaved(false);
    loadPatients();
  };

  const progressPercentage = (currentStep / 4) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'recipe': return <Utensils className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'article': return 'Artículo';
      case 'guide': return 'Guía';
      case 'recipe': return 'Receta';
      default: return 'Recurso';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="text-white">Educación Nutricional</h1>
          <p className="text-emerald-100">Sistema Experto de Recursos Educativos</p>
        </div>
      </div>

      {/* Progress Bar - Separado del header */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-emerald-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-600 to-green-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-emerald-600">
          <span className={currentStep >= 1 ? 'text-emerald-900' : ''}>1. Paciente</span>
          <span className={currentStep >= 2 ? 'text-emerald-900' : ''}>2. Categoría</span>
          <span className={currentStep >= 3 ? 'text-emerald-900' : ''}>3. Análisis</span>
          <span className={currentStep >= 4 ? 'text-emerald-900' : ''}>4. Recursos</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Paso 1: Seleccionar Paciente */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Seleccionar Paciente</h2>
                <p className="text-emerald-600">Elige el paciente para asignar recursos</p>
              </div>
            </div>

            <div className="space-y-4">
              {patients.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="patient" className="text-emerald-900">Paciente *</Label>
                    <select
                      id="patient"
                      value={selectedPatient}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      className="w-full h-[42px] px-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 appearance-none bg-white"
                      style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
                    >
                      <option value="">Selecciona un paciente</option>
                      {patients.map((patient, index) => (
                        <option key={index} value={patient.name}>
                          {patient.name} - {patient.glucoseStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatientData && (
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-emerald-600" />
                        <p className="text-emerald-900 font-medium">{selectedPatientData.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-emerald-600 text-xs">Estado Glucémico</p>
                          <p className="text-emerald-900 font-medium">{selectedPatientData.glucoseStatus}</p>
                        </div>
                        <div>
                          <p className="text-emerald-600 text-xs">Categoría IMC</p>
                          <p className="text-emerald-900">{selectedPatientData.bmiCategory}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">
                    No hay pacientes disponibles. Primero realiza una evaluación nutricional.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={!selectedPatient}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Seleccionar Categoría de Recurso */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Categoría de Recurso Educativo</h2>
                  <p className="text-emerald-600">Selecciona el tema de interés</p>
                </div>
              </div>

              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-emerald-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-emerald-900 font-medium">{category.name}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={startAnalysis}
                disabled={!canProceedStep1()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Analizar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Análisis del Sistema Experto */}
        {currentStep === 3 && processing && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Análisis del Sistema Experto</h2>
                <p className="text-emerald-600">Seleccionando recursos personalizados</p>
              </div>
            </div>

            <div className="space-y-3">
              {processingSteps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index < processingStep;
                const isCurrent = index === processingStep;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      isComplete
                        ? 'border-green-500 bg-green-50'
                        : isCurrent
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      isComplete ? 'text-green-600' : isCurrent ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <p className={`flex-1 ${
                      isComplete ? 'text-green-900' : isCurrent ? 'text-emerald-900' : 'text-gray-500'
                    }`}>
                      {step.text}
                    </p>
                    {isComplete && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Paso 4: Recursos Recomendados */}
        {currentStep === 4 && recommendedResources.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Recursos Recomendados</h2>
                  <p className="text-emerald-600">{selectedPatientData?.name} • {categories.find(c => c.id === selectedCategory)?.name}</p>
                </div>
              </div>

              {/* Información del Paciente */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-5">
                <p className="text-emerald-900 font-medium mb-2">
                  Recursos seleccionados según:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-emerald-600 text-xs">Estado</p>
                    <p className="text-emerald-900">{selectedPatientData?.glucoseStatus}</p>
                  </div>
                  <div>
                    <p className="text-emerald-600 text-xs">Categoría IMC</p>
                    <p className="text-emerald-900">{selectedPatientData?.bmiCategory}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Recursos */}
              <div className="space-y-4 mb-6">
                {recommendedResources.map((resource, index) => {
                  const Icon = resource.icon;
                  
                  return (
                    <div key={resource.id} className="border border-emerald-200 rounded-lg p-4 bg-gradient-to-br from-white to-emerald-50">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${resource.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-emerald-900 font-medium mb-1">{resource.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-white rounded-lg text-emerald-700 text-xs border border-emerald-200 flex items-center gap-1">
                              {getTypeIcon(resource.type)}
                              {getTypeLabel(resource.type)}
                            </span>
                            <span className="text-emerald-600 text-xs">{resource.category}</span>
                          </div>
                          <p className="text-emerald-600 text-sm mb-3">{resource.description}</p>
                        </div>
                      </div>

                      {/* Contenido del Recurso */}
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <h4 className="text-emerald-900 font-medium text-sm mb-2">📚 Contenido:</h4>
                        <ul className="space-y-1">
                          {resource.content.map((item, idx) => (
                            <li key={idx} className="text-emerald-700 text-sm flex items-start gap-2">
                              <span className="text-emerald-500 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips Prácticos */}
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <h4 className="text-yellow-900 font-medium text-sm mb-2">💡 Tips Prácticos:</h4>
                        <ul className="space-y-1">
                          {resource.tips.map((tip, idx) => (
                            <li key={idx} className="text-yellow-800 text-sm flex items-start gap-2">
                              <span className="text-yellow-600 flex-shrink-0">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-emerald-600 text-sm mb-6">
                <Calendar className="w-4 h-4" />
                <p>
                  Recursos generados el {new Date().toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Mensaje de Guardado */}
              {saved && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center mb-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>✓ Recursos educativos guardados exitosamente</span>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveResources}
                  disabled={saved}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saved ? 'Recursos Guardados' : 'Guardar Recursos'}
                </Button>
                <Button
                  onClick={handleNewEducation}
                  variant="outline"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Nueva Asignación
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
