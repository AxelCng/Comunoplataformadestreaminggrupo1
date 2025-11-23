import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Tv, Heart, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { GlassesIcon } from './GlassesIcon';
import { ComunoText } from './ComunoText';
import { toast } from 'sonner@2.0.3';
import { authAPI } from '../utils/api';

interface LoginPageProps {
  onLogin: (username: string, userId: string, accessToken: string) => void;
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
}

export function LoginPage({ onLogin, accessibilityMode, onToggleAccessibility }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error('Por favor completa todos los campos', {
        closeButton: true
      });
      return;
    }

    setIsLoading(true);

    try {
      const { user, accessToken } = await authAPI.signIn(loginEmail, loginPassword);
      
      toast.success('¡Bienvenido de vuelta!', {
        description: `Hola ${user?.user_metadata?.name || loginEmail}`,
        closeButton: true
      });
      
      onLogin(user?.user_metadata?.name || loginEmail, user!.id, accessToken!);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión', {
        description: error.message || 'Verifica tus credenciales',
        closeButton: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      toast.error('Por favor completa todos los campos', {
        closeButton: true
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Contraseña muy corta', {
        description: 'La contraseña debe tener al menos 6 caracteres',
        closeButton: true
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      await authAPI.signUp(registerEmail, registerPassword, registerName);
      
      // Automatically sign in after registration
      const { user, accessToken } = await authAPI.signIn(registerEmail, registerPassword);
      
      toast.success('¡Cuenta creada exitosamente!', {
        description: `Bienvenido a COMUNO, ${registerName}`,
        closeButton: true
      });
      
      onLogin(registerName, user!.id, accessToken!);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Error al registrarse', {
        description: error.message || 'Intenta con otro email',
        closeButton: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    toast.info('Ingresando como invitado', {
      description: 'Algunas funciones pueden estar limitadas',
      closeButton: true
    });
    onLogin('Invitado', 'guest', '');
  };

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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 py-8">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 items-center">
          {/* Left Side - Branding */}
          <div className="text-center md:text-left space-y-4">
            <div className="flex flex-col items-center justify-center mb-4 space-y-3">
              <GlassesIcon className={`text-white ${accessibilityMode ? 'h-20' : 'h-16'}`} />
              <ComunoText className={`text-white tracking-widest ${accessibilityMode ? 'text-5xl' : 'text-4xl'}`} />
            </div>

            <h2 className={`text-white ${accessibilityMode ? 'text-2xl' : 'text-xl md:text-2xl'}`}>
              Ve, Conecta, Comparte
            </h2>

            <p className={`text-white ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
              La plataforma de streaming que te conecta con contenido local e independiente, 
              y con una comunidad apasionada por el cine.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-2.5">
                <div className="bg-purple-600/20 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <h3 className={`text-white ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                    Watch Parties
                  </h3>
                  <p className={`text-white ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
                    Ve contenido en simultáneo con amigos y familia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="bg-pink-600/20 p-2 rounded-lg">
                  <Tv className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-left">
                  <h3 className={`text-white ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                    Contenido Local
                  </h3>
                  <p className={`text-white ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
                    Descubre producciones locales e independientes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className={`text-white ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                    Accesible para Todos
                  </h3>
                  <p className={`text-white ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
                    Diseñado con accesibilidad desde el inicio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <Card className="bg-gray-900/90 backdrop-blur-md border-gray-800 p-5 md:p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="login"
                  className={accessibilityMode ? 'text-base py-2.5' : 'text-sm'}
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className={accessibilityMode ? 'text-base py-2.5' : 'text-sm'}
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="login-email" 
                      className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                    >
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        accessibilityMode ? 'text-lg py-6' : ''
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label 
                      htmlFor="login-password" 
                      className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
                          accessibilityMode ? 'text-lg py-6' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className={`text-gray-400 cursor-pointer ${
                          accessibilityMode ? 'text-base' : 'text-sm'
                        }`}
                      >
                        Recordarme
                      </label>
                    </div>
                    <button
                      type="button"
                      className={`text-purple-400 hover:text-purple-300 ${
                        accessibilityMode ? 'text-base' : 'text-sm'
                      }`}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${
                      accessibilityMode ? 'text-xl py-7' : 'text-lg py-6'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="register-name" 
                      className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                    >
                      Nombre completo
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        accessibilityMode ? 'text-lg py-6' : ''
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label 
                      htmlFor="register-email" 
                      className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                    >
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        accessibilityMode ? 'text-lg py-6' : ''
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label 
                      htmlFor="register-password" 
                      className={`text-white ${accessibilityMode ? 'text-lg' : ''}`}
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
                          accessibilityMode ? 'text-lg py-6' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className={`text-gray-400 cursor-pointer ${
                        accessibilityMode ? 'text-base' : 'text-sm'
                      }`}
                    >
                      Acepto los términos y condiciones y la política de privacidad
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${
                      accessibilityMode ? 'text-xl py-7' : 'text-lg py-6'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className={`bg-gray-900 px-4 text-gray-400 ${
                  accessibilityMode ? 'text-base' : 'text-sm'
                }`}>
                  o
                </span>
              </div>
            </div>

            {/* Guest Access */}
            <Button
              variant="outline"
              onClick={handleGuestLogin}
              className={`w-full border-gray-700 bg-gray-800/50 text-white hover:bg-gray-800 hover:text-white ${
                accessibilityMode ? 'text-lg py-6' : ''
              }`}
            >
              Continuar como Invitado
            </Button>

            <p className={`text-center text-gray-500 mt-4 ${
              accessibilityMode ? 'text-base' : 'text-xs'
            }`}>
              Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}