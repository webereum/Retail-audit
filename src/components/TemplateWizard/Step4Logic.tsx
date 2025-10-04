import { useState } from 'react';
import { Plus, Trash2, Download, Zap, AlertCircle } from 'lucide-react';

interface Step4Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step4Logic({ data, onChange }: Step4Props) {
  const sections = data.sections || [];
  const conditionalLogic = data.conditional_logic || [];
  const [showAddRule, setShowAddRule] = useState(false);

  const allQuestions = sections.flatMap((section: any) =>
    (section.questions || []).map((q: any) => ({
      ...q,
      section_id: section.section_id,
      section_title: section.title,
    }))
  );

  const hasQuestions = allQuestions.length > 0;

  const addRule = () => {
    const newRule = {
      rule_id: `r${Date.now()}`,
      source_question_id: '',
      condition_type: 'equals',
      condition_value: '',
      action: 'show',
      target_question_ids: [],
    };

    onChange({
      ...data,
      conditional_logic: [...conditionalLogic, newRule],
    });
    setShowAddRule(false);
  };

  const updateRule = (index: number, field: string, value: any) => {
    const updated = [...conditionalLogic];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, conditional_logic: updated });
  };

  const deleteRule = (index: number) => {
    const updated = conditionalLogic.filter((_: any, i: number) => i !== index);
    onChange({ ...data, conditional_logic: updated });
  };

  const toggleTargetQuestion = (ruleIndex: number, questionId: string) => {
    const rule = conditionalLogic[ruleIndex];
    const targets = rule.target_question_ids || [];
    const updated = targets.includes(questionId)
      ? targets.filter((id: string) => id !== questionId)
      : [...targets, questionId];

    updateRule(ruleIndex, 'target_question_ids', updated);
  };

  const loadSampleTemplate = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/samples/retail-execution`);
      const result = await response.json();
      onChange(result.template);
    } catch (error) {
      console.error('Failed to load sample template:', error);
    }
  };

  const getQuestionById = (id: string) => {
    return allQuestions.find((q: any) => q.question_id === id);
  };

  const getConditionOptions = (question: any) => {
    if (!question) return [];

    if (question.type === 'yes_no') {
      return ['Yes', 'No'];
    } else if (question.type === 'single_choice' || question.type === 'dropdown') {
      return question.options || [];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configure Logic</h2>
          <p className="text-slate-600 mt-1">
            Create rules to show/hide questions based on responses
          </p>
        </div>

        <button
          onClick={loadSampleTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300"
        >
          <Download className="w-4 h-4" />
          Load Sample
        </button>
      </div>

      {!hasQuestions ? (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-2">No Questions Available</p>
          <p className="text-sm text-slate-500">
            Add questions first to configure conditional logic
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="bg-slate-900 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Conditional Logic Explanation
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Create rules to show/hide questions based on responses. For example, if a
                  user answers "Yes" to a specific question, you can reveal additional related
                  questions.
                </p>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Examples:</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">→</span>
                      <span>
                        If "Is product available?" = <strong>No</strong> → Show "Why is it
                        unavailable?"
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">→</span>
                      <span>
                        If "Stock quantity" &lt; <strong>5</strong> → Show "Did you inform
                        staff?"
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">→</span>
                      <span>
                        If "Product placement" = <strong>Bottom shelf</strong> → Show "Can it
                        be moved?"
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {conditionalLogic.map((rule: any, index: number) => {
              const sourceQuestion = getQuestionById(rule.source_question_id);
              const conditionOptions = getConditionOptions(sourceQuestion);

              return (
                <div
                  key={rule.rule_id}
                  className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-slate-900">Conditional Rule</h4>
                    </div>
                    <button
                      onClick={() => deleteRule(index)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        When this question
                      </label>
                      <select
                        value={rule.source_question_id}
                        onChange={(e) =>
                          updateRule(index, 'source_question_id', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      >
                        <option value="">Select a question</option>
                        {allQuestions.map((q: any) => (
                          <option key={q.question_id} value={q.question_id}>
                            {q.section_title} → {q.text}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Condition
                      </label>
                      <select
                        value={rule.condition_type}
                        onChange={(e) => updateRule(index, 'condition_type', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="contains">Contains</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Value
                      </label>
                      {conditionOptions.length > 0 ? (
                        <select
                          value={rule.condition_value}
                          onChange={(e) =>
                            updateRule(index, 'condition_value', e.target.value)
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        >
                          <option value="">Select value</option>
                          {conditionOptions.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={rule.condition_value}
                          onChange={(e) =>
                            updateRule(index, 'condition_value', e.target.value)
                          }
                          placeholder="Enter value"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Then
                      </label>
                      <select
                        value={rule.action}
                        onChange={(e) => updateRule(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      >
                        <option value="show">Show</option>
                        <option value="hide">Hide</option>
                        <option value="require">Make Required</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Target Questions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {allQuestions
                        .filter((q: any) => q.question_id !== rule.source_question_id)
                        .map((q: any) => {
                          const isSelected = (rule.target_question_ids || []).includes(
                            q.question_id
                          );
                          return (
                            <label
                              key={q.question_id}
                              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                                isSelected
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-white hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleTargetQuestion(index, q.question_id)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-xs font-medium mb-1 ${
                                    isSelected ? 'text-slate-300' : 'text-slate-500'
                                  }`}
                                >
                                  {q.section_title}
                                </div>
                                <div
                                  className={`text-sm truncate ${
                                    isSelected ? 'text-white' : 'text-slate-900'
                                  }`}
                                >
                                  {q.text}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!showAddRule ? (
            <button
              onClick={() => setShowAddRule(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition text-slate-600 font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Conditional Rule
            </button>
          ) : (
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-dashed border-slate-300">
              <p className="text-slate-700 mb-4">
                Create a new rule to control question visibility based on user responses.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={addRule}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Create Rule
                </button>
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {conditionalLogic.length > 0 && (
            <div className="bg-slate-900 text-white rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Active Rules Summary
              </h4>
              <div className="space-y-2 text-sm">
                {conditionalLogic.map((rule: any, index: number) => {
                  const sourceQ = getQuestionById(rule.source_question_id);
                  return (
                    <div
                      key={rule.rule_id}
                      className="bg-slate-800 rounded-lg p-3 font-mono text-xs"
                    >
                      <span className="text-slate-400">Rule {index + 1}:</span>{' '}
                      <span className="text-yellow-400">IF</span> "{sourceQ?.text || 'Question'}
                      " {rule.condition_type.replace('_', ' ')}{' '}
                      <span className="text-green-400">"{rule.condition_value}"</span>{' '}
                      <span className="text-yellow-400">THEN</span> {rule.action}{' '}
                      <span className="text-slate-400">
                        ({rule.target_question_ids?.length || 0} question(s))
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
