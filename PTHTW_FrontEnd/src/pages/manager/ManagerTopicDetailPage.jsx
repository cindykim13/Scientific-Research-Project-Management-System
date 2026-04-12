import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicsApi } from '../../api/topics.api';
import { councilsApi } from '../../api/councils.api';
import useUiStore from '../../store/uiStore';
import { getStatusLabel, getStatusColor, formatVND, formatDateTime } from '../../utils/formatters';

export default function ManagerTopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const [topic, setTopic] = useState(null);
  const [councils, setCouncils] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [topicRes, councilsList] = await Promise.all([
          topicsApi.getById(topicId),
          councilsApi.fetchAllCouncils(),
        ]);
        setTopic(topicRes.data);
        setCouncils(councilsList);
      } catch { /* interceptor */ }
      finally { setLoading(false); }
    };
    load();
  }, [topicId]);

  const handleAssignToCouncil = async () => {
    if (!selectedCouncil) return;
    setAssigning(true);
    try {
      await councilsApi.assignTopics(selectedCouncil, [Number(topicId)]);
      addToast({ type: 'success', message: 'Đề tài đã được phân công cho Hội đồng.' });
      const res = await topicsApi.getById(topicId);
      setTopic(res.data);
    } catch { /* interceptor */ }
    finally { setAssigning(false); }
  };

  const handleDownloadAttachment = async (attachmentId) => {
    try {
      const res = await topicsApi.downloadAttachment(topicId, attachmentId);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attachment';
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* interceptor */ }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (!topic) return <div className="text-center py-12 text-gray-500">Không tìm thấy đề tài.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Quay lại</button>

      <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{topic.titleVn}</h1>
            <p className="text-sm text-gray-500 mt-1">{topic.topicCode}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.topicStatus)}`}>
            {getStatusLabel(topic.topicStatus)}
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-xs text-gray-500">Tên tiếng Anh</dt><dd className="font-medium">{topic.titleEn}</dd></div>
          <div><dt className="text-xs text-gray-500">Chủ nhiệm</dt><dd className="font-medium">{topic.investigatorFullName}</dd></div>
          <div><dt className="text-xs text-gray-500">Đơn vị</dt><dd className="font-medium">{topic.managingDepartmentName}</dd></div>
          <div><dt className="text-xs text-gray-500">Kinh phí</dt><dd className="font-medium">{formatVND(topic.expectedBudget)}</dd></div>
          <div><dt className="text-xs text-gray-500">Lĩnh vực</dt><dd className="font-medium">{topic.researchField}</dd></div>
          <div><dt className="text-xs text-gray-500">Thời gian</dt><dd className="font-medium">{topic.durationMonths} tháng</dd></div>
        </dl>
      </div>

      {/* Attachments */}
      {topic.attachments?.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Tệp đính kèm</h3>
          {topic.attachments.map((att) => (
            <button key={att.attachmentId} onClick={() => handleDownloadAttachment(att.attachmentId)}
              className="text-sm text-blue-600 hover:underline">
              Tải về tệp (v{att.fileVersion})
            </button>
          ))}
        </div>
      )}

      {/* Audit log */}
      {topic.auditLogs?.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Lịch sử trạng thái</h3>
          <div className="space-y-3">
            {topic.auditLogs.map((log, i) => (
              <div key={log.id ?? i} className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">{getStatusLabel(log.previousStatus)} &rarr; {getStatusLabel(log.newStatus)}</p>
                  <p className="text-xs text-gray-500">{log.actorFullName} — {formatDateTime(log.actionTimestamp)}</p>
                  {log.feedbackNote && <p className="text-xs text-gray-600 mt-1 italic">{log.feedbackNote}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign to council */}
      {topic.topicStatus === 'DEPT_APPROVED' && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Phân công Hội đồng</h3>
          <div className="flex gap-3">
            <select value={selectedCouncil} onChange={(e) => setSelectedCouncil(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">— Chọn Hội đồng —</option>
              {councils.map((c) => (
                <option key={c.councilId} value={c.councilId}>{c.councilName}</option>
              ))}
            </select>
            <button onClick={handleAssignToCouncil} disabled={!selectedCouncil || assigning}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {assigning ? 'Đang phân...' : 'Phân công'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
