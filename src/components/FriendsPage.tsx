import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  UserPlus, 
  UserMinus, 
  Users, 
  Search, 
  Check, 
  X, 
  Clock,
  MessageSquare,
  Video,
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'watching';
  currentlyWatching?: string;
  friendSince: Date;
}

export interface FriendRequest {
  id: string;
  username: string;
  avatar?: string;
  requestDate: Date;
  type: 'incoming' | 'outgoing';
}

interface FriendsPageProps {
  accessibilityMode: boolean;
}

export function FriendsPage({ accessibilityMode }: FriendsPageProps) {
  const navigate = useNavigate();
  
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      username: 'María López',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'online',
      friendSince: new Date(2024, 8, 15)
    },
    {
      id: '2',
      username: 'Carlos Ruiz',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      status: 'watching',
      currentlyWatching: 'Voces del Barrio',
      friendSince: new Date(2024, 7, 20)
    },
    {
      id: '3',
      username: 'Ana García',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      status: 'offline',
      friendSince: new Date(2024, 6, 10)
    },
    {
      id: '4',
      username: 'Pedro Martínez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'online',
      friendSince: new Date(2024, 9, 5)
    },
    {
      id: '5',
      username: 'Lucía Fernández',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'watching',
      currentlyWatching: 'El Último Viaje',
      friendSince: new Date(2024, 5, 25)
    },
  ]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      username: 'Diego Torres',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      requestDate: new Date(Date.now() - 86400000),
      type: 'incoming'
    },
    {
      id: '2',
      username: 'Sofía Ramírez',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      requestDate: new Date(Date.now() - 172800000),
      type: 'incoming'
    },
  ]);

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock users for search
  const mockUsers = [
    { id: 'u1', username: 'Juan Silva', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { id: 'u2', username: 'Elena Castro', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 'u3', username: 'Roberto Méndez', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150' },
    { id: 'u4', username: 'Isabella Vargas', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  ];

  const handleSearchUsers = () => {
    if (searchUsername.trim()) {
      const results = mockUsers.filter(user => 
        user.username.toLowerCase().includes(searchUsername.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = (user: any) => {
    toast.success('Solicitud enviada', {
      description: `Se envió la solicitud de amistad a ${user.username}`,
      closeButton: true
    });
    setSearchResults([]);
    setSearchUsername('');
    setIsAddFriendOpen(false);
  };

  const handleAcceptRequest = (request: FriendRequest) => {
    const newFriend: Friend = {
      id: request.id,
      username: request.username,
      avatar: request.avatar,
      status: 'online',
      friendSince: new Date()
    };
    setFriends([...friends, newFriend]);
    setFriendRequests(friendRequests.filter(r => r.id !== request.id));
    toast.success('Solicitud aceptada', {
      description: `${request.username} ahora es tu amigo`,
      closeButton: true
    });
  };

  const handleRejectRequest = (request: FriendRequest) => {
    setFriendRequests(friendRequests.filter(r => r.id !== request.id));
    toast.info('Solicitud rechazada', {
      description: `Rechazaste la solicitud de ${request.username}`,
      closeButton: true
    });
  };

  const handleRemoveFriend = (friend: Friend) => {
    setFriends(friends.filter(f => f.id !== friend.id));
    toast.info('Amigo eliminado', {
      description: `${friend.username} fue eliminado de tu lista`,
      closeButton: true
    });
  };

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'watching':
        return 'bg-purple-500';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'watching':
        return 'Viendo';
      case 'offline':
        return 'Sin conexión';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-white hover:bg-gray-800 mb-6"
          size={accessibilityMode ? 'lg' : 'default'}
        >
          <ArrowLeft className={`${accessibilityMode ? 'w-6 h-6 mr-3' : 'w-4 h-4 mr-2'}`} />
          Volver
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-white ${accessibilityMode ? 'text-4xl' : 'text-3xl'} mb-2`}>
              Amigos
            </h1>
            <p className={`text-gray-400 ${accessibilityMode ? 'text-lg' : ''}`}>
              {friends.length} amigos • {friendRequests.filter(r => r.type === 'incoming').length} solicitudes pendientes
            </p>
          </div>

          <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                size={accessibilityMode ? 'lg' : 'default'}
              >
                <UserPlus className={`${accessibilityMode ? 'w-6 h-6 mr-3' : 'w-4 h-4 mr-2'}`} />
                Agregar amigo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className={accessibilityMode ? 'text-2xl' : ''}>
                  Agregar nuevo amigo
                </DialogTitle>
                <DialogDescription className={`text-gray-400 ${accessibilityMode ? 'text-base' : ''}`}>
                  Busca usuarios por su nombre de usuario
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar por nombre de usuario..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button onClick={handleSearchUsers} variant="secondary">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchResults.map((user) => (
                      <Card key={user.id} className="bg-gray-800 border-gray-700 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.username[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-white">{user.username}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSendFriendRequest(user)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="bg-transparent gap-2 w-full sm:w-auto">
            <TabsTrigger 
              value="friends" 
              className={`bg-gray-600 text-white data-[state=active]:bg-white data-[state=active]:text-black ${accessibilityMode ? 'text-base px-6 py-3' : ''}`}
            >
              <Users className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-2'}`} />
              Mis Amigos
            </TabsTrigger>
            <TabsTrigger 
              value="requests"
              className={`bg-gray-600 text-white data-[state=active]:bg-white data-[state=active]:text-black ${accessibilityMode ? 'text-base px-6 py-3' : ''}`}
            >
              <Clock className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-2'}`} />
              Solicitudes
              {friendRequests.filter(r => r.type === 'incoming').length > 0 && (
                <Badge className="ml-2 bg-red-500 hover:bg-red-600">
                  {friendRequests.filter(r => r.type === 'incoming').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="bg-gray-800/50 border-gray-700 p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <Avatar className={accessibilityMode ? 'w-16 h-16' : 'w-12 h-12'}>
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${getStatusColor(friend.status)}`} />
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-white ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                          {friend.username}
                        </h3>
                        <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'} mt-1`}>
                          {getStatusText(friend.status)}
                        </p>
                        {friend.currentlyWatching && (
                          <p className={`text-purple-400 ${accessibilityMode ? 'text-base' : 'text-sm'} mt-1`}>
                            {friend.currentlyWatching}
                          </p>
                        )}
                        <p className={`text-gray-500 ${accessibilityMode ? 'text-sm' : 'text-xs'} mt-2`}>
                          Amigos desde {friend.friendSince.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size={accessibilityMode ? 'default' : 'icon'}
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-950"
                        title="Enviar mensaje"
                      >
                        <MessageSquare className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                      </Button>
                      {friend.status === 'watching' && (
                        <Button
                          size={accessibilityMode ? 'default' : 'icon'}
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-950"
                          title="Unirse a Watch Party"
                        >
                          <Video className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                        </Button>
                      )}
                      <Button
                        size={accessibilityMode ? 'default' : 'icon'}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-950"
                        onClick={() => handleRemoveFriend(friend)}
                        title="Eliminar amigo"
                      >
                        <UserMinus className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friend Requests */}
          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              {friendRequests.filter(r => r.type === 'incoming').length === 0 && (
                <Card className="bg-gray-800/50 border-gray-700 p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className={`text-gray-400 ${accessibilityMode ? 'text-lg' : ''}`}>
                    No tienes solicitudes pendientes
                  </p>
                </Card>
              )}

              {friendRequests.filter(r => r.type === 'incoming').map((request) => (
                <Card key={request.id} className="bg-gray-800/50 border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className={accessibilityMode ? 'w-14 h-14' : 'w-12 h-12'}>
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback>{request.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className={`text-white ${accessibilityMode ? 'text-xl' : 'text-lg'}`}>
                          {request.username}
                        </h3>
                        <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                          Hace {Math.floor((Date.now() - request.requestDate.getTime()) / (1000 * 60 * 60 * 24))} días
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptRequest(request)}
                        className="bg-purple-600 hover:bg-purple-700"
                        size={accessibilityMode ? 'default' : 'sm'}
                      >
                        <Check className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1'}`} />
                        Aceptar
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest(request)}
                        variant="outline"
                        className="border-gray-600 text-black hover:bg-gray-700 hover:text-white"
                        size={accessibilityMode ? 'default' : 'sm'}
                      >
                        <X className={`${accessibilityMode ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1'}`} />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}