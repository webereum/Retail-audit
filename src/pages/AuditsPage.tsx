import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ClipboardList, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Audit {
  audit_id: string;
  template_name: string;
  status: string;
  location: string;
  score: number | null;
  created_at: string;
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setAudits([
        {
          audit_id: '1',
          template_name: 'Shelf Compliance Audit',
          status: 'Completed',
          location: 'Store #123',
          score: 85.5,
          created_at: new Date().toISOString(),
        },
        {
          audit_id: '2',
          template_name: 'Stock Level Assessment',
          status: 'In Progress',
          location: 'Store #456',
          score: null,
          created_at: new Date().toISOString(),
        },
        {
          audit_id: '3',
          template_name: 'Quality Check',
          status: 'Pending',
          location: 'Store #789',
          score: null,
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700';
      case 'Pending':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredAudits = audits.filter((audit) => {
    if (filter === 'all') return true;
    return audit.status.toLowerCase().replace(' ', '-') === filter;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Audits</h1>
            <p className="text-slate-600">View and manage your audit assignments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in-progress'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading audits...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAudits.map((audit) => (
              <div
                key={audit.audit_id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {audit.template_name}
                      </h3>
                      <p className="text-sm text-slate-600">{audit.location}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(audit.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              audit.status
                            )}`}
                          >
                            {audit.status}
                          </span>
                        </div>
                      </div>

                      {audit.score !== null && (
                        <div className="text-center">
                          <p className="text-sm text-slate-600 mb-1">Score</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {audit.score}%
                          </p>
                        </div>
                      )}

                      <Link
                        to={`/audits/${audit.audit_id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                      >
                        {audit.status === 'Completed' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            View
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            {audit.status === 'Pending' ? 'Start' : 'Continue'}
                          </>
                        )}
                      </Link>
                    </div>
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
