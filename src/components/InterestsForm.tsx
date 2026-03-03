import React, { useState } from 'react';
import { Interest } from '../types/cv.types';
import { Plus, Trash2 } from 'lucide-react';

interface InterestsFormProps {
  interests: Interest[];
  onAdd: (interest: Interest) => void;
  onDelete: (id: string) => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({ interests, onAdd, onDelete }) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim().length === 0) return;
    onAdd({ id: Date.now().toString(), name: value.trim() });
    setValue('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Centres d’intérêt</h2>
        <p className="text-gray-600">Ajoutez des loisirs ou activités</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="flex space-x-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex: Photographie, Randonnée, Échecs"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {interests.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun centre d’intérêt ajouté</p>
        )}
        {interests.map((i) => (
          <span
            key={i.id}
            className="inline-flex items-center px-3 py-1.5 bg-white border rounded-full text-sm text-gray-700"
          >
            {i.name}
            <button
              onClick={() => onDelete(i.id)}
              className="ml-2 text-gray-400 hover:text-red-600"
              aria-label="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default InterestsForm;
