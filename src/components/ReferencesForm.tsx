import React, { useState } from 'react';
import { ReferenceContact } from '../types/cv.types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ReferencesFormProps {
  references: ReferenceContact[];
  onAdd: (ref: ReferenceContact) => void;
  onUpdate: (id: string, data: Partial<ReferenceContact>) => void;
  onDelete: (id: string) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({
  references,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ReferenceContact, 'id'>>({
    name: '',
    contact: ''
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
    setFormData({ name: '', contact: '' });
  };

  const handleEdit = (r: ReferenceContact) => {
    setFormData({ name: r.name, contact: r.contact });
    setEditingId(r.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Références</h2>
          <p className="text-gray-600">Ajoutez des contacts de recommandation</p>
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
            {editingId ? 'Modifier la référence' : 'Nouvelle référence'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Marie Dupont"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact (email ou téléphone)
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData(f => ({ ...f, contact: e.target.value }))}
                  placeholder="marie.dupont@email.com / +33 6 12 34 56 78"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
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
        {references.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">Aucune référence ajoutée</p>
          </div>
        )}
        {references.map((r) => (
          <div key={r.id} className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{r.name}</h4>
                <p className="text-sm text-gray-600">{r.contact}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(r.id)}
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

export default ReferencesForm;
