import { useState } from 'react';
import { Content } from './ContentCard';
import { X, Upload, Edit2, Save, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CatalogAdminProps {
  contents: Content[];
  onUpdateContents: (contents: Content[]) => void;
  accessToken: string;
  onClose: () => void;
  accessibilityMode: boolean;
}

export function CatalogAdmin({ contents, onUpdateContents, accessToken, onClose, accessibilityMode }: CatalogAdminProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Content>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = (content: Content) => {
    setEditingId(content.id);
    setEditForm({ ...content });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const newId = `${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      title: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1080&q=80',
      duration: '',
      rating: 0,
      category: 'Película',
      isLocal: true,
      activeWatchParties: 0
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (!editForm.title || !editForm.description || !editForm.duration) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (isAddingNew) {
      // Add new content
      onUpdateContents([...contents, editForm as Content]);
      toast.success('Contenido agregado exitosamente');
    } else {
      // Update existing content
      const updatedContents = contents.map(c => 
        c.id === editingId ? { ...c, ...editForm } : c
      );
      onUpdateContents(updatedContents);
      toast.success('Contenido actualizado exitosamente');
    }

    setEditingId(null);
    setEditForm({});
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setIsAddingNew(false);
  };

  const handleImageUpload = (contentId: string, file: File) => {
    try {
      setUploadingId(contentId);
      toast.info('Procesando imagen...');

      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;

        // Update the thumbnail in the form or content
        if (editingId === contentId) {
          setEditForm({ ...editForm, thumbnail: imageUrl });
        } else {
          const updatedContents = contents.map(c => 
            c.id === contentId ? { ...c, thumbnail: imageUrl } : c
          );
          onUpdateContents(updatedContents);
        }

        toast.success('Imagen cargada exitosamente');
        setUploadingId(null);
      };

      reader.onerror = () => {
        toast.error('Error al procesar la imagen');
        setUploadingId(null);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar imagen');
      setUploadingId(null);
    }
  };

  const handleFileSelect = (contentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen');
        return;
      }

      handleImageUpload(contentId, file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-white ${accessibilityMode ? 'text-4xl' : 'text-3xl'} font-bold mb-2`}>
                Administrar Catálogo
              </h1>
              <p className={`text-gray-400 ${accessibilityMode ? 'text-xl' : ''}`}>
                Edita películas y series, sube imágenes personalizadas
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddNew}
                className={`flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ${accessibilityMode ? 'text-xl' : ''}`}
              >
                <Plus className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
                Agregar Nuevo
              </button>
              <button
                onClick={onClose}
                className={`p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors`}
              >
                <X className={accessibilityMode ? 'w-6 h-6' : 'w-5 h-5'} />
              </button>
            </div>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {contents.map((content) => (
              <div
                key={content.id}
                className={`bg-gray-900 rounded-lg overflow-hidden ${
                  editingId === content.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {editingId === content.id ? (
                  // Edit Form
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Upload */}
                      <div>
                        <label className={`block text-gray-400 mb-2 ${accessibilityMode ? 'text-lg' : ''}`}>
                          Imagen
                        </label>
                        <div className="relative">
                          <img
                            src={editForm.thumbnail}
                            alt={editForm.title}
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 cursor-pointer rounded-lg transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileSelect(content.id, e)}
                              className="hidden"
                              disabled={uploadingId === content.id}
                            />
                            <div className="flex flex-col items-center gap-2 text-white">
                              {uploadingId === content.id ? (
                                <div className="animate-spin">⏳</div>
                              ) : (
                                <Upload className="w-8 h-8" />
                              )}
                              <span className={accessibilityMode ? 'text-lg' : ''}>
                                {uploadingId === content.id ? 'Procesando...' : 'Cambiar imagen'}
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className={`block text-gray-400 mb-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                            Título *
                          </label>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${accessibilityMode ? 'text-lg' : ''}`}
                            placeholder="Título de la película/serie"
                          />
                        </div>

                        <div>
                          <label className={`block text-gray-400 mb-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                            Duración *
                          </label>
                          <input
                            type="text"
                            value={editForm.duration || ''}
                            onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                            className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${accessibilityMode ? 'text-lg' : ''}`}
                            placeholder="ej: 2h 15min, 3 temporadas"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-gray-400 mb-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                              Categoría
                            </label>
                            <select
                              value={editForm.category || 'Película'}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${accessibilityMode ? 'text-lg' : ''}`}
                            >
                              <option value="Película">Película</option>
                              <option value="Serie">Serie</option>
                              <option value="TV Show">TV Show</option>
                              <option value="Documental">Documental</option>
                              <option value="Independiente">Independiente</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-gray-400 mb-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                              Rating (1-5)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={editForm.rating || 0}
                              onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
                              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${accessibilityMode ? 'text-lg' : ''}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-gray-400 mb-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                        Descripción *
                      </label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${accessibilityMode ? 'text-lg' : ''}`}
                        placeholder="Descripción del contenido"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={handleCancel}
                        className={`px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ${accessibilityMode ? 'text-lg' : ''}`}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ${accessibilityMode ? 'text-lg' : ''}`}
                      >
                        <Save className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex gap-4 p-4">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`text-white font-semibold ${accessibilityMode ? 'text-2xl' : 'text-xl'}`}>
                            {content.title}
                          </h3>
                          <div className={`flex gap-3 text-gray-400 mt-1 ${accessibilityMode ? 'text-lg' : ''}`}>
                            <span>{content.category}</span>
                            <span>•</span>
                            <span>{content.duration}</span>
                            <span>•</span>
                            <span>⭐ {content.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEdit(content)}
                          className={`p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors`}
                        >
                          <Edit2 className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                        </button>
                      </div>
                      <p className={`text-gray-400 line-clamp-2 ${accessibilityMode ? 'text-lg' : ''}`}>
                        {content.description}
                      </p>

                      {/* Quick Image Upload */}
                      <label className={`inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer transition-colors ${accessibilityMode ? 'text-lg' : ''}`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(content.id, e)}
                          className="hidden"
                          disabled={uploadingId === content.id}
                        />
                        <ImageIcon className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
                        {uploadingId === content.id ? 'Procesando...' : 'Cambiar imagen'}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
