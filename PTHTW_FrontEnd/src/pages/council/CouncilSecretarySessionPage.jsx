// File: src/pages/council/CouncilSecretarySessionPage.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { councilsApi } from '../../api/councils.api';
import { topicsApi } from '../../api/topics.api';
import ForbiddenPage from '../../components/error/ForbiddenPage';
import useUiStore from '../../store/uiStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getCouncilRoleLabel, formatDate } from '../../utils/formatters';

const POLL_MS = 15000;

// ─── Configurations & Theming ─────────────────────────────────────────────────

const ROLE_CFG = {
  PRESIDENT:  { bg: "bg-red-50 text-red-700 border-red-200", avatarGrad: "from-red-600 to-red-800" },
  SECRETARY:  { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", avatarGrad: "from-indigo-600 to-indigo-800" },
  REVIEWER_1: { bg: "bg-orange-50 text-orange-700 border-orange-200", avatarGrad: "from-orange-500 to-orange-700" },
  REVIEWER_2: { bg: "bg-amber-50 text-amber-700 border-amber-200", avatarGrad: "from-amber-500 to-amber-700" },
  MEMBER:     { bg: "bg-gray-50 text-gray-700 border-gray-200", avatarGrad: "from-gray-500 to-gray-700" },
};

const getRoleCfg = (roleCode) => ROLE_CFG[roleCode] || ROLE_CFG.MEMBER;

// ─── SVG Factory ────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2, fill = "none" }) => (
  <svg aria-hidden="true" className={`flex-shrink-0 ${cls}`} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcLeft    = p => <Svg {...p} d="M10 19l-7-7m0 0l7-7m-7 7h18" />;
const IcClock   = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcMapPin  = p => <Svg {...p} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
const IcDoc     = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcSession = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"]} />;
const IcCheck   = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcAlert   = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcBell    = p => <Svg {...p} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
const IcLoader  = p => <Svg {...p} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;

// ─── Main View ────────────────────────────────────────────────────────────────

export default function CouncilSecretarySessionPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);

  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [topic, setTopic] = useState(null);
  const [councilId, setCouncilId] = useState(null);
  const [councilDetail, setCouncilDetail] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [remindedIds, setRemindedIds] = useState([]);
  /** Intra-council role for this topicId only (from assignment payload). */
  const [topicCouncilRole, setTopicCouncilRole] = useState(null);

  const pollRef = useRef(null);

  // ── ABAC Guard & Load Data ──
  useEffect(() => {
    const load = async () => {
      try {
        const myTopicsList = await councilsApi.fetchAllMyCouncilTopics();
        const assignment = myTopicsList.find((t) => String(t.topicId) === String(topicId));

        if (!assignment || assignment.councilRole !== 'SECRETARY') {
          setForbidden(true);
          setLoading(false);
          return;
        }

        setTopicCouncilRole(assignment.councilRole);
        setCouncilId(assignment.councilId);

        const [topicRes, councilRes] = await Promise.all([
          topicsApi.getById(topicId),
          councilsApi.getById(assignment.councilId),
        ]);
        setTopic(topicRes.data);
        setCouncilDetail(councilRes.data);
      } catch {
        setForbidden(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId]);

  // ── Polling Readiness ──
  const fetchReadiness = useCallback(async () => {
    if (!councilId || !topicId) return;
    try {
      const res = await councilsApi.getEvaluationStatus(councilId, topicId);
      setReadiness(res.data);
    } catch { /* silent */ }
  }, [councilId, topicId]);

  useEffect(() => {
    if (!councilId) return;
    fetchReadiness();
    pollRef.current = setInterval(fetchReadiness, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [councilId, fetchReadiness]);

  const handleRemind = (id, name) => {
    setRemindedIds(prev => [...prev, id]);
    addToast({
      type: 'warning',
      message: `Đã gửi email hối thúc đến chuyên gia ${name}.`,
      duration: 4000,
    });
    // TODO: Connect actual API call here when ready
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner label="Đang tải phiên họp hội đồng" sizeClass="h-8 w-8" borderClass="border-b-2 border-[#1a5ea8]" />
      </div>
    );
  }
  if (forbidden) return <ForbiddenPage />;

  // Computed state
  const total = readiness?.totalNonSecretaries ?? 0;
  const done = readiness?.submittedCount ?? 0;
  const pendingCount = total - done;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isReady = readiness?.ready === true;
  const isMinutesCreated = topic?.topicStatus && !['PENDING_COUNCIL'].includes(topic.topicStatus);
  
  const members = councilDetail?.members ?? [];
  const evaluators = members.filter(m => m.councilRole !== 'SECRETARY');

  // Determine Dashboard Status for UI
  const dashboardState = isMinutesCreated 
    ? "MINUTES_CREATED" 
    : (isReady ? "READY" : "IN_PROGRESS");

  return (
    // AppShell compatible container
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#eaf5fc] -m-6 border-l border-gray-200">
      
      {/* ── Page Header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a5ea8] transition">
                <IcLeft cls="w-3.5 h-3.5" /> Trở về
              </button>
              <div className="w-px h-4 bg-gray-300" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SC-COUNCIL-03 · Phiên họp Hội đồng</p>
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 leading-tight mt-0.5">
              Quản trị Phiên họp — <span className="text-[#1a5ea8]">{topic?.topicCode}</span>
            </h1>
            {topicCouncilRole && (
              <p className="text-xs font-semibold text-indigo-800 mt-1">
                Vai trò trong đề tài này: <span className="text-indigo-950">{getCouncilRoleLabel(topicCouncilRole)}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{topic?.titleVn}</p>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              {(councilDetail?.meetingDate || councilDetail?.meetingTime) && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  <IcClock cls="w-3 h-3 text-gray-400" />
                  {councilDetail?.meetingDate ? formatDate(councilDetail.meetingDate) : ''}
                  {councilDetail?.meetingTime ? ` · ${String(councilDetail.meetingTime).slice(0, 5)}` : ''}
                </span>
              )}
              {councilDetail?.meetingLocation && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  <IcMapPin cls="w-3 h-3 text-gray-400" />
                  {councilDetail.meetingLocation}
                </span>
              )}
              {councilDetail?.councilName && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-[#1a5ea8]">
                  <IcDoc cls="w-3 h-3 text-blue-400" />
                  {councilDetail.councilName}
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            {dashboardState === "MINUTES_CREATED" ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Đã lập Biên bản
              </span>
            ) : dashboardState === "READY" ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-100 text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Đủ điều kiện Biên bản
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-100 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Đang tiến hành ({done}/{total})
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-6">
        
        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
            <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="50" cy="50" r="36" fill="none"
                stroke={isReady ? "#16a34a" : "#1a5ea8"}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 * (1 - (total ? done / total : 0))}
                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black leading-none transition-colors ${isReady ? "text-green-600" : "text-[#1a5ea8]"}`}>
                {done}
              </span>
              <span className="text-[10px] font-bold text-gray-400">/{total}</span>
            </div>
          </div>

          <div className="w-full h-px md:w-px md:h-16 bg-gray-100 flex-shrink-0" />

          <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Tiến độ thu thập Phiếu đánh giá</p>
                <span className={`text-[11px] font-bold ${isReady ? "text-green-600" : "text-[#1a5ea8]"}`}>{pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${isReady ? "bg-green-400" : "bg-[#1a5ea8]"}`} style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">Chuyên gia:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {evaluators.map(m => {
                  const evData = readiness?.evaluations?.find(e => e.councilMemberId === m.councilMemberId);
                  const isDone = !!evData;
                  const cfg = getRoleCfg(m.councilRole);
                  return (
                    <div key={m.councilMemberId} title={`${m.fullName} — ${isDone ? "Đã nộp phiếu" : "Đang chờ"}`}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${cfg.avatarGrad} flex items-center justify-center text-white text-[9px] font-bold border-2 transition-all ${isDone ? "border-green-300 ring-1 ring-green-400/50" : "border-gray-200 opacity-50"}`}>
                      {m.fullName.charAt(0).toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <span className="text-[11px] text-gray-400 ml-1 hidden sm:inline">
                <span className="font-bold text-green-600">{done}</span>/{total} hoàn tất
              </span>
            </div>

            <p className={`text-[11.5px] leading-snug mt-1 ${isReady ? "text-green-700 font-semibold" : "text-gray-500"}`}>
              {isReady
                ? "✓ Tất cả chuyên gia phản biện và ủy viên đã nộp phiếu. Sẵn sàng lập Biên bản Hội đồng."
                : "Vui lòng chờ tất cả thành viên (trừ Thư ký) hoàn tất trước khi lập Biên bản tổng hợp."}
            </p>
          </div>
        </div>

        {/* Member Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <IcSession cls="w-4 h-4 text-[#1a5ea8]" />
              <h3 className="text-sm font-bold text-gray-800">Danh sách Thành viên Hội đồng</h3>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{members.length} thành viên</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider text-left">Họ và tên</th>
                  <th className="py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Vai trò</th>
                  <th className="py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Trạng thái Phiếu</th>
                  <th className="py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Tác vụ / Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map(member => {
                  const isSec = member.councilRole === 'SECRETARY';
                  const cfg = getRoleCfg(member.councilRole);
                  const evData = readiness?.evaluations?.find(e => e.councilMemberId === member.councilMemberId);
                  const isDone = !!evData;
                  const isReminded = remindedIds.includes(member.councilMemberId);

                  return (
                    <tr key={member.councilMemberId} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${cfg.avatarGrad} flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold shadow-sm`}>
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold leading-tight text-gray-800">{member.fullName}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{member.departmentName || "Đại học Mở TP.HCM"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.pill}`}>
                          {getCouncilRoleLabel(member.councilRole)}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-center">
                        {isSec ? (
                          <span className="text-[11.5px] font-medium text-gray-400 italic">—</span>
                        ) : isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <IcCheck cls="w-3.5 h-3.5" /> Đã hoàn tất
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" /> Đang chờ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-center">
                        {isSec ? (
                          <span className="text-[11px] text-indigo-500 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">Thư ký quản trị</span>
                        ) : isDone ? (
                          <span className="text-[11px] text-green-600 font-bold">{evData.totalScore?.toFixed(2) ?? '—'}/100 đ</span>
                        ) : dashboardState !== "MINUTES_CREATED" ? (
                          <button
                            onClick={() => handleRemind(member.councilMemberId, member.fullName)}
                            disabled={isReminded}
                            className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border text-xs font-semibold transition ${
                              isReminded ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50" : "border-amber-300 text-amber-700 hover:bg-amber-50 bg-white"
                            }`}
                          >
                            {isReminded ? <><IcCheck cls="w-3.5 h-3.5" />Đã nhắc nhở</> : <><IcBell cls="w-3.5 h-3.5" />Gửi nhắc nhở</>}
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400">Đã khóa</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Sticky Gatekeeper Footer ── */}
      <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center gap-3">
          {dashboardState === "IN_PROGRESS" && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
              <IcAlert cls="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-[12px] text-amber-700 font-semibold">Chờ <strong>{pendingCount}</strong> chuyên gia hoàn tất phiếu đánh giá</p>
            </div>
          )}
          {dashboardState === "READY" && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2 animate-in fade-in">
              <IcCheck cls="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-[12px] text-green-700 font-semibold">Tất cả thành viên đã hoàn tất — sẵn sàng lập biên bản</p>
            </div>
          )}
          {dashboardState === "MINUTES_CREATED" && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2">
              <IcDoc cls="w-4 h-4 text-[#1a5ea8] flex-shrink-0" />
              <p className="text-[12px] text-[#1a5ea8] font-semibold">Biên bản Hội đồng đã được tạo thành công</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {!isMinutesCreated && (
            <Link
              to={isReady ? `/council/topics/${topicId}/minute` : "#"}
              className={`flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold transition ${
                isReady ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              <IcDoc cls="w-4 h-4" /> Lập Biên bản Hội đồng
            </Link>
          )}
          {isMinutesCreated && (
            <Link
              to={`/council/topics/${topicId}/minute`}
              className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold border-2 border-[#1a5ea8] text-[#1a5ea8] hover:bg-blue-50 transition"
            >
              <IcDoc cls="w-4 h-4" /> Xem Biên bản
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}