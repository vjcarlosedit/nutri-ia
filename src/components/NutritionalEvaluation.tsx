import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, Calendar, Scale, Ruler, Activity, Droplet, TestTube, Brain, Database, Settings, CheckCircle, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Footer } from './Footer';

interface NutritionalEvaluationProps {
  onBack: () => void;
}

export function NutritionalEvaluation({ onBack }: NutritionalEvaluationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientType, setPatientType] = useState<'new' | 'existing'>('new');
  const [existingPatients, setExistingPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [formData, setFormData] = useState({
    // Información Personal
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    age: '',
    gender: '',
    // Datos Antropométricos
    weight: '',
    height: '',
    waist: '',
    hip: '',
    // Datos Clínicos
    glucoseFasting: '',
    glucosePostprandial: '',
    hba1c: '',
    bloodPressure: '',
    cholesterol: '',
    triglycerides: '',
    // Observaciones
    medicalHistory: '',
    currentMedication: '',
    dietaryHabits: '',
    physicalActivity: ''
  });

  const [evaluation, setEvaluation] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  useEffect(() => {
    loadExistingPatients();
  }, []);

  const loadExistingPatients = () => {
    const evaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    
    // Crear un mapa para obtener pacientes únicos con su última evaluación
    const patientsMap = new Map();
    
    evaluations.forEach((e: any) => {
      const patientKey = e.patientName;
      if (!patientsMap.has(patientKey) || new Date(e.date) > new Date(patientsMap.get(patientKey).lastEvaluation)) {
        patientsMap.set(patientKey, {
          id: patientKey,
          name: patientKey,
          firstName: e.firstName || '',
          paternalLastName: e.paternalLastName || '',
          maternalLastName: e.maternalLastName || '',
          age: e.age || '',
          gender: e.gender || '',
          lastEvaluation: e.date
        });
      }
    });
    
    const uniquePatients = Array.from(patientsMap.values());
    setExistingPatients(uniquePatients);
    console.log('Pacientes cargados:', uniquePatients); // Para debug
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = existingPatients.find(p => p.id === patientId);
    console.log('Paciente seleccionado:', patient); // Para debug
    if (patient) {
      setFormData(prev => ({
        ...prev,
        firstName: patient.firstName,
        paternalLastName: patient.paternalLastName,
        maternalLastName: patient.maternalLastName,
        age: patient.age.toString(),
        gender: patient.gender,
        // Limpiar datos clínicos y antropométricos para nueva evaluación
        weight: '',
        height: '',
        waist: '',
        hip: '',
        glucoseFasting: '',
        glucosePostprandial: '',
        hba1c: '',
        bloodPressure: '',
        cholesterol: '',
        triglycerides: '',
        medicalHistory: '',
        currentMedication: '',
        dietaryHabits: '',
        physicalActivity: ''
      }));
    }
  };

  const handlePatientTypeChange = (type: 'new' | 'existing') => {
    setPatientType(type);
    setSelectedPatientId('');
    if (type === 'new') {
      // Limpiar todos los datos para nuevo paciente
      setFormData({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        age: '',
        gender: '',
        weight: '',
        height: '',
        waist: '',
        hip: '',
        glucoseFasting: '',
        glucosePostprandial: '',
        hba1c: '',
        bloodPressure: '',
        cholesterol: '',
        triglycerides: '',
        medicalHistory: '',
        currentMedication: '',
        dietaryHabits: '',
        physicalActivity: ''
      });
    }
  };

  const processingSteps = [
    { icon: Database, text: 'Accediendo a base de conocimientos...', delay: 800 },
    { icon: Brain, text: 'Activando motor de inferencia...', delay: 1000 },
    { icon: Activity, text: 'Analizando datos antropométricos...', delay: 900 },
    { icon: Droplet, text: 'Evaluando control glucémico...', delay: 1000 },
    { icon: CheckCircle, text: 'Generando recomendaciones personalizadas...', delay: 1100 }
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedStep1 = () => {
    // Si es paciente existente, debe haber seleccionado uno
    if (patientType === 'existing' && !selectedPatientId) {
      return false;
    }
    // Validar que los campos requeridos estén llenos
    return formData.firstName && formData.paternalLastName && formData.age && formData.gender;
  };

  const canProceedStep2 = () => {
    return formData.weight && formData.height;
  };

  const canProceedStep3 = () => {
    return formData.glucoseFasting && formData.hba1c;
  };

  const startProcessing = async () => {
    setProcessing(true);
    setCurrentStep(4);

    // Simular procesamiento paso a paso
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].delay));
    }

    // Calcular resultados
    calculateEvaluation();
    
    // Esperar un momento antes de mostrar resultados
    await new Promise(resolve => setTimeout(resolve, 500));
    setProcessing(false);
    setCurrentStep(5);
  };

  const calculateEvaluation = () => {
    // Cálculo del IMC
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    const imc = weight / (height * height);
    const glucoseFasting = parseFloat(formData.glucoseFasting);
    const waist = parseFloat(formData.waist || '0');
    const hba1c = parseFloat(formData.hba1c);

    // Análisis del IMC
    let imcStatus = '';
    let imcRisk = '';
    if (imc < 18.5) {
      imcStatus = 'Bajo peso';
      imcRisk = 'Riesgo de desnutrición';
    } else if (imc < 25) {
      imcStatus = 'Peso normal';
      imcRisk = 'Peso saludable';
    } else if (imc < 30) {
      imcStatus = 'Sobrepeso';
      imcRisk = 'Riesgo moderado';
    } else {
      imcStatus = 'Obesidad';
      imcRisk = 'Riesgo alto';
    }

    // Análisis del estado glucémico
    let glucoseStatus = '';
    let glucoseRisk = '';
    let dietaryPlan = '';
    let exerciseRecommendation = '';
    let monitoringPlan = '';
    let nutritionalGoals: string[] = [];

    if (glucoseFasting < 100) {
      glucoseStatus = 'Normoglucemia';
      glucoseRisk = 'Control glucémico óptimo';
      dietaryPlan = 'Plan alimenticio preventivo balanceado con 50-55% carbohidratos complejos, 15-20% proteínas de alto valor biológico y 25-30% grasas saludables. Énfasis en fibra soluble e insoluble (25-30g/día), consumo regular de frutas y verduras (5 porciones/día).';
      exerciseRecommendation = 'Actividad física aeróbica moderada 150 minutos/semana distribuidos en 5 días. Combinar con ejercicios de resistencia 2-3 veces/semana. Caminar, nadar, ciclismo son excelentes opciones.';
      monitoringPlan = 'Control de glucosa en ayunas cada 6 meses. Revisión de peso mensual. Evaluación nutricional trimestral.';
      nutritionalGoals = [
        'Mantener peso saludable dentro del rango de IMC 18.5-24.9',
        'Consumir al menos 5 porciones de frutas y verduras al día',
        'Limitar azúcares añadidos a menos del 10% de calorías totales',
        'Realizar 3 comidas principales y 2 colaciones',
        'Hidratación adecuada: 2-2.5 litros de agua al día'
      ];
    } else if (glucoseFasting < 126) {
      glucoseStatus = 'Prediabetes';
      glucoseRisk = 'Riesgo elevado de desarrollar diabetes tipo 2';
      dietaryPlan = 'Plan alimenticio hipoglucémico con 40-45% carbohidratos de bajo índice glucémico, 20-25% proteínas magras y 30-35% grasas monoinsaturadas. Reducir carbohidratos simples, eliminar azúcares refinados. Aumentar consumo de fibra a 30-35g/día. Porciones controladas con método del plato (1/2 verduras, 1/4 proteína, 1/4 carbohidratos complejos).';
      exerciseRecommendation = 'Programa estructurado de ejercicio: 200 minutos/semana de actividad aeróbica moderada-vigorosa. Ejercicios de resistencia 3 veces/semana para mejorar sensibilidad a la insulina. Caminar 10,000 pasos diarios como mínimo.';
      monitoringPlan = 'Monitoreo de glucosa en ayunas mensual. Control de HbA1c cada 3 meses. Evaluación antropométrica mensual. Consulta nutricional cada 4-6 semanas con ajustes personalizados.';
      nutritionalGoals = [
        'Reducir peso corporal 5-10% en los próximos 3-6 meses',
        'Mantener glucosa en ayunas <100 mg/dL',
        'Reducir circunferencia de cintura (Hombres <90cm, Mujeres <80cm)',
        'Eliminar bebidas azucaradas y jugos comerciales',
        'Incorporar alimentos de bajo índice glucémico en cada comida',
        'Realizar actividad física 5-6 días a la semana'
      ];
    } else {
      glucoseStatus = 'Diabetes';
      glucoseRisk = 'Requiere control metabólico estricto';
      dietaryPlan = 'Plan alimenticio especializado para diabetes con 35-40% carbohidratos complejos de muy bajo índice glucémico, 25-30% proteínas magras y 30-35% grasas saludables (omega-3, monoinsaturadas). Método de conteo de carbohidratos: 45-60g por comida principal. Timing nutricional: comer cada 3-4 horas. Evitar ayunos prolongados. Aumentar fibra a 35-40g/día. Suplementación con vitaminas B, C, D y magnesio según necesidad.';
      exerciseRecommendation = 'Programa de ejercicio supervisado: 150-300 minutos/semana de actividad aeróbica moderada. Entrenamiento de fuerza 3 veces/semana con peso moderado. Ejercicios de flexibilidad diarios. Monitorear glucosa antes y después del ejercicio. Evitar ejercicio si glucosa >250 mg/dL.';
      monitoringPlan = 'Automonitoreo de glucosa capilar 3-4 veces/día (ayunas, pre y postprandial). HbA1c cada 3 meses con meta <7%. Control de presión arterial semanal. Examen de lípidos cada 3 meses. Consulta con nutriólogo cada 3-4 semanas. Revisión oftalmológica y podológica anual.';
      nutritionalGoals = [
        'Mantener glucosa en ayunas entre 80-130 mg/dL',
        'Glucosa postprandial (2hrs) <180 mg/dL',
        'HbA1c <7% (individualizado según paciente)',
        'Reducir peso 7-10% si hay sobrepeso u obesidad',
        'Presión arterial <130/80 mmHg',
        'Colesterol LDL <100 mg/dL',
        'Triglicéridos <150 mg/dL',
        'Adherencia 100% al plan nutricional y medicación'
      ];
    }

    const evaluationData = {
      imc: imc.toFixed(2),
      imcStatus,
      imcRisk,
      glucoseStatus,
      glucoseRisk,
      dietaryPlan,
      exerciseRecommendation,
      monitoringPlan,
      nutritionalGoals,
      waistCircumference: waist,
      hba1cValue: hba1c
    };

    setEvaluation(evaluationData);

    // Guardar en localStorage
    const fullName = `${formData.firstName} ${formData.paternalLastName} ${formData.maternalLastName}`.trim();
    const evaluationRecord = {
      ...formData,
      ...evaluationData,
      date: new Date().toISOString(),
      patientName: fullName
    };

    const existingEvaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    existingEvaluations.push(evaluationRecord);
    localStorage.setItem('nutriia_evaluations', JSON.stringify(existingEvaluations));
    
    console.log('Evaluación guardada:', evaluationRecord); // Para debug
    console.log('Total evaluaciones:', existingEvaluations.length); // Para debug
  };

  const progressPercentage = (currentStep / 5) * 100;

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
          <h1 className="text-white">Evaluación Nutricional</h1>
          <p className="text-emerald-100">Sistema Experto de Evaluación</p>
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
          <span className={currentStep >= 1 ? 'text-emerald-900' : ''}>1. Información</span>
          <span className={currentStep >= 2 ? 'text-emerald-900' : ''}>2. Antropometría</span>
          <span className={currentStep >= 3 ? 'text-emerald-900' : ''}>3. Clínicos</span>
          <span className={currentStep >= 4 ? 'text-emerald-900' : ''}>4. Análisis</span>
          <span className={currentStep >= 5 ? 'text-emerald-900' : ''}>5. Resultados</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        {/* Paso 1: Información Personal */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Información Personal</h2>
                <p className="text-emerald-600">Datos generales del paciente</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Selector de Tipo de Paciente */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Label className="text-emerald-900 mb-3 block">Tipo de Registro</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="patientType"
                      value="new"
                      checked={patientType === 'new'}
                      onChange={() => handlePatientTypeChange('new')}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-900">Nuevo Paciente</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="patientType"
                      value="existing"
                      checked={patientType === 'existing'}
                      onChange={() => handlePatientTypeChange('existing')}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-900">Paciente Existente</span>
                  </label>
                </div>
              </div>

              {/* Selector de Paciente Existente */}
              {patientType === 'existing' && (
                <div className="space-y-2">
                  <Label htmlFor="existingPatient" className="text-emerald-900">Seleccionar Paciente *</Label>
                  {existingPatients.length > 0 ? (
                    <select
                      id="existingPatient"
                      value={selectedPatientId}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      className="w-full h-[42px] px-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 appearance-none bg-white"
                      style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
                    >
                      <option value="">Selecciona un paciente</option>
                      {existingPatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-emerald-600 text-sm p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      No hay pacientes registrados. Selecciona "Nuevo Paciente" para crear uno.
                    </p>
                  )}
                </div>
              )}

              {/* Formulario de Datos Personales */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-emerald-900">Nombre(s) *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                      patientType === 'existing' && selectedPatientId ? 'bg-emerald-50' : ''
                    }`}
                    placeholder="Nombre(s) del paciente"
                    readOnly={patientType === 'existing' && selectedPatientId !== ''}
                    disabled={patientType === 'existing' && !selectedPatientId}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paternalLastName" className="text-emerald-900">Apellido Paterno *</Label>
                <Input
                  id="paternalLastName"
                  value={formData.paternalLastName}
                  onChange={(e) => handleChange('paternalLastName', e.target.value)}
                  className={`border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                    patientType === 'existing' && selectedPatientId ? 'bg-emerald-50' : ''
                  }`}
                  placeholder="Apellido paterno"
                  readOnly={patientType === 'existing' && selectedPatientId !== ''}
                  disabled={patientType === 'existing' && !selectedPatientId}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maternalLastName" className="text-emerald-900">Apellido Materno</Label>
                <Input
                  id="maternalLastName"
                  value={formData.maternalLastName}
                  onChange={(e) => handleChange('maternalLastName', e.target.value)}
                  className={`border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                    patientType === 'existing' && selectedPatientId ? 'bg-emerald-50' : ''
                  }`}
                  placeholder="Apellido materno"
                  readOnly={patientType === 'existing' && selectedPatientId !== ''}
                  disabled={patientType === 'existing' && !selectedPatientId}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-emerald-900">Edad (años) *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className={`pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 ${
                        patientType === 'existing' && selectedPatientId ? 'bg-emerald-50' : ''
                      }`}
                      placeholder="Edad"
                      readOnly={patientType === 'existing' && selectedPatientId !== ''}
                      disabled={patientType === 'existing' && !selectedPatientId}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-emerald-900">Sexo *</Label>
                  <div className="relative">
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className={`w-full h-[42px] px-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 appearance-none bg-white ${
                        patientType === 'existing' && selectedPatientId ? 'bg-emerald-50' : ''
                      }`}
                      style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
                      disabled={patientType === 'existing'}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={!canProceedStep1()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Datos Antropométricos */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Datos Antropométricos</h2>
                <p className="text-emerald-600">Medidas corporales del paciente</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-emerald-900">Peso (kg) *</Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-emerald-900">Estatura (cm) *</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-emerald-900">Cintura (cm)</Label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="waist"
                      type="number"
                      value={formData.waist}
                      onChange={(e) => handleChange('waist', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-emerald-900">Cadera (cm)</Label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="hip"
                      type="number"
                      value={formData.hip}
                      onChange={(e) => handleChange('hip', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalActivity" className="text-emerald-900">Nivel de Actividad Física</Label>
                <select
                  id="physicalActivity"
                  value={formData.physicalActivity}
                  onChange={(e) => handleChange('physicalActivity', e.target.value)}
                  className="w-full h-[42px] px-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 appearance-none bg-white"
                  style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
                >
                  <option value="">Seleccionar</option>
                  <option value="Sedentario">Sedentario (poco o ningún ejercicio)</option>
                  <option value="Ligero">Ligero (ejercicio 1-3 días/semana)</option>
                  <option value="Moderado">Moderado (ejercicio 3-5 días/semana)</option>
                  <option value="Activo">Activo (ejercicio 6-7 días/semana)</option>
                  <option value="Muy Activo">Muy Activo (ejercicio intenso diario)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedStep2()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Datos Clínicos */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Datos Clínicos</h2>
                <p className="text-emerald-600">Información médica y análisis clínicos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="glucoseFasting" className="text-emerald-900">Glucosa Ayunas (mg/dL) *</Label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="glucoseFasting"
                      type="number"
                      value={formData.glucoseFasting}
                      onChange={(e) => handleChange('glucoseFasting', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="mg/dL"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucosePostprandial" className="text-emerald-900">Postprandial (mg/dL)</Label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="glucosePostprandial"
                      type="number"
                      value={formData.glucosePostprandial}
                      onChange={(e) => handleChange('glucosePostprandial', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="mg/dL"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="hba1c" className="text-emerald-900">HbA1c (%) *</Label>
                  <div className="relative">
                    <TestTube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input
                      id="hba1c"
                      type="number"
                      step="0.1"
                      value={formData.hba1c}
                      onChange={(e) => handleChange('hba1c', e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="text-emerald-900">Presión Arterial</Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => handleChange('bloodPressure', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="120/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cholesterol" className="text-emerald-900">Colesterol (mg/dL)</Label>
                  <Input
                    id="cholesterol"
                    type="number"
                    value={formData.cholesterol}
                    onChange={(e) => handleChange('cholesterol', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="triglycerides" className="text-emerald-900">Triglicéridos (mg/dL)</Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    value={formData.triglycerides}
                    onChange={(e) => handleChange('triglycerides', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-emerald-900">Antecedentes Médicos</Label>
                <textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange('medicalHistory', e.target.value)}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 min-h-20"
                  placeholder="Enfermedades previas, cirugías, alergias..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedication" className="text-emerald-900">Medicación Actual</Label>
                <textarea
                  id="currentMedication"
                  value={formData.currentMedication}
                  onChange={(e) => handleChange('currentMedication', e.target.value)}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 min-h-16"
                  placeholder="Medicamentos que toma actualmente..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryHabits" className="text-emerald-900">Hábitos Alimentarios</Label>
                <textarea
                  id="dietaryHabits"
                  value={formData.dietaryHabits}
                  onChange={(e) => handleChange('dietaryHabits', e.target.value)}
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 min-h-16"
                  placeholder="Descripción de alimentación habitual, horarios, preferencias..."
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={startProcessing}
                disabled={!canProceedStep3()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Iniciar Análisis
                <Brain className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 4: Sistema Experto (Procesamiento) */}
        {currentStep === 4 && processing && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8 mb-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center animate-pulse">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-emerald-900 mb-2">Sistema Experto Procesando</h2>
              <p className="text-emerald-600 mb-8">Analizando información del paciente...</p>

              <div className="space-y-4 max-w-md mx-auto">
                {processingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === processingStep;
                  const isCompleted = index < processingStep;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-emerald-50 border-2 border-emerald-500'
                          : isCompleted
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200 opacity-50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          isActive
                            ? 'bg-emerald-500 animate-pulse'
                            : isCompleted
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <StepIcon className="w-5 h-5 text-white" />
                      </div>
                      <p
                        className={`text-sm text-left ${
                          isActive
                            ? 'text-emerald-900'
                            : isCompleted
                            ? 'text-green-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.text}
                      </p>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Paso 5: Resultados */}
        {currentStep === 5 && evaluation && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Resultados de Evaluación</h2>
                  <p className="text-emerald-600">Paciente: {`${formData.firstName} ${formData.paternalLastName} ${formData.maternalLastName}`.trim()}</p>
                </div>
              </div>

              {/* Estado General */}
              <div className={`rounded-xl border p-5 mb-4 ${
                evaluation.imcStatus === 'Peso normal' && evaluation.glucoseStatus === 'Normoglucemia' 
                  ? 'bg-green-50 border-green-200' 
                  : evaluation.glucoseStatus === 'Diabetes' || evaluation.imcStatus === 'Obesidad'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <h3 className={`mb-4 ${
                  evaluation.imcStatus === 'Peso normal' && evaluation.glucoseStatus === 'Normoglucemia' 
                    ? 'text-green-900' 
                    : evaluation.glucoseStatus === 'Diabetes' || evaluation.imcStatus === 'Obesidad'
                    ? 'text-red-900'
                    : 'text-amber-900'
                }`}>Estado General del Paciente</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 bg-white rounded-lg border ${
                    evaluation.imcStatus === 'Peso normal' ? 'border-green-200' :
                    evaluation.imcStatus === 'Sobrepeso' ? 'border-amber-200' :
                    evaluation.imcStatus === 'Obesidad' ? 'border-red-200' :
                    'border-blue-200'
                  }`}>
                    <p className="text-emerald-600 mb-1">Índice de Masa Corporal</p>
                    <p className={`mb-1 ${
                      evaluation.imcStatus === 'Peso normal' ? 'text-green-700' :
                      evaluation.imcStatus === 'Sobrepeso' ? 'text-amber-700' :
                      evaluation.imcStatus === 'Obesidad' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>{evaluation.imc} kg/m²</p>
                    <p className="text-emerald-700">{evaluation.imcStatus}</p>
                    <p className="text-emerald-600 text-xs mt-1">{evaluation.imcRisk}</p>
                  </div>

                  <div className={`p-4 bg-white rounded-lg border ${
                    evaluation.glucoseStatus === 'Normoglucemia' ? 'border-green-200' :
                    evaluation.glucoseStatus === 'Prediabetes' ? 'border-amber-200' :
                    'border-red-200'
                  }`}>
                    <p className="text-emerald-600 mb-1">Estado Glucémico</p>
                    <p className={`mb-1 ${
                      evaluation.glucoseStatus === 'Normoglucemia' ? 'text-green-700' :
                      evaluation.glucoseStatus === 'Prediabetes' ? 'text-amber-700' :
                      'text-red-700'
                    }`}>{evaluation.glucoseStatus}</p>
                    <p className="text-emerald-600 text-xs mt-1">{evaluation.glucoseRisk}</p>
                  </div>
                </div>
              </div>

              {/* Recomendaciones */}
              <h3 className="text-emerald-900 mb-4">Recomendaciones del Sistema Experto</h3>

              {/* Plan Dietético */}
              <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <h4 className="text-emerald-900 mb-2 flex items-center gap-2">
                  🥗 Plan Dietético Personalizado
                </h4>
                <p className="text-emerald-700 text-sm leading-relaxed">{evaluation.dietaryPlan}</p>
              </div>

              {/* Actividad Física */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h4 className="text-blue-900 mb-2 flex items-center gap-2">
                  💪 Recomendaciones de Actividad Física
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">{evaluation.exerciseRecommendation}</p>
              </div>

              {/* Plan de Monitoreo */}
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="text-purple-900 mb-2 flex items-center gap-2">
                  📊 Plan de Monitoreo y Seguimiento
                </h4>
                <p className="text-purple-700 text-sm leading-relaxed">{evaluation.monitoringPlan}</p>
              </div>

              {/* Objetivos Nutricionales */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <h4 className="text-amber-900 mb-3 flex items-center gap-2">
                  🎯 Objetivos Nutricionales
                </h4>
                <ul className="space-y-2">
                  {evaluation.nutritionalGoals.map((goal: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-amber-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                onClick={onBack}
              >
                Ir al Dashboard
              </Button>
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setCurrentStep(1);
                  setEvaluation(null);
                  setPatientType('new');
                  setSelectedPatientId('');
                  setFormData({
                    firstName: '',
                    paternalLastName: '',
                    maternalLastName: '',
                    age: '',
                    gender: '',
                    weight: '',
                    height: '',
                    waist: '',
                    hip: '',
                    glucoseFasting: '',
                    glucosePostprandial: '',
                    hba1c: '',
                    bloodPressure: '',
                    cholesterol: '',
                    triglycerides: '',
                    medicalHistory: '',
                    currentMedication: '',
                    dietaryHabits: '',
                    physicalActivity: ''
                  });
                  // Recargar la lista de pacientes
                  loadExistingPatients();
                }}
              >
                Nueva Evaluación
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
