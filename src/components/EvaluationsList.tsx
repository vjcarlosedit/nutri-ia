import React, { useState, useEffect } from 'react';
import { ArrowLeft, ClipboardList, User, Calendar, TrendingUp } from 'lucide-react';

interface EvaluationsListProps {
  onBack: () => void;
}

export function EvaluationsList({ onBack }: EvaluationsListProps) {
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    const allEvaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    
    // Ordenar por fecha más reciente
    const sorted = allEvaluations.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setEvaluations(sorted);
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
          <h1 className="text-white">Evaluaciones Nutricionales</h1>
          <p className="text-emerald-100">{evaluations.length} evaluación{evaluations.length !== 1 ? 'es' : ''} registrada{evaluations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {evaluations.length > 0 ? (
          <div className="space-y-3">
            {evaluations.map((evaluation, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-sm border p-4 ${getStatusBg(evaluation.glucoseStatus)}`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-emerald-900 mb-1">{evaluation.patientName}</h3>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">
                        {new Date(evaluation.date).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusBg(evaluation.glucoseStatus)} ${getStatusColor(evaluation.glucoseStatus)}`}>
                    {evaluation.glucoseStatus}
                  </span>
                </div>

                {/* Datos Resumidos */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-emerald-600 text-xs mb-1">Edad</p>
                    <p className="text-emerald-900">{evaluation.age}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-emerald-600 text-xs mb-1">Peso</p>
                    <p className="text-emerald-900">{evaluation.weight}kg</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-emerald-600 text-xs mb-1">IMC</p>
                    <p className="text-emerald-900">{evaluation.imc}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-emerald-600 text-xs mb-1">Glucosa</p>
                    <p className={getStatusColor(evaluation.glucoseStatus)}>{evaluation.glucoseFasting}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-100 p-12 text-center">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-emerald-900 mb-2">No hay evaluaciones</h3>
            <p className="text-emerald-600">
              Las evaluaciones aparecerán aquí después de completar evaluaciones nutricionales
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
