// File: src/pages/DepartmentDashboard.jsx

import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  DEPT_FIELDS,
  STATUS_CFG,
  INITIAL_TOPICS,
  CHECKLIST_ITEMS,
  HEADERS
} from "../mocks/departmentMock";

// ─── SVG Factory ───────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcHome      = p => <Svg {...p} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />;
const IcHistory   = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcChart     = p => <Svg {...p} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
const IcSettings  = p => <Svg {...p} d={["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"]} />;
const IcLogout    = p => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcSearch    = p => <Svg {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcX         = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcLeft      = p => <Svg {...p} d="M11 17l-5-5m0 0l5-5m-5 5h12" />;
const IcCheck     = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcFilter    = p => <Svg {...p} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />;
const IcEye       = p => <Svg {...p} d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />;
const IcDoc       = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcClipboard = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", "M9 12h6m-6 4h4"]} />;
const IcAlert     = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcInbox     = p => <Svg {...p} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />;
const IcZoomPlus  = p => <Svg {...p} d="M21 21l-4.35-4.35M10 7v6m-3-3h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcZoomMinus = p => <Svg {...p} d="M21 21l-4.35-4.35M7 11h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcChevUp    = p => <Svg {...p} d="M5 15l7-7 7 7" />;
const IcChevDown  = p => <Svg {...p} d="M19 9l-7 7-7-7" />;
const IcTag       = p => <Svg {...p} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />;
const IcCalendar  = p => <Svg {...p} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;

// ─── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type = "success" }) => (
  <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold transition-all ${
    type === "success" ? "bg-green-600" : "bg-red-600"
  }`}>
    <IcCheck cls="w-5 h-5 text-green-200 flex-shrink-0" />
    {msg}
  </div>
);

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

const ConfirmModal = ({ action, onConfirm, onClose }) => {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const isApprove = action === "approve";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-end px-4 pt-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <IcX cls="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center px-8 pb-7 gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isApprove ? "bg-blue-50" : "bg-amber-50"}`}>
            {isApprove
              ? <IcCheck cls="w-8 h-8 text-[#1a5ea8]" />
              : <IcAlert cls="w-8 h-8 text-amber-500" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Xác nhận quyết định này?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {isApprove
                ? "Đề tài sẽ được phê duyệt và chuyển lên Phòng QLKH để tiếp tục xét duyệt. Hành động này không thể hoàn tác."
                : "Yêu cầu chỉnh sửa sẽ được gửi đến Chủ nhiệm đề tài kèm theo ý kiến đánh giá của bạn."}
            </p>
          </div>
          <div className="flex gap-3 w-full pt-1">
            <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 h-10 rounded-lg text-white text-sm font-bold transition shadow-sm ${
                isApprove ? "bg-[#1a5ea8] hover:bg-[#15306a]" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const DEPT_NAV = [
  { id: "dashboard", label: "Dashboard",           icon: <IcHome /> },
  { id: "history",   label: "Lịch sử xét duyệt",  icon: <IcHistory /> },
  { id: "stats",     label: "Thống kê Khoa",       icon: <IcChart /> },
  { id: "settings",  label: "Cài đặt",             icon: <IcSettings /> },
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
      {DEPT_NAV.map(item => {
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
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4a90c4] to-[#1a5ea8] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        PK
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">Trần Minh Khoa</p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">Vai trò: Phụ trách Khoa</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition flex-shrink-0">
        <IcLogout cls="w-4 h-4" />
      </button>
    </div>
  </aside>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
      <IcInbox cls="w-8 h-8 text-[#4a90c4]" />
    </div>
    <p className="text-sm font-bold text-gray-600">Không tìm thấy đề tài nào</p>
    <p className="text-xs text-gray-400 mt-1">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
  </div>
);

// ─── VIEW 1: Department Dashboard ─────────────────────────────────────────────

const DeptDashboard = ({ topics, onViewTopic, navActive, setNavActive, toastComponent }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [dateFrom,    setDateFrom]    = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const pending  = topics.filter(t => t.status === "pending").length;
  const approved = topics.filter(t => t.status === "approved").length;
  const revision = topics.filter(t => t.status === "revision").length;

  // Active filter tags
  const activeTags = [
    ...(fieldFilter ? [{ id: "field", label: `Lĩnh vực: ${fieldFilter}`,  onRemove: () => setFieldFilter("") }] : []),
    ...(searchQuery ? [{ id: "q",     label: `Tìm kiếm: "${searchQuery}"`, onRemove: () => setSearchQuery("") }] : []),
    ...(dateFrom    ? [{ id: "date",  label: `Từ ngày: ${dateFrom}`,        onRemove: () => setDateFrom("")    }] : []),
  ];

  const filtered = topics.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.pi.toLowerCase().includes(q);
    const matchField  = !fieldFilter || t.field === fieldFilter;
    return matchSearch && matchField;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={navActive} setActive={setNavActive} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Dashboard Duyệt Đề tài</h1>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">cấp Khoa</p>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-5">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Chờ xét duyệt",     value: pending,  color: "text-yellow-500" },
              { label: "Đã phê duyệt",       value: approved, color: "text-green-600"  },
              { label: "Yêu cầu chỉnh sửa",  value: revision, color: "text-red-500"    },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
                <span className={`text-4xl font-black leading-none ${color}`}>
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-gray-600 leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IcSearch cls="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Tìm kiếm mã, tên đề tài, chủ nhiệm..."
                  className="h-9 pl-9 pr-4 w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 focus:bg-white transition"
                />
              </div>
              {/* Field filter */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IcFilter cls="w-4 h-4 text-gray-400" />
                </span>
                <select
                  value={fieldFilter}
                  onChange={e => { setFieldFilter(e.target.value); setCurrentPage(1); }}
                  className="h-9 pl-9 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 cursor-pointer appearance-none transition"
                >
                  <option value="">Lĩnh vực (Tất cả)</option>
                  {DEPT_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              {/* Date from */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IcCalendar cls="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  className="h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 cursor-pointer transition"
                />
              </div>
            </div>

            {/* Active filter tags */}
            {activeTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <IcTag cls="w-3 h-3" /> Đang lọc:
                </span>
                {activeTags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1a5ea8]"
                  >
                    {tag.label}
                    <button
                      onClick={tag.onRemove}
                      className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blue-200 transition"
                    >
                      <IcX cls="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => { setSearchQuery(""); setFieldFilter(""); setDateFrom(""); setCurrentPage(1); }}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-600 transition ml-1"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Table or empty state */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <EmptyState />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {HEADERS.map(h => (
                      <th
                        key={h}
                        className={`py-3.5 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider ${
                          ["Trạng thái", "Hành động"].includes(h) ? "text-center" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(topic => (
                    <tr key={topic.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-gray-700 whitespace-nowrap">{topic.code}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="line-clamp-2 text-gray-800 leading-snug">{topic.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{topic.pi}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">{topic.field}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">{topic.submittedAt}</td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={topic.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onViewTopic(topic)}
                          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#1a3a7c] hover:bg-[#15306a] text-white text-xs font-bold transition shadow-sm"
                        >
                          <IcEye cls="w-3.5 h-3.5" />
                          Xem &amp; Duyệt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ── Pagination footer ── */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
                {/* Result summary */}
                <p className="text-xs text-gray-400">
                  Hiển thị{" "}
                  <span className="font-semibold text-gray-600">
                    {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
                  đề tài
                </p>

                {/* Page controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-semibold transition ${
                        p === safePage
                          ? "bg-[#1a5ea8] border-[#1a5ea8] text-white shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {toastComponent}
    </div>
  );
};

// ─── VIEW 2: Mock PDF Content ──────────────────────────────────────────────────

const MockPDFPage = ({ topic, page }) => (
  <div className="bg-white shadow-md rounded-sm p-10 text-[11px] leading-relaxed text-gray-800 min-h-[700px] w-full max-w-[680px]">
    <div className="text-center mb-7 pb-5 border-b border-gray-200">
      <p className="font-bold text-[12px] uppercase tracking-wider text-gray-900">
        THUYẾT MINH ĐỀ TÀI NGHIÊN CỨU KHOA HỌC
      </p>
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Trường Đại học Mở TP. Hồ Chí Minh</p>
    </div>

    {page === 1 && (
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">
            I. THÔNG TIN CHUNG
          </p>
          {[
            ["Tên đề tài (Tiếng Việt):",  topic.title],
            ["Tên đề tài (Tiếng Anh):",   "Research on Applications in Science and Technology"],
            ["Loại hình nghiên cứu:",      "Ứng dụng"],
            ["Lĩnh vực Khoa học:",         topic.field],
            ["Mã số chuyên ngành:",        "48 06 01"],
            ["Thời gian thực hiện:",       "24 tháng (2026–2028)"],
            ["Chủ nhiệm đề tài:",          topic.pi],
            ["Đơn vị công tác:",           "Trường Đại học Mở TP. HCM"],
            ["Ngày nộp hồ sơ:",            topic.submittedAt],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3 mb-1.5 items-start">
              <span className="font-semibold text-gray-600 w-48 flex-shrink-0">{label}</span>
              <span className="text-gray-800 flex-1">{value}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">
            II. TỔNG QUAN NGHIÊN CỨU
          </p>
          <p className="text-gray-700 leading-relaxed">
            Trong bối cảnh cuộc Cách mạng công nghiệp 4.0, việc ứng dụng công nghệ tiên tiến vào các lĩnh vực khoa học và giáo dục ngày càng trở nên cấp thiết. Đề tài này nhằm nghiên cứu, phát triển và triển khai thử nghiệm các giải pháp sáng tạo ứng dụng trực tiếp vào thực tiễn, góp phần nâng cao chất lượng đào tạo và nghiên cứu khoa học tại Trường Đại học Mở TP.HCM.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Các kết quả nghiên cứu kỳ vọng sẽ tạo ra nền tảng tri thức mới, đồng thời đề xuất các giải pháp thực tiễn có thể áp dụng ngay tại các cơ sở giáo dục và doanh nghiệp trong nước.
          </p>
        </div>
      </div>
    )}

    {page === 2 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">
          III. MỤC TIÊU VÀ NỘI DUNG NGHIÊN CỨU
        </p>
        <div>
          <p className="font-semibold text-gray-700 mb-1.5">3.1 Mục tiêu tổng quát</p>
          <p className="text-gray-700 leading-relaxed">Nghiên cứu, xây dựng và triển khai thử nghiệm một hệ thống tích hợp nhằm giải quyết các vấn đề thực tiễn trong lĩnh vực nghiên cứu, đồng thời đề xuất mô hình có thể nhân rộng tại các đơn vị giáo dục đại học Việt Nam.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-1.5">3.2 Mục tiêu cụ thể</p>
          {["Khảo sát và đánh giá hiện trạng áp dụng các giải pháp hiện có.", "Thiết kế và phát triển mô hình/hệ thống đề xuất.", "Thử nghiệm và đánh giá hiệu quả tại Trường Đại học Mở TP.HCM.", "Hoàn thiện và đề xuất nhân rộng kết quả nghiên cứu."].map((item, i) => (
            <p key={i} className="text-gray-700 ml-3 mb-1">• {item}</p>
          ))}
        </div>
      </div>
    )}

    {page === 3 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">
          IV. KẾ HOẠCH VÀ DỰ TOÁN KINH PHÍ
        </p>
        <div className="rounded border border-gray-200 overflow-hidden">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["STT", "Hạng mục", "Số lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)"].map(h => (
                  <th key={h} className="py-1.5 px-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "Chi phí nhân công nghiên cứu", "24 tháng", "5.000.000", "120.000.000"],
                ["2", "Chi phí thiết bị, vật tư",     "Trọn gói", "—",         "80.000.000"],
                ["3", "Chi phí hội thảo, điều tra",    "2 lần",   "15.000.000","30.000.000"],
                ["4", "Chi phí quản lý",               "Trọn gói", "—",         "20.000.000"],
              ].map(([no, item, qty, unit, total]) => (
                <tr key={no} className="border-b border-gray-100">
                  <td className="py-1.5 px-2">{no}</td>
                  <td className="py-1.5 px-2">{item}</td>
                  <td className="py-1.5 px-2">{qty}</td>
                  <td className="py-1.5 px-2">{unit}</td>
                  <td className="py-1.5 px-2 font-semibold">{total}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={4} className="py-1.5 px-2 text-right">Tổng cộng:</td>
                <td className="py-1.5 px-2">250.000.000 VNĐ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}

    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-400">
      <span>Mẫu TM-ĐT-2026</span>
      <span>Trang {page} / 3</span>
    </div>
  </div>
);

// ─── VIEW 2: Approval Form ─────────────────────────────────────────────────────

const ApprovalView = ({ topic, onBack, onDecision }) => {
  const [activeDocTab, setActiveDocTab] = useState("thuyetminh");
  const [zoom,         setZoom]         = useState(100);
  const [page,         setPage]         = useState(1);
  const [checks, setChecks] = useState({ form: false, noDebt: false, content: false });
  const [notes,        setNotes]        = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  const allChecked    = checks.form && checks.noDebt && checks.content;
  const notesHasText  = notes.trim().length > 0;
  const canRevision   = notesHasText;
  const canApprove    = notesHasText && allChecked;

  const toggleCheck = (id) => setChecks(c => ({ ...c, [id]: !c[id] }));

  const handleConfirm = () => {
    setConfirmModal({ open: false, action: null });
    onDecision(topic.id, confirmModal.action);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Top header */}
      <header className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#1a5ea8] hover:text-blue-900 transition flex-shrink-0"
        >
          <IcLeft cls="w-4 h-4" />
          Quay lại
        </button>
        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thẩm định Đề tài Cấp Khoa</p>
          <h2 className="text-sm font-bold text-gray-800 truncate leading-tight mt-0.5">{topic.title}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">Mã:</span>
          <span className="text-xs font-bold text-[#1a5ea8] bg-blue-50 px-2 py-0.5 rounded">{topic.code}</span>
          <StatusBadge status={topic.status} />
        </div>
      </header>

      {/* Split-screen body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── Left: PDF Panel (60%) ─── */}
        <div className="flex flex-col bg-[#E0E0E0]" style={{ width: "60%" }}>
          {/* PDF Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-gray-300 flex-shrink-0">
            {/* File tabs */}
            <div className="flex items-center gap-1">
              {[
                { id: "thuyetminh", label: "Thuyết minh đề tài.pdf",  iconCls: "text-red-500"   },
                { id: "dutoan",     label: "Dự toán kinh phí.xlsx",    iconCls: "text-green-600" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveDocTab(tab.id); setPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    activeDocTab === tab.id
                      ? "bg-white shadow-sm text-gray-800 border border-gray-200"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <IcDoc cls={`w-3.5 h-3.5 ${tab.iconCls}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* PDF controls */}
            <div className="flex items-center gap-1">
              {/* Page nav */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="text-gray-500 hover:text-gray-800 transition disabled:opacity-30" disabled={page === 1}>
                  <IcChevUp cls="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-gray-700 mx-1 min-w-[40px] text-center">
                  {page} / 3
                </span>
                <button onClick={() => setPage(p => Math.min(3, p + 1))} className="text-gray-500 hover:text-gray-800 transition disabled:opacity-30" disabled={page === 3}>
                  <IcChevDown cls="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Zoom */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1">
                <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-gray-500 hover:text-gray-800 transition">
                  <IcZoomMinus cls="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-gray-700 mx-1 min-w-[36px] text-center">
                  {zoom}%
                </span>
                <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-gray-500 hover:text-gray-800 transition">
                  <IcZoomPlus cls="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document canvas */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
              <MockPDFPage topic={topic} page={page} />
            </div>
          </div>
        </div>

        {/* ─── Right: Decision Panel (40%) ─── */}
        <div className="flex flex-col bg-white border-l border-gray-200 shadow-xl overflow-hidden" style={{ width: "40%" }}>
          {/* Panel header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <IcClipboard cls="w-4 h-4 text-[#1a5ea8]" />
              <h3 className="text-sm font-bold text-gray-800">Phiếu Thẩm định Đề tài</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">Hoàn thành các mục bên dưới để đưa ra quyết định</p>
          </div>

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            {/* Section 1: Checklist */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kiểm tra Tính hợp lệ</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  allChecked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {Object.values(checks).filter(Boolean).length} / 3 mục
                </span>
              </div>
              <div className="flex flex-col gap-2.5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                {CHECKLIST_ITEMS.map(item => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleCheck(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                        checks[item.id]
                          ? "bg-[#1a5ea8] border-[#1a5ea8]"
                          : "border-gray-300 group-hover:border-[#1a5ea8]"
                      }`}
                    >
                      {checks[item.id] && <IcCheck cls="w-3 h-3 text-white" />}
                    </div>
                    <span
                      onClick={() => toggleCheck(item.id)}
                      className={`text-sm leading-snug select-none ${checks[item.id] ? "text-gray-800 font-medium" : "text-gray-600"}`}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
              {!allChecked && (
                <p className="text-[11px] text-amber-600 flex items-center gap-1">
                  <IcAlert cls="w-3.5 h-3.5" />
                  Cần tích đủ 3 mục để phê duyệt đề tài
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Section 2: Notes (mandatory) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ý kiến đánh giá / Yêu cầu chỉnh sửa
                  <span className="text-red-500 ml-0.5">*</span>
                </h4>
                <span className="text-[10px] text-gray-400">Bắt buộc</span>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Nhập nhận xét, đánh giá hoặc yêu cầu chỉnh sửa của bạn về đề tài này. Ý kiến này sẽ được gửi đến Chủ nhiệm đề tài..."
                rows={7}
                className={`w-full px-3.5 py-3 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none resize-none transition border ${
                  notesHasText
                    ? "border-[#1a5ea8] ring-2 ring-[#1a5ea8]/10"
                    : "border-gray-200 hover:border-gray-300 focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10"
                } bg-white`}
              />
              {!notesHasText && (
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <IcAlert cls="w-3.5 h-3.5 text-gray-400" />
                  Nhập ý kiến để kích hoạt các nút bên dưới
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Section 3: Action buttons */}
            <div className="flex flex-col gap-3 pb-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quyết định</h4>

              {/* Revision button */}
              <button
                disabled={!canRevision}
                onClick={() => setConfirmModal({ open: true, action: "revision" })}
                className={`w-full h-11 rounded-lg border-2 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  canRevision
                    ? "border-red-400 text-red-600 hover:bg-red-50 active:bg-red-100"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <IcAlert cls="w-4 h-4" />
                Yêu cầu chỉnh sửa
              </button>

              {/* Approve button */}
              <button
                disabled={!canApprove}
                onClick={() => setConfirmModal({ open: true, action: "approve" })}
                className={`w-full h-11 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                  canApprove
                    ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IcCheck cls="w-4 h-4" />
                Duyệt &amp; Chuyển Phòng QLKH
              </button>

              {/* Helper text */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  <strong className="text-gray-600">Yêu cầu chỉnh sửa:</strong> Cần có ý kiến đánh giá.<br />
                  <strong className="text-gray-600">Duyệt & Chuyển QLKH:</strong> Cần có ý kiến đánh giá <em>và</em> tích đủ 3 mục kiểm tra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal.open && (
        <ConfirmModal
          action={confirmModal.action}
          onConfirm={handleConfirm}
          onClose={() => setConfirmModal({ open: false, action: null })}
        />
      )}
    </div>
  );
};

// ─── Main Controller ───────────────────────────────────────────────────────────

const DepartmentDashboard = () => {
  const [topics,       setTopics]       = useState(INITIAL_TOPICS);
  const [currentView,  setCurrentView]  = useState("dashboard");
  const [selectedTopic,setSelectedTopic]= useState(null);
  const [navActive,    setNavActive]    = useState("dashboard");
  const [toast,        setToast]        = useState({ visible: false, msg: "" });

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "" }), 3500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = (msg) => setToast({ visible: true, msg });

  const handleViewTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentView("approval");
  };

  const handleDecision = (topicId, action) => {
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? { ...t, status: action === "approve" ? "approved" : "revision" }
          : t
      )
    );
    setCurrentView("dashboard");
    showToast(
      action === "approve"
        ? "✓ Đã phê duyệt và chuyển Phòng QLKH thành công!"
        : "✓ Đã gửi yêu cầu chỉnh sửa đến Chủ nhiệm thành công!"
    );
  };

  const toastEl = toast.visible ? <Toast msg={toast.msg} /> : null;

  return (
    <>
      {toastEl}
      {currentView === "dashboard" ? (
        <DeptDashboard
          topics={topics}
          onViewTopic={handleViewTopic}
          navActive={navActive}
          setNavActive={setNavActive}
          toastComponent={null}
        />
      ) : (
        <ApprovalView
          topic={selectedTopic}
          onBack={() => setCurrentView("dashboard")}
          onDecision={handleDecision}
        />
      )}
    </>
  );
};

export default DepartmentDashboard;