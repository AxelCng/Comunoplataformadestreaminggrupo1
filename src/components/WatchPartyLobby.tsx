import { useState } from 'react';
import { Button } from './ui/button';
import { X, Users, Copy, Share2, Play, Check, UserPlus, Mail, MessageSquare, Facebook, Instagram, MoreVertical, UserX, Star, Clock, Sparkles, Search, Filter, Zap, XCircle } from 'lucide-react';
import { Content } from './ContentCard';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface WatchPartyLobbyProps {
  content: Content;
  onClose: () => void;
  onStart: () => void;
  accessibilityMode: boolean;
  participantsList: Array<{ id: string; name: string; color: string }>;
  onParticipantsChange: (participants: Array<{ id: string; name: string; color: string }>) => void;
}

interface Participant {
  id: string;
  name: string;
  color: string;
  initials: string;
}

// Function to generate random room code
const generateRoomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export function WatchPartyLobby({ 
  content, 
  onClose, 
  onStart, 
  accessibilityMode,
  participantsList,
  onParticipantsChange
}: WatchPartyLobbyProps) {
  const [roomCode] = useState(() => generateRoomCode());
  const roomLink = `comuno.app/watch/${roomCode}`;
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'recent' | 'frequent'>('all');

  // Convert participantsList to include initials
  const participants: Participant[] = participantsList.map(p => ({
    ...p,
    initials: p.name.substring(0, 2).toUpperCase()
  }));

  // Mock friends list
  const friends = [
    {
      id: 'f1',
      username: 'Pedro Martínez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'online' as const
    },
    {
      id: 'f2',
      username: 'Lucía Fernández',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'online' as const
    },
    {
      id: 'f3',
      username: 'Diego Torres',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'online' as const
    },
    {
      id: 'f4',
      username: 'Sofía Ramírez',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      status: 'offline' as const
    },
    {
      id: 'f5',
      username: 'Roberto Méndez',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
      status: 'online' as const
    },
  ];

  const copyToClipboard = (text: string) => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => {
        // Fallback to textarea method
        return fallbackCopyToClipboard(text);
      });
    } else {
      // Use fallback method directly
      return fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand('copy');
      textarea.remove();
      return Promise.resolve();
    } catch (err) {
      textarea.remove();
      return Promise.reject(err);
    }
  };

  const handleCopyCode = () => {
    copyToClipboard(roomCode)
      .then(() => {
        setCopiedCode(true);
        toast.success('¡Código copiado!', {
          closeButton: true
        });
        setTimeout(() => setCopiedCode(false), 2000);
      })
      .catch(() => {
        toast.error('Error al copiar', {
          closeButton: true
        });
      });
  };

  const handleCopyLink = () => {
    copyToClipboard(roomLink)
      .then(() => {
        setCopiedLink(true);
        toast.success('¡Link copiado!', {
          closeButton: true
        });
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch(() => {
        toast.error('Error al copiar', {
          closeButton: true
        });
      });
  };

  const handleShare = async () => {
    setIsShareDialogOpen(true);
  };

  const shareMessage = `¡Únete a mi Watch Party en COMUNO! Estoy viendo "${content.title}". Código: ${roomCode} - Link: ${roomLink}`;

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
    toast.success('Abriendo WhatsApp', {
      closeButton: true
    });
    setIsShareDialogOpen(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Watch Party - ${content.title}`);
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success('Abriendo cliente de correo', {
      closeButton: true
    });
    setIsShareDialogOpen(false);
  };

  const handleShareSMS = () => {
    const url = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = url;
    toast.success('Abriendo SMS', {
      closeButton: true
    });
    setIsShareDialogOpen(false);
  };

  const handleShareInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we copy the link
    copyToClipboard(shareMessage)
      .then(() => {
        toast.success('Mensaje copiado', {
          description: 'Pega este mensaje en Instagram',
          closeButton: true
        });
      });
    setIsShareDialogOpen(false);
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(roomLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success('Abriendo Facebook', {
      closeButton: true
    });
    setIsShareDialogOpen(false);
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

    // Add new participants to the list
    const newParticipants = friends
      .filter(f => selectedFriends.includes(f.id))
      .map((f, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: f.username.split(' ')[0],
        color: ['#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#ec4899'][index % 5]
      }));

    onParticipantsChange([...participantsList, ...newParticipants]);

    toast.success('Invitaciones enviadas', {
      description: `Invitaciones enviadas a ${friendNames.join(', ')}`,
      closeButton: true
    });

    setSelectedFriends([]);
    setIsInviteDialogOpen(false);
  };

  const handleKickParticipant = (participantId: string, participantName: string) => {
    // Remove participant from list
    const updatedParticipants = participantsList.filter(p => p.id !== participantId);
    onParticipantsChange(updatedParticipants);

    toast.success(`${participantName} fue expulsado de la Watch Party`, {
      closeButton: true
    });
  };

  // Mock data for suggested friends (based on watch party history)
  const suggestedFriends = friends.filter(f => ['f1', 'f2', 'f3'].includes(f.id));

  // Filter and search friends
  const filteredFriends = friends.filter(friend => {
    // Search filter
    const matchesSearch = friend.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'online' && friend.status === 'online') ||
      (filterType === 'recent' && ['f1', 'f2'].includes(friend.id)) ||
      (filterType === 'frequent' && suggestedFriends.some(sf => sf.id === friend.id));
    
    return matchesSearch && matchesFilter;
  });

  // Quick action: Invite only online friends
  const handleInviteOnline = () => {
    const onlineIds = friends.filter(f => f.status === 'online').map(f => f.id);
    setSelectedFriends(onlineIds);
    toast.success('Amigos en línea seleccionados', {
      description: `${onlineIds.length} amigos en línea seleccionados`,
      closeButton: true
    });
  };

  // Quick action: Invite all friends
  const handleInviteAll = () => {
    const allIds = filteredFriends.map(f => f.id);
    setSelectedFriends(allIds);
    toast.success('Todos seleccionados', {
      description: `${allIds.length} amigos seleccionados`,
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

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ 
            backgroundImage: `url(${typeof content.thumbnail === 'string' ? content.thumbnail : ''})`,
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div>
            <h1 className={`text-white ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
              {content.title}
            </h1>
            <p className={`text-gray-300 mt-1 ${accessibilityMode ? 'text-lg' : 'text-sm'}`}>
              {content.duration} • Rating: {content.rating}/5
            </p>
          </div>
          <Button
            variant="ghost"
            size={accessibilityMode ? 'lg' : 'icon'}
            onClick={onClose}
            className="text-white hover:bg-red-600/90 hover:text-white bg-white/10 backdrop-blur-sm rounded-full transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 md:p-8">
          {/* Left Side - Room Info & Controls */}
          <div className="w-full max-w-md space-y-6">
            {/* Room Code Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-4">
                <p className={`text-gray-300 mb-2 ${accessibilityMode ? 'text-lg' : 'text-sm'}`}>
                  Código de sala
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-white tracking-wider ${accessibilityMode ? 'text-4xl' : 'text-3xl'}`}>
                    {roomCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    className="text-white hover:bg-white/10"
                    aria-label="Copiar código"
                  >
                    {copiedCode ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={onStart}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4"
                size={accessibilityMode ? 'lg' : 'default'}
              >
                <Play className={`${accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                Empezar
              </Button>

              {/* Share Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                    size={accessibilityMode ? 'lg' : 'default'}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                    size={accessibilityMode ? 'lg' : 'default'}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>

                {/* Invite Friends Button */}
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                      size={accessibilityMode ? 'lg' : 'default'}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invitar amigos
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
                    <div className="flex gap-2 mb-4">
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
                    <div className="flex gap-2 flex-wrap mb-4">
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

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {filteredFriends.map((friend) => (
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
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsInviteDialogOpen(false);
                          setSelectedFriends([]);
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

                {/* Share Options Dialog */}
                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className={accessibilityMode ? 'text-2xl' : 'text-xl'}>
                        Compartir Watch Party
                      </DialogTitle>
                      <DialogDescription className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                        Elige cómo compartir esta Watch Party con tus amigos
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {/* WhatsApp */}
                      <Button
                        onClick={handleShareWhatsApp}
                        className="h-auto flex flex-col items-center gap-2 p-4 bg-[#25D366] hover:bg-[#20BA5A] text-white"
                        size={accessibilityMode ? 'lg' : 'default'}
                      >
                        <MessageSquare className={accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} />
                        <span className={accessibilityMode ? 'text-base' : 'text-sm'}>WhatsApp</span>
                      </Button>

                      {/* Email */}
                      <Button
                        onClick={handleShareEmail}
                        className="h-auto flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white"
                        size={accessibilityMode ? 'lg' : 'default'}
                      >
                        <Mail className={accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} />
                        <span className={accessibilityMode ? 'text-base' : 'text-sm'}>Correo</span>
                      </Button>

                      {/* SMS */}
                      <Button
                        onClick={handleShareSMS}
                        className="h-auto flex flex-col items-center gap-2 p-4 bg-green-600 hover:bg-green-700 text-white"
                        size={accessibilityMode ? 'lg' : 'default'}
                      >
                        <MessageSquare className={accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} />
                        <span className={accessibilityMode ? 'text-base' : 'text-sm'}>SMS</span>
                      </Button>

                      {/* Instagram */}
                      <Button
                        onClick={handleShareInstagram}
                        className="h-auto flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white"
                        size={accessibilityMode ? 'lg' : 'default'}
                      >
                        <Instagram className={accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} />
                        <span className={accessibilityMode ? 'text-base' : 'text-sm'}>Instagram</span>
                      </Button>

                      {/* Facebook */}
                      <Button
                        onClick={handleShareFacebook}
                        className="h-auto flex flex-col items-center gap-2 p-4 bg-[#1877F2] hover:bg-[#145dbf] text-white col-span-2"
                        size={accessibilityMode ? 'lg' : 'default'}
                      >
                        <Facebook className={accessibilityMode ? 'w-8 h-8' : 'w-6 h-6'} />
                        <span className={accessibilityMode ? 'text-base' : 'text-sm'}>Facebook</span>
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setIsShareDialogOpen(false)}
                      className="w-full mt-4 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className={`text-white ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                  Acerca de esta película
                </h3>
              </div>
              
              <p className={`text-white leading-relaxed mb-4 ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                {content.description}
              </p>

              {/* Movie Details */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span className={`text-purple-100 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                    {content.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className={`text-purple-100 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                    {content.rating}/5
                  </span>
                </div>
                {content.isLocal && (
                  <div className="flex items-center gap-1 bg-green-600/30 px-2 py-1 rounded-full border border-green-500/30">
                    <span className={`text-green-300 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                      🌟 Producción Local
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Participants */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <Users className={`text-purple-400 ${accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'}`} />
                <h3 className={`text-white ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                  Participantes ({participants.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <Avatar className="w-10 h-10 border-2" style={{ borderColor: participant.color }}>
                      <AvatarFallback 
                        className="text-white"
                        style={{ backgroundColor: participant.color }}
                      >
                        {participant.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-white flex-1 ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                      {participant.name}
                    </span>
                    {participant.id === '1' ? (
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                        Host
                      </span>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end"
                          className="bg-gray-800 border-gray-700 text-white"
                        >
                          <DropdownMenuItem
                            onClick={() => handleKickParticipant(participant.id, participant.name)}
                            className="cursor-pointer hover:bg-red-600 focus:bg-red-600 text-red-400 focus:text-white"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Expulsar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>

              <div className={`mt-4 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                <p className="text-purple-200">
                  💡 Comparte el código o link para invitar a más amigos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}