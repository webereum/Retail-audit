import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FileText, Plus, CreditCard as Edit, Trash2, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  createdAt: string;
  sections: any[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/templates`);
      if (!response.ok) throw new Error('Failed to fetch templates');

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`${API_URL}/templates/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete template');

      fetchTemplates();
    } catch (err: any) {
      alert(err.message);
    }
  };

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No templates found</p>
            <Link
              to="/templates/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
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
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {template.description || 'No description'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">{template.category}</span>
                    <span className="text-xs text-slate-400">{template.sections?.length || 0} sections</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
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
    </Layout>
  );
}
