import React, { useState } from 'react';
import { Language } from '../types/cv.types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface LanguagesFormProps {
  languages: Language[];
  onAdd: (lang: Language) => void;
  onUpdate: (id: string, data: Partial<Language>) => void;
  onDelete: (id: string) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({
  languages,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Language, 'id'>>({
    name: '',
    level: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd({ ...formData, id: Date.now().toString() });
    }
    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({ name: '', level: 50 });
  };

  const handleEdit = (l: Language) => {
    setFormData({ name: l.name, level: l.level });
    setEditingId(l.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const levelLabel = (level: number) => {
    if (level >= 90) return 'Bilingue';
    if (level >= 75) return 'Courant';
    if (level >= 50) return 'Intermédiaire';
    return 'Débutant';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Langues</h2>
          <p className="text-gray-600">Ajoutez vos langues et niveaux</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la langue' : 'Nouvelle langue'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Français, Anglais, Espagnol"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau: {formData.level}% ({levelLabel(formData.level)})
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={formData.level}
                onChange={(e) => setFormData(f => ({ ...f, level: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {languages.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">Aucune langue ajoutée</p>
          </div>
        )}
        {languages.map((l) => (
          <div key={l.id} className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{l.name}</h4>
                <p className="text-sm text-gray-600">Niveau: {l.level}% ({levelLabel(l.level)})</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(l)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(l.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesForm;
