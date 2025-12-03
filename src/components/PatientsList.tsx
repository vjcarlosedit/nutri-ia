import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, User, Calendar, Activity } from 'lucide-react';

interface PatientsListProps {
  onBack: () => void;
}

export function PatientsList({ onBack }: PatientsListProps) {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const evaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    
    // Agrupar evaluaciones por paciente
    const patientsMap = new Map();
    
    evaluations.forEach((evaluation: any) => {
      if (!evaluation.patientName) return;
      
      if (!patientsMap.has(evaluation.patientName)) {
        patientsMap.set(evaluation.patientName, {
          name: evaluation.patientName,
          age: evaluation.age,
          lastEvaluation: evaluation.date,
          evaluationsCount: 1,
          lastGlucose: evaluation.glucoseFasting,
          lastStatus: evaluation.glucoseStatus,
          lastIMC: evaluation.imc
        });
      } else {
        const patient = patientsMap.get(evaluation.patientName);
        patient.evaluationsCount++;
        // Actualizar con la evaluación más reciente
        if (new Date(evaluation.date) > new Date(patient.lastEvaluation)) {
          patient.lastEvaluation = evaluation.date;
          patient.lastGlucose = evaluation.glucoseFasting;
          patient.lastStatus = evaluation.glucoseStatus;
          patient.lastIMC = evaluation.imc;
        }
      }
    });

    setPatients(Array.from(patientsMap.values()));
  };

  const getStatusColor = (status: string) => {
    if (status === 'Normoglucemia') return 'text-emerald-600';
    if (status === 'Prediabetes') return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBg = (status: string) => {
    if (status === 'Normoglucemia') return 'bg-emerald-50 border-emerald-200';
    if (status === 'Prediabetes') return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen">
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
          <h1 className="text-white">Pacientes Activos</h1>
          <p className="text-emerald-100">{patients.length} paciente{patients.length !== 1 ? 's' : ''} registrado{patients.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {patients.length > 0 ? (
          <div className="space-y-3">
            {patients.map((patient, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-sm border p-4 ${getStatusBg(patient.lastStatus)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-emerald-900 mb-1">{patient.name}</h3>
                    <p className="text-emerald-600">{patient.age} años</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusBg(patient.lastStatus)} ${getStatusColor(patient.lastStatus)}`}>
                    {patient.lastStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">Glucosa</p>
                    <p className={`${getStatusColor(patient.lastStatus)}`}>{patient.lastGlucose}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">IMC</p>
                    <p className="text-emerald-900">{patient.lastIMC}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">Evaluaciones</p>
                    <p className="text-emerald-900">{patient.evaluationsCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Última evaluación: {new Date(patient.lastEvaluation).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-100 p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-emerald-900 mb-2">No hay pacientes</h3>
            <p className="text-emerald-600">
              Los pacientes aparecerán aquí después de realizar evaluaciones nutricionales
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
