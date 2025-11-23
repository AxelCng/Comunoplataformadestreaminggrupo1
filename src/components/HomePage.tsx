import { ContentCard, Content } from './ContentCard';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface HomePageProps {
  contents: Content[];
  onPlayContent: (contentId: string) => void;
  onJoinWatchParty: (contentId: string) => void;
  accessibilityMode: boolean;
  searchQuery: string;
  categoryFilter?: string;
}

export function HomePage({ contents, onPlayContent, onJoinWatchParty, accessibilityMode, searchQuery, categoryFilter }: HomePageProps) {
  // Filter contents based on search query
  const filteredContents = searchQuery
    ? contents.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contents;

  // Group contents by category
  const localContent = filteredContents.filter(c => c.isLocal);
  const documentaries = filteredContents.filter(c => c.category === 'Documental');
  const independent = filteredContents.filter(c => c.category === 'Independiente');
  const trending = filteredContents.filter(c => c.activeWatchParties > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      {!searchQuery && !categoryFilter && contents.length > 0 && (
        <div className="relative h-[60vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${contents[0]?.thumbnail})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-col justify-end pb-12">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm">Destacado Local</span>
            </div>
            <h1 className={`text-white mb-3 max-w-2xl ${accessibilityMode ? 'text-4xl' : 'text-3xl md:text-5xl'}`}>
              {contents[0]?.title}
            </h1>
            <p className={`text-gray-300 mb-4 max-w-xl ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
              {contents[0]?.description}
            </p>
            <div className="flex gap-3">
              {contents[0]?.activeWatchParties > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  className={`border-white !text-white hover:!text-white hover:bg-white/20 bg-transparent ${accessibilityMode ? 'text-xl px-8 py-7' : ''}`}
                  onClick={() => onJoinWatchParty(contents[0]?.id)}
                >
                  Reproducir
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 space-y-8">
        {/* Category Filter View */}
        {categoryFilter && (
          <div>
            <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
              {categoryFilter === 'Película' ? '🎬 Películas' : categoryFilter === 'Serie' ? '📺 Series' : '📺 TV Shows'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredContents.map(content => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onPlay={() => onPlayContent(content.id)}
                  onJoinWatchParty={() => onJoinWatchParty(content.id)}
                  accessibilityMode={accessibilityMode}
                />
              ))}
            </div>
            {filteredContents.length === 0 && (
              <p className="text-gray-400 text-center py-12">
                No hay contenido disponible en esta categoría
              </p>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchQuery && !categoryFilter && (
          <div>
            <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
              Resultados para "{searchQuery}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredContents.map(content => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onPlay={() => onPlayContent(content.id)}
                  onJoinWatchParty={() => onJoinWatchParty(content.id)}
                  accessibilityMode={accessibilityMode}
                />
              ))}
            </div>
            {filteredContents.length === 0 && (
              <p className="text-gray-400 text-center py-12">
                No se encontraron resultados
              </p>
            )}
          </div>
        )}

        {!searchQuery && !categoryFilter && (
          <>
            {/* Trending Watch Parties */}
            {trending.length > 0 && (
              <section>
                <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
                  🎉 Watch Parties Activas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {trending.slice(0, 4).map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onPlay={() => onPlayContent(content.id)}
                      onJoinWatchParty={() => onJoinWatchParty(content.id)}
                      accessibilityMode={accessibilityMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Local Content */}
            {localContent.length > 0 && (
              <section>
                <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
                  🌟 Producciones Locales
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {localContent.slice(0, 4).map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onPlay={() => onPlayContent(content.id)}
                      onJoinWatchParty={() => onJoinWatchParty(content.id)}
                      accessibilityMode={accessibilityMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Documentaries */}
            {documentaries.length > 0 && (
              <section>
                <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
                  📽️ Documentales
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {documentaries.slice(0, 4).map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onPlay={() => onPlayContent(content.id)}
                      onJoinWatchParty={() => onJoinWatchParty(content.id)}
                      accessibilityMode={accessibilityMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Independent */}
            {independent.length > 0 && (
              <section>
                <h2 className={`text-white mb-4 ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
                  🎬 Cine Independiente
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {independent.slice(0, 4).map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onPlay={() => onPlayContent(content.id)}
                      onJoinWatchParty={() => onJoinWatchParty(content.id)}
                      accessibilityMode={accessibilityMode}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
