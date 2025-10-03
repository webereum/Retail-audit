interface Step4Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step4Logic({ data, onChange }: Step4Props) {
  const sections = data.sections || [];
  const hasQuestions = sections.some((s: any) => s.questions && s.questions.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configure Logic</h2>
        <p className="text-slate-600 mt-1">Set up conditional logic and question dependencies (Optional)</p>
      </div>

      {!hasQuestions ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-slate-500">Add questions first to configure logic</p>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-2">Conditional Logic Builder</p>
          <p className="text-sm text-slate-500">
            This feature allows you to show/hide questions based on user responses
          </p>
          <p className="text-xs text-slate-400 mt-4">
            Advanced feature - Skip for now or configure later
          </p>
        </div>
      )}

      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-2">Example Logic Rules:</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• If Question 1 = "No" then show Question 5</li>
          <li>• If Question 3 = "Yes" then skip to Section 2</li>
          <li>• If Question 2 is answered then make Question 6 mandatory</li>
        </ul>
      </div>
    </div>
  );
}
