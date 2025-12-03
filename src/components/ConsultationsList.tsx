import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, User, Calendar, FileText } from 'lucide-react';

interface ConsultationsListProps {
  onBack: () => void;
}

export function ConsultationsList({ onBack }: ConsultationsListProps) {
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = () => {
    const evaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    
    // Ordenar por fecha más reciente
    const sorted = evaluations.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setConsultations(sorted);
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

  const getIMCStatus = (status: string) => {
    const colors: any = {
      'Bajo peso': 'text-blue-600',
      'Peso normal': 'text-emerald-600',
      'Sobrepeso': 'text-amber-600',
      'Obesidad': 'text-red-600'
    };
    return colors[status] || 'text-emerald-600';
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
          <h1 className="text-white">Consultas Realizadas</h1>
          <p className="text-emerald-100">{consultations.length} consulta{consultations.length !== 1 ? 's' : ''} registrada{consultations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {consultations.length > 0 ? (
          <div className="space-y-3">
            {consultations.map((consultation, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-sm border p-4 ${getStatusBg(consultation.glucoseStatus)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-emerald-900 mb-1">{consultation.patientName}</h3>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(consultation.date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resultados */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">Estado Glucémico</p>
                    <p className={`${getStatusColor(consultation.glucoseStatus)}`}>
                      {consultation.glucoseStatus}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">Estado IMC</p>
                    <p className={`${getIMCStatus(consultation.imcStatus)}`}>
                      {consultation.imcStatus}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">Glucosa en Ayunas</p>
                    <p className={`${getStatusColor(consultation.glucoseStatus)}`}>
                      {consultation.glucoseFasting} mg/dL
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-emerald-600 text-xs mb-1">IMC</p>
                    <p className="text-emerald-900">{consultation.imc}</p>
                  </div>
                </div>

                {/* Recomendación */}
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-900 text-xs mb-1">Recomendación</p>
                      <p className="text-emerald-700 text-sm">{consultation.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-100 p-12 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-emerald-900 mb-2">No hay consultas</h3>
            <p className="text-emerald-600">
              Las consultas aparecerán aquí después de realizar evaluaciones nutricionales
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
