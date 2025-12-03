import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, ClipboardList, Brain, FileText, Activity, Calendar, Scale, Droplet, TrendingUp, TrendingDown, CheckCircle, Database, Settings, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Footer } from './Footer';

interface MonitoringProps {
  onBack: () => void;
}

export function Monitoring({ onBack }: MonitoringProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [trackingRecords, setTrackingRecords] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const processingSteps = [
    { icon: Database, text: 'Cargando historial del paciente...', delay: 800 },
    { icon: Activity, text: 'Analizando evolución de indicadores...', delay: 1000 },
    { icon: Brain, text: 'Evaluando adherencia al plan alimenticio...', delay: 1200 },
    { icon: Settings, text: 'Generando recomendaciones de ajuste...', delay: 1100 },
    { icon: CheckCircle, text: 'Análisis completado exitosamente', delay: 600 }
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
    
    // Cargar historial
    loadPatientHistory(patientName);
  };

  const loadPatientHistory = (patientName: string) => {
    // Cargar evaluaciones
    const allEvaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    const patientEvaluations = allEvaluations
      .filter((e: any) => e.patientName === patientName)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEvaluations(patientEvaluations);
    
    // Cargar planes alimenticios
    const allPlans = JSON.parse(localStorage.getItem('nutriia_meal_plans') || '[]');
    const patientPlans = allPlans
      .filter((p: any) => p.patientName === patientName)
      .sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    setMealPlans(patientPlans);
    
    // Cargar seguimientos previos
    const allTracking = JSON.parse(localStorage.getItem('nutriia_tracking') || '[]');
    const patientTracking = allTracking
      .filter((t: any) => t.patientName === patientName)
      .sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    setTrackingRecords(patientTracking);
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
    return selectedPatient !== '';
  };

  const canProceedStep2 = () => {
    return evaluations.length > 0 || mealPlans.length > 0;
  };

  const startAnalysis = async () => {
    setProcessing(true);
    setCurrentStep(3);

    // Simular procesamiento paso a paso
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].delay));
    }

    // Generar análisis basado en el historial
    const latestEvaluation = evaluations[0];
    const latestPlan = mealPlans[0];
    
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

    // Determinar nivel de adherencia
    const adherenceLevel = mealPlans.length > 0 ? 'buena' : 'sin plan asignado';
    
    // Generar recomendaciones
    let recommendations = [];
    
    if (glucoseTrend === 'aumento') {
      recommendations.push('Reforzar el plan bajo en carbohidratos');
      recommendations.push('Incrementar actividad física a 30 min diarios');
      recommendations.push('Revisar horarios de comidas');
    } else if (glucoseTrend === 'descenso') {
      recommendations.push('Continuar con el plan alimenticio actual');
      recommendations.push('Mantener rutina de actividad física');
      recommendations.push('Monitorear para prevenir hipoglucemias');
    } else {
      recommendations.push('Mantener el plan actual');
      recommendations.push('Continuar con monitoreo regular');
      recommendations.push('Considerar variaciones en el menú');
    }
    
    if (weightTrend === 'aumento') {
      recommendations.push('Ajustar porciones en comidas');
      recommendations.push('Incrementar consumo de vegetales');
    } else if (weightTrend === 'descenso') {
      recommendations.push('Verificar ingesta calórica adecuada');
    }

    const analysis = {
      patientName: selectedPatient,
      evaluationCount: evaluations.length,
      planCount: mealPlans.length,
      trackingCount: trackingRecords.length,
      currentStatus: latestEvaluation?.glucoseStatus || 'Sin evaluar',
      weightTrend,
      glucoseTrend,
      adherenceLevel,
      currentWeight: latestEvaluation?.weight || 'N/A',
      currentGlucose: latestEvaluation?.glucoseFasting || 'N/A',
      currentBMI: latestEvaluation?.bmi || 'N/A',
      currentPlan: latestPlan?.menuType?.name || 'Sin plan asignado',
      recommendations,
      createdDate: new Date().toISOString()
    };

    setAnalysisResult(analysis);

    await new Promise(resolve => setTimeout(resolve, 500));
    setProcessing(false);
    setCurrentStep(4);
  };

  const handleSaveTracking = () => {
    if (!analysisResult) return;

    const allTracking = JSON.parse(localStorage.getItem('nutriia_tracking') || '[]');
    allTracking.push(analysisResult);
    localStorage.setItem('nutriia_tracking', JSON.stringify(allTracking));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleNewTracking = () => {
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedPatientData(null);
    setEvaluations([]);
    setMealPlans([]);
    setTrackingRecords([]);
    setAnalysisResult(null);
    setProcessingStep(0);
    setSaved(false);
    loadPatients();
  };

  const progressPercentage = (currentStep / 4) * 100;

  const getTrendIcon = (trend: string) => {
    if (trend === 'aumento') return <TrendingUp className="w-5 h-5 text-red-600" />;
    if (trend === 'descenso') return <TrendingDown className="w-5 h-5 text-green-600" />;
    return <Activity className="w-5 h-5 text-blue-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'aumento') return 'text-red-600';
    if (trend === 'descenso') return 'text-green-600';
    return 'text-blue-600';
  };

  const getTrendBg = (trend: string) => {
    if (trend === 'aumento') return 'bg-red-50 border-red-200';
    if (trend === 'descenso') return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
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
          <h1 className="text-white">Seguimiento y Ajustes</h1>
          <p className="text-emerald-100">Sistema Experto de Monitoreo</p>
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
          <span className={currentStep >= 2 ? 'text-emerald-900' : ''}>2. Historial</span>
          <span className={currentStep >= 3 ? 'text-emerald-900' : ''}>3. Análisis</span>
          <span className={currentStep >= 4 ? 'text-emerald-900' : ''}>4. Resultados</span>
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
                <p className="text-emerald-600">Elige el paciente para hacer seguimiento</p>
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
                          <p className="text-emerald-600 text-xs">Edad</p>
                          <p className="text-emerald-900">{selectedPatientData.age} años</p>
                        </div>
                        <div>
                          <p className="text-emerald-600 text-xs">Género</p>
                          <p className="text-emerald-900 capitalize">{selectedPatientData.gender}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-emerald-600 text-xs">Estado Glucémico</p>
                          <p className="text-emerald-900 font-medium">{selectedPatientData.glucoseStatus}</p>
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
                disabled={!canProceedStep1()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Historial */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Historial del Paciente</h2>
                  <p className="text-emerald-600">Evaluaciones y planes alimenticios</p>
                </div>
              </div>

              {/* Resumen */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                  <p className="text-emerald-600 text-xs mb-1">Evaluaciones</p>
                  <p className="text-emerald-900 text-2xl font-medium">{evaluations.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="text-blue-600 text-xs mb-1">Planes</p>
                  <p className="text-blue-900 text-2xl font-medium">{mealPlans.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                  <p className="text-purple-600 text-xs mb-1">Seguimientos</p>
                  <p className="text-purple-900 text-2xl font-medium">{trackingRecords.length}</p>
                </div>
              </div>

              {/* Evaluaciones Nutricionales */}
              {evaluations.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-emerald-900 font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Evaluaciones Nutricionales
                  </h3>
                  <div className="space-y-2">
                    {evaluations.slice(0, 3).map((evaluation, index) => (
                      <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-600 text-sm">
                            {new Date(evaluation.date).toLocaleDateString('es-MX', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-emerald-900 font-medium text-sm">{evaluation.glucoseStatus}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-emerald-600">Peso</p>
                            <p className="text-emerald-900">{evaluation.weight} kg</p>
                          </div>
                          <div>
                            <p className="text-emerald-600">IMC</p>
                            <p className="text-emerald-900">{evaluation.bmi}</p>
                          </div>
                          <div>
                            <p className="text-emerald-600">Glucosa</p>
                            <p className="text-emerald-900">{evaluation.glucoseFasting} mg/dL</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {evaluations.length > 3 && (
                      <p className="text-emerald-600 text-sm text-center">
                        +{evaluations.length - 3} evaluaciones más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Planes Alimenticios */}
              {mealPlans.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-emerald-900 font-medium mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    Planes Alimenticios
                  </h3>
                  <div className="space-y-2">
                    {mealPlans.slice(0, 3).map((plan, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-medium">{plan.menuType.name}</span>
                          <span className="text-blue-600 text-sm">Semana {plan.week}</span>
                        </div>
                        <p className="text-blue-700 text-xs">{plan.menuType.description}</p>
                        <p className="text-blue-600 text-xs mt-1">
                          {new Date(plan.createdDate).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    ))}
                    {mealPlans.length > 3 && (
                      <p className="text-blue-600 text-sm text-center">
                        +{mealPlans.length - 3} planes más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Seguimientos Previos */}
              {trackingRecords.length > 0 && (
                <div>
                  <h3 className="text-emerald-900 font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Seguimientos Previos
                  </h3>
                  <div className="space-y-2">
                    {trackingRecords.slice(0, 2).map((tracking, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-purple-900 font-medium text-sm mb-1">
                          {new Date(tracking.createdDate).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-purple-700 text-xs">
                          Estado: {tracking.currentStatus} • {tracking.recommendations.length} recomendaciones
                        </p>
                      </div>
                    ))}
                    {trackingRecords.length > 2 && (
                      <p className="text-purple-600 text-sm text-center">
                        +{trackingRecords.length - 2} seguimientos más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {evaluations.length === 0 && mealPlans.length === 0 && (
                <div className="text-center py-8">
                  <ClipboardList className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                  <p className="text-emerald-600">No hay historial disponible</p>
                  <p className="text-emerald-500 text-sm">Realiza evaluaciones y asigna planes para comenzar</p>
                </div>
              )}
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
                disabled={!canProceedStep2()}
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
                <p className="text-emerald-600">Evaluando progreso del paciente</p>
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

        {/* Paso 4: Resultados del Seguimiento */}
        {currentStep === 4 && analysisResult && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Resultados del Seguimiento</h2>
                  <p className="text-emerald-600">{analysisResult.patientName}</p>
                </div>
              </div>

              {/* Resumen General */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-600 text-xs mb-1">Estado Actual</p>
                  <p className="text-emerald-900 font-medium">{analysisResult.currentStatus}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-600 text-xs mb-1">Plan Actual</p>
                  <p className="text-blue-900 font-medium text-sm">{analysisResult.currentPlan}</p>
                </div>
              </div>

              {/* Indicadores Actuales */}
              <div className="mb-5">
                <h3 className="text-emerald-900 font-medium mb-3">Indicadores Actuales</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Scale className="w-4 h-4 text-purple-600" />
                      <p className="text-purple-600 text-xs">Peso</p>
                    </div>
                    <p className="text-purple-900 font-medium">{analysisResult.currentWeight} kg</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="w-4 h-4 text-orange-600" />
                      <p className="text-orange-600 text-xs">Glucosa</p>
                    </div>
                    <p className="text-orange-900 font-medium">{analysisResult.currentGlucose} mg/dL</p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      <p className="text-cyan-600 text-xs">IMC</p>
                    </div>
                    <p className="text-cyan-900 font-medium">{analysisResult.currentBMI}</p>
                  </div>
                </div>
              </div>

              {/* Análisis de Tendencias */}
              <div className="mb-5">
                <h3 className="text-emerald-900 font-medium mb-3">Análisis de Tendencias</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-lg border ${getTrendBg(analysisResult.weightTrend)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendIcon(analysisResult.weightTrend)}
                      <p className="text-emerald-900 font-medium">Peso</p>
                    </div>
                    <p className={`capitalize ${getTrendColor(analysisResult.weightTrend)}`}>
                      {analysisResult.weightTrend}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border ${getTrendBg(analysisResult.glucoseTrend)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendIcon(analysisResult.glucoseTrend)}
                      <p className="text-emerald-900 font-medium">Glucosa</p>
                    </div>
                    <p className={`capitalize ${getTrendColor(analysisResult.glucoseTrend)}`}>
                      {analysisResult.glucoseTrend}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nivel de Adherencia */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-5">
                <h3 className="text-indigo-900 font-medium mb-2">Nivel de Adherencia al Plan</h3>
                <p className="text-indigo-700 capitalize">{analysisResult.adherenceLevel}</p>
              </div>

              {/* Recomendaciones */}
              <div className="mb-5">
                <h3 className="text-emerald-900 font-medium mb-3">Recomendaciones de Ajuste</h3>
                <div className="space-y-2">
                  {analysisResult.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-900 text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fecha del Análisis */}
              <div className="flex items-center gap-2 text-emerald-600 text-sm mb-6">
                <Calendar className="w-4 h-4" />
                <p>
                  Análisis generado el {new Date(analysisResult.createdDate).toLocaleDateString('es-MX', {
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
                  <span>✓ Seguimiento guardado exitosamente</span>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveTracking}
                  disabled={saved}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {saved ? 'Seguimiento Guardado' : 'Guardar Seguimiento'}
                </Button>
                <Button
                  onClick={handleNewTracking}
                  variant="outline"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Nuevo Seguimiento
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
