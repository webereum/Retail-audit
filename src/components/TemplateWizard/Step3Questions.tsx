import { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye } from 'lucide-react';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
}

const QUESTION_TYPES = [
  { value: 'text_input', label: 'Text Input' },
  { value: 'numeric_input', label: 'Numeric Input' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date_time', label: 'Date/Time' },
  { value: 'file_upload', label: 'File Upload' },
  { value: 'barcode_scanner', label: 'Barcode Scanner' }
];

export default function Step3Questions({ data, onChange }: Step3Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [questionData, setQuestionData] = useState<any>({
    text: '',
    type: 'text_input',
    options: [''],
    mandatory: false,
    validation: {}
  });
  const [editingQuestion, setEditingQuestion] = useState<{ sectionIdx: number; questionIdx: number } | null>(null);

  const sections = data.sections || [];

  const handleAddQuestion = (sectionId: string) => {
    setSelectedSection(sectionId);
    setQuestionData({
      text: '',
      type: 'text_input',
      options: [''],
      mandatory: false,
      validation: {}
    });
    setEditingQuestion(null);
    setShowModal(true);
  };

  const handleEditQuestion = (sectionIdx: number, questionIdx: number) => {
    const question = sections[sectionIdx].questions[questionIdx];
    setSelectedSection(sections[sectionIdx].section_id);
    setQuestionData({
      text: question.text,
      type: question.type,
      options: question.options || [''],
      mandatory: question.mandatory || false,
      validation: question.validation || {}
    });
    setEditingQuestion({ sectionIdx, questionIdx });
    setShowModal(true);
  };

  const handleSaveQuestion = () => {
    if (!questionData.text.trim()) return;

    const sectionIdx = sections.findIndex((s: any) => s.section_id === selectedSection);
    if (sectionIdx === -1) return;

    const newQuestion = {
      question_id: editingQuestion ? sections[editingQuestion.sectionIdx].questions[editingQuestion.questionIdx].question_id : `q_${Date.now()}`,
      text: questionData.text,
      type: questionData.type,
      options: ['single_choice', 'multiple_choice', 'dropdown'].includes(questionData.type) ? questionData.options.filter((o: string) => o.trim()) : undefined,
      mandatory: questionData.mandatory,
      validation: questionData.type === 'numeric_input' ? questionData.validation : undefined
    };

    const updatedSections = [...sections];
    if (editingQuestion) {
      updatedSections[editingQuestion.sectionIdx].questions[editingQuestion.questionIdx] = newQuestion;
    } else {
      if (!updatedSections[sectionIdx].questions) {
        updatedSections[sectionIdx].questions = [];
      }
      updatedSections[sectionIdx].questions.push(newQuestion);
    }

    onChange({ ...data, sections: updatedSections });
    setShowModal(false);
  };

  const handleDeleteQuestion = (sectionIdx: number, questionIdx: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIdx].questions.splice(questionIdx, 1);
    onChange({ ...data, sections: updatedSections });
  };

  const addOption = () => {
    setQuestionData({ ...questionData, options: [...questionData.options, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = questionData.options.filter((_: string, i: number) => i !== index);
    setQuestionData({ ...questionData, options: newOptions });
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Please add sections first before adding questions</p>
        <button
          onClick={() => {}}
          className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          Go Back to Sections
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Add Questions</h2>
        <p className="text-slate-600 mt-1">Add questions to each section of your audit</p>
      </div>

      <div className="space-y-6">
        {sections.map((section: any, sectionIdx: number) => (
          <div key={section.section_id} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
              <button
                onClick={() => handleAddQuestion(section.section_id)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {(!section.questions || section.questions.length === 0) ? (
              <p className="text-sm text-slate-500 text-center py-4">No questions added yet</p>
            ) : (
              <div className="space-y-3">
                {section.questions.map((question: any, questionIdx: number) => (
                  <div
                    key={question.question_id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{question.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                            {QUESTION_TYPES.find(t => t.value === question.type)?.label}
                          </span>
                          {question.mandatory && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditQuestion(sectionIdx, questionIdx)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(sectionIdx, questionIdx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Question Text *
                </label>
                <input
                  type="text"
                  value={questionData.text}
                  onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Question Type *
                </label>
                <select
                  value={questionData.type}
                  onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                >
                  {QUESTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {['single_choice', 'multiple_choice', 'dropdown'].includes(questionData.type) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {questionData.options.map((option: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                          placeholder={`Option ${index + 1}`}
                        />
                        {questionData.options.length > 1 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addOption}
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              )}

              {questionData.type === 'numeric_input' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      value={questionData.validation.min || ''}
                      onChange={(e) => setQuestionData({
                        ...questionData,
                        validation: { ...questionData.validation, min: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      value={questionData.validation.max || ''}
                      onChange={(e) => setQuestionData({
                        ...questionData,
                        validation: { ...questionData.validation, max: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={questionData.mandatory}
                  onChange={(e) => setQuestionData({ ...questionData, mandatory: e.target.checked })}
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                />
                <label htmlFor="mandatory" className="ml-2 text-sm text-slate-700">
                  Make this question mandatory
                </label>
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
                onClick={handleSaveQuestion}
                disabled={!questionData.text.trim()}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {editingQuestion ? 'Update' : 'Add'} Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
