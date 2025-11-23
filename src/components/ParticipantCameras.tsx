import { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, MoreVertical, UserX, MicOffIcon, VideoOffIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

export interface Participant {
  id: string;
  username: string;
  cameraOn: boolean;
  micOn: boolean;
  color: string;
}

interface ParticipantCamerasProps {
  accessibilityMode: boolean;
  participantsList: Array<{ id: string; name: string; color: string }>;
  isHost?: boolean;
  participantStates?: Record<string, { cameraOn?: boolean; micOn?: boolean }>;
  onKickParticipant?: (participantId: string) => void;
  onToggleMic?: (participantId: string) => void;
  onToggleCamera?: (participantId: string) => void;
}

export function ParticipantCameras({ 
  accessibilityMode, 
  participantsList, 
  isHost = false,
  participantStates = {},
  onKickParticipant,
  onToggleMic,
  onToggleCamera
}: ParticipantCamerasProps) {
  // Convert participantsList to full participant objects with camera/mic states
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Initialize and update participants when list changes
  useEffect(() => {
    setParticipants(prevParticipants => {
      // Create a map of existing participants to preserve their camera/mic states
      const existingMap = new Map(
        prevParticipants.map(p => [p.id, { cameraOn: p.cameraOn, micOn: p.micOn }])
      );

      // Map new participants list, preserving states or using defaults
      return participantsList.map(p => {
        const existingState = existingMap.get(p.id);
        const controlledState = participantStates[p.id];
        
        return {
          id: p.id,
          username: p.name,
          color: p.color,
          // If controlled by host (has participantStates), use those values
          // Otherwise, preserve existing or use random defaults
          cameraOn: controlledState !== undefined 
            ? (controlledState.cameraOn ?? true)
            : (existingState?.cameraOn ?? Math.random() > 0.3),
          micOn: controlledState !== undefined
            ? (controlledState.micOn ?? true)
            : (existingState?.micOn ?? Math.random() > 0.2),
        };
      });
    });
  }, [participantsList, participantStates]);

  // Simulate random camera/mic toggles (only when not host-controlled)
  useEffect(() => {
    if (isHost) return; // Don't simulate when host is controlling
    
    const interval = setInterval(() => {
      setParticipants(prev => {
        if (prev.length === 0) return prev;
        
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        
        if (Math.random() > 0.5) {
          updated[randomIndex].cameraOn = !updated[randomIndex].cameraOn;
        } else {
          updated[randomIndex].micOn = !updated[randomIndex].micOn;
        }
        
        return updated;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isHost]);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleKick = (participant: Participant) => {
    if (onKickParticipant) {
      onKickParticipant(participant.id);
      toast.success(`${participant.username} fue expulsado de la Watch Party`, {
        closeButton: true
      });
    }
  };

  const handleToggleMic = (participant: Participant) => {
    if (onToggleMic) {
      onToggleMic(participant.id);
      toast.success(
        participant.micOn 
          ? `Micrófono de ${participant.username} silenciado`
          : `Micrófono de ${participant.username} activado`,
        {
          closeButton: true
        }
      );
    }
  };

  const handleToggleCamera = (participant: Participant) => {
    if (onToggleCamera) {
      onToggleCamera(participant.id);
      toast.success(
        participant.cameraOn 
          ? `Cámara de ${participant.username} apagada`
          : `Cámara de ${participant.username} encendida`,
        {
          closeButton: true
        }
      );
    }
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white">
          <Video className="w-4 h-4" />
          <span className={accessibilityMode ? 'text-base' : 'text-sm'}>
            Participantes ({participants.length})
          </span>
          {isHost && (
            <span className="ml-auto text-[10px] bg-purple-600 px-1.5 py-0.5 rounded">
              Host
            </span>
          )}
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden group"
            >
              {/* Camera View */}
              {participant.cameraOn ? (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${participant.color}40, ${participant.color}20)` 
                  }}
                >
                  {/* Simulated video - usando el avatar como placeholder */}
                  <div className="text-4xl opacity-50">
                    {getInitials(participant.username)}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                  <VideoOff className="w-6 h-6 text-gray-600 mb-1" />
                  <span className="text-gray-500 text-[10px]">Cámara apagada</span>
                </div>
              )}

              {/* Username Badge */}
              <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <span 
                  className="text-white text-[10px]"
                  style={{ 
                    color: participant.color,
                  }}
                >
                  {participant.username}
                </span>
                {!participant.micOn && (
                  <MicOff className="w-2.5 h-2.5 text-red-500" />
                )}
              </div>

              {/* Host Controls - Top Left */}
              {isHost && participant.username !== 'Tú' && (
                <div className="absolute top-1 left-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 bg-black/70 hover:bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-3 h-3 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start"
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <DropdownMenuItem
                        onClick={() => handleToggleMic(participant)}
                        className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {participant.micOn ? (
                          <>
                            <MicOffIcon className="w-4 h-4 mr-2" />
                            Silenciar micrófono
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Activar micrófono
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleCamera(participant)}
                        className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {participant.cameraOn ? (
                          <>
                            <VideoOffIcon className="w-4 h-4 mr-2" />
                            Apagar cámara
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Encender cámara
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleKick(participant)}
                        className="cursor-pointer hover:bg-red-600 focus:bg-red-600 text-red-400 focus:text-white"
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Expulsar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Camera/Mic Status Icons - Top Right */}
              <div className="absolute top-1 right-1 flex gap-0.5">
                {participant.cameraOn ? (
                  <div className="bg-green-500/80 backdrop-blur-sm p-0.5 rounded">
                    <Video className="w-2.5 h-2.5 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500/80 backdrop-blur-sm p-0.5 rounded">
                    <VideoOff className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                {participant.micOn ? (
                  <div className="bg-green-500/80 backdrop-blur-sm p-0.5 rounded">
                    <Mic className="w-2.5 h-2.5 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500/80 backdrop-blur-sm p-0.5 rounded">
                    <MicOff className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
