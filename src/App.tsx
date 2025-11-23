import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { WatchParty } from './components/WatchParty';
import { WatchPartyList } from './components/WatchPartyList';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { LoginPage } from './components/LoginPage';
import { FriendsPage } from './components/FriendsPage';
import { HelpButton } from './components/HelpButton';
import { Content } from './components/ContentCard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { authAPI, moviesAPI } from './utils/api';
import chavinThumbnail from 'figma:asset/e3479e6a8734237562eca58d69c805a0272a8403.png';
import alFondoThumbnail from 'figma:asset/1bfd68c9286ef7a29a288c7b597b32d4704bdf27.png';
import misterioThumbnail from 'figma:asset/87d9ebefc7a54c8a8d49b56a734c7df01038e9c8.png';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  // Initial movie data for seeding the database
  const initialContents: Content[] = [
    {
      id: '1',
      title: 'Voces del Barrio',
      description: 'Un documental que explora las historias de artistas urbanos locales y su impacto en la comunidad.',
      thumbnail: 'https://images.unsplash.com/photo-1586006742515-c2caee579d83?w=1080&q=80',
      duration: '1h 45min',
      rating: 4.7,
      category: 'Documental',
      isLocal: true,
      activeWatchParties: 3
    },
    {
      id: '2',
      title: 'Ritmos de la Tierra',
      description: 'Una celebración musical que documenta la evolución del folklore local y su fusión con sonidos contemporáneos.',
      thumbnail: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1080&q=80',
      duration: '52min',
      rating: 4.5,
      category: 'Documental',
      isLocal: true,
      activeWatchParties: 2
    },
    {
      id: '3',
      title: 'El Último Viaje',
      description: 'Un cortometraje independiente sobre redescubrir las raíces familiares a través de un viaje emocional.',
      thumbnail: 'https://images.unsplash.com/photo-1580451088951-d1781ba14bb8?w=1080&q=80',
      duration: '28min',
      rating: 4.8,
      category: 'Independiente',
      isLocal: true,
      activeWatchParties: 1
    },


    {
      id: '6',
      title: 'Memorias Urbanas',
      description: 'Un relato cinematográfico sobre la transformación de los espacios urbanos a través de los ojos de sus habitantes.',
      thumbnail: 'https://images.unsplash.com/photo-1661260728334-79080c8148af?w=1080&q=80',
      duration: '58min',
      rating: 4.4,
      category: 'Independiente',
      isLocal: true,
      activeWatchParties: 1
    },
    {
      id: '7',
      title: 'Chavín de Huantar',
      description: 'En una operación de rescate sin precedentes, comandos de élite se infiltran en una embajada sitiada por terroristas para liberar a decenas de rehenes, enfrentando un desafío que pondrá a prueba su valentía y humanidad.',
      thumbnail: chavinThumbnail,
      duration: '2h 15min',
      rating: 4.8,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 2
    },
    {
      id: '8',
      title: 'En la Línea de Fuego',
      description: 'Un thriller de acción donde un detective local debe detener una conspiración que amenaza la ciudad.',
      thumbnail: 'https://images.unsplash.com/photo-1755076347925-fe1e04401c90?w=1080&q=80',
      duration: '2h 5min',
      rating: 4.5,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 4
    },
    {
      id: '9',
      title: 'Sombras del Pasado',
      description: 'Un thriller psicológico sobre secretos familiares que resurgen después de décadas de silencio.',
      thumbnail: 'https://images.unsplash.com/photo-1662937600299-7cb9ff0b1061?w=1080&q=80',
      duration: '1h 52min',
      rating: 4.6,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 2
    },
    {
      id: '10',
      title: 'Risas de Barrio',
      description: 'Una comedia ligera sobre vecinos que deben trabajar juntos para salvar su comunidad.',
      thumbnail: 'https://images.unsplash.com/photo-1649446801521-61ea6333f4c9?w=1080&q=80',
      duration: '1h 38min',
      rating: 4.3,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 1
    },
    {
      id: '11',
      title: 'Lazos de Sangre',
      description: 'Un drama familiar intenso que explora las complejidades de las relaciones entre generaciones.',
      thumbnail: 'https://images.unsplash.com/photo-1715322608224-a9efaeeffaf7?w=1080&q=80',
      duration: '2h 20min',
      rating: 4.7,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 0
    },
    {
      id: '12',
      title: 'Misterio',
      description: 'Serie peruana de drama y ficción que narra historias de la vida real con un toque de misterio. Cada episodio presenta casos basados en hechos reales que mantienen al espectador en suspenso.',
      thumbnail: misterioThumbnail,
      duration: '3 temporadas',
      rating: 4.7,
      category: 'Serie',
      isLocal: true,
      activeWatchParties: 3
    },
    {
      id: '13',
      title: 'Calles de la Ciudad',
      description: 'Serie dramática que sigue las vidas entrelazadas de habitantes de un barrio multicultural.',
      thumbnail: 'https://images.unsplash.com/photo-1631387019069-2ff599943f9a?w=1080&q=80',
      duration: '8 episodios',
      rating: 4.8,
      category: 'Serie',
      isLocal: true,
      activeWatchParties: 2
    },
    {
      id: '14',
      title: 'Al Fondo Hay Sitio',
      description: 'La icónica sitcom peruana que retrata con humor las diferencias sociales y culturales entre las familias Gonzales y Maldini, mostrándonos las aventuras y desventuras de sus divertidos personajes.',
      thumbnail: alFondoThumbnail,
      duration: '11 temporadas',
      rating: 4.9,
      category: 'TV Show',
      isLocal: true,
      activeWatchParties: 5
    },
    {
      id: '15',
      title: 'Misterios Urbanos',
      description: 'Programa de televisión donde cada episodio resuelve un caso diferente en la ciudad, mezclando entretenimiento con investigacin.',
      thumbnail: 'https://images.unsplash.com/photo-1760582912320-79fcbc9f309b?w=1080&q=80',
      duration: '10 episodios',
      rating: 4.5,
      category: 'TV Show',
      isLocal: true,
      activeWatchParties: 2
    },
  ];

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load movies when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadMovies();
    }
  }, [isLoggedIn]);

  const checkSession = async () => {
    try {
      const { session, user } = await authAPI.getSession();
      
      if (session && user) {
        setIsLoggedIn(true);
        setUsername(user.user_metadata?.name || user.email || 'Usuario');
        setUserId(user.id);
        setAccessToken(session.access_token!);
      }
    } catch (error) {
      console.log('No active session');
    }
  };

  const loadMovies = async () => {
    setIsLoadingMovies(true);
    
    // Usar catálogo local directamente
    // La tabla KV store no existe en la base de datos, así que usamos datos locales
    console.log('Loading movies from local catalog...');
    setContents(initialContents);
    setIsLoadingMovies(false);
    
    // No intentar cargar desde BD ya que la tabla no existe
  };

  // Mock Watch Party rooms
  const watchPartyRooms = contents
    .filter(c => c.activeWatchParties > 0)
    .map((content, index) => ({
      id: `room-${content.id}`,
      content,
      host: ['María González', 'Carlos Ruiz', 'Ana López'][index] || 'Usuario',
      participants: Math.floor(Math.random() * 15) + 5,
      startedAt: new Date(Date.now() - Math.random() * 3600000)
    }));

  const handleNavigate = (view: string) => {
    if (view === 'settings') {
      setShowAccessibilitySettings(true);
    } else {
      setCurrentView(view);
      setSelectedContent(null);
    }
  };

  const handlePlayContent = (contentId: string) => {
    const content = contents.find(c => c.id === contentId);
    if (content) {
      setSelectedContent(content);
      setCurrentView('player');
      toast.success('Reproduciendo contenido', {
        description: `Ahora viendo: ${content.title}`,
        closeButton: true
      });
    }
  };

  const handleJoinWatchParty = (contentId: string) => {
    const content = contents.find(c => c.id === contentId);
    if (content) {
      setSelectedContent(content);
      setCurrentView('watchparty');
      toast.success('Unido a Watch Party', {
        description: `Te has unido a la sala de ${content.title}`,
        closeButton: true
      });
    }
  };

  const handleCloseWatchParty = () => {
    setSelectedContent(null);
    setCurrentView('home');
    toast.info('Has salido de la Watch Party', {
      closeButton: true
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleToggleAccessibility = () => {
    setAccessibilityMode(!accessibilityMode);
    if (isLoggedIn) {
      toast.success(
        !accessibilityMode ? 'Modo de accesibilidad activado' : 'Modo de accesibilidad desactivado',
        {
          description: !accessibilityMode 
            ? 'Los elementos de la interfaz ahora son más grandes'
            : 'Los elementos de la interfaz volvieron a su tamaño normal',
          closeButton: true
        }
      );
    }
  };

  const handleLogin = (user: string, uId: string, token: string) => {
    setUsername(user);
    setUserId(uId);
    setAccessToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    
    setIsLoggedIn(false);
    setUsername('');
    setUserId('');
    setAccessToken('');
    setCurrentView('home');
    setSelectedContent(null);
    setContents([]);
    
    toast.info('Has cerrado sesin', {
      description: 'Hasta pronto, vuelve cuando quieras',
      closeButton: true
    });
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          accessibilityMode={accessibilityMode}
          onToggleAccessibility={handleToggleAccessibility}
        />
        <HelpButton accessibilityMode={accessibilityMode} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        accessibilityMode={accessibilityMode}
        onLogout={handleLogout}
      />

      {currentView === 'home' && (
        <HomePage
          contents={contents}
          onPlayContent={handlePlayContent}
          onJoinWatchParty={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
          searchQuery={searchQuery}
        />
      )}

      {currentView === 'catalog' && (
        <HomePage
          contents={contents}
          onPlayContent={handlePlayContent}
          onJoinWatchParty={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
          searchQuery={searchQuery}
        />
      )}

      {currentView === 'movies' && (
        <HomePage
          contents={contents.filter(c => c.category === 'Película')}
          onPlayContent={handlePlayContent}
          onJoinWatchParty={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
          searchQuery={searchQuery}
          categoryFilter="Película"
        />
      )}

      {currentView === 'series' && (
        <HomePage
          contents={contents.filter(c => c.category === 'Serie')}
          onPlayContent={handlePlayContent}
          onJoinWatchParty={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
          searchQuery={searchQuery}
          categoryFilter="Serie"
        />
      )}

      {currentView === 'tvshows' && (
        <HomePage
          contents={contents.filter(c => c.category === 'TV Show')}
          onPlayContent={handlePlayContent}
          onJoinWatchParty={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
          searchQuery={searchQuery}
          categoryFilter="TV Show"
        />
      )}

      {currentView === 'watchparties' && (
        <WatchPartyList
          rooms={watchPartyRooms}
          onJoinRoom={handleJoinWatchParty}
          accessibilityMode={accessibilityMode}
        />
      )}

      {currentView === 'player' && selectedContent && (
        <WatchParty
          content={selectedContent}
          onClose={handleCloseWatchParty}
          accessibilityMode={accessibilityMode}
          currentView={currentView}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'watchparty' && selectedContent && (
        <WatchParty
          content={selectedContent}
          onClose={handleCloseWatchParty}
          accessibilityMode={accessibilityMode}
          currentView={currentView}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'friends' && (
        <FriendsPage
          accessibilityMode={accessibilityMode}
        />
      )}

      {showAccessibilitySettings && (
        <AccessibilitySettings
          accessibilityMode={accessibilityMode}
          onToggleAccessibility={handleToggleAccessibility}
          onClose={() => setShowAccessibilitySettings(false)}
        />
      )}

      {/* Show help button only when not watching content */}
      {currentView !== 'player' && currentView !== 'watchparty' && (
        <HelpButton accessibilityMode={accessibilityMode} />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}