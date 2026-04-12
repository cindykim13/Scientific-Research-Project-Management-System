import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../../api/stats.api';
import { topicsApi } from '../../api/topics.api';
import { getStatusLabel, getStatusColor, formatVND } from '../../utils/formatters';

const KPI_ITEMS = [
  { key: 'topicsDraft', label: 'Bản nháp', color: 'bg-gray-100 text-gray-700' },
  { key: 'topicsPendingReview', label: 'Chờ duyệt Khoa', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'topicsDeptApproved', label: 'Khoa đã duyệt', color: 'bg-blue-100 text-blue-700' },
  { key: 'topicsPendingCouncil', label: 'Chờ Hội đồng', color: 'bg-indigo-100 text-indigo-700' },
  { key: 'topicsCouncilReviewed', label: 'HĐ đã đánh giá', color: 'bg-purple-100 text-purple-700' },
  { key: 'topicsRevisionRequired', label: 'Cần chỉnh sửa', color: 'bg-orange-100 text-orange-800' },
  { key: 'topicsApproved', label: 'Đã duyệt', color: 'bg-green-100 text-green-700' },
  { key: 'topicsRejected', label: 'Không duyệt', color: 'bg-red-100 text-red-700' },
];

export default function SciManDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, topicsRes] = await Promise.all([
          statsApi.getSummary(),
          topicsApi.getAll({ page: 0, size: 5, sort: 'topicId,desc' }),
        ]);
        setStats(statsRes.data);
        setRecentTopics(topicsRes.data?.content ?? []);
      } catch { /* interceptor */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan Quản lý Khoa học</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPI_ITEMS.map((kpi) => (
          <div key={kpi.key} className={`rounded-lg p-4 ${kpi.color}`}>
            <p className="text-2xl font-bold">{stats?.[kpi.key] ?? 0}</p>
            <p className="text-xs font-medium mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-lg p-4 bg-white border">
          <p className="text-2xl font-bold text-gray-900">{stats?.totalCouncils ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Hội đồng</p>
        </div>
        <div className="rounded-lg p-4 bg-white border">
          <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Người dùng</p>
        </div>
        <div className="rounded-lg p-4 bg-white border">
          <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Đang hoạt động</p>
        </div>
      </div>

      {/* Recent topics */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-800">Đề tài gần đây</h3>
          <Link to="/manager/topics" className="text-xs text-blue-600 hover:underline">Xem tất cả</Link>
        </div>
        <div className="divide-y">
          {recentTopics.map((t) => (
            <Link key={t.topicId} to={`/manager/topics/${t.topicId}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{t.titleVn}</p>
                <p className="text-xs text-gray-500">{t.topicCode} — {t.investigatorFullName}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-3 ${getStatusColor(t.topicStatus)}`}>
                {getStatusLabel(t.topicStatus)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
