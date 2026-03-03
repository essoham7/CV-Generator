import React, { useState } from 'react';
import { Education } from '../types/cv.types';
import { GraduationCap, Building2, Calendar } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onAdd: (item: Education) => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onDelete: (id: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    degree: '',
    institution: '',
    period: ''
  });

  const reset = () => {
    setFormData({ degree: '', institution: '', period: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.period.trim()) return;
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd({ ...formData, id: Date.now().toString() });
    }
    reset();
  };

  const handleEdit = (item: Education) => {
    setFormData({ degree: item.degree, institution: item.institution, period: item.period });
    setEditingId(item.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formation</h2>
          <p className="text-gray-600">Ajoutez vos diplômes, établissements et périodes</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la formation' : 'Nouvelle formation'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Type de formation
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData(f => ({ ...f, degree: e.target.value }))}
                  placeholder="Ex: Master, Licence, BTS..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Établissement / Structure
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(f => ({ ...f, institution: e.target.value }))}
                  placeholder="Ex: Université de Lomé"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Période
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData(f => ({ ...f, period: e.target.value }))}
                  placeholder="Ex: 2012 - 2013"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {education.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">Aucune formation ajoutée</p>
            <p className="text-sm text-gray-500 mt-2">Ajoutez vos diplômes et établissements</p>
          </div>
        )}

        {education.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{item.degree}</h4>
                <p className="text-sm text-gray-600">{item.institution}</p>
              </div>
              <p className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                {item.period}
              </p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => handleEdit(item)}
                className="mr-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;
