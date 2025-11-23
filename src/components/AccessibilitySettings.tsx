import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { X, Eye, Type, Contrast } from 'lucide-react';

interface AccessibilitySettingsProps {
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
  onClose: () => void;
}

export function AccessibilitySettings({ 
  accessibilityMode, 
  onToggleAccessibility, 
  onClose 
}: AccessibilitySettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-white ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
              Configuración de Accesibilidad
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-gray-800"
              aria-label="Cerrar configuración"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <p className={`text-gray-400 mb-8 ${accessibilityMode ? 'text-lg' : ''}`}>
            COMUNO está diseñado para ser accesible para todos. Personaliza tu experiencia.
          </p>

          {/* Settings */}
          <div className="space-y-6">
            {/* Main Accessibility Mode */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex gap-3 flex-1">
                <div className="bg-purple-600/20 p-2 rounded-lg h-fit">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <Label 
                    htmlFor="accessibility-mode" 
                    className={`text-white block mb-2 ${accessibilityMode ? 'text-xl' : 'text-lg'}`}
                  >
                    Modo de Accesibilidad
                  </Label>
                  <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                    Aumenta el tamaño de todos los elementos de la interfaz, botones y texto para una mejor visibilidad
                  </p>
                </div>
              </div>
              <Switch
                id="accessibility-mode"
                checked={accessibilityMode}
                onCheckedChange={onToggleAccessibility}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {/* Text Size Info */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="bg-blue-600/20 p-2 rounded-lg h-fit">
                <Type className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className={`text-white mb-2 ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                  Tamaño de Texto
                </h3>
                <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                  El modo de accesibilidad aumenta automáticamente el tamaño de todo el texto en la aplicación
                </p>
              </div>
            </div>

            {/* High Contrast Info */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="bg-green-600/20 p-2 rounded-lg h-fit">
                <Contrast className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className={`text-white mb-2 ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                  Alto Contraste
                </h3>
                <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                  La interfaz de COMUNO usa colores de alto contraste por defecto para mejor legibilidad
                </p>
              </div>
            </div>

            {/* Keyboard Navigation Info */}
            <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-700/50">
              <h3 className={`text-white mb-3 ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                Navegación por Teclado
              </h3>
              <div className={`text-gray-300 space-y-2 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                <p>• <strong>Tab</strong> - Navegar entre elementos</p>
                <p>• <strong>Enter/Espacio</strong> - Activar botones</p>
                <p>• <strong>Esc</strong> - Cerrar diálogos</p>
                <p>• <strong>Flechas</strong> - Controlar el reproductor</p>
              </div>
            </div>

            {/* Screen Reader Info */}
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <h3 className={`text-white mb-3 ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                Compatibilidad con Lectores de Pantalla
              </h3>
              <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                COMUNO está optimizado para lectores de pantalla con etiquetas ARIA apropiadas y estructura semántica
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <Button
              onClick={onClose}
              className={`w-full bg-purple-600 hover:bg-purple-700 ${
                accessibilityMode ? 'text-lg py-6' : ''
              }`}
            >
              Guardar y Cerrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
