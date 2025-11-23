import { Play, Users, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  rating: number;
  category: string;
  isLocal: boolean;
  activeWatchParties: number;
}

interface ContentCardProps {
  content: Content;
  onPlay: () => void;
  onJoinWatchParty: () => void;
  accessibilityMode: boolean;
}

export function ContentCard({ content, onPlay, onJoinWatchParty, accessibilityMode }: ContentCardProps) {
  return (
    <Card className="group bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-all duration-300 hover:scale-105">
      <div className="relative aspect-video overflow-hidden">
        <ImageWithFallback
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {content.isLocal && (
            <Badge className="bg-green-600 hover:bg-green-700 text-[10px] px-1.5 py-0">
              Local
            </Badge>
          )}
          <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] px-1.5 py-0">
            {content.category}
          </Badge>
        </div>

        {/* Play Button */}
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Reproducir ${content.title}`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </button>

        {/* Watch Party Indicator */}
        {content.activeWatchParties > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-purple-600 px-1.5 py-0.5 rounded-full">
            <Users className="w-3 h-3" />
            <span className="text-[10px]">{content.activeWatchParties}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className={`text-white mb-1 line-clamp-1 ${accessibilityMode ? 'text-lg' : 'text-sm'}`}>
          {content.title}
        </h3>
        <p className={`text-gray-400 mb-2 line-clamp-2 ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
          {content.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{content.duration}</span>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{content.rating}</span>
            </div>
          </div>

          {content.activeWatchParties > 0 && (
            <button
              onClick={onJoinWatchParty}
              className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors"
              aria-label={`Unirse a Watch Party de ${content.title}`}
            >
              <Users className="w-3 h-3" />
              Unirse
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
