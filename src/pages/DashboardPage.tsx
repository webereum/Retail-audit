import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  ClipboardList,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAudits: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });

  useEffect(() => {
    setStats({
      totalAudits: 12,
      completed: 8,
      pending: 2,
      inProgress: 2,
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back! Here's an overview of your audit activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-slate-100 p-3 rounded-lg">
                <ClipboardList className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {stats.totalAudits}
              </span>
            </div>
            <p className="text-sm text-slate-600">Total Audits</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {stats.completed}
              </span>
            </div>
            <p className="text-sm text-slate-600">Completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {stats.inProgress}
              </span>
            </div>
            <p className="text-sm text-slate-600">In Progress</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats.pending}
              </span>
            </div>
            <p className="text-sm text-slate-600">Pending</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/templates/create"
                className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition group"
              >
                <div className="bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Create Template</p>
                  <p className="text-sm text-slate-600">Build a new audit template</p>
                </div>
              </Link>

              <Link
                to="/audits"
                className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition group"
              >
                <div className="bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">View Audits</p>
                  <p className="text-sm text-slate-600">Access all your audits</p>
                </div>
              </Link>

              <Link
                to="/templates"
                className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition group"
              >
                <div className="bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Manage Templates</p>
                  <p className="text-sm text-slate-600">View and edit templates</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Shelf Compliance Audit Completed
                  </p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    New Template Created
                  </p>
                  <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Stock Audit In Progress
                  </p>
                  <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
