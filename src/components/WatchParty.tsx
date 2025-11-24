import { useState, useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { ChatPanel, ChatMessage } from './ChatPanel';
import { ParticipantCameras } from './ParticipantCameras';
import { WatchPartyLobby } from './WatchPartyLobby';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { X, Users, UserPlus, Search, Star, Clock, Zap, Filter, XCircle } from 'lucide-react';
import { Content } from './ContentCard';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface WatchPartyProps {
  content: Content;
  onClose: () => void;
  accessibilityMode: boolean;
  currentView?: string;
  onNavigate?: (view: string) => void;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export function WatchParty({ 
  content, 
  onClose, 
  accessibilityMode,
  currentView = 'watchparty',
  onNavigate = () => {},
  onSearch = () => {},
  onLogout = () => {}
}: WatchPartyProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'recent' | 'frequent'>('all');
  
  // Lista de participantes activos - solo el anfitrión al inicio
  const [participantsList, setParticipantsList] = useState([
    { id: '1', name: 'Tú', color: '#a855f7' },
  ]);

  // Track participant states (camera/mic) - Initialize with user's own state
  const [participantStates, setParticipantStates] = useState<Record<string, { cameraOn: boolean; micOn: boolean }>>({
    '1': { cameraOn: false, micOn: false }
  });

  // Mock friends list with additional data
  const friends = [
    {
      id: 'f1',
      username: 'Andrés López',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'online' as const,
      watchPartyCount: 15,
      lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isSuggested: true
    },
    {
      id: 'f2',
      username: 'Carmen Vega',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'online' as const,
      watchPartyCount: 12,
      lastSeen: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isSuggested: true
    },
    {
      id: 'f3',
      username: 'José Ruiz',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'online' as const,
      watchPartyCount: 8,
      lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isSuggested: false
    },
    {
      id: 'f4',
      username: 'Isabel Moreno',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      status: 'offline' as const,
      watchPartyCount: 10,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isSuggested: false
    },
    {
      id: 'f5',
      username: 'Fernando Castro',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
      status: 'online' as const,
      watchPartyCount: 6,
      lastSeen: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isSuggested: false
    },
    {
      id: 'f6',
      username: 'Laura Méndez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      status: 'online' as const,
      watchPartyCount: 18,
      lastSeen: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      isSuggested: true
    },
    {
      id: 'f7',
      username: 'Miguel Ángel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      status: 'offline' as const,
      watchPartyCount: 4,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isSuggested: false
    },
    {
      id: 'f8',
      username: 'Sofía Ramírez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'online' as const,
      watchPartyCount: 7,
      lastSeen: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
      isSuggested: false
    },
  ];

  useEffect(() => {
    // Simulate random messages from other participants (not "Tú")
    const interval = setInterval(() => {
      const randomMessages = [
        '¡Wow, qué escena!',
        'No puedo creer esto',
        '¿Vieron eso? 😮',
        'Esta parte es mi favorita',
        'Increíble actuación',
        'La música es espectacular',
        'Amo esta película',
      ];
      
      // Filter out "Tú" from participants who can send automatic messages
      const otherParticipants = participantsList.filter(p => p.name !== 'Tú');
      
      if (Math.random() > 0.7 && otherParticipants.length > 0) {
        const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          username: randomParticipant.name,
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          color: randomParticipant.color
        };
        setMessages(prev => [...prev.slice(-20), newMessage]); // Keep last 20 messages
      }
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [participantsList]);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'Tú',
      message,
      timestamp: new Date(),
      color: '#a855f7'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Update participant states for the user
    setParticipantStates(prev => ({
      ...prev,
      '1': {
        ...prev['1'],
        micOn: !isMicOn
      }
    }));
    toast.success(
      !isMicOn ? 'Micrófono activado' : 'Micrófono desactivado',
      {
        description: !isMicOn 
          ? 'Ahora puedes comunicarte por voz' 
          : 'Tu micrófono está silenciado',
        closeButton: true
      }
    );
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // Update participant states for the user
    setParticipantStates(prev => ({
      ...prev,
      '1': {
        ...prev['1'],
        cameraOn: !isCameraOn
      }
    }));
    toast.success(
      !isCameraOn ? 'Cámara activada' : 'Cámara desactivada',
      {
        description: !isCameraOn 
          ? 'Ahora puedes ver tu imagen' 
          : 'Tu cámara está apagada',
        closeButton: true
      }
    );
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    toast.info(
      !isChatVisible ? 'Chat visible' : 'Chat oculto',
      {
        description: !isChatVisible 
          ? 'El panel de chat ahora es visible' 
          : 'El panel de chat está oculto',
        closeButton: true
      }
    );
  };

  const handleFullscreenChange = (isFullscreenNow: boolean) => {
    // Hide chat when entering fullscreen, show when exiting
    setIsChatVisible(!isFullscreenNow);
    setIsFullscreen(isFullscreenNow);
  };

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSendInvites = () => {
    if (selectedFriends.length === 0) {
      toast.error('Selecciona al menos un amigo', {
        closeButton: true
      });
      return;
    }

    const friendNames = friends
      .filter(f => selectedFriends.includes(f.id))
      .map(f => f.username.split(' ')[0]);

    // Agregar nuevos participantes a la lista
    const newParticipants = friends
      .filter(f => selectedFriends.includes(f.id))
      .map((f, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: f.username.split(' ')[0],
        color: ['#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#ec4899'][index % 5]
      }));

    setParticipantsList(prev => [...prev, ...newParticipants]);

    toast.success('Invitaciones enviadas', {
      description: `${friendNames.join(', ')} se ${newParticipants.length === 1 ? 'unió' : 'unieron'} a la Watch Party`,
      closeButton: true
    });

    setSelectedFriends([]);
    setIsInviteDialogOpen(false);
  };

  // Filter friends based on search query and filter type
  const getFilteredFriends = () => {
    let filtered = friends;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'online':
        filtered = filtered.filter(f => f.status === 'online');
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
        break;
      case 'frequent':
        filtered = [...filtered].sort((a, b) => b.watchPartyCount - a.watchPartyCount);
        break;
    }

    return filtered;
  };

  // Get suggested friends
  const suggestedFriends = friends
    .filter(f => f.isSuggested)
    .sort((a, b) => b.watchPartyCount - a.watchPartyCount)
    .slice(0, 3);

  // Quick action: Invite all online friends
  const handleInviteAllOnline = () => {
    const onlineFriends = friends.filter(f => f.status === 'online').map(f => f.id);
    setSelectedFriends(onlineFriends);
    toast.success('Amigos en línea seleccionados', {
      description: `${onlineFriends.length} amigos seleccionados`,
      closeButton: true
    });
  };

  // Quick action: Invite all friends
  const handleInviteAll = () => {
    const allFriends = friends.map(f => f.id);
    setSelectedFriends(allFriends);
    toast.success('Todos los amigos seleccionados', {
      description: `${allFriends.length} amigos seleccionados`,
      closeButton: true
    });
  };

  // Quick action: Invite suggested friends
  const handleInviteSuggested = () => {
    const suggestedIds = suggestedFriends.map(f => f.id);
    setSelectedFriends(suggestedIds);
    toast.success('Amigos sugeridos seleccionados', {
      description: `${suggestedIds.length} amigos frecuentes seleccionados`,
      closeButton: true
    });
  };

  // Quick action: Deselect all friends
  const handleDeselectAll = () => {
    setSelectedFriends([]);
    toast.info('Selección eliminada', {
      description: 'Todos los amigos han sido deseleccionados',
      closeButton: true
    });
  };

  // Get filter label
  const getFilterLabel = () => {
    switch (filterType) {
      case 'all':
        return 'Todos';
      case 'online':
        return 'Solo en línea';
      case 'recent':
        return 'Recientes';
      case 'frequent':
        return 'Más usados';
    }
  };

  // Host management functions
  const handleKickParticipant = (participantId: string) => {
    const participant = participantsList.find(p => p.id === participantId);
    if (participant) {
      setParticipantsList(prev => prev.filter(p => p.id !== participantId));
      // Remove from participant states
      setParticipantStates(prev => {
        const newStates = { ...prev };
        delete newStates[participantId];
        return newStates;
      });
    }
  };

  const handleToggleMic = (participantId: string) => {
    setParticipantStates(prev => {
      const currentState = prev[participantId] || { cameraOn: true, micOn: true };
      return {
        ...prev,
        [participantId]: {
          ...currentState,
          micOn: !currentState.micOn
        }
      };
    });
  };

  const handleToggleCamera = (participantId: string) => {
    setParticipantStates(prev => {
      const currentState = prev[participantId] || { cameraOn: true, micOn: true };
      return {
        ...prev,
        [participantId]: {
          ...currentState,
          cameraOn: !currentState.cameraOn
        }
      };
    });
  };

  // Show lobby if not started yet
  if (!hasStarted) {
    return (
      <WatchPartyLobby
        content={content}
        onClose={onClose}
        onStart={handleStart}
        accessibilityMode={accessibilityMode}
        participantsList={participantsList}
        onParticipantsChange={setParticipantsList}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Navigation */}
      {!isFullscreen && (
        <Navigation
          currentView={currentView}
          onNavigate={onNavigate}
          onSearch={onSearch}
          accessibilityMode={accessibilityMode}
          onLogout={onLogout}
        />
      )}
      
      {/* Header */}
      {!isFullscreen && (
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
        <div>
          <h2 className={`text-white ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
            Watch Party
          </h2>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Users className="w-4 h-4" />
            <span className={accessibilityMode ? 'text-base' : 'text-sm'}>
              {participantsList.length} {participantsList.length === 1 ? 'persona viendo' : 'personas viendo'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Invite Friends Button */}
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size={accessibilityMode ? 'lg' : 'default'}
                className="bg-purple-600/20 border-purple-500/30 text-white hover:bg-purple-600/30"
              >
                <UserPlus className={`${accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />
                Invitar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className={accessibilityMode ? 'text-2xl' : 'text-xl'}>
                  Invitar amigos
                </DialogTitle>
                <DialogDescription className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                  Selecciona los amigos que quieres invitar a esta Watch Party
                </DialogDescription>
              </DialogHeader>

              {/* Search Bar and Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className={`
                      bg-gray-800 border-gray-700 text-white pl-10
                      focus-visible:ring-purple-500
                      ${accessibilityMode ? 'h-12 text-base' : 'h-10'}
                    `}
                  />
                </div>
                
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size={accessibilityMode ? 'default' : 'default'}
                      className={`
                        bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700
                        ${accessibilityMode ? 'h-12 px-4' : 'h-10 px-3'}
                      `}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {getFilterLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem
                      onClick={() => setFilterType('all')}
                      className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className={`flex items-center gap-2 ${filterType === 'all' ? 'text-purple-400' : 'text-white'}`}>
                        Todos
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType('online')}
                      className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className={`flex items-center gap-2 ${filterType === 'online' ? 'text-purple-400' : 'text-white'}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Solo en línea
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType('recent')}
                      className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className={`flex items-center gap-2 ${filterType === 'recent' ? 'text-purple-400' : 'text-white'}`}>
                        <Clock className="w-3 h-3" />
                        Recientes
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType('frequent')}
                      className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className={`flex items-center gap-2 ${filterType === 'frequent' ? 'text-purple-400' : 'text-white'}`}>
                        <Star className="w-3 h-3" />
                        Más usados
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInviteSuggested}
                  className="flex-1 min-w-[120px] bg-purple-600/10 border-purple-600/30 text-purple-300 hover:bg-purple-600/20"
                >
                  <Zap className="w-3 h-3 mr-1.5" />
                  Sugeridos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInviteAll}
                  className="flex-1 min-w-[120px] bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <Users className="w-3 h-3 mr-1.5" />
                  Invitar a todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={selectedFriends.length === 0}
                  className="flex-1 min-w-[140px] bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-3 h-3 mr-1.5" />
                  Deseleccionar
                </Button>
              </div>

              {/* Suggested Friends Section */}
              {filterType === 'all' && !searchQuery && suggestedFriends.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Sugerencias basadas en tu historial</span>
                  </div>
                  {suggestedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg hover:bg-purple-900/30 transition-colors cursor-pointer"
                      onClick={() => handleToggleFriend(friend.id)}
                    >
                      <Checkbox
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={() => handleToggleFriend(friend.id)}
                        className="border-purple-600"
                      />
                      <Avatar className="w-10 h-10 ring-2 ring-purple-600/50">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-white ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                            {friend.username}
                          </p>
                          <Badge className="bg-purple-600/30 text-purple-300 text-xs">
                            <Star className="w-2.5 h-2.5 mr-0.5" />
                            Frecuente
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className="text-xs text-gray-400">
                            {friend.status === 'online' ? 'En línea' : 'Sin conexión'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {friend.watchPartyCount} Watch Parties
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Friends List */}
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-2">
                  {(filterType !== 'all' || searchQuery) && getFilteredFriends().length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No se encontraron amigos</p>
                    </div>
                  )}
                  {getFilteredFriends().map((friend) => {
                    // Skip already shown suggested friends if showing all
                    if (filterType === 'all' && !searchQuery && friend.isSuggested) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => handleToggleFriend(friend.id)}
                      >
                        <Checkbox
                          checked={selectedFriends.includes(friend.id)}
                          onCheckedChange={() => handleToggleFriend(friend.id)}
                          className="border-gray-600"
                        />
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className={`text-white ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                            {friend.username}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <span className="text-xs text-gray-400">
                              {friend.status === 'online' ? 'En línea' : 'Sin conexión'}
                            </span>
                            {filterType === 'frequent' && (
                              <span className="text-xs text-gray-500 ml-2">
                                {friend.watchPartyCount} partidas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInviteDialogOpen(false);
                    setSelectedFriends([]);
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="flex-1 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendInvites}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={selectedFriends.length === 0}
                >
                  Enviar invitación ({selectedFriends.length})
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size={accessibilityMode ? 'lg' : 'icon'}
            onClick={onClose}
            className="text-white hover:bg-gray-800"
            aria-label="Salir de Watch Party"
          >
            <X className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
          </Button>
        </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="w-full h-full">
            <VideoPlayer
              title={content.title}
              thumbnail={content.thumbnail}
              accessibilityMode={accessibilityMode}
              isMicOn={isMicOn}
              onMicToggle={toggleMic}
              isCameraOn={isCameraOn}
              onCameraToggle={toggleCamera}
              isChatVisible={isChatVisible}
              onChatToggle={toggleChat}
              onFullscreenChange={handleFullscreenChange}
            />
          </div>
        </div>

        {/* Sidebar Panel - Desktop */}
        {isChatVisible && (
          <div className="hidden lg:flex lg:flex-col lg:w-96 xl:w-[450px] 2xl:w-[500px] bg-gray-900 border-l border-gray-800">
            {/* Cameras - Top Section */}
            <div className="h-56 border-b border-gray-800">
              <ParticipantCameras 
                accessibilityMode={accessibilityMode}
                participantsList={participantsList}
                participantStates={participantStates}
                isHost={true}
                onKickParticipant={handleKickParticipant}
                onToggleMic={handleToggleMic}
                onToggleCamera={handleToggleCamera}
              />
            </div>

            {/* Chat - Bottom Section */}
            <div className="flex-1 overflow-hidden">
              <ChatPanel
                messages={messages}
                participants={participantsList.length}
                onSendMessage={handleSendMessage}
                accessibilityMode={accessibilityMode}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Panel - Mobile (Bottom Sheet) */}
      {isChatVisible && (
        <div className="lg:hidden flex flex-col h-80 border-t border-gray-800 bg-gray-900">
          {/* Cameras - Top Section */}
          <div className="h-48 border-b border-gray-800">
            <ParticipantCameras 
              accessibilityMode={accessibilityMode}
              participantsList={participantsList}
              participantStates={participantStates}
              isHost={true}
              onKickParticipant={handleKickParticipant}
              onToggleMic={handleToggleMic}
              onToggleCamera={handleToggleCamera}
            />
          </div>

          {/* Chat - Bottom Section */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              participants={participantsList.length}
              onSendMessage={handleSendMessage}
              accessibilityMode={accessibilityMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}