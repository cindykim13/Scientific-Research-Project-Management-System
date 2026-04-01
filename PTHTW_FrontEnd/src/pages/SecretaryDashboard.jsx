// File: src/pages/SecretaryDashboard.jsx

import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  SECRETARY,
  MOCK_MEETING,
  ROLE_CFG,
  DASHBOARD_STATUS_CFG,
  INITIAL_MEMBERS,
} from "../mocks/secretaryMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcGrid     = p => <Svg {...p} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />;
const IcSession  = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"]} />;
const IcHistory  = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcUserCirc = p => <Svg {...p} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcLogout   = p => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcBell     = p => <Svg {...p} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
const IcCheck    = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcX        = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcAlert    = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcEye      = p => <Svg {...p} d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />;
const IcEdit     = p => <Svg {...p} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />;
const IcArrow    = p => <Svg {...p} d="M13 7l5 5m0 0l-5 5m5-5H6" />;
const IcLoader   = p => <Svg {...p} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
const IcDoc      = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcClock    = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcMapPin   = p => <Svg {...p} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type = "success" }) => (
  <div className={`fixed top-5 right-5 z-[200] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-semibold pointer-events-none max-w-sm ${
    type === "success" ? "bg-green-600" : "bg-amber-500"
  }`}>
    {type === "success"
      ? <IcCheck cls="w-5 h-5 flex-shrink-0 mt-0.5" />
      : <IcBell  cls="w-5 h-5 flex-shrink-0 mt-0.5" />}
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────────

const ConfirmModal = ({ completedCount, totalCount, onClose, onConfirm }) => {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-end px-4 pt-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <IcX cls="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center px-8 pb-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <IcDoc cls="w-8 h-8 text-[#1a5ea8]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Xác nhận lập Biên bản Hội đồng?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hệ thống sẽ tổng hợp <strong className="text-gray-700">{completedCount}/{totalCount}</strong> phiếu đánh giá và tạo Biên bản chính thức. Bạn sẽ không thể thay đổi kết quả phiếu sau bước này.
            </p>
          </div>

          {/* Summary */}
          <div className="w-full bg-green-50 rounded-xl p-3 flex items-center gap-3 border border-green-100">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <IcCheck cls="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-green-800 text-left">
              Tất cả {totalCount} thành viên đã hoàn tất phiếu đánh giá
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Hủy</button>
            <button onClick={onConfirm} className="flex-1 h-10 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm">
              Xác nhận lập biên bản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────────

const SEC_NAV = [
  { id: "dashboard", label: "Dashboard Hội đồng",   icon: <IcGrid /> },
  { id: "session",   label: "Quản trị Phiên họp",   icon: <IcSession /> },
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
      {SEC_NAV.map(item => {
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
    <div className="mx-3 mb-4 mt-2 bg-white/60 rounded-xl px-3 py-3 flex items-center gap-2.5 border border-blue-100">
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${SECRETARY.avatarGrad} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm`}>
        {SECRETARY.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">{SECRETARY.name}</p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">Vai trò: {SECRETARY.role}</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition flex-shrink-0">
        <IcLogout cls="w-4 h-4" />
      </button>
    </div>
  </aside>
);

// ─── Circular Progress Indicator ─────────────────────────────────────────────────

const CircularProgress = ({ done, total }) => {
  const radius       = 36;
  const circumference = 2 * Math.PI * radius;
  const pct          = total > 0 ? done / total : 0;
  const offset       = circumference * (1 - pct);
  const isComplete   = done === total;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={isComplete ? "#16a34a" : "#1a5ea8"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black leading-none transition-colors ${isComplete ? "text-green-600" : "text-[#1a5ea8]"}`}>
          {done}
        </span>
        <span className="text-[10px] font-bold text-gray-400">/{total}</span>
      </div>
    </div>
  );
};

// ─── Progress Card ────────────────────────────────────────────────────────────────

const ProgressCard = ({ members }) => {
  const done  = members.filter(m => m.status === "done").length;
  const total = members.length;
  const pct   = Math.round((done / total) * 100);
  const isComplete = done === total;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 flex items-center gap-6">
      {/* Circular progress */}
      <CircularProgress done={done} total={total} />

      {/* Divider */}
      <div className="w-px h-16 bg-gray-100 flex-shrink-0" />

      {/* Info section */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">
              Tiến độ thu thập Phiếu đánh giá
            </p>
            <span className={`text-[11px] font-bold ${isComplete ? "text-green-600" : "text-[#1a5ea8]"}`}>
              {pct}%
            </span>
          </div>
          {/* Thick progress bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-green-400" : "bg-[#1a5ea8]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Member avatar dots */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">Thành viên:</span>
          <div className="flex items-center gap-1.5">
            {members.map(m => (
              <div
                key={m.id}
                title={`${m.name} — ${m.status === "done" ? "Đã hoàn tất" : "Đang chờ"}`}
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.avatarGrad} flex items-center justify-center text-white text-[9px] font-bold border-2 transition-all ${
                  m.status === "done" ? "border-green-300 ring-1 ring-green-400/50" : "border-gray-200 opacity-50"
                }`}
              >
                {m.initials}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-gray-400 ml-1">
            <span className="font-bold text-green-600">{done}</span>/{total} hoàn tất
          </span>
        </div>

        {/* Status message */}
        <p className={`text-[11.5px] leading-snug ${isComplete ? "text-green-700 font-semibold" : "text-gray-500"}`}>
          {isComplete
            ? "✓ Tất cả thành viên đã hoàn tất. Sẵn sàng lập Biên bản Hội đồng."
            : "Vui lòng chờ tất cả thành viên hoàn tất trước khi lập Biên bản tổng hợp."}
        </p>
      </div>
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CFG[role] ?? { bg: "bg-gray-400", text: "text-white" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${cfg.bg} ${cfg.text}`}>
      {role}
    </span>
  );
};

// ─── Member Status Badge ──────────────────────────────────────────────────────────

const MemberStatusBadge = ({ status }) => (
  status === "done"
    ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <IcCheck cls="w-3 h-3" />
        Đã hoàn tất
      </span>
    : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
        Đang chờ
      </span>
);

// ─── Member Tracking Table ────────────────────────────────────────────────────────

const MemberTable = ({ members, remindedIds, evaluating, onRemind, onEvaluate, disabled }) => {
  const HEADERS = ["Họ và tên", "Vai trò", "Trạng thái Phiếu", "Tác vụ"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <IcSession cls="w-4 h-4 text-[#1a5ea8]" />
          <h3 className="text-sm font-bold text-gray-800">Danh sách Thành viên Hội đồng</h3>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">{members.length} thành viên</span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {HEADERS.map(h => (
              <th
                key={h}
                className={`py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider ${
                  ["Trạng thái Phiếu", "Tác vụ"].includes(h) ? "text-center" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const isReminded     = remindedIds.includes(member.id);
            const isEvaluatingMe = evaluating && member.isSelf;

            return (
              <tr
                key={member.id}
                className={`border-b border-gray-100 transition ${
                  member.isSelf ? "bg-blue-50/30" : "hover:bg-gray-50/60"
                }`}
              >
                {/* Name + avatar */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.avatarGrad} flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold shadow-sm`}>
                      {member.initials}
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold leading-tight ${member.isSelf ? "text-[#1a5ea8]" : "text-gray-800"}`}>
                        {member.name}
                        {member.isSelf && (
                          <span className="ml-2 text-[9px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Bạn</span>
                        )}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{MOCK_MEETING.council}</p>
                    </div>
                  </div>
                </td>

                {/* Role badge */}
                <td className="py-4 px-5">
                  <RoleBadge role={member.role} />
                </td>

                {/* Status badge */}
                <td className="py-4 px-5 text-center">
                  {isEvaluatingMe
                    ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        <IcLoader cls="w-3 h-3 animate-spin" />
                        Đang đánh giá...
                      </span>
                    : <MemberStatusBadge status={member.status} />
                  }
                </td>

                {/* Dynamic action column */}
                <td className="py-4 px-5 text-center">
                  {/* Self + pending */}
                  {member.isSelf && member.status === "pending" && (
                    <button
                      onClick={onEvaluate}
                      disabled={isEvaluatingMe || disabled}
                      className={`inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-bold transition shadow-sm ${
                        isEvaluatingMe || disabled
                          ? "bg-[#1a5ea8]/60 text-white cursor-wait"
                          : "bg-[#1a5ea8] hover:bg-[#15306a] text-white"
                      }`}
                    >
                      {isEvaluatingMe
                        ? <><IcLoader cls="w-3.5 h-3.5 animate-spin" />Đang mở SC-02...</>
                        : <><IcArrow cls="w-3.5 h-3.5" />Tiến hành Đánh giá</>}
                    </button>
                  )}

                  {/* Self + done */}
                  {member.isSelf && member.status === "done" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      <IcCheck cls="w-3 h-3" />
                      Đã hoàn tất
                    </span>
                  )}

                  {/* Other + pending */}
                  {!member.isSelf && member.status === "pending" && (
                    <button
                      onClick={() => onRemind(member.id, member.name)}
                      disabled={isReminded}
                      className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border text-xs font-semibold transition ${
                        isReminded
                          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                          : "border-amber-300 text-amber-700 hover:bg-amber-50 bg-white"
                      }`}
                    >
                      {isReminded
                        ? <><IcCheck cls="w-3.5 h-3.5" />Đã nhắc nhở</>
                        : <><IcBell  cls="w-3.5 h-3.5" />Gửi nhắc nhở</>}
                    </button>
                  )}

                  {/* Other + done */}
                  {!member.isSelf && member.status === "done" && (
                    <button className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-gray-500 text-xs font-semibold hover:bg-gray-50 hover:text-gray-700 transition border border-gray-200">
                      <IcEye cls="w-3.5 h-3.5" />
                      Xem phiếu
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Gatekeeper Footer ────────────────────────────────────────────────────────────

const GatekeeperFooter = ({ dashboardState, pendingCount, onClickMinutes }) => {
  const isDisabled       = dashboardState === "IN_PROGRESS";
  const isReady          = dashboardState === "READY";
  const isMinutesCreated = dashboardState === "MINUTES_CREATED";

  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {/* Left: status summary */}
      <div className="flex items-center gap-3">
        {isDisabled && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
            <IcAlert cls="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-[12px] text-amber-700 font-semibold">
              Chờ <strong>{pendingCount}</strong> thành viên hoàn tất phiếu đánh giá
            </p>
          </div>
        )}
        {isReady && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2">
            <IcCheck cls="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-[12px] text-green-700 font-semibold">
              Tất cả thành viên đã hoàn tất — sẵn sàng lập biên bản
            </p>
          </div>
        )}
        {isMinutesCreated && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2">
            <IcDoc cls="w-4 h-4 text-[#1a5ea8] flex-shrink-0" />
            <p className="text-[12px] text-[#1a5ea8] font-semibold">
              Biên bản Hội đồng đã được tạo thành công
            </p>
          </div>
        )}
      </div>

      {/* Right: action button */}
      <div className="flex-shrink-0">
        {!isMinutesCreated && (
          <button
            disabled={isDisabled}
            onClick={isReady ? onClickMinutes : undefined}
            className={`flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold transition ${
              isReady
                ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IcDoc cls="w-4 h-4" />
            Lập Biên bản Hội đồng
          </button>
        )}
        {isMinutesCreated && (
          <button className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold border-2 border-[#1a5ea8] text-[#1a5ea8] hover:bg-blue-50 transition">
            <IcEdit cls="w-4 h-4" />
            Xem / Cập nhật Biên bản
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component: Secretary Council Dashboard (SC-COUNCIL-03) ─────────────────

const SecretaryDashboard = () => {
  const [members,        setMembers]        = useState(INITIAL_MEMBERS);
  
  // FIX ESLINT CASCADING RENDERS: Tính toán trạng thái trực tiếp từ state thay vì dùng useEffect
  const [isMinutesCreated, setIsMinutesCreated] = useState(false);
  const [remindedIds,    setRemindedIds]    = useState([]);
  const [evaluating,     setEvaluating]     = useState(false);
  const [confirmOpen,    setConfirmOpen]    = useState(false);
  const [navActive,      setNavActive]      = useState("session");
  const [toast,          setToast]          = useState({ visible: false, msg: "", type: "success" });

  const completedCount = members.filter(m => m.status === "done").length;
  const pendingCount   = members.length - completedCount;

  // Derived State (Best Practice): Tự động xác định trạng thái màn hình
  const dashboardState = isMinutesCreated 
    ? "MINUTES_CREATED" 
    : (completedCount === members.length ? "READY" : "IN_PROGRESS");

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "", type: "success" }), 4000);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = (msg, type = "success") => setToast({ visible: true, msg, type });

  const handleRemind = (id, name) => {
    setRemindedIds(prev => [...prev, id]);
    showToast(`Đã gửi email hối thúc đến ${name.split(". ")[1] ?? name}.`, "remind");
  };

  const handleEvaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      setMembers(prev => prev.map(m => m.isSelf ? { ...m, status: "done" } : m));
      setEvaluating(false);
      showToast("Đã hoàn thành đánh giá. Phiếu của bạn đã được lưu thành công.");
    }, 1800);
  };

  const handleCreateMinutes = () => setConfirmOpen(true);

  const handleConfirmMinutes = () => {
    setConfirmOpen(false);
    setIsMinutesCreated(true);
    showToast("Biên bản Hội đồng đã được lập thành công. Hệ thống đang tổng hợp kết quả đánh giá.");
  };

  const statusCfg = DASHBOARD_STATUS_CFG[dashboardState];

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={navActive} setActive={setNavActive} />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Page Header ── */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SC-COUNCIL-03 · Thư ký Hội đồng</p>
                <h1 className="text-xl font-bold text-gray-800 leading-tight mt-0.5">
                  Quản trị Phiên họp —{" "}
                  <span className="text-[#1a5ea8]">{MOCK_MEETING.topicCode}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{MOCK_MEETING.topicTitle}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  <IcClock cls="w-3 h-3 text-gray-400" />
                  {MOCK_MEETING.datetime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  <IcMapPin cls="w-3 h-3 text-gray-400" />
                  {MOCK_MEETING.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  <IcDoc cls="w-3 h-3 text-gray-400" />
                  {MOCK_MEETING.council}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${statusCfg.bg} ${statusCfg.text}`}
                style={{ borderColor: "transparent" }}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dot} animate-pulse`} />
                {statusCfg.label}
              </span>
            </div>
          </div>
        </header>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-5">
          <ProgressCard members={members} />

          <MemberTable
            members={members}
            remindedIds={remindedIds}
            evaluating={evaluating}
            onRemind={handleRemind}
            onEvaluate={handleEvaluate}
            disabled={dashboardState === "MINUTES_CREATED"}
          />
        </div>

        {/* ── Sticky Gatekeeper Footer ── */}
        <GatekeeperFooter
          dashboardState={dashboardState}
          pendingCount={pendingCount}
          onClickMinutes={handleCreateMinutes}
        />
      </main>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <ConfirmModal
          completedCount={completedCount}
          totalCount={members.length}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmMinutes}
        />
      )}

      {/* Toast */}
      {toast.visible && <Toast msg={toast.msg} type={toast.type === "remind" ? "remind" : "success"} />}
    </div>
  );
};

export default SecretaryDashboard;