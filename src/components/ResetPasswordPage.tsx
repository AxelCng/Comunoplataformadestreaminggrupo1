import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { GlassesIcon } from './GlassesIcon';
import { ComunoText } from './ComunoText';
import { toast } from 'sonner@2.0.3';
import { authAPI } from '../utils/api';

interface ResetPasswordPageProps {
  accessibilityMode: boolean;
}

export function ResetPasswordPage({ accessibilityMode }: ResetPasswordPageProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session/token from the email link
    const checkSession = async () => {
      try {
        const { session } = await authAPI.getSession();
        if (!session) {
          toast.error('Enlace inválido o expirado', {
            description: 'Por favor solicita un nuevo enlace de recuperación',
            closeButton: true
          });
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Por favor completa todos los campos', {
        closeButton: true
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Contraseña muy corta', {
        description: 'La contraseña debe tener al menos 6 caracteres',
        closeButton: true
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden', {
        description: 'Por favor verifica que ambas contraseñas sean iguales',
        closeButton: true
      });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.updatePassword(newPassword);
      
      setIsSuccess(true);
      
      toast.success('¡Contraseña actualizada!', {
        description: 'Tu contraseña ha sido cambiada exitosamente',
        closeButton: true
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Error al cambiar la contraseña', {
        description: error.message || 'Intenta nuevamente',
        closeButton: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1754102874418-016fcac03415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGNpbmVtYSUyMG1vdmllJTIwdGhlYXRlcnxlbnwxfHx8fDE3NjIyNzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-blue-600/40" />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <Card className="bg-gray-900/90 backdrop-blur-md border-gray-800 p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
            </div>
            
            <h1 className={`text-white mb-4 ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
              ¡Contraseña Actualizada!
            </h1>
            
            <p className={`text-gray-400 mb-6 ${accessibilityMode ? 'text-lg' : ''}`}>
              Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
            </p>
            
            <Button
              onClick={() => navigate('/')}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${
                accessibilityMode ? 'text-xl py-7' : 'text-lg py-6'
              }`}
            >
              Ir al Inicio de Sesión
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1754102874418-016fcac03415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGNpbmVtYSUyMG1vdmllJTIwdGhlYXRlcnxlbnwxfHx8fDE3NjIyNzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-blue-600/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8 space-y-3">
            <GlassesIcon className={`text-white ${accessibilityMode ? 'h-20' : 'h-16'}`} />
            <ComunoText className={`text-white tracking-widest ${accessibilityMode ? 'text-5xl' : 'text-4xl'}`} />
          </div>

          <Card className="bg-gray-900/90 backdrop-blur-md border-gray-800 p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-600/20 p-3 rounded-full">
                <KeyRound className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <h1 className={`text-white text-center mb-2 ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
              Crear Nueva Contraseña
            </h1>
            
            <p className={`text-gray-400 text-center mb-6 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
              Ingresa tu nueva contraseña para tu cuenta de COMUNO
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="new-password" 
                  className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                >
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
                      accessibilityMode ? 'text-lg py-6' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className={`text-gray-500 ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="confirm-password" 
                  className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
                      accessibilityMode ? 'text-lg py-6' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${
                  accessibilityMode ? 'text-xl py-7' : 'text-lg py-6'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando contraseña...' : 'Cambiar Contraseña'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className={`w-full text-gray-400 hover:text-white hover:bg-gray-800 ${
                  accessibilityMode ? 'text-base py-6' : ''
                }`}
              >
                Cancelar
              </Button>
            </form>
          </Card>

          <p className={`text-center text-gray-400 mt-4 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
            ¿Recordaste tu contraseña?{' '}
            <button 
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
