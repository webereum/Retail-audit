interface Step1Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step1Setup({ data, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Template Setup</h2>
      <p className="text-slate-600">Provide basic information about your audit template</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Template Name *
        </label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
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
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="Brief description of the template purpose"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category *
        </label>
        <select
          value={data.category || 'Merchandising'}
          onChange={(e) => onChange({ ...data, category: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        >
          <option value="Merchandising">Merchandising</option>
          <option value="Stock">Stock</option>
          <option value="Quality">Quality</option>
          <option value="Compliance">Compliance</option>
          <option value="Safety">Safety</option>
        </select>
      </div>
    </div>
  );
}
