import { Film, Tv, Monitor, Settings, Search, User, LogOut, UserPlus, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GlassesIcon } from './GlassesIcon';
import { ComunoText } from './ComunoText';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
  accessibilityMode: boolean;
  onLogout: () => void;
}

export function Navigation({ currentView, onNavigate, onSearch, accessibilityMode, onLogout }: NavigationProps) {
  return (
    <nav className="bg-black/95 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Ir a inicio"
            >
              <GlassesIcon className="w-8 h-8 text-white" />
              <ComunoText className="text-white hidden sm:block" />
            </button>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              <Button
                variant={currentView === 'movies' ? 'secondary' : 'ghost'}
                onClick={() => onNavigate('movies')}
                className={`text-white hover:text-white hover:bg-white/10 ${currentView === 'movies' ? 'bg-white/20' : ''} ${accessibilityMode ? 'text-base px-5 py-5' : 'text-sm px-3'}`}
              >
                <Film className="w-4 h-4 mr-1.5" />
                Películas
              </Button>
              <Button
                variant={currentView === 'series' ? 'secondary' : 'ghost'}
                onClick={() => onNavigate('series')}
                className={`text-white hover:text-white hover:bg-white/10 ${currentView === 'series' ? 'bg-white/20' : ''} ${accessibilityMode ? 'text-base px-5 py-5' : 'text-sm px-3'}`}
              >
                <Tv className="w-4 h-4 mr-1.5" />
                Series
              </Button>
              <Button
                variant={currentView === 'tvshows' ? 'secondary' : 'ghost'}
                onClick={() => onNavigate('tvshows')}
                className={`text-white hover:text-white hover:bg-white/10 ${currentView === 'tvshows' ? 'bg-white/20' : ''} ${accessibilityMode ? 'text-base px-5 py-5' : 'text-sm px-3'}`}
              >
                <Monitor className="w-4 h-4 mr-1.5" />
                TV Shows
              </Button>
            </div>
          </div>

          {/* Search and Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar contenido..."
                className="pl-9 w-48 lg:w-56 bg-gray-600 border-gray-500 text-white placeholder:text-gray-300 h-9 text-sm"
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Buscar contenido"
              />
            </div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menú de usuario"
                  className={`inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-white transition-colors ${accessibilityMode ? 'w-10 h-10' : 'w-8 h-8'}`}
                >
                  <User className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                <DropdownMenuItem 
                  onClick={() => onNavigate('settings')}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNavigate('friends')}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Amigos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNavigate('admin')}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Administrar Catálogo
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="text-red-400 hover:bg-gray-800 hover:text-red-300 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 pb-3">
          <Button
            variant={currentView === 'movies' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('movies')}
          >
            <Film className="w-4 h-4" />
          </Button>
          <Button
            variant={currentView === 'series' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('series')}
          >
            <Tv className="w-4 h-4" />
          </Button>
          <Button
            variant={currentView === 'tvshows' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('tvshows')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}