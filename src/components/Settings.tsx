import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut, 
  Mail,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserData } from '../App';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  userData: UserData | null;
}

export function Settings({ onBack, onLogout, userData }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  const [profile, setProfile] = useState({
    name: userData?.name || '',
    email: userData?.email || ''
  });

  const tabs = [
    { id: 'profile' as const, name: 'Perfil', icon: User },
    { id: 'security' as const, name: 'Seguridad', icon: Lock }
  ];

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
          <h1 className="text-white">Configuración</h1>
          <p className="text-emerald-100">Administra tu cuenta</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Perfil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
            <h2 className="text-emerald-900 mb-5">Información de Perfil</h2>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-emerald-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white flex-shrink-0">
                <span className="text-xl">{profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}</span>
              </div>
              <div>
                <h3 className="text-emerald-900">{profile.name}</h3>
              </div>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileName" className="text-emerald-900">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input
                    id="profileName"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileEmail" className="text-emerald-900">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                Guardar Cambios
              </Button>
            </form>
          </div>
        )}

        {/* Seguridad */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5">
            <h2 className="text-emerald-900 mb-5">Seguridad y Privacidad</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-emerald-900 mb-1">Cambiar Contraseña</p>
                    <p className="text-emerald-600 mb-3">Actualiza tu contraseña</p>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón de Cerrar Sesión */}
        <div className="mt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}