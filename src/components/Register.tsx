import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User, Leaf, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RegisterProps {
  onBack: () => void;
  onRegister: (data: any) => void;
}

export function Register({ onBack, onRegister }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setShowSuccess(true);
    
    // Esperar 2 segundos antes de registrar y redirigir
    setTimeout(() => {
      onRegister(formData);
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-emerald-900 mb-2">Nutri-IA Expert</h1>
          <p className="text-emerald-600">Crear Cuenta Profesional</p>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-emerald-900 mb-6 text-center">Registro</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-900">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre y apellidos"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-900">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-emerald-900">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            >
              Crear Cuenta
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-emerald-600 px-4">
          © 2025 Nutri-IA Expert
        </p>
      </div>

      {/* Modal de Éxito */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-emerald-900 mb-2">¡Cuenta Registrada!</h3>
            <p className="text-emerald-600">
              Tu cuenta ha sido creada exitosamente. Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}