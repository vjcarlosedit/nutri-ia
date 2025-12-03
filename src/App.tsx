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
import { authAPI, evaluationsAPI } from './services/api';

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

  // Calcular estadísticas desde API
  useEffect(() => {
    if (isAuthenticated) {
      calculateStats();
    }
  }, [isAuthenticated, currentScreen]);

  const calculateStats = async () => {
    try {
      const statsData = await evaluationsAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Fallback a valores por defecto
      setStats({
        totalEvaluations: 0,
        todayConsultations: 0,
        activePatients: 0
      });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setUserData(response.user);
      setIsAuthenticated(true);
      // Esperar 1.5 segundos antes de redirigir para mostrar el modal
      setTimeout(() => {
        setDashboardKey(prev => prev + 1); // Forzar remontaje del dashboard
        setCurrentScreen('dashboard');
      }, 1500);
      return true;
    } catch (error: any) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const handleRegister = async (data: any) => {
    try {
      await authAPI.register(data.name, data.email, data.password);
      // Redirigir al login después de registrarse
      setCurrentScreen('login');
      return true;
    } catch (error: any) {
      console.error('Error en registro:', error);
      return false;
    }
  };

  const handleLogout = () => {
    authAPI.logout();
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