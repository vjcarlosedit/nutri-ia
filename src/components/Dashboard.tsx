import React, { useEffect, useState } from 'react';
import { Settings, Users, Activity, ClipboardList, Heart, TrendingUp, BookOpen, Leaf } from 'lucide-react';
import { Screen } from '../App';
import { AppStats } from '../App';
import { Footer } from './Footer';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  userName: string;
  stats: AppStats;
}

export function Dashboard({ onNavigate, userName, stats }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Trigger animation after component mounts
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      id: 'evaluation' as Screen,
      title: 'Evaluación Nutricional',
      description: 'Evaluar estado de salud y control glucémico',
      icon: ClipboardList,
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 'meal-plans' as Screen,
      title: 'Planes Alimenticios',
      description: 'Diseñar planes personalizados',
      icon: Heart,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'monitoring' as Screen,
      title: 'Seguimiento',
      description: 'Monitorear avances y ajustes',
      icon: TrendingUp,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'education' as Screen,
      title: 'Educación Nutricional',
      description: 'Recursos educativos y asesoría',
      icon: BookOpen,
      color: 'from-emerald-600 to-green-600'
    }
  ];

  const statsCards = [
    { label: 'Pacientes Activos', value: stats.activePatients.toString(), icon: Users, color: 'text-emerald-600', screen: 'patients-list' as Screen },
    { label: 'Consultas Hoy', value: stats.todayConsultations.toString(), icon: Activity, color: 'text-green-600', screen: 'consultations-list' as Screen },
    { label: 'Evaluaciones', value: stats.totalEvaluations.toString(), icon: ClipboardList, color: 'text-teal-600', screen: 'evaluations-list' as Screen }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white">Nutri-IA Expert</h1>
                <p className="text-emerald-100">Bienvenid@{userName ? `, ${userName.split(' ')[0]}` : ''}</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('settings')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Stats */}
        <div className={`grid grid-cols-3 gap-3 mb-6 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {statsCards.map((stat, index) => (
            <button
              key={index}
              onClick={() => onNavigate(stat.screen)}
              className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="text-center">
                <div className={`inline-flex p-2 rounded-lg bg-emerald-50 mb-2`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-emerald-600 text-xs">{stat.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Menu Principal */}
        <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-emerald-900 mb-4">Actividades Principales</h2>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group w-full bg-white rounded-xl shadow-sm border border-emerald-100 p-4 text-left hover:shadow-md transition-all active:scale-[0.98]"
                style={{
                  animationDelay: `${450 + index * 100}ms`,
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'all 0.5s ease-out'
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-emerald-900 mb-1 group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                    <p className="text-emerald-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Información del Sistema */}
        <div className={`mt-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-emerald-900 mb-2">Sistema Experto Nutri-IA</h3>
              <p className="text-emerald-700 mb-3">
                Sistema basado en conocimiento para evaluación nutricional y control glucémico
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-emerald-700 border border-emerald-200">
                  IA Basada en Reglas
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-emerald-700 border border-emerald-200">
                  Control Glucémico
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}