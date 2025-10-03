interface Step5Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step5Scoring({ data, onChange }: Step5Props) {
  const sections = data.sections || [];
  const scoringRules = data.scoring_rules || { enabled: false, weights: {}, threshold: 80 };

  const handleToggleScoring = (enabled: boolean) => {
    const newRules = { ...scoringRules, enabled };
    if (enabled && Object.keys(scoringRules.weights || {}).length === 0) {
      const weights: any = {};
      sections.forEach((section: any) => {
        weights[section.section_id] = Math.round(100 / sections.length);
      });
      newRules.weights = weights;
    }
    onChange({ ...data, scoring_rules: newRules });
  };

  const handleWeightChange = (sectionId: string, weight: number) => {
    const newWeights = { ...scoringRules.weights, [sectionId]: weight };
    onChange({
      ...data,
      scoring_rules: { ...scoringRules, weights: newWeights }
    });
  };

  const handleThresholdChange = (threshold: number) => {
    onChange({
      ...data,
      scoring_rules: { ...scoringRules, threshold }
    });
  };

  const totalWeight = Object.values(scoringRules.weights || {}).reduce((sum: number, w: any) => sum + (parseFloat(w) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Scoring & Publish</h2>
        <p className="text-slate-600 mt-1">Configure scoring rules and publish your template</p>
      </div>

      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
        <div>
          <p className="font-medium text-slate-900">Enable Scoring</p>
          <p className="text-sm text-slate-600">
            Assign weights and calculate compliance scores
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={scoringRules.enabled}
            onChange={(e) => handleToggleScoring(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
        </label>
      </div>

      {scoringRules.enabled && (
        <>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-medium text-slate-900 mb-4">Section Weights</h3>

            {sections.length === 0 ? (
              <p className="text-sm text-slate-500">Add sections to configure weights</p>
            ) : (
              <div className="space-y-4">
                {sections.map((section: any) => (
                  <div key={section.section_id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{section.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoringRules.weights[section.section_id] || 0}
                        onChange={(e) => handleWeightChange(section.section_id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center"
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">Total Weight</p>
                    <p className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalWeight.toFixed(0)}%
                    </p>
                  </div>
                  {totalWeight !== 100 && (
                    <p className="text-xs text-red-600 mt-1">
                      Warning: Total weight should equal 100%
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-medium text-slate-900 mb-4">Compliance Threshold</h3>
            <p className="text-sm text-slate-600 mb-4">
              Minimum score required to pass the audit
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={scoringRules.threshold || 80}
                onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center font-medium">
                {scoringRules.threshold || 80}%
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="font-medium text-slate-900 mb-2">Template Summary</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><span className="font-medium">Name:</span> {data.name || 'Untitled'}</p>
          <p><span className="font-medium">Category:</span> {data.category || 'N/A'}</p>
          <p><span className="font-medium">Sections:</span> {sections.length}</p>
          <p><span className="font-medium">Total Questions:</span> {sections.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0)}</p>
          <p><span className="font-medium">Scoring:</span> {scoringRules.enabled ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
    </div>
  );
}
