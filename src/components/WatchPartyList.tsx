import { Users, Play, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Content } from './ContentCard';

interface WatchPartyRoom {
  id: string;
  content: Content;
  host: string;
  participants: number;
  startedAt: Date;
}

interface WatchPartyListProps {
  rooms: WatchPartyRoom[];
  onJoinRoom: (contentId: string) => void;
  accessibilityMode: boolean;
}

export function WatchPartyList({ rooms, onJoinRoom, accessibilityMode }: WatchPartyListProps) {
  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-white mb-3 ${accessibilityMode ? 'text-3xl' : 'text-2xl'}`}>
            Watch Parties Activas
          </h1>
          <p className={`text-gray-400 ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
            Únete a una sala y ve contenido en simultáneo con otros usuarios
          </p>
        </div>

        {/* Active Rooms */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-all group">
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={room.content.thumbnail}
                    alt={room.content.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Live Indicator */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 hover:bg-red-700 animate-pulse text-[10px] px-1.5 py-0">
                      ● EN VIVO
                    </Badge>
                  </div>

                  {/* Participants */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <Users className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{room.participants}</span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className={`text-white mb-2 line-clamp-1 ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
                    {room.content.title}
                  </h3>
                  
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Users className="w-3.5 h-3.5" />
                      <span className={accessibilityMode ? 'text-sm' : 'text-xs'}>
                        Anfitrión: {room.host}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className={accessibilityMode ? 'text-sm' : 'text-xs'}>
                        {getTimeAgo(room.startedAt)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onJoinRoom(room.content.id)}
                    className={`w-full bg-purple-600 hover:bg-purple-700 ${
                      accessibilityMode ? 'text-base py-5' : 'text-sm'
                    }`}
                  >
                    <Users className="w-4 h-4 mr-1.5" />
                    Unirse a la Sala
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className={`text-white mb-2 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
              No hay Watch Parties activas
            </h3>
            <p className={`text-gray-400 ${accessibilityMode ? 'text-lg' : ''}`}>
              Sé el primero en crear una sala desde el catálogo
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/50">
          <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
            ¿Cómo funcionan las Watch Parties?
          </h2>
          <div className={`text-gray-300 space-y-3 ${accessibilityMode ? 'text-lg' : ''}`}>
            <p>
              • <strong>Ve contenido en sincronía</strong> con otros usuarios en tiempo real
            </p>
            <p>
              • <strong>Chatea en vivo</strong> mientras disfrutas de películas y series
            </p>
            <p>
              • <strong>Conecta con la comunidad</strong> y descubre nuevas perspectivas
            </p>
            <p>
              • <strong>Apoya el contenido local</strong> compartiendo la experiencia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
