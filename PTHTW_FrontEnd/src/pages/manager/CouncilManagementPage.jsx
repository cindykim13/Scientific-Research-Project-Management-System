import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { councilsApi } from '../../api/councils.api';
import { formatDate } from '../../utils/formatters';

export default function CouncilManagementPage() {
  const [councils, setCouncils] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCouncils = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await councilsApi.getAll({ page: p, size: 10, sort: 'councilId,desc' });
      setCouncils(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { /* interceptor */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCouncils(page); }, [page, fetchCouncils]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Hội đồng</h1>
        <Link to="/manager/councils/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          Tạo Hội đồng mới
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : councils.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border"><p className="text-gray-500">Chưa có Hội đồng nào.</p></div>
      ) : (
        <div className="space-y-3">
          {councils.map((c) => (
            <Link key={c.councilId} to={`/manager/councils/${c.councilId}`}
              className="block bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{c.councilName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.meetingLocation} — {formatDate(c.meetingDate)}</p>
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{c.memberCount ?? 0} thành viên</span>
                  <span>{c.topicCount ?? 0} đề tài</span>
                </div>
              </div>
            </Link>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50">Trước</button>
              <span className="px-3 py-1 text-sm text-gray-500">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
