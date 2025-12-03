import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, Calendar, ChefHat, FileText, CheckCircle, Database, Brain, Activity, Utensils, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Footer } from './Footer';

interface MealPlansProps {
  onBack: () => void;
}

export function MealPlans({ onBack }: MealPlansProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [selectedMenuType, setSelectedMenuType] = useState<number>(0);
  const [considerations, setConsiderations] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [planSaved, setPlanSaved] = useState(false);

  const processingSteps = [
    { icon: Database, text: 'Accediendo a evaluación nutricional del paciente...', delay: 800 },
    { icon: Activity, text: 'Analizando estado de salud y control glucémico...', delay: 1000 },
    { icon: Brain, text: 'Aplicando reglas del sistema experto...', delay: 1200 },
    { icon: Utensils, text: 'Diseñando plan alimenticio personalizado...', delay: 1100 },
    { icon: CheckCircle, text: 'Plan alimenticio generado exitosamente', delay: 600 }
  ];

  const menuPlans = [
    {
      id: 1,
      name: 'Plan Mediterráneo',
      description: 'Rico en vegetales, pescado y grasas saludables',
      meals: {
        lunes: {
          desayuno: ['Avena con frutas y nueces', 'Yogurt griego', 'Té verde'],
          comida: ['Ensalada mediterránea', 'Salmón al horno', 'Quinoa', 'Agua natural'],
          cena: ['Sopa de verduras', 'Pollo a la plancha', 'Ensalada verde']
        },
        martes: {
          desayuno: ['Huevos con espinacas', 'Pan integral', 'Jugo de naranja natural'],
          comida: ['Ensalada de garbanzos', 'Pescado blanco', 'Arroz integral', 'Agua de limón'],
          cena: ['Crema de calabaza', 'Pechuga de pavo', 'Verduras al vapor']
        },
        miercoles: {
          desayuno: ['Smoothie verde', 'Tostadas integrales con aguacate', 'Café'],
          comida: ['Ensalada griega', 'Atún sellado', 'Camote al horno', 'Agua natural'],
          cena: ['Consomé de pollo', 'Tortilla de verduras', 'Ensalada']
        },
        jueves: {
          desayuno: ['Yogurt con granola', 'Frutas frescas', 'Té de hierbas'],
          comida: ['Ensalada de espinacas', 'Pollo al limón', 'Lentejas', 'Agua de Jamaica sin azúcar'],
          cena: ['Sopa de nopales', 'Pescado a la plancha', 'Verduras asadas']
        },
        viernes: {
          desayuno: ['Omelette de claras', 'Pan pita integral', 'Jugo verde'],
          comida: ['Ensalada césar light', 'Camarones al ajillo', 'Arroz con vegetales', 'Agua natural'],
          cena: ['Caldo de verduras', 'Pollo en salsa verde', 'Nopales']
        },
        sabado: {
          desayuno: ['Pancakes de avena', 'Frutas del bosque', 'Café americano'],
          comida: ['Ensalada de atún', 'Filete de pescado', 'Pure de coliflor', 'Agua de pepino'],
          cena: ['Sopa miso', 'Pollo teriyaki', 'Vegetales salteados']
        },
        domingo: {
          desayuno: ['Huevos benedictinos light', 'Ensalada de frutas', 'Té chai'],
          comida: ['Ensalada caprese', 'Lasaña de vegetales', 'Pan integral', 'Agua natural'],
          cena: ['Consomé', 'Wrap de pollo', 'Ensalada verde']
        }
      }
    },
    {
      id: 2,
      name: 'Plan Bajo en Carbohidratos',
      description: 'Ideal para control glucémico estricto',
      meals: {
        lunes: {
          desayuno: ['Huevos revueltos con queso', 'Aguacate', 'Café negro'],
          comida: ['Ensalada de col', 'Carne asada', 'Brócoli', 'Agua natural'],
          cena: ['Sopa de col', 'Pollo rostizado', 'Espárragos']
        },
        martes: {
          desayuno: ['Omelette de champiñones', 'Espinacas salteadas', 'Té verde'],
          comida: ['Ensalada verde', 'Filete de res', 'Coliflor al vapor', 'Agua con limón'],
          cena: ['Caldo de pollo', 'Salmón a la plancha', 'Ensalada mixta']
        },
        miercoles: {
          desayuno: ['Huevos pochados', 'Jamón de pavo', 'Café americano'],
          comida: ['Ensalada de espinacas', 'Pechuga a la plancha', 'Calabacitas', 'Agua natural'],
          cena: ['Consomé', 'Atún sellado', 'Verduras asadas']
        },
        jueves: {
          desayuno: ['Tortilla de claras', 'Queso cottage', 'Té de hierbas'],
          comida: ['Ensalada césar sin crutones', 'Pollo al limón', 'Ejotes', 'Agua mineral'],
          cena: ['Sopa de verduras', 'Pescado horneado', 'Ensalada']
        },
        viernes: {
          desayuno: ['Huevos fritos', 'Tocino de pavo', 'Café'],
          comida: ['Ensalada de pepino', 'Camarones', 'Zucchini', 'Agua natural'],
          cena: ['Caldo de res', 'Pollo en salsa de chile', 'Nopales']
        },
        sabado: {
          desayuno: ['Omelette de vegetales', 'Aguacate', 'Té verde'],
          comida: ['Ensalada griega', 'Bistec', 'Brócoli y coliflor', 'Agua con pepino'],
          cena: ['Sopa de hongos', 'Salmón', 'Espinacas']
        },
        domingo: {
          desayuno: ['Huevos benedictinos sin pan', 'Jamón', 'Café negro'],
          comida: ['Ensalada mixta', 'Costillas al horno', 'Vegetales asados', 'Agua natural'],
          cena: ['Consomé de pollo', 'Pechuga rellena', 'Ensalada verde']
        }
      }
    },
    {
      id: 3,
      name: 'Plan Equilibrado',
      description: 'Balance de todos los grupos alimenticios',
      meals: {
        lunes: {
          desayuno: ['Pan integral con mermelada sin azúcar', 'Queso fresco', 'Leche descremada'],
          comida: ['Ensalada fresca', 'Pollo al horno', 'Arroz integral', 'Frijoles', 'Agua natural'],
          cena: ['Sopa de verduras', 'Quesadilla integral', 'Ensalada']
        },
        martes: {
          desayuno: ['Cereal integral', 'Plátano', 'Yogurt natural'],
          comida: ['Ensalada de lechuga', 'Pescado empapelado', 'Papa al horno', 'Agua de Jamaica sin azúcar'],
          cena: ['Crema de zanahoria', 'Tacos de pollo', 'Nopales']
        },
        miercoles: {
          desayuno: ['Hotcakes integrales', 'Miel de abeja', 'Café con leche'],
          comida: ['Ensalada de col', 'Carne de res magra', 'Pasta integral', 'Agua natural'],
          cena: ['Sopa de lentejas', 'Pechuga asada', 'Verduras']
        },
        jueves: {
          desayuno: ['Molletes integrales', 'Pico de gallo', 'Jugo de naranja'],
          comida: ['Ensalada mixta', 'Pollo en mole', 'Arroz', 'Tortillas', 'Agua de limón'],
          cena: ['Caldo de pollo', 'Tostadas de atún', 'Ensalada']
        },
        viernes: {
          desayuno: ['Chilaquiles horneados', 'Frijoles refritos', 'Café'],
          comida: ['Ensalada verde', 'Filete de pescado', 'Puré de papa', 'Agua natural'],
          cena: ['Sopa de tortilla', 'Sincronizadas de jamón', 'Verduras']
        },
        sabado: {
          desayuno: ['Sandwich integral', 'Jamón de pavo', 'Licuado de frutas'],
          comida: ['Ensalada cesar', 'Pollo a la naranja', 'Arroz con vegetales', 'Agua de pepino'],
          cena: ['Pozole de pollo', 'Tostadas', 'Lechuga']
        },
        domingo: {
          desayuno: ['Huevos a la mexicana', 'Frijoles', 'Tortillas', 'Café'],
          comida: ['Ensalada fresca', 'Mole con pollo', 'Arroz', 'Agua de horchata sin azúcar'],
          cena: ['Sopa de pasta', 'Quesadillas', 'Ensalada verde']
        }
      }
    }
  ];

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const evaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    const patientsMap = new Map();
    
    evaluations.forEach((e: any) => {
      const patientKey = e.patientName;
      if (!patientsMap.has(patientKey) || new Date(e.date) > new Date(patientsMap.get(patientKey).lastEvaluation)) {
        patientsMap.set(patientKey, {
          name: e.patientName,
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
  };

  const nextStep = () => {
    if (currentStep < 6) {
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
    return currentWeek > 0;
  };

  const canProceedStep3 = () => {
    return selectedMenuType !== null;
  };

  const startProcessing = async () => {
    setProcessing(true);
    setCurrentStep(5);

    // Simular procesamiento paso a paso
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].delay));
    }

    // Generar plan
    const plan = {
      patientName: selectedPatient,
      patientStatus: selectedPatientData.glucoseStatus,
      week: currentWeek,
      menuType: menuPlans[selectedMenuType],
      considerations: considerations,
      createdDate: new Date().toISOString()
    };

    setGeneratedPlan(plan);

    await new Promise(resolve => setTimeout(resolve, 500));
    setProcessing(false);
    setCurrentStep(6);
  };

  const handleSavePlan = () => {
    if (!generatedPlan) return;

    const existingPlans = JSON.parse(localStorage.getItem('nutriia_meal_plans') || '[]');
    existingPlans.push(generatedPlan);
    localStorage.setItem('nutriia_meal_plans', JSON.stringify(existingPlans));
    
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 3000);
  };

  const handleNewPlan = () => {
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedPatientData(null);
    setCurrentWeek(1);
    setSelectedMenuType(0);
    setConsiderations('');
    setGeneratedPlan(null);
    setProcessingStep(0);
    setPlanSaved(false);
    loadPatients();
  };

  const progressPercentage = (currentStep / 6) * 100;

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
          <h1 className="text-white">Planes Alimenticios</h1>
          <p className="text-emerald-100">Sistema Experto de Nutrición Personalizada</p>
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
          <span className={currentStep >= 2 ? 'text-emerald-900' : ''}>2. Semana</span>
          <span className={currentStep >= 3 ? 'text-emerald-900' : ''}>3. Menú</span>
          <span className={currentStep >= 4 ? 'text-emerald-900' : ''}>4. Consideraciones</span>
          <span className={currentStep >= 5 ? 'text-emerald-900' : ''}>5. Análisis</span>
          <span className={currentStep >= 6 ? 'text-emerald-900' : ''}>6. Plan</span>
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
                <p className="text-emerald-600">Elige el paciente para crear su plan</p>
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
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-emerald-600" />
                        <p className="text-emerald-900">{selectedPatientData.name}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-emerald-700">
                          <span className="font-medium">Estado:</span> {selectedPatientData.glucoseStatus}
                        </p>
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

        {/* Paso 2: Semana de Seguimiento */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Semana de Seguimiento</h2>
                <p className="text-emerald-600">Selecciona la semana del plan alimenticio</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-emerald-900">Semana *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                    <button
                      key={week}
                      onClick={() => setCurrentWeek(week)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        currentWeek === week
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-emerald-200 text-emerald-600 hover:border-emerald-300'
                      }`}
                    >
                      Semana {week}
                    </button>
                  ))}
                </div>
              </div>

              {currentWeek > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-900">
                    <span className="font-medium">Semana seleccionada:</span> Semana {currentWeek}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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

        {/* Paso 3: Tipo de Menú */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Tipo de Menú</h2>
                <p className="text-emerald-600">Selecciona el plan alimenticio adecuado</p>
              </div>
            </div>

            <div className="space-y-3">
              {menuPlans.map((menu, index) => (
                <div
                  key={menu.id}
                  onClick={() => setSelectedMenuType(index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMenuType === index
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-emerald-900 font-medium">{menu.name}</h3>
                      <p className="text-emerald-600 text-sm mt-1">{menu.description}</p>
                    </div>
                    {selectedMenuType === index && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedStep3()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 4: Consideraciones */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Consideraciones Especiales</h2>
                <p className="text-emerald-600">Notas adicionales para el plan alimenticio</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="considerations" className="text-emerald-900">Consideraciones y Observaciones</Label>
                <textarea
                  id="considerations"
                  value={considerations}
                  onChange={(e) => setConsiderations(e.target.value)}
                  className="w-full min-h-[120px] p-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none text-emerald-900 resize-none"
                  placeholder="Ej: Alergia a mariscos, preferencia por comidas vegetarianas, restricción de sodio, etc."
                />
                <p className="text-emerald-600 text-xs">
                  Incluye alergias, intolerancias, preferencias alimentarias o cualquier consideración especial
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-900 text-sm">
                  💡 <span className="font-medium">Tip:</span> Estas consideraciones ayudarán a personalizar mejor el plan alimenticio del paciente.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={startProcessing}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                Generar Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 5: Análisis del Sistema Experto */}
        {currentStep === 5 && processing && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-emerald-900">Análisis del Sistema Experto</h2>
                <p className="text-emerald-600">Procesando información del paciente</p>
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

        {/* Paso 6: Plan Generado */}
        {currentStep === 6 && generatedPlan && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-emerald-900">Plan Alimenticio Generado</h2>
                  <p className="text-emerald-600">
                    Paciente: {generatedPlan.patientName}
                  </p>
                </div>
              </div>

              {/* Información del Plan */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-600 text-xs mb-1">Semana</p>
                  <p className="text-emerald-900 font-medium">Semana {generatedPlan.week}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-600 text-xs mb-1">Estado</p>
                  <p className="text-emerald-900 font-medium">{generatedPlan.patientStatus}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-5">
                <p className="text-blue-900">
                  <span className="font-medium">Plan:</span> {generatedPlan.menuType.name}
                </p>
                <p className="text-blue-700 text-sm mt-1">{generatedPlan.menuType.description}</p>
              </div>

              {generatedPlan.considerations && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-5">
                  <p className="text-purple-900 font-medium mb-1">Consideraciones Especiales:</p>
                  <p className="text-purple-700 text-sm">{generatedPlan.considerations}</p>
                </div>
              )}

              {/* Menú Semanal */}
              <div className="space-y-3">
                <h3 className="text-emerald-900 font-medium">Menú Semanal</h3>
                
                {Object.entries(generatedPlan.menuType.meals).map(([day, meals]: [string, any]) => (
                  <div key={day} className="border border-emerald-200 rounded-lg overflow-hidden">
                    <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200">
                      <p className="text-emerald-900 font-medium capitalize">{day}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-emerald-700 text-sm font-medium mb-1">Desayuno</p>
                        <ul className="space-y-1">
                          {meals.desayuno.map((item: string, idx: number) => (
                            <li key={idx} className="text-emerald-600 text-sm flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-emerald-700 text-sm font-medium mb-1">Comida</p>
                        <ul className="space-y-1">
                          {meals.comida.map((item: string, idx: number) => (
                            <li key={idx} className="text-emerald-600 text-sm flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-emerald-700 text-sm font-medium mb-1">Cena</p>
                        <ul className="space-y-1">
                          {meals.cena.map((item: string, idx: number) => (
                            <li key={idx} className="text-emerald-600 text-sm flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {planSaved && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-900">Plan guardado exitosamente</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSavePlan}
                  disabled={planSaved}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {planSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Guardado
                    </>
                  ) : (
                    'Guardar Plan'
                  )}
                </Button>
                <Button
                  onClick={handleNewPlan}
                  variant="outline"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Nuevo Plan
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
