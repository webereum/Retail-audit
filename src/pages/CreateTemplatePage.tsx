import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import Step1Setup from '../components/TemplateWizard/Step1Setup';
import Step2Sections from '../components/TemplateWizard/Step2Sections';
import Step3Questions from '../components/TemplateWizard/Step3Questions';
import Step4Logic from '../components/TemplateWizard/Step4Logic';
import Step5Scoring from '../components/TemplateWizard/Step5Scoring';

const STEPS = [
  'Template Setup',
  'Define Sections',
  'Add Questions',
  'Configure Logic',
  'Scoring & Publish',
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function CreateTemplatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'Merchandising',
    sections: [],
    scoring_rules: { enabled: false, weights: {}, threshold: 80 },
    conditional_logic: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep === 0 && !templateData.name.trim()) {
      setError('Template name is required');
      return;
    }
    setError('');
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setError('');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...templateData, is_published: false })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }

      navigate('/templates');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!templateData.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (templateData.sections.length === 0) {
      setError('Please add at least one section');
      return;
    }

    const hasQuestions = templateData.sections.some((s: any) => s.questions && s.questions.length > 0);
    if (!hasQuestions) {
      setError('Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create template');
      }

      const result = await response.json();

      await fetch(`${API_URL}/templates/${result.template._id}/publish`, {
        method: 'PATCH'
      });

      navigate('/templates');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Setup data={templateData} onChange={setTemplateData} />;
      case 1:
        return <Step2Sections data={templateData} onChange={setTemplateData} />;
      case 2:
        return <Step3Questions data={templateData} onChange={setTemplateData} />;
      case 3:
        return <Step4Logic data={templateData} onChange={setTemplateData} />;
      case 4:
        return <Step5Scoring data={templateData} onChange={setTemplateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 transition ${
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
                      className={`text-xs font-medium text-center transition ${
                        index <= currentStep ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition ${
                        index < currentStep ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {renderStep()}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={loading || !templateData.name.trim()}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Draft'}
              </button>

              {currentStep === STEPS.length - 1 ? (
                <button
                  onClick={handlePublish}
                  disabled={loading || !templateData.name.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  {loading ? 'Publishing...' : 'Publish Template'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
