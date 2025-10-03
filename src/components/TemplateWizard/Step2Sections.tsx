import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

interface Step2Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step2Sections({ data, onChange }: Step2Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionData, setSectionData] = useState({ title: '', description: '' });

  const sections = data.sections || [];

  const handleAddSection = () => {
    setSectionData({ title: '', description: '' });
    setEditingSection(null);
    setShowModal(true);
  };

  const handleEditSection = (section: any, index: number) => {
    setSectionData({ title: section.title, description: section.description });
    setEditingSection(index);
    setShowModal(true);
  };

  const handleSaveSection = () => {
    if (!sectionData.title.trim()) return;

    const newSection = {
      section_id: editingSection !== null ? sections[editingSection].section_id : `section_${Date.now()}`,
      title: sectionData.title,
      description: sectionData.description,
      order: editingSection !== null ? sections[editingSection].order : sections.length + 1,
      questions: editingSection !== null ? sections[editingSection].questions : []
    };

    let updatedSections;
    if (editingSection !== null) {
      updatedSections = sections.map((s: any, i: number) => i === editingSection ? newSection : s);
    } else {
      updatedSections = [...sections, newSection];
    }

    onChange({ ...data, sections: updatedSections });
    setShowModal(false);
    setSectionData({ title: '', description: '' });
  };

  const handleDeleteSection = (index: number) => {
    const updatedSections = sections.filter((_: any, i: number) => i !== index);
    onChange({ ...data, sections: updatedSections });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Define Sections</h2>
          <p className="text-slate-600 mt-1">Organize your audit into logical sections</p>
        </div>
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-slate-500 mb-4">No sections added yet</p>
          <button
            onClick={handleAddSection}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Add First Section
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section: any, index: number) => (
            <div
              key={section.section_id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition"
            >
              <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {section.questions?.length || 0} question(s)
                </p>
              </div>
              <button
                onClick={() => handleEditSection(section, index)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteSection(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingSection !== null ? 'Edit Section' : 'Add New Section'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={sectionData.title}
                  onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g., Product Placement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={sectionData.description}
                  onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  placeholder="Brief description of this section"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                disabled={!sectionData.title.trim()}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {editingSection !== null ? 'Update' : 'Add'} Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
