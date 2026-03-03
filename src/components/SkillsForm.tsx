import React, { useState } from 'react';
import { Skill } from '../types/cv.types';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, data: Partial<Skill>) => void;
  onDelete: (id: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      const newSkill: Skill = {
        ...formData,
        id: Date.now().toString()
      };
      onAdd(newSkill);
    }
    
    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 50
    });
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level
    });
    setEditingId(skill.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const handleInputChange = (field: keyof Omit<Skill, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    if (level >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Avancé';
    if (level >= 40) return 'Intermédiaire';
    return 'Débutant';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compétences</h2>
          <p className="text-gray-600">Ajoutez vos compétences techniques et niveaux</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la compétence' : 'Nouvelle compétence'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Nom de la compétence
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="JavaScript, React, Python, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de maîtrise: {formData.level}% ({getSkillLevelLabel(formData.level)})
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) => handleInputChange('level', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Débutant</span>
                <span>Expert</span>
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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {skills.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune compétence ajoutée</p>
            <p className="text-sm text-gray-500 mt-2">Commencez par ajouter vos premières compétences</p>
          </div>
        )}

        {skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{skill.name}</h4>
                <p className="text-sm text-gray-500">
                  {getSkillLevelLabel(skill.level)} ({skill.level}%)
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(skill.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getSkillLevelColor(skill.level)}`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;