import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FileText, Plus, CreditCard as Edit, Trash2, Eye } from 'lucide-react';

interface Template {
  template_id: string;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTemplates([
        {
          template_id: '1',
          name: 'Shelf Compliance Audit',
          description: 'Verify shelf organization and product placement',
          category: 'Merchandising',
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          template_id: '2',
          name: 'Stock Level Assessment',
          description: 'Check inventory levels and stock availability',
          category: 'Stock',
          is_published: false,
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Templates</h1>
            <p className="text-slate-600">Manage your audit templates</p>
          </div>
          <Link
            to="/templates/create"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.template_id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      template.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {template.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {template.category}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/templates/${template.template_id}`}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/templates/${template.template_id}/edit`}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
