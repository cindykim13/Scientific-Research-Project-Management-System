import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { councilsApi } from '../../api/councils.api';
import { topicsApi } from '../../api/topics.api';
import { usersApi } from '../../api/users.api';
import useUiStore from '../../store/uiStore';
import { formatDate, getStatusLabel, getStatusColor, getCouncilRoleLabel } from '../../utils/formatters';

const COUNCIL_ROLES = ['PRESIDENT', 'SECRETARY', 'REVIEWER', 'MEMBER'];

export default function CouncilDetailPage() {
  const { councilId } = useParams();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const [council, setCouncil] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [deptApprovedTopics, setDeptApprovedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('MEMBER');
  const [showAssignTopic, setShowAssignTopic] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  const fetchCouncil = async () => {
    try {
      const res = await councilsApi.getById(councilId);
      setCouncil(res.data);
    } catch { /* interceptor */ }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [councilRes, allUsers, allTopics] = await Promise.all([
          councilsApi.getById(councilId),
          usersApi.fetchAllUsers(),
          topicsApi.fetchAllTopics(),
        ]);
        setCouncil(councilRes.data);
        setAllUsers(allUsers);
        setDeptApprovedTopics(allTopics.filter((t) => t.topicStatus === 'DEPT_APPROVED'));
      } catch { /* interceptor */ }
      finally { setLoading(false); }
    };
    load();
  }, [councilId]);

  const handleAddMember = async () => {
    if (!newMemberUserId) return;
    try {
      await councilsApi.assignMembers(councilId, [{ userId: newMemberUserId, councilRole: newMemberRole }]);
      addToast({ type: 'success', message: 'Thành viên đã được thêm.' });
      fetchCouncil();
      setShowAddMember(false);
      setNewMemberUserId('');
    } catch { /* interceptor */ }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Xác nhận xóa thành viên?')) return;
    try {
      await councilsApi.removeMember(councilId, userId);
      addToast({ type: 'success', message: 'Đã xóa thành viên.' });
      fetchCouncil();
    } catch { /* interceptor */ }
  };

  const handleAssignTopics = async () => {
    if (selectedTopicIds.length === 0) return;
    try {
      await councilsApi.assignTopics(councilId, selectedTopicIds.map(Number));
      addToast({ type: 'success', message: 'Đã phân công đề tài.' });
      fetchCouncil();
      setShowAssignTopic(false);
      setSelectedTopicIds([]);
    } catch { /* interceptor */ }
  };

  const handleRemoveTopic = async (topicId) => {
    if (!confirm('Xác nhận gỡ đề tài?')) return;
    try {
      await councilsApi.removeTopic(councilId, topicId);
      addToast({ type: 'success', message: 'Đã gỡ đề tài.' });
      fetchCouncil();
    } catch { /* interceptor */ }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (!council) return <div className="text-center py-12 text-gray-500">Không tìm thấy Hội đồng.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/manager/councils')} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Quay lại</button>

      <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
        <h1 className="text-xl font-bold text-gray-900">{council.councilName}</h1>
        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
          <div><span className="text-gray-500">Ngày họp:</span> <span className="font-medium">{formatDate(council.meetingDate)}</span></div>
          <div><span className="text-gray-500">Giờ:</span> <span className="font-medium">{council.meetingTime}</span></div>
          <div><span className="text-gray-500">Địa điểm:</span> <span className="font-medium">{council.meetingLocation}</span></div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Thành viên ({council.members?.length ?? 0})</h3>
          <button onClick={() => setShowAddMember(!showAddMember)}
            className="text-xs text-blue-600 hover:underline">{showAddMember ? 'Đóng' : 'Thêm thành viên'}</button>
        </div>

        {showAddMember && (
          <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded border">
            <select value={newMemberUserId} onChange={(e) => setNewMemberUserId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm">
              <option value="">— Chọn người dùng —</option>
              {allUsers.filter((u) => u.systemRole === 'COUNCIL' && !council.members?.some((m) => m.userId === u.userId))
                .map((u) => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
            </select>
            <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm">
              {COUNCIL_ROLES.map((r) => <option key={r} value={r}>{getCouncilRoleLabel(r)}</option>)}
            </select>
            <button onClick={handleAddMember}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Thêm</button>
          </div>
        )}

        <div className="divide-y">
          {(council.members ?? []).map((m) => (
            <div key={m.userId} className="flex items-center justify-between py-2 text-sm">
              <div>
                <span className="font-medium text-gray-900">{m.fullName}</span>
                <span className="text-gray-500 ml-2">({m.email})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">{getCouncilRoleLabel(m.councilRole)}</span>
                <button onClick={() => handleRemoveMember(m.userId)} className="text-xs text-red-500 hover:text-red-700">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Đề tài ({council.topics?.length ?? 0})</h3>
          <button onClick={() => setShowAssignTopic(!showAssignTopic)}
            className="text-xs text-blue-600 hover:underline">{showAssignTopic ? 'Đóng' : 'Phân công đề tài'}</button>
        </div>

        {showAssignTopic && (
          <div className="mb-4 p-3 bg-gray-50 rounded border space-y-2">
            {deptApprovedTopics.length === 0 ? (
              <p className="text-xs text-gray-500">Không có đề tài nào ở trạng thái "Khoa đã duyệt".</p>
            ) : (
              <>
                {deptApprovedTopics.map((t) => (
                  <label key={t.topicId} className="flex items-center gap-2 text-sm">
                    <input type="checkbox"
                      checked={selectedTopicIds.includes(String(t.topicId))}
                      onChange={(e) => {
                        setSelectedTopicIds((prev) =>
                          e.target.checked ? [...prev, String(t.topicId)] : prev.filter((id) => id !== String(t.topicId))
                        );
                      }} />
                    {t.titleVn} ({t.topicCode})
                  </label>
                ))}
                <button onClick={handleAssignTopics} disabled={selectedTopicIds.length === 0}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50">Phân công</button>
              </>
            )}
          </div>
        )}

        <div className="divide-y">
          {(council.topics ?? []).map((t) => (
            <div key={t.topicId} className="flex items-center justify-between py-2 text-sm">
              <div>
                <Link to={`/manager/topics/${t.topicId}`} className="font-medium text-gray-900 hover:text-blue-600">{t.titleVn}</Link>
                <span className="text-xs text-gray-500 ml-2">{t.topicCode}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(t.topicStatus)}`}>{getStatusLabel(t.topicStatus)}</span>
                <button onClick={() => handleRemoveTopic(t.topicId)} className="text-xs text-red-500 hover:text-red-700">Gỡ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
