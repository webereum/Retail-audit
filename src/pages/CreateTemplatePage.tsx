import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';

const STEPS = [
  'Template Setup',
  'Define Sections',
  'Add Questions',
  'Configure Logic',
  'Scoring & Publish',
];

export default function CreateTemplatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'Merchandising',
    sections: [] as any[],
    scoringEnabled: false,
  });
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', templateData);
    navigate('/templates');
  };

  const handlePublish = () => {
    console.log('Publishing template:', templateData);
    navigate('/templates');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              Create New Template
            </h1>

            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 ${
                        index <= currentStep
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${
                        index <= currentStep ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        index < currentStep ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Template Setup
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateData.name}
                    onChange={(e) =>
                      setTemplateData({ ...templateData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="e.g., Shelf Compliance Audit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={templateData.description}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Brief description of the template"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={templateData.category}
                    onChange={(e) =>
                      setTemplateData({ ...templateData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option>Merchandising</option>
                    <option>Stock</option>
                    <option>Quality</option>
                    <option>Compliance</option>
                    <option>Safety</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Define Sections
                </h2>
                <p className="text-slate-600">
                  Organize your audit into logical sections
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <p className="text-slate-500 mb-4">No sections added yet</p>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
                    Add Section
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Add Questions
                </h2>
                <p className="text-slate-600">
                  Add questions to each section of your audit
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <p className="text-slate-500 mb-4">
                    Create sections first to add questions
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Configure Logic
                </h2>
                <p className="text-slate-600">
                  Set up conditional logic and question dependencies
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <p className="text-slate-500">Optional: Add conditional logic</p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Scoring & Publish
                </h2>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Enable Scoring</p>
                    <p className="text-sm text-slate-600">
                      Assign weights and calculate compliance scores
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateData.scoringEnabled}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          scoringEnabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-white transition"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              {currentStep === STEPS.length - 1 ? (
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish Template
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
