import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicsApi } from '../../api/topics.api';
import useUiStore from '../../store/uiStore';
import { getStatusLabel, getStatusColor, formatVND, formatDateTime } from '../../utils/formatters';
import { getAvailableActions } from '../../utils/topicStatusConfig';

export default function DeptTopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await topicsApi.getById(topicId);
        setTopic(res.data);
      } catch { /* interceptor */ }
      finally { setLoading(false); }
    };
    load();
  }, [topicId]);

  const handleStatusChange = async (targetStatus) => {
    if (targetStatus === 'DEPT_REJECTED' && !feedbackMessage.trim()) return;
    setActionLoading(true);
    try {
      await topicsApi.changeStatus(topicId, { targetStatus, feedbackMessage: targetStatus === 'DEPT_REJECTED' ? feedbackMessage : undefined });
      addToast({ type: 'success', message: 'Cập nhật trạng thái thành công.' });
      const res = await topicsApi.getById(topicId);
      setTopic(res.data);
      setShowRejectModal(false);
      setFeedbackMessage('');
    } catch { /* interceptor */ }
    finally { setActionLoading(false); }
  };

  const handleDownload = async (attachmentId) => {
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

  const actions = getAvailableActions(topic.topicStatus, 'DEPT_HEAD');

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/department/dashboard')} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Quay lại</button>
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
          <div><dt className="text-xs text-gray-500">Loại hình</dt><dd className="font-medium">{topic.researchType}</dd></div>
          <div><dt className="text-xs text-gray-500">Thời gian</dt><dd className="font-medium">{topic.durationMonths} tháng</dd></div>
        </dl>
      </div>

      {/* Attachments */}
      {topic.attachments?.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Tệp đính kèm</h3>
          <div className="divide-y divide-gray-100">
            {topic.attachments.map((att) => (
              <div key={att.attachmentId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Thuyết minh đề tài</p>
                    <p className="text-xs text-gray-400">Phiên bản {att.fileVersion} &middot; {formatDateTime(att.uploadedAt)}</p>
                  </div>
                </div>
                <button onClick={() => handleDownload(att.attachmentId)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Tải xuống
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit log timeline */}
      {topic.auditLogs?.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Lịch sử trạng thái</h3>
          <div className="space-y-3">
            {topic.auditLogs.map((log, i) => (
              <div key={log.id ?? i} className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    {getStatusLabel(log.previousStatus)} &rarr; {getStatusLabel(log.newStatus)}
                  </p>
                  <p className="text-xs text-gray-500">{log.actorFullName} — {formatDateTime(log.actionTimestamp)}</p>
                  {log.feedbackNote && <p className="text-xs text-gray-600 mt-1 italic">{log.feedbackNote}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Thao tác</h3>
          <div className="flex gap-3">
            {actions.map((a) => (
              a.requiresFeedback ? (
                <button key={a.targetStatus} onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700">
                  {a.label}
                </button>
              ) : (
                <button key={a.targetStatus} onClick={() => handleStatusChange(a.targetStatus)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                  {a.label}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lý do từ chối</h3>
            <textarea value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={4} placeholder="Nhập lý do từ chối (bắt buộc)..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowRejectModal(false); setFeedbackMessage(''); }}
                className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={() => handleStatusChange('DEPT_REJECTED')}
                disabled={!feedbackMessage.trim() || actionLoading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
