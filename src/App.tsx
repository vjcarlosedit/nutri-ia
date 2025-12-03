import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { NutritionalEvaluation } from './components/NutritionalEvaluation';
import { MealPlans } from './components/MealPlans';
import { Monitoring } from './components/Monitoring';
import { Education } from './components/Education';
import { Settings } from './components/Settings';
import { PatientsList } from './components/PatientsList';
import { ConsultationsList } from './components/ConsultationsList';
import { EvaluationsList } from './components/EvaluationsList';

export type Screen = 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'evaluation' 
  | 'meal-plans' 
  | 'monitoring' 
  | 'education' 
  | 'settings'
  | 'patients-list'
  | 'consultations-list'
  | 'evaluations-list';

export interface UserData {
  name: string;
  email: string;
}

export interface AppStats {
  totalEvaluations: number;
  todayConsultations: number;
  activePatients: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [stats, setStats] = useState<AppStats>({
    totalEvaluations: 0,
    todayConsultations: 0,
    activePatients: 0
  });

  // Calcular estadísticas desde localStorage
  useEffect(() => {
    if (isAuthenticated) {
      calculateStats();
    }
  }, [isAuthenticated, currentScreen]);

  const calculateStats = () => {
    // Obtener evaluaciones guardadas
    const evaluations = JSON.parse(localStorage.getItem('nutriia_evaluations') || '[]');
    
    // Obtener planes alimenticios guardados
    const mealPlans = JSON.parse(localStorage.getItem('nutriia_meal_plans') || '[]');
    
    // Obtener registros de monitoreo
    const monitoringRecords = JSON.parse(localStorage.getItem('nutriia_monitoring_records') || '[]');

    // Total de evaluaciones
    const totalEvaluations = evaluations.length;

    // Consultas de hoy (evaluaciones + planes creados hoy)
    const today = new Date().toISOString().split('T')[0];
    const todayEvaluations = evaluations.filter((e: any) => 
      e.date && e.date.startsWith(today)
    ).length;
    const todayPlans = mealPlans.filter((p: any) => 
      p.createdDate && p.createdDate.startsWith(today)
    ).length;
    const todayConsultations = todayEvaluations + todayPlans;

    // Pacientes activos (únicos por nombre en evaluaciones)
    const patientNames = new Set(evaluations.map((e: any) => e.patientName).filter(Boolean));
    const activePatients = patientNames.size;

    setStats({
      totalEvaluations,
      todayConsultations,
      activePatients
    });
  };

  const handleLogin = (email: string, password: string) => {
    // Simulación de login
    const storedUser = localStorage.getItem('nutriia_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && user.password === password) {
        setUserData(user);
        setIsAuthenticated(true);
        // Esperar 1.5 segundos antes de redirigir para mostrar el modal
        setTimeout(() => {
          setDashboardKey(prev => prev + 1); // Forzar remontaje del dashboard
          setCurrentScreen('dashboard');
        }, 1500);
        return true;
      }
    }
    return false;
  };

  const handleRegister = (data: any) => {
    // Simulación de registro
    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    localStorage.setItem('nutriia_user', JSON.stringify(newUser));
    // Redirigir al login después de registrarse
    setCurrentScreen('login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    if (!isAuthenticated && currentScreen !== 'register') {
      return <Login onLogin={handleLogin} onRegister={() => setCurrentScreen('register')} />;
    }

    switch (currentScreen) {
      case 'register':
        return <Register onBack={() => setCurrentScreen('login')} onRegister={handleRegister} />;
      case 'dashboard':
        return <Dashboard key={dashboardKey} onNavigate={setCurrentScreen} userName={userData?.name || ''} stats={stats} />;
      case 'evaluation':
        return <NutritionalEvaluation onBack={() => setCurrentScreen('dashboard')} />;
      case 'meal-plans':
        return <MealPlans onBack={() => setCurrentScreen('dashboard')} />;
      case 'monitoring':
        return <Monitoring onBack={() => setCurrentScreen('dashboard')} />;
      case 'education':
        return <Education onBack={() => setCurrentScreen('dashboard')} />;
      case 'settings':
        return <Settings onBack={() => setCurrentScreen('dashboard')} onLogout={handleLogout} userData={userData} />;
      case 'patients-list':
        return <PatientsList onBack={() => setCurrentScreen('dashboard')} />;
      case 'consultations-list':
        return <ConsultationsList onBack={() => setCurrentScreen('dashboard')} />;
      case 'evaluations-list':
        return <EvaluationsList onBack={() => setCurrentScreen('dashboard')} />;
      default:
        return <Dashboard key={dashboardKey} onNavigate={setCurrentScreen} userName={userData?.name || ''} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex justify-center">
      <div className="w-full max-w-md">
        {renderScreen()}
      </div>
    </div>
  );
}