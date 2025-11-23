import { useState } from 'react';
import { HelpCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface HelpButtonProps {
  accessibilityMode?: boolean;
}

export function HelpButton({ accessibilityMode = false }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast.error('Categoría requerida', {
        description: 'Por favor selecciona una categoría para tu consulta',
        closeButton: true
      });
      return;
    }

    if (!message.trim()) {
      toast.error('Mensaje requerido', {
        description: 'Por favor describe tu problema o consulta',
        closeButton: true
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast.success('Solicitud enviada', {
        description: 'Nuestro equipo revisará tu mensaje y te contactará pronto',
        closeButton: true
      });
      
      setIsSubmitting(false);
      setCategory('');
      setMessage('');
      setIsOpen(false);
    }, 1000);
  };

  const categories = [
    { value: 'technical', label: 'Problema técnico' },
    { value: 'account', label: 'Mi cuenta' },
    { value: 'content', label: 'Contenido' },
    { value: 'watchparty', label: 'Watch Parties' },
    { value: 'accessibility', label: 'Accesibilidad' },
    { value: 'billing', label: 'Facturación' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-50
          bg-zinc-800
          hover:bg-zinc-700
          text-white rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-300
          group
          ${accessibilityMode ? 'w-14 h-14' : 'w-12 h-12'}
        `}
        aria-label="Solicitar ayuda"
      >
        <div className="relative flex items-center justify-center">
          <span className={`${accessibilityMode ? 'text-2xl' : 'text-xl'} font-bold group-hover:scale-110 transition-transform`}>
            ?
          </span>
        </div>
      </button>

      {/* Help Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`
          bg-zinc-900 border-zinc-800 text-white
          ${accessibilityMode ? 'max-w-2xl' : 'max-w-lg'}
        `}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
              <HelpCircle className={`${accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} text-purple-400`} />
              ¿Necesitas ayuda?
            </DialogTitle>
            <DialogDescription className={`text-zinc-400 ${accessibilityMode ? 'text-lg' : ''}`}>
              Cuéntanos qué problema estás experimentando y nuestro equipo te ayudará lo antes posible.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className={`text-zinc-300 ${accessibilityMode ? 'text-xl' : ''}`}>
                Categoría del problema
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger 
                  id="category"
                  className={`
                    bg-zinc-800 border-zinc-700 text-white
                    focus:ring-purple-500 focus:border-purple-500
                    ${accessibilityMode ? 'h-14 text-lg' : 'h-11'}
                  `}
                >
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className={`
                        focus:bg-zinc-700 focus:text-white
                        ${accessibilityMode ? 'text-lg py-3' : ''}
                      `}
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message" className={`text-zinc-300 ${accessibilityMode ? 'text-xl' : ''}`}>
                Describe tu problema
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Por favor describe tu problema con el mayor detalle posible..."
                className={`
                  bg-zinc-800 border-zinc-700 text-white
                  placeholder:text-zinc-500
                  focus:ring-purple-500 focus:border-purple-500
                  resize-none
                  ${accessibilityMode ? 'min-h-40 text-lg' : 'min-h-32'}
                `}
                maxLength={1000}
              />
              <p className={`text-zinc-500 text-right ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                {message.length}/1000 caracteres
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className={`
                  bg-white hover:bg-gray-100
                  text-black border-0
                  ${accessibilityMode ? 'h-12 px-6 text-lg' : 'h-10 px-4'}
                `}
              >
                <X className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-2'}`} />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`
                  bg-white hover:bg-gray-100
                  text-black border-0
                  ${accessibilityMode ? 'h-12 px-6 text-lg' : 'h-10 px-4'}
                `}
              >
                <Send className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-2'}`} />
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </div>
          </form>

          {/* Info Message */}
          <div className={`
            mt-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700
            ${accessibilityMode ? 'text-base' : 'text-sm'}
          `}>
            <p className="text-zinc-400">
              <strong className="text-white">Tiempo de respuesta:</strong> Nuestro equipo suele responder en menos de 24 horas. Para problemas urgentes, también puedes contactarnos en{' '}
              <a href="mailto:soporte@comuno.com" className="text-purple-400 hover:text-purple-300 underline">
                soporte@comuno.com
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}