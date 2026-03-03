import React, { useState } from 'react';
import { Certification } from '../types/cv.types';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: (cert: Certification) => void;
  onUpdate: (id: string, data: Partial<Certification>) => void;
  onDelete: (id: string) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    date: ''
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
    setFormData({ name: '', issuer: '', date: '' });
  };

  const handleEdit = (c: Certification) => {
    setFormData({ name: c.name, issuer: c.issuer, date: c.date });
    setEditingId(c.id);
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
          <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
          <p className="text-gray-600">Ajoutez vos certificats et dates d’obtention</p>
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
            {editingId ? 'Modifier la certification' : 'Nouvelle certification'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la certification
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="month"
                  value={formData.date}
                  onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organisme
                </label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData(f => ({ ...f, issuer: e.target.value }))}
                  placeholder="Ex: Amazon Web Services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        {certifications.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune certification ajoutée</p>
          </div>
        )}

        {certifications.map((c) => (
          <div key={c.id} className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{c.name}</h4>
                <p className="text-sm text-gray-600">
                  {c.issuer || 'Organisme inconnu'} {c.date ? `• ${c.date}` : ''}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
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

export default CertificationsForm;
