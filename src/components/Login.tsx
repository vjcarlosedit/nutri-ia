import React, { useState } from 'react';
import { Lock, Mail, Leaf, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
  onRegister: () => void;
}

export function Login({ onLogin, onRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = onLogin(email, password);
    if (!success) {
      setError('Correo o contraseña incorrectos');
    } else {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-emerald-900 mb-2">Nutri-IA Expert</h1>
          <p className="text-emerald-600">Sistema Experto de Nutrición</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-emerald-900 mb-6 text-center">Iniciar Sesión</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-900">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-700">
              ¿No tienes cuenta?{' '}
              <button onClick={onRegister} className="text-emerald-600 hover:underline">
                Regístrate aquí
              </button>
            </p>
          </div>
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
            <h3 className="text-emerald-900 mb-2">¡Inicio de Sesión Exitoso!</h3>
            <p className="text-emerald-600">
              Bienvenido al Sistema Experto Nutri-IA
            </p>
          </div>
        </div>
      )}
    </div>
  );
}