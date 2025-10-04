import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  FileText,
  Award,
  Zap,
  AlertCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditDetail();
  }, [id]);

  const fetchAuditDetail = async () => {
    try {
      setLoading(true);
      const auditResponse = await fetch(`${API_URL}/audits/${id}`);
      const auditData = await auditResponse.json();
      setAudit(auditData.audit);

      if (auditData.audit.template_id) {
        const templateResponse = await fetch(
          `${API_URL}/templates/${auditData.audit.template_id}`
        );
        const templateData = await templateResponse.json();
        setTemplate(templateData.template);
      }
    } catch (error) {
      console.error('Failed to fetch audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'In Progress':
        return <Clock className="w-5 h-5" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const renderAnswer = (question: any, answer: any) => {
    if (answer === null || answer === undefined || answer === '') {
      return <span className="text-slate-400 italic">Not answered</span>;
    }

    switch (question.type) {
      case 'yes_no':
        return (
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              answer === 'Yes'
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-red-100 text-red-700 border-2 border-red-300'
            }`}
          >
            {answer === 'Yes' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {answer}
          </span>
        );

      case 'rating_scale':
        const rating = parseInt(answer);
        const maxRating = question.validation?.max || 5;
        return (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: maxRating }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                    i < rating
                      ? 'bg-amber-400 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <span className="text-lg font-bold text-slate-900">
              {rating} / {maxRating}
            </span>
          </div>
        );

      case 'multiple_choice':
        if (Array.isArray(answer)) {
          return (
            <div className="flex flex-wrap gap-2">
              {answer.map((item: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          );
        }
        return <span className="text-slate-900">{answer}</span>;

      case 'single_choice':
        return (
          <span className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium inline-block">
            {answer}
          </span>
        );

      case 'numeric_input':
        return (
          <span className="text-2xl font-bold text-slate-900">{answer}</span>
        );

      case 'image_upload':
        return (
          <div className="bg-slate-100 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <span className="text-slate-600">📷 Image uploaded</span>
          </div>
        );

      default:
        return <span className="text-slate-900">{answer}</span>;
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'yes_no':
        return '✓';
      case 'rating_scale':
        return '★';
      case 'multiple_choice':
        return '☐';
      case 'single_choice':
        return '○';
      case 'numeric_input':
        return '#';
      case 'image_upload':
        return '📷';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading audit details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!audit) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-slate-600">Audit not found</p>
            <button
              onClick={() => navigate('/audits')}
              className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Back to Audits
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const responses = audit.responses || {};
  const responsesMap = new Map();
  Object.entries(responses).forEach(([sectionId, sectionResponses]: [string, any]) => {
    Object.entries(sectionResponses).forEach(([questionId, answer]) => {
      responsesMap.set(questionId, answer);
    });
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Audits
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">{audit.template_name}</h1>
                  </div>
                  {template?.description && (
                    <p className="text-slate-300 text-lg">{template.description}</p>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium ${getStatusColor(
                    audit.status
                  )}`}
                >
                  {getStatusIcon(audit.status)}
                  {audit.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-white font-semibold text-lg">
                    {audit.location?.store_name || 'Unknown'}
                  </p>
                  {audit.location?.address && (
                    <p className="text-slate-300 text-sm">{audit.location.address}</p>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Submitted</span>
                  </div>
                  <p className="text-white font-semibold text-lg">
                    {audit.submitted_at
                      ? new Date(audit.submitted_at).toLocaleDateString()
                      : 'Not submitted'}
                  </p>
                  {audit.submitted_at && (
                    <p className="text-slate-300 text-sm">
                      {new Date(audit.submitted_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {audit.score !== null && audit.score !== undefined && (
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="flex items-center gap-3 text-slate-300 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">Score</span>
                    </div>
                    <p className="text-white font-bold text-3xl">{audit.score}%</p>
                  </div>
                )}
              </div>

              {template?.conditional_logic && template.conditional_logic.length > 0 && (
                <div className="mt-4 bg-yellow-500/20 backdrop-blur border-2 border-yellow-400/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-200">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      This audit used smart conditional logic with{' '}
                      {template.conditional_logic.length} rules
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {template?.sections && template.sections.length > 0 ? (
            <div className="space-y-6">
              {template.sections.map((section: any, sectionIndex: number) => (
                <div
                  key={section.section_id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {sectionIndex + 1}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-slate-600 mt-1">{section.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {section.questions?.map((question: any, qIndex: number) => {
                      const answer = responsesMap.get(question.question_id);
                      const wasAnswered =
                        answer !== null && answer !== undefined && answer !== '';

                      return (
                        <div
                          key={question.question_id}
                          className={`p-6 rounded-xl border-2 transition ${
                            wasAnswered
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-red-50/50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {getQuestionIcon(question.type)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                    {question.text}
                                    {question.mandatory && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </h3>
                                  <p className="text-xs text-slate-500 uppercase font-medium">
                                    {question.type.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4">
                                {renderAnswer(question, answer)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No responses recorded</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
