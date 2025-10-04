import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const QUESTION_COMPONENTS: any = {
  text_input: TextInputComponent,
  numeric_input: NumericInputComponent,
  single_choice: SingleChoiceComponent,
  multiple_choice: MultipleChoiceComponent,
  dropdown: DropdownComponent,
  date_time: DateTimeComponent,
  file_upload: FileUploadComponent,
  barcode_scanner: BarcodeComponent,
  yes_no: YesNoComponent,
  rating_scale: RatingScaleComponent,
  image_upload: ImageUploadComponent,
};

function TextInputComponent({ question, value, onChange }: any) {
  return (
    <TextInput
      style={styles.textInput}
      value={value || ''}
      onChangeText={onChange}
      placeholder="Enter your answer"
      multiline
    />
  );
}

function NumericInputComponent({ question, value, onChange }: any) {
  return (
    <TextInput
      style={styles.textInput}
      value={value || ''}
      onChangeText={onChange}
      placeholder="Enter number"
      keyboardType="numeric"
    />
  );
}

function YesNoComponent({ question, value, onChange }: any) {
  return (
    <View style={styles.yesNoContainer}>
      <TouchableOpacity
        style={[styles.yesNoButton, value === 'Yes' && styles.yesButtonSelected]}
        onPress={() => onChange('Yes')}
      >
        <Text
          style={[
            styles.yesNoText,
            value === 'Yes' && styles.yesNoTextSelected,
          ]}
        >
          Yes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.yesNoButton, value === 'No' && styles.noButtonSelected]}
        onPress={() => onChange('No')}
      >
        <Text
          style={[
            styles.yesNoText,
            value === 'No' && styles.yesNoTextSelected,
          ]}
        >
          No
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function RatingScaleComponent({ question, value, onChange }: any) {
  const max = question.validation?.max || 5;
  const ratings = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.ratingContainer}>
      {ratings.map((rating) => (
        <TouchableOpacity
          key={rating}
          style={[
            styles.ratingButton,
            value === rating.toString() && styles.ratingButtonSelected,
          ]}
          onPress={() => onChange(rating.toString())}
        >
          <Text
            style={[
              styles.ratingText,
              value === rating.toString() && styles.ratingTextSelected,
            ]}
          >
            {rating}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SingleChoiceComponent({ question, value, onChange }: any) {
  return (
    <View style={styles.optionsContainer}>
      {question.options?.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            value === option && styles.optionButtonSelected,
          ]}
          onPress={() => onChange(option)}
        >
          <Text
            style={[
              styles.optionText,
              value === option && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MultipleChoiceComponent({ question, value, onChange }: any) {
  const selected = value || [];

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((o: string) => o !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <View style={styles.optionsContainer}>
      {question.options?.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selected.includes(option) && styles.optionButtonSelected,
          ]}
          onPress={() => toggleOption(option)}
        >
          <Text
            style={[
              styles.optionText,
              selected.includes(option) && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DropdownComponent({ question, value, onChange }: any) {
  return <SingleChoiceComponent question={question} value={value} onChange={onChange} />;
}

function DateTimeComponent({ question, value, onChange }: any) {
  return (
    <TextInput
      style={styles.textInput}
      value={value || new Date().toISOString().split('T')[0]}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
    />
  );
}

function FileUploadComponent({ question, value, onChange }: any) {
  return (
    <TouchableOpacity style={styles.uploadButton}>
      <Text style={styles.uploadButtonText}>
        {value ? 'File Selected' : 'Select File (Coming Soon)'}
      </Text>
    </TouchableOpacity>
  );
}

function ImageUploadComponent({ question, value, onChange }: any) {
  return (
    <TouchableOpacity style={styles.uploadButton}>
      <Text style={styles.uploadButtonText}>
        {value ? '📷 Photo Captured' : '📷 Take Photo (Coming Soon)'}
      </Text>
    </TouchableOpacity>
  );
}

function BarcodeComponent({ question, value, onChange }: any) {
  return (
    <TextInput
      style={styles.textInput}
      value={value || ''}
      onChangeText={onChange}
      placeholder="Scan or enter barcode"
    />
  );
}

export default function AuditFormScreen({ route, navigation }: any) {
  const { template } = route.params;
  const [responses, setResponses] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const evaluateCondition = (rule: any, currentResponses: any) => {
    const sections = template.sections || [];
    let questionValue = null;

    for (const section of sections) {
      const value = currentResponses[section.section_id]?.[rule.source_question_id];
      if (value !== undefined && value !== null) {
        questionValue = value;
        break;
      }
    }

    if (questionValue === null || questionValue === undefined || questionValue === '') {
      return false;
    }

    switch (rule.condition_type) {
      case 'equals':
        return String(questionValue) === String(rule.condition_value);
      case 'not_equals':
        return String(questionValue) !== String(rule.condition_value);
      case 'contains':
        return String(questionValue).includes(String(rule.condition_value));
      case 'greater_than':
        return Number(questionValue) > Number(rule.condition_value);
      case 'less_than':
        return Number(questionValue) < Number(rule.condition_value);
      default:
        return false;
    }
  };

  const visibleQuestions = useMemo(() => {
    const visible = new Set<string>();
    const conditionalLogic = template.conditional_logic || [];

    const allQuestions = template.sections.flatMap((section: any) =>
      (section.questions || []).map((q: any) => q.question_id)
    );

    allQuestions.forEach((qId: string) => visible.add(qId));

    conditionalLogic.forEach((rule: any) => {
      const conditionMet = evaluateCondition(rule, responses);

      rule.target_question_ids?.forEach((targetId: string) => {
        if (rule.action === 'show' && conditionMet) {
          visible.add(targetId);
        } else if (rule.action === 'hide' && conditionMet) {
          visible.delete(targetId);
        } else if (rule.action === 'show' && !conditionMet) {
          visible.delete(targetId);
        } else if (rule.action === 'hide' && !conditionMet) {
          visible.add(targetId);
        }
      });
    });

    return visible;
  }, [responses, template]);

  const handleResponseChange = (sectionId: string, questionId: string, value: any) => {
    setResponses((prev: any) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value,
      },
    }));
  };

  const validateForm = () => {
    for (const section of template.sections) {
      for (const question of section.questions || []) {
        if (!visibleQuestions.has(question.question_id)) {
          continue;
        }

        if (question.mandatory) {
          const value = responses[section.section_id]?.[question.question_id];
          if (!value || (Array.isArray(value) && value.length === 0)) {
            Alert.alert('Validation Error', `Please answer: ${question.text}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const auditResponse = await axios.post(`${API_URL}/audits`, {
        template_id: template._id,
        assigned_to: 'mobile_user',
        location: {
          store_name: 'Mobile Store',
          address: 'Field Location',
        },
      });

      await axios.post(`${API_URL}/audits/${auditResponse.data.audit._id}/submit`, {
        responses,
      });

      navigation.replace('AuditSuccess');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{template.name}</Text>
        {template.description && (
          <Text style={styles.description}>{template.description}</Text>
        )}
        {template.conditional_logic && template.conditional_logic.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ Smart Questions Enabled</Text>
          </View>
        )}
      </View>

      {template.sections.map((section: any) => (
        <View key={section.section_id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.description && (
            <Text style={styles.sectionDescription}>{section.description}</Text>
          )}

          {section.questions?.map((question: any) => {
            const isVisible = visibleQuestions.has(question.question_id);

            if (!isVisible) {
              return null;
            }

            const QuestionComponent = QUESTION_COMPONENTS[question.type] || TextInputComponent;

            return (
              <View key={question.question_id} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {question.text}
                  {question.mandatory && <Text style={styles.required}> *</Text>}
                </Text>

                <QuestionComponent
                  question={question}
                  value={responses[section.section_id]?.[question.question_id]}
                  onChange={(value: any) =>
                    handleResponseChange(section.section_id, question.question_id, value)
                  }
                />
              </View>
            );
          })}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Audit</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  required: {
    color: '#ef4444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  yesNoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  yesNoButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  yesButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  noButtonSelected: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  yesNoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  yesNoTextSelected: {
    color: '#ffffff',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  ratingButton: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  ratingButtonSelected: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  ratingTextSelected: {
    color: '#ffffff',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  optionButtonSelected: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  optionText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#0f172a',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
