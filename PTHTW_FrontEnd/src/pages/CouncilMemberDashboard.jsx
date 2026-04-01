// File: src/pages/CouncilMemberDashboard.jsx

import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  ROLE_CFG,
  STATUS_CFG,
  COUNCIL_MEMBER,
  INITIAL_ASSIGNMENTS,
  TABS,
  TABLE_HEADERS
} from "../mocks/councilMemMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcGrid     = p => <Svg {...p} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />;
const IcHistory  = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcProfile  = p => <Svg {...p} d={["M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804", "M15 10a3 3 0 11-6 0 3 3 0 016 0z", "M19.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414-1.414l11-11a1 1 0 011.414 0z"]} />;
const IcUserCirc = p => <Svg {...p} d={["M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"]} />;
const IcLogout   = p => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcVideo    = p => <Svg {...p} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />;
const IcCheck    = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcX        = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcAlert    = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcArrowRight = p => <Svg {...p} d="M13 7l5 5m0 0l-5 5m5-5H6" />;
const IcDoc      = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcClipboard = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"]} />;
const IcLoader   = p => <Svg {...p} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg, loading = false }) => (
  <div className="fixed top-5 right-5 z-[200] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl bg-green-600 text-white text-sm font-semibold max-w-sm pointer-events-none">
    {loading
      ? <IcLoader cls="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
      : <IcCheck  cls="w-5 h-5 flex-shrink-0 mt-0.5" />}
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────────

const COUNCIL_NAV = [
  { id: "dashboard", label: "Dashboard Hội đồng",   icon: <IcGrid /> },
  { id: "history",   label: "Lịch sử tham gia",     icon: <IcHistory /> },
  { id: "profile",   label: "Hồ sơ chuyên gia",     icon: <IcUserCirc /> },
];

const Sidebar = ({ active, setActive }) => (
  <aside className="flex flex-col w-56 min-h-screen bg-[#c5e2f5] flex-shrink-0">
    <div className="flex flex-col items-center pt-6 pb-5 px-4 border-b border-blue-200/60">
      <img src={logoOU} alt="OU Logo" className="h-14 w-auto object-contain" />
      <p className="mt-2 text-[9.5px] font-bold text-[#1a5ea8] uppercase tracking-widest text-center leading-tight">
        Trường Đại Học Mở TP. HCM
      </p>
    </div>

    <div className="px-5 pt-5 pb-3">
      <p className="text-[10px] font-semibold text-[#4a7faa] uppercase tracking-widest leading-relaxed">
        Hệ thống Quản lý<br />Đề tài Nghiên cứu<br />Khoa học
      </p>
    </div>

    <nav className="flex flex-col gap-1 px-3 flex-1">
      {COUNCIL_NAV.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-semibold transition duration-150 ${
              isActive ? "bg-[#1a5ea8] text-white shadow-sm" : "text-[#1a5ea8] hover:bg-blue-200/60"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    {/* User card */}
    <div className="mx-3 mb-4 mt-2 bg-white/60 rounded-xl px-3 py-3 flex items-center gap-2.5 border border-blue-100">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
        {COUNCIL_MEMBER.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">
          {COUNCIL_MEMBER.title} {COUNCIL_MEMBER.name}
        </p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">{COUNCIL_MEMBER.role}</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition flex-shrink-0">
        <IcLogout cls="w-4 h-4" />
      </button>
    </div>
  </aside>
);

// ─── Role Badge ───────────────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CFG[role] ?? { bg: "bg-gray-400", text: "text-white" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${cfg.bg} ${cfg.text}`}>
      {role}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {status === "completed" ? <IcCheck cls="w-3 h-3" /> : <IcAlert cls="w-3 h-3" />}
      {cfg.label}
    </span>
  );
};

// ─── Enter Meeting Confirmation Modal ─────────────────────────────────────────────

const EnterMeetingModal = ({ topic, onClose, onConfirm, isEntering }) => {
  useEffect(() => {
    const h = e => e.key === "Escape" && !isEntering && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose, isEntering]);

  const roleCfg = ROLE_CFG[topic.role] ?? ROLE_CFG["Ủy viên"];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={e => !isEntering && e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${roleCfg.bg}`}>
              <IcVideo cls="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 leading-tight">Xác nhận vào phòng Thẩm định</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Khu vực đánh giá và chấm điểm</p>
            </div>
          </div>
          {!isEntering && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
              <IcX cls="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Topic info card */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3.5 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <IcDoc cls="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đề tài thẩm định</p>
                <p className="text-[13px] font-semibold text-gray-800 leading-snug mt-1">{topic.title}</p>
                <p className="text-[11px] text-gray-500 mt-1">Mã: <span className="font-bold text-[#1a5ea8]">{topic.code}</span> · CN: {topic.pi}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-200 mt-1">
              <IcClipboard cls="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-[11px] text-gray-500">Vai trò của bạn:</p>
              <RoleBadge role={topic.role} />
            </div>

            <div className="flex items-center gap-2">
              <IcHistory cls="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-[11px] text-gray-500">{topic.datetime} · {topic.location}</p>
            </div>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <IcAlert cls="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Hệ thống sẽ chuyển bạn đến khu vực <strong>đánh giá và chấm điểm (SC-COUNCIL-02)</strong>. Vui lòng đảm bảo bạn đã chuẩn bị đầy đủ hồ sơ trước khi vào phòng.
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button
            onClick={onClose}
            disabled={isEntering}
            className="h-9 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isEntering}
            className={`h-9 px-6 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm ${
              isEntering
                ? "bg-[#1a5ea8]/70 text-white cursor-wait"
                : "bg-[#1a5ea8] hover:bg-[#15306a] text-white"
            }`}
          >
            {isEntering
              ? <><IcLoader cls="w-4 h-4 animate-spin" />Đang kết nối...</>
              : <><IcArrowRight cls="w-4 h-4" />Vào phòng</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component: Council Member Dashboard (SC-COUNCIL-01) ────────────────────

const CouncilMemberDashboard = () => {
  const [navActive,      setNavActive]      = useState("dashboard");
  const [activeTab,      setActiveTab]      = useState("pending");
  const [selectedTopic,  setSelectedTopic]  = useState(null);
  const [isEntering,     setIsEntering]     = useState(false);
  const [toast,          setToast]          = useState({ visible: false, msg: "", loading: false });

  const totalAssigned = INITIAL_ASSIGNMENTS.length;
  const pendingCount  = INITIAL_ASSIGNMENTS.filter(a => a.status === "pending").length;

  const displayed = INITIAL_ASSIGNMENTS.filter(a =>
    activeTab === "pending" ? a.status === "pending" : a.status === "completed"
  );

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "", loading: false }), 4000);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = (msg, loading = false) =>
    setToast({ visible: true, msg, loading });

  const handleOpenModal  = topic => { setSelectedTopic(topic); setIsEntering(false); };
  const handleCloseModal = ()    => { setSelectedTopic(null);  setIsEntering(false); };

  const handleConfirmEnter = () => {
    setIsEntering(true);
    showToast("Đang chuyển hướng đến phòng họp ảo...", true);

    // Simulate 2-second redirect
    setTimeout(() => {
      setIsEntering(false);
      setSelectedTopic(null);
      showToast(`Đã kết nối phòng thẩm định: ${selectedTopic?.code}. Chào mừng bạn vào phòng họp!`);
      console.info("[SC-COUNCIL-01] Redirecting to SC-COUNCIL-02 for topic:", selectedTopic?.code);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={navActive} setActive={setNavActive} />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Page Header ── */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Bảng điều khiển Công việc Hội đồng</h1>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">
              {COUNCIL_MEMBER.title} {COUNCIL_MEMBER.name} · {COUNCIL_MEMBER.unit}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {COUNCIL_MEMBER.initials}
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-700 leading-tight">{COUNCIL_MEMBER.title} {COUNCIL_MEMBER.name}</p>
              <p className="text-[10px] text-[#4a7faa]">{COUNCIL_MEMBER.role}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-5">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <IcClipboard cls="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600 leading-none">{String(totalAssigned).padStart(2, "0")}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Tổng số đề tài phân công</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <IcAlert cls="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-red-500 leading-none">{String(pendingCount).padStart(2, "0")}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Chờ đánh giá</p>
              </div>
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 flex gap-1 self-start">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#1a5ea8] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.id === "pending" && pendingCount > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                    activeTab === "pending" ? "bg-white/25 text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Data Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <IcCheck cls="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm font-bold text-gray-600">Không còn đề tài chờ đánh giá</p>
                <p className="text-xs text-gray-400 mt-1">Tất cả đề tài phân công đã được xử lý</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {TABLE_HEADERS.map(h => (
                      <th
                        key={h}
                        className={`py-3.5 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider ${
                          ["Vai trò Hội đồng", "Trạng thái", "Hành động"].includes(h)
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">

                      {/* Mã ĐT */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#1a5ea8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">{item.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          CN: {item.pi} · <span className="text-[#4a7faa] font-medium">{item.council}</span>
                        </p>
                      </td>

                      {/* Role badge */}
                      <td className="py-4 px-4 text-center">
                        <RoleBadge role={item.role} />
                      </td>

                      {/* Datetime + location */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="text-[13px] text-gray-700 font-medium">{item.datetime}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.location}</p>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-xs font-bold transition shadow-sm"
                          >
                            <IcVideo cls="w-3.5 h-3.5" />
                            Vào phòng họp
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition">
                            <IcDoc cls="w-3.5 h-3.5" />
                            Xem biên bản
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Table footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-400">
                Hiển thị <span className="font-semibold text-gray-600">{displayed.length}</span>{" "}
                đề tài trong tab này
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Enter Meeting Confirmation Modal */}
      {selectedTopic && (
        <EnterMeetingModal
          topic={selectedTopic}
          isEntering={isEntering}
          onClose={handleCloseModal}
          onConfirm={handleConfirmEnter}
        />
      )}

      {/* Toast */}
      {toast.visible && <Toast msg={toast.msg} loading={toast.loading} />}
    </div>
  );
};

export default CouncilMemberDashboard;