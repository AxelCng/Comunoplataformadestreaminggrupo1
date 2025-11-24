import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
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

// GitHub Images Configuration
// URL de GitHub configurada para: AxelCng/Comunoplataformadestreaminggrupo1
// Las imágenes están en: src/images/
const GITHUB_IMAGES_BASE = 'https://raw.githubusercontent.com/AxelCng/Comunoplataformadestreaminggrupo1/main/src/images/';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      thumbnail: `${GITHUB_IMAGES_BASE}chavinThumbnail.png`,
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
      category: 'Pel��cula',
      isLocal: true,
      activeWatchParties: 0
    },
    {
      id: '12',
      title: 'Misterio',
      description: 'Serie peruana de drama y ficción que narra historias de la vida real con un toque de misterio. Cada episodio presenta casos basados en hechos reales que mantienen al espectador en suspenso.',
      thumbnail: `${GITHUB_IMAGES_BASE}misterioThumbnail.png`,
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
      thumbnail: `${GITHUB_IMAGES_BASE}alFondoThumbnail.png`,
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
    {
      id: '16',
      title: 'El Padrino',
      description: 'La épica saga de la familia Corleone y su ascenso en el mundo del crimen organizado en Nueva York. Una obra maestra del cine que explora temas de poder, lealtad y familia.',
      thumbnail: `${GITHUB_IMAGES_BASE}elPadrino.jpg`,
      duration: '2h 55min',
      rating: 4.9,
      category: 'Película',
      isLocal: false,
      activeWatchParties: 8
    },
    {
      id: '17',
      title: 'Scarface',
      description: 'La historia de Tony Montana, un refugiado cubano que construye un imperio del narcotráfico en Miami, pero descubre que el precio del poder es devastador.',
      thumbnail: `${GITHUB_IMAGES_BASE}scarface.jpg`,
      duration: '2h 50min',
      rating: 4.8,
      category: 'Película',
      isLocal: false,
      activeWatchParties: 6
    },
    {
      id: '18',
      title: 'Iron Man',
      description: 'Tony Stark, un genio multimillonario, construye una armadura tecnológica para escapar de sus captores y se convierte en el superhéroe Iron Man para proteger al mundo.',
      thumbnail: `${GITHUB_IMAGES_BASE}ironman.jpg`,
      duration: '2h 6min',
      rating: 4.7,
      category: 'Película',
      isLocal: false,
      activeWatchParties: 10
    },
    {
      id: '19',
      title: 'Los Increíbles',
      description: 'Una familia de superhéroes retirados debe volver a la acción para salvar al mundo. Una aventura animada llena de acción, humor y corazón para toda la familia.',
      thumbnail: `${GITHUB_IMAGES_BASE}losIncreibles.jpg`,
      duration: '1h 55min',
      rating: 4.8,
      category: 'Película',
      isLocal: false,
      activeWatchParties: 7
    },
    {
      id: '20',
      title: 'El Correcaminos',
      description: 'Película peruana que narra la historia de un joven corredor de los Andes que persigue su sueño de convertirse en atleta profesional, enfrentando obstáculos sociales y económicos.',
      thumbnail: `${GITHUB_IMAGES_BASE}elCorrecaminos.jpg`,
      duration: '1h 45min',
      rating: 4.6,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 3
    },
    {
      id: '21',
      title: 'Wiñaypacha',
      description: 'Conmovedora película peruana en quechua que retrata la vida de una pareja de ancianos en los Andes peruanos, esperando el regreso de su hijo mientras enfrentan la soledad y las duras condiciones de la montaña.',
      thumbnail: `${GITHUB_IMAGES_BASE}winaypacha.jpg`,
      duration: '1h 27min',
      rating: 4.7,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 4
    },
    {
      id: '22',
      title: 'Pataclaun',
      description: 'Icónica serie de humor peruano que marcó a toda una generación con sus sketches inolvidables, personajes absurdos y una comedia física única que revolucionó la televisión peruana en los años 90.',
      thumbnail: `${GITHUB_IMAGES_BASE}pataclaun.jpg`,
      duration: '6 temporadas',
      rating: 4.9,
      category: 'Serie',
      isLocal: true,
      activeWatchParties: 9
    },
    {
      id: '23',
      title: 'La Gran Sangre',
      description: 'Serie peruana que combina drama familiar con el apasionante mundo de la lucha libre. Sigue las rivalidades, amores y secretos de los luchadores más emblemáticos del cuadrilátero peruano.',
      thumbnail: `${GITHUB_IMAGES_BASE}laGranSangre.jpg`,
      duration: '4 temporadas',
      rating: 4.7,
      category: 'Serie',
      isLocal: true,
      activeWatchParties: 7
    },
    {
      id: '24',
      title: 'Breaking Bad',
      description: 'Un profesor de química con cáncer se convierte en fabricante de metanfetaminas junto a un exalumno. Una obra maestra que explora la transformación moral de un hombre ordinario en un señor del crimen.',
      thumbnail: `${GITHUB_IMAGES_BASE}breakingBad.jpg`,
      duration: '5 temporadas',
      rating: 5.0,
      category: 'Serie',
      isLocal: false,
      activeWatchParties: 15
    },
    {
      id: '25',
      title: 'The Boys',
      description: 'En un mundo donde los superhéroes son celebridades corruptas, un grupo de vigilantes lucha por exponer la verdad sobre estos "héroes" y la siniestra corporación que los respalda.',
      thumbnail: `${GITHUB_IMAGES_BASE}theBoys.jpg`,
      duration: '4 temporadas',
      rating: 4.8,
      category: 'Serie',
      isLocal: false,
      activeWatchParties: 12
    },
    {
      id: '26',
      title: 'Avatar: La Leyenda de Aang',
      description: 'Serie animada épica que sigue a Aang, el último Maestro del Aire, en su viaje para dominar los cuatro elementos y traer paz a un mundo dividido por la guerra.',
      thumbnail: `${GITHUB_IMAGES_BASE}avatar.jpg`,
      duration: '3 temporadas',
      rating: 4.9,
      category: 'Serie',
      isLocal: false,
      activeWatchParties: 11
    },
    {
      id: '27',
      title: 'The Office',
      description: 'Comedia en formato de falso documental que retrata la vida diaria de los empleados de Dunder Mifflin, una empresa de papel, con humor incómodo, personajes memorables y momentos icónicos.',
      thumbnail: `${GITHUB_IMAGES_BASE}theOffice.jpg`,
      duration: '9 temporadas',
      rating: 4.8,
      category: 'Serie',
      isLocal: false,
      activeWatchParties: 10
    },
    {
      id: '28',
      title: 'Yo Soy',
      description: 'El exitoso programa de imitación peruano donde talentosos artistas se transforman en sus ídolos musicales. Un espectáculo lleno de talento, humor y entretenimiento que cautiva a toda la familia.',
      thumbnail: `${GITHUB_IMAGES_BASE}yoSoy.jpg`,
      duration: 'Múltiples temporadas',
      rating: 4.6,
      category: 'TV Show',
      isLocal: true,
      activeWatchParties: 8
    },
    {
      id: '29',
      title: 'ALF',
      description: 'Serie clásica de los 80 sobre un extraterrestre peludo y sarcástico que aterriza en el garaje de una familia suburbana. Comedia familiar llena de humor intergaláctico y momentos entrañables.',
      thumbnail: `${GITHUB_IMAGES_BASE}alf.jpg`,
      duration: '4 temporadas',
      rating: 4.5,
      category: 'TV Show',
      isLocal: false,
      activeWatchParties: 6
    },
    {
      id: '30',
      title: 'Hora de Aventura',
      description: 'Serie animada que sigue las aventuras de Finn el Humano y Jake el Perro en la Tierra de Ooo. Una mezcla única de humor absurdo, fantasía épica y momentos emotivos que conquistó a todas las edades.',
      thumbnail: `${GITHUB_IMAGES_BASE}horaDeAventura.jpg`,
      duration: '10 temporadas',
      rating: 4.9,
      category: 'TV Show',
      isLocal: false,
      activeWatchParties: 9
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

  const handlePlayContent = (contentId: string) => {
    const content = contents.find(c => c.id === contentId);
    if (content) {
      setSelectedContent(content);
      navigate('/player');
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
      navigate('/watchparty');
      toast.success('Unido a Watch Party', {
        description: `Te has unido a la sala de ${content.title}`,
        closeButton: true
      });
    }
  };

  const handleCloseWatchParty = () => {
    setSelectedContent(null);
    navigate('/');
    toast.info('Has salido de la Watch Party', {
      closeButton: true
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (location.pathname !== '/') {
      navigate('/');
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
    navigate('/');
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
        onSearch={handleSearch}
        accessibilityMode={accessibilityMode}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={
          <HomePage
            contents={contents}
            onPlayContent={handlePlayContent}
            onJoinWatchParty={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
            searchQuery={searchQuery}
          />
        } />
        <Route path="/catalog" element={
          <HomePage
            contents={contents}
            onPlayContent={handlePlayContent}
            onJoinWatchParty={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
            searchQuery={searchQuery}
          />
        } />
        <Route path="/movies" element={
          <HomePage
            contents={contents.filter(c => c.category === 'Película')}
            onPlayContent={handlePlayContent}
            onJoinWatchParty={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
            searchQuery={searchQuery}
            categoryFilter="Película"
          />
        } />
        <Route path="/series" element={
          <HomePage
            contents={contents.filter(c => c.category === 'Serie')}
            onPlayContent={handlePlayContent}
            onJoinWatchParty={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
            searchQuery={searchQuery}
            categoryFilter="Serie"
          />
        } />
        <Route path="/tvshows" element={
          <HomePage
            contents={contents.filter(c => c.category === 'TV Show')}
            onPlayContent={handlePlayContent}
            onJoinWatchParty={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
            searchQuery={searchQuery}
            categoryFilter="TV Show"
          />
        } />
        <Route path="/watchparties" element={
          <WatchPartyList
            rooms={watchPartyRooms}
            onJoinRoom={handleJoinWatchParty}
            accessibilityMode={accessibilityMode}
          />
        } />
        <Route path="/player" element={
          selectedContent ? (
            <WatchParty
              content={selectedContent}
              onClose={handleCloseWatchParty}
              accessibilityMode={accessibilityMode}
              onNavigate={navigate}
              onSearch={handleSearch}
              onLogout={handleLogout}
            />
          ) : <Navigate to="/" />
        } />
        <Route path="/watchparty" element={
          selectedContent ? (
            <WatchParty
              content={selectedContent}
              onClose={handleCloseWatchParty}
              accessibilityMode={accessibilityMode}
              onNavigate={navigate}
              onSearch={handleSearch}
              onLogout={handleLogout}
            />
          ) : <Navigate to="/" />
        } />
        <Route path="/friends" element={
          <FriendsPage
            accessibilityMode={accessibilityMode}
          />
        } />
        <Route path="/settings" element={
          <AccessibilitySettings
            accessibilityMode={accessibilityMode}
            onToggleAccessibility={handleToggleAccessibility}
            onClose={() => setShowAccessibilitySettings(false)}
          />
        } />
      </Routes>

      {/* Show help button only when not watching content */}
      {location.pathname !== '/player' && location.pathname !== '/watchparty' && (
        <HelpButton accessibilityMode={accessibilityMode} />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}