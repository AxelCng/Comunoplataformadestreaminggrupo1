import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, X, Mic, MicOff, MessageSquare, MessageSquareOff, Video, VideoOff, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface VideoPlayerProps {
  title: string;
  thumbnail: string;
  onClose?: () => void;
  accessibilityMode: boolean;
  isMicOn?: boolean;
  onMicToggle?: () => void;
  isCameraOn?: boolean;
  onCameraToggle?: () => void;
  isChatVisible?: boolean;
  onChatToggle?: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function VideoPlayer({ 
  title, 
  thumbnail, 
  onClose, 
  accessibilityMode,
  isMicOn,
  onMicToggle,
  isCameraOn,
  onCameraToggle,
  isChatVisible,
  onChatToggle,
  onFullscreenChange
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes mock duration
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Streaming options states
  const [videoQuality, setVideoQuality] = useState<'auto' | '4K' | '1080p' | '720p' | '480p' | '360p'>('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [subtitles, setSubtitles] = useState<'es' | 'en' | 'pt' | 'none'>('none');
  const [audioTrack, setAudioTrack] = useState<'es' | 'en' | 'descriptive'>('es');

  // Accordion states for settings menu
  const [expandedSections, setExpandedSections] = useState<{
    quality: boolean;
    speed: boolean;
    subtitles: boolean;
    audio: boolean;
  }>({
    quality: false,
    speed: false,
    subtitles: false,
    audio: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        onFullscreenChange?.(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        onFullscreenChange?.(false);
      }
    } catch (error) {
      // Fallback: use CSS-based fullscreen if native API is blocked
      const newFullscreenState = !isFullscreen;
      setIsFullscreen(newFullscreenState);
      onFullscreenChange?.(newFullscreenState);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      onFullscreenChange?.(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  // Handlers for streaming options
  const handleQualityChange = (quality: typeof videoQuality) => {
    setVideoQuality(quality);
    const qualityLabels = {
      'auto': 'Automática',
      '4K': '4K (2160p)',
      '1080p': 'Full HD (1080p)',
      '720p': 'HD (720p)',
      '480p': 'SD (480p)',
      '360p': 'Baja (360p)'
    };
    toast.success('Calidad de video cambiada', {
      description: `Ahora reproduciendo en calidad ${qualityLabels[quality]}`,
      closeButton: true
    });
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    toast.success('Velocidad de reproducción cambiada', {
      description: `Ahora reproduciendo a ${speed}x`,
      closeButton: true
    });
  };

  const handleSubtitlesChange = (subtitle: typeof subtitles) => {
    setSubtitles(subtitle);
    const subtitleLabels = {
      'es': 'Español',
      'en': 'Inglés',
      'pt': 'Portugués',
      'none': 'Sin subtítulos'
    };
    toast.success('Subtítulos cambiados', {
      description: subtitleLabels[subtitle],
      closeButton: true
    });
  };

  const handleAudioTrackChange = (track: typeof audioTrack) => {
    setAudioTrack(track);
    const trackLabels = {
      'es': 'Español (Original)',
      'en': 'Inglés',
      'descriptive': 'Audio descriptivo'
    };
    toast.success('Pista de audio cambiada', {
      description: trackLabels[track],
      closeButton: true
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black group ${
        isFullscreen && !document.fullscreenElement 
          ? 'fixed inset-0 z-50' 
          : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-contain"
        />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-colors"
              aria-label="Reproducir video"
            >
              <Play className="w-16 h-16 text-white fill-white" />
            </button>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-white ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h3>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`text-white hover:bg-white/20 ${accessibilityMode ? 'w-12 h-12' : ''}`}
              aria-label="Cerrar reproductor"
            >
              <X className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="cursor-pointer"
            aria-label="Barra de progreso del video"
          />
          <div className="flex justify-between mt-1">
            <span className={`text-white ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
              {formatTime(currentTime)}
            </span>
            <span className={`text-white ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size={accessibilityMode ? 'lg' : 'icon'}
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
              ) : (
                <Play className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size={accessibilityMode ? 'lg' : 'icon'}
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                ) : (
                  <Volume2 className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                )}
              </Button>
              <div className="w-24 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (value[0] > 0) setIsMuted(false);
                  }}
                  aria-label="Control de volumen"
                />
              </div>
            </div>

            {/* Microphone Toggle - only show if handler provided */}
            {onMicToggle && (
              <Button
                variant={isMicOn ? 'default' : 'ghost'}
                size={accessibilityMode ? 'lg' : 'icon'}
                onClick={onMicToggle}
                className={`${
                  isMicOn 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
                aria-label={isMicOn ? 'Desactivar micrófono' : 'Activar micrófono'}
              >
                {isMicOn ? (
                  <Mic className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                ) : (
                  <MicOff className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                )}
              </Button>
            )}

            {/* Camera Toggle - only show if handler provided */}
            {onCameraToggle && (
              <Button
                variant={isCameraOn ? 'default' : 'ghost'}
                size={accessibilityMode ? 'lg' : 'icon'}
                onClick={onCameraToggle}
                className={`${
                  isCameraOn 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
                aria-label={isCameraOn ? 'Desactivar cámara' : 'Activar cámara'}
              >
                {isCameraOn ? (
                  <Video className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                ) : (
                  <VideoOff className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Chat Toggle - only show if handler provided */}
            {onChatToggle && (
              <Button
                variant="ghost"
                size={accessibilityMode ? 'lg' : 'icon'}
                onClick={onChatToggle}
                className="text-white hover:bg-white/20"
                aria-label={isChatVisible ? 'Ocultar chat' : 'Mostrar chat'}
              >
                {isChatVisible ? (
                  <MessageSquare className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                ) : (
                  <MessageSquareOff className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                )}
              </Button>
            )}
            
            {/* Settings Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={accessibilityMode ? 'lg' : 'icon'}
                  className="text-white hover:bg-white/20"
                  aria-label="Configuración de video"
                >
                  <Settings className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-gray-900 border-gray-700 text-white w-64 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                align="end"
                sideOffset={8}
              >
                {/* Quality Section */}
                <div className="border-b border-gray-800">
                  <button
                    onClick={() => toggleSection('quality')}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm">Calidad de video</span>
                    {expandedSections.quality ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.quality && (
                    <div className="pb-2">
                      {(['auto', '4K', '1080p', '720p', '480p', '360p'] as const).map((quality) => (
                        <DropdownMenuItem
                          key={quality}
                          onClick={() => handleQualityChange(quality)}
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 flex items-center justify-between px-3 py-2 mx-2"
                        >
                          <span>
                            {quality === 'auto' ? 'Automática' : quality}
                            {quality !== 'auto' && quality === '4K' && ' (2160p)'}
                            {quality === '1080p' && ' - Full HD'}
                            {quality === '720p' && ' - HD'}
                          </span>
                          {videoQuality === quality && (
                            <Check className="w-4 h-4 text-purple-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>

                {/* Playback Speed Section */}
                <div className="border-b border-gray-800">
                  <button
                    onClick={() => toggleSection('speed')}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm">Velocidad de reproducción</span>
                    {expandedSections.speed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.speed && (
                    <div className="pb-2">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <DropdownMenuItem
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 flex items-center justify-between px-3 py-2 mx-2"
                        >
                          <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
                          {playbackSpeed === speed && (
                            <Check className="w-4 h-4 text-purple-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitles Section */}
                <div className="border-b border-gray-800">
                  <button
                    onClick={() => toggleSection('subtitles')}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm">Subtítulos</span>
                    {expandedSections.subtitles ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.subtitles && (
                    <div className="pb-2">
                      {[
                        { value: 'none' as const, label: 'Sin subtítulos' },
                        { value: 'es' as const, label: 'Español' },
                        { value: 'en' as const, label: 'Inglés' },
                        { value: 'pt' as const, label: 'Portugués' }
                      ].map((subtitle) => (
                        <DropdownMenuItem
                          key={subtitle.value}
                          onClick={() => handleSubtitlesChange(subtitle.value)}
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 flex items-center justify-between px-3 py-2 mx-2"
                        >
                          <span>{subtitle.label}</span>
                          {subtitles === subtitle.value && (
                            <Check className="w-4 h-4 text-purple-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audio Track Section */}
                <div>
                  <button
                    onClick={() => toggleSection('audio')}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm">Pista de audio</span>
                    {expandedSections.audio ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.audio && (
                    <div className="pb-2">
                      {[
                        { value: 'es' as const, label: 'Español (Original)' },
                        { value: 'en' as const, label: 'Inglés' },
                        { value: 'descriptive' as const, label: 'Audio descriptivo' }
                      ].map((audio) => (
                        <DropdownMenuItem
                          key={audio.value}
                          onClick={() => handleAudioTrackChange(audio.value)}
                          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 flex items-center justify-between px-3 py-2 mx-2"
                        >
                          <span>{audio.label}</span>
                          {audioTrack === audio.value && (
                            <Check className="w-4 h-4 text-purple-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size={accessibilityMode ? 'lg' : 'icon'}
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <Minimize className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
              ) : (
                <Maximize className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}