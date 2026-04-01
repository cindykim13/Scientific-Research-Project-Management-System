// File: src/pages/CouncilManagement.jsx

import { useState, useEffect, useRef } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  MEMBER_ROLES,
  MOCK_EXPERTS,
  MOCK_TOPICS,
  COUNCIL_STATUS,
  INITIAL_COUNCILS,
  HEADERS,
  getRoleCounts,
  isQuorumMet
} from "../mocks/councilManMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcHome     = p => <Svg {...p} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />;
const IcCouncil  = p => <Svg {...p} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />;
const IcAccount  = p => <Svg {...p} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
const IcSettings = p => <Svg {...p} d={["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"]} />;
const IcLogout   = p => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcPlus     = p => <Svg {...p} d="M12 4v16m8-8H4" />;
const IcX        = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcTrash    = p => <Svg {...p} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />;
const IcSearch   = p => <Svg {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcCheck    = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcAlert    = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcEdit     = p => <Svg {...p} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />;
const IcCalendar = p => <Svg {...p} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const IcClock    = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcMapPin   = p => <Svg {...p} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
const IcMail     = p => <Svg {...p} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const IcChevDown = p => <Svg {...p} d="M19 9l-7 7-7-7" />;

// ─── Helpers ─────────────────────────────────────────────────────────────────────

let _memberId = 6;
const freshMember = () => ({ id: _memberId++, name: "", email: "", role: "" });
const makeDefaultMembers = () => Array.from({ length: 5 }, freshMember);

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg }) => (
  <div className="fixed top-5 right-5 z-[300] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl bg-green-600 text-white text-sm font-semibold max-w-md pointer-events-none">
    <IcCheck cls="w-5 h-5 flex-shrink-0 mt-0.5" />
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────────

const MAN_NAV = [
  { id: "dashboard", label: "Dashboard",         icon: <IcHome /> },
  { id: "council",   label: "Quản lý Hội đồng",  icon: <IcCouncil /> },
  { id: "accounts",  label: "Quản lý Tài khoản", icon: <IcAccount /> },
  { id: "settings",  label: "Cài đặt",            icon: <IcSettings /> },
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
      {MAN_NAV.map(item => {
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
        CV
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">Nguyễn Văn Cường</p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">Vai trò: Chuyên viên Phòng QLKH</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition flex-shrink-0">
        <IcLogout cls="w-4 h-4" />
      </button>
    </div>
  </aside>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = COUNCIL_STATUS[status] ?? COUNCIL_STATUS.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// ─── Role Counter Pill ────────────────────────────────────────────────────────────

const RoleCounterPill = ({ label, count, required, isN = false }) => {
  const fulfilled = isN ? count > 0 : count === required;
  const over      = !isN && count > required;
  const lacking   = !isN && count < required;

  let colorCls;
  if (fulfilled)     colorCls = "bg-green-50 border-green-300 text-green-700";
  else if (over)     colorCls = "bg-red-50 border-red-300 text-red-700";
  else               colorCls = "bg-gray-100 border-gray-200 text-gray-500";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${colorCls}`}>
      {fulfilled && <IcCheck cls="w-2.5 h-2.5" />}
      {over      && <IcAlert cls="w-2.5 h-2.5" />}
      {lacking   && <span className="w-2.5 h-2.5 flex-shrink-0" />}
      {label}: {count}/{isN ? "n" : required}
    </span>
  );
};

// ─── Expert Name Combobox (per member row) ────────────────────────────────────────

const ExpertCombobox = ({ value, onChange, onSelectExpert, placeholder }) => {
  const [open, setOpen] = useState(false);
  const suggestions = value.length >= 2
    ? MOCK_EXPERTS.filter(e => e.name.toLowerCase().includes(value.toLowerCase()))
    : [];

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.length >= 2 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        placeholder={placeholder}
        className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white transition"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-2xl z-[60] overflow-hidden max-h-44 overflow-y-auto">
          {suggestions.map(expert => (
            <button
              key={expert.email}
              onMouseDown={() => { onSelectExpert(expert); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition border-b border-gray-50 last:border-b-0 flex flex-col gap-0.5"
            >
              <span className="text-[13px] font-semibold text-gray-800 leading-tight">{expert.name}</span>
              <span className="text-[11px] text-gray-400">{expert.email} · {expert.unit}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Topic Searchable Input ────────────────────────────────────────────────────────

const TopicSearchInput = ({ query, selectedTopic, onQuery, onSelect, onClear, readOnly = false }) => {
  const [open, setOpen] = useState(false);
  const filtered = MOCK_TOPICS.filter(t =>
    !query ||
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.code.toLowerCase().includes(query.toLowerCase())
  );

  if (selectedTopic) {
    return (
      <div className={`flex items-center gap-3 h-10 px-3 rounded-lg border ${readOnly ? "border-blue-200 bg-blue-50/60" : "border-green-300 bg-green-50"}`}>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${readOnly ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
          {selectedTopic.code}
        </span>
        <span className={`text-sm font-medium truncate flex-1 leading-tight ${readOnly ? "text-blue-900" : "text-green-900"}`}>
          {selectedTopic.title}
        </span>
        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">CN: {selectedTopic.pi}</span>
        {!readOnly && (
          <button onClick={onClear} className="text-green-500 hover:text-green-700 transition flex-shrink-0 ml-1">
            <IcX cls="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <IcSearch cls="w-4 h-4 text-gray-400" />
      </span>
      <input
        type="text"
        value={query}
        onChange={e => { onQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        placeholder="Tìm kiếm theo mã hoặc tên đề tài..."
        className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white transition"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-2xl z-[60] overflow-hidden max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">Không tìm thấy đề tài phù hợp</p>
          ) : (
            filtered.map(t => (
              <button
                key={t.id}
                onMouseDown={() => { onSelect(t); setOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-[#1a5ea8] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">{t.code}</span>
                  <span className="text-[13px] text-gray-800 font-medium leading-snug">{t.title}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 pl-0.5">Chủ nhiệm: {t.pi}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Member Row ───────────────────────────────────────────────────────────────────

const MemberRow = ({ member, rowNum, onUpdate, onSelectExpert, onRemove }) => {
  const roleColors = {
    "Chủ tịch":   "text-blue-700 bg-blue-50 border-blue-200",
    "Thư ký":     "text-purple-700 bg-purple-50 border-purple-200",
    "Phản biện 1":"text-orange-700 bg-orange-50 border-orange-200",
    "Phản biện 2":"text-orange-700 bg-orange-50 border-orange-200",
    "Ủy viên":    "text-gray-600 bg-gray-50 border-gray-200",
  };
  const roleBadgeCls = member.role ? roleColors[member.role] ?? "" : "";

  return (
    <div className="grid items-start gap-2" style={{ gridTemplateColumns: "28px 1fr 1fr 170px 36px" }}>
      <span className="h-9 flex items-center justify-center text-xs font-bold text-gray-400 select-none">{rowNum}</span>
      <ExpertCombobox
        value={member.name}
        onChange={val => onUpdate(member.id, "name", val)}
        onSelectExpert={expert => onSelectExpert(member.id, expert)}
        placeholder="Tìm / nhập họ tên..."
      />
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <IcMail cls="w-3.5 h-3.5 text-gray-300" />
        </span>
        <input
          type="email"
          value={member.email}
          onChange={e => onUpdate(member.id, "email", e.target.value)}
          placeholder="Email liên hệ..."
          className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white transition"
        />
      </div>
      <div className="relative">
        <select
          value={member.role}
          onChange={e => onUpdate(member.id, "role", e.target.value)}
          className={`h-9 w-full pl-3 pr-7 rounded-lg border text-sm font-semibold outline-none focus:border-[#1a5ea8] cursor-pointer appearance-none transition ${
            member.role ? `${roleBadgeCls} border` : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          <option value="">Chọn vai trò...</option>
          {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <IcChevDown cls="w-3 h-3 text-gray-400" />
        </span>
      </div>
      <button
        onClick={() => onRemove(member.id)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition flex-shrink-0"
        title="Xóa thành viên"
      >
        <IcTrash cls="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Council Configuration Modal ─────────────────────────────────────────────────

const CouncilModal = ({ onClose, onSave, prefillTopic = null, initialData = null }) => {
  const [form, setForm] = useState({
    name:          initialData?.name ?? "",
    date:          initialData?.datetime?.split(" ")[0]?.split("/").reverse().join("-") ?? "",
    time:          initialData?.datetime?.split(" ")[1] ?? "",
    location:      initialData?.location ?? "",
    topicQuery:    initialData ? initialData.topic : (prefillTopic ? `${prefillTopic.code} – ${prefillTopic.title}` : ""),
    selectedTopic: initialData ? MOCK_TOPICS.find(t => t.title === initialData.topic) : (prefillTopic ?? null),
  });

  const [members, setMembers]   = useState(makeDefaultMembers);
  const nextIdRef               = useRef(100);

  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const counts   = getRoleCounts(members);
  const canSave  = isQuorumMet(counts);

  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addMember = () =>
    setMembers(prev => [...prev, { id: nextIdRef.current++, name: "", email: "", role: "" }]);

  const removeMember = id =>
    setMembers(prev => prev.filter(m => m.id !== id));

  const updateMember = (id, field, val) =>
    setMembers(prev => prev.map(m => m.id !== id ? m : { ...m, [field]: val }));

  const selectExpert = (id, expert) =>
    setMembers(prev => prev.map(m => m.id !== id ? m : { ...m, name: expert.name, email: expert.email }));

  const handleSave = () => {
    const name     = form.name.trim() || `Hội đồng ${new Date().toLocaleDateString("vi-VN")}`;
    const dateStr  = form.date ? form.date.split("-").reverse().join("/") : "—";
    const timeStr  = form.time || "";
    const datetime = form.date ? `${dateStr}${timeStr ? " " + timeStr : ""}` : "—";
    
    // Nếu có initialData (tức là đang Edit), ta gộp với ID cũ để hàm cha biết đường map()
    onSave({
      ...(initialData && { id: initialData.id }),
      name,
      topic:       form.selectedTopic?.title ?? form.topicQuery ?? "—",
      pi:          form.selectedTopic?.pi    ?? "—",
      datetime,
      location:    form.location.trim() || "—",
      status:      initialData ? initialData.status : "pending",
      memberCount: members.filter(m => m.name.trim()).length || members.length,
    });
  };

  const quorumHints = [];
  if (counts.chuTich  !== 1) quorumHints.push(`1 Chủ tịch (hiện: ${counts.chuTich})`);
  if (counts.thuKy    !== 1) quorumHints.push(`1 Thư ký (hiện: ${counts.thuKy})`);
  if (counts.phanBien !== 2) quorumHints.push(`2 Phản biện (hiện: ${counts.phanBien})`);

  return (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a5ea8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <IcCouncil cls="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">
                {initialData ? "Chỉnh sửa Hội đồng Xét duyệt" : "Thiết lập Hội đồng Xét duyệt"}
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Điền đầy đủ thông tin chung và cơ cấu thành viên bắt buộc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition"
          >
            <IcX cls="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1a5ea8] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">1</span>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Thông tin chung</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Tên Hội đồng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setField("name", e.target.value)}
                  placeholder="VD: HĐ CNTT – 01/2026"
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Ngày họp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IcCalendar cls="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setField("date", e.target.value)}
                    className="h-10 pl-9 pr-3 w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 cursor-pointer transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Giờ họp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IcClock cls="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setField("time", e.target.value)}
                    className="h-10 pl-9 pr-3 w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 cursor-pointer transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Địa điểm / Link trực tuyến</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IcMapPin cls="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setField("location", e.target.value)}
                    placeholder="VD: Phòng B.306 hoặc https://meet.google.com/..."
                    className="h-10 pl-9 pr-3 w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Gán Đề tài nghiên cứu <span className="text-red-500">*</span>
              </label>
              <TopicSearchInput
                query={form.topicQuery}
                selectedTopic={form.selectedTopic}
                readOnly={!!prefillTopic}
                onQuery={q => setField("topicQuery", q)}
                onSelect={t => setForm(f => ({ ...f, selectedTopic: t, topicQuery: "" }))}
                onClear={() => setForm(f => ({ ...f, selectedTopic: null, topicQuery: "" }))}
              />
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1a5ea8] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-tight">Cơ cấu Thành viên Hội đồng</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {members.length} thành viên — bắt buộc: 1 Chủ tịch, 1 Thư ký, 2 Phản biện
                  </p>
                </div>
              </div>
              <button
                onClick={addMember}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[#1a5ea8] text-[#1a5ea8] text-xs font-bold hover:bg-blue-50 transition"
              >
                <IcPlus cls="w-3.5 h-3.5" />
                Thêm chuyên gia
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mr-1">Kiểm tra cơ cấu:</span>
              <RoleCounterPill label="Chủ tịch"  count={counts.chuTich}  required={1} />
              <RoleCounterPill label="Thư ký"    count={counts.thuKy}    required={1} />
              <RoleCounterPill label="Phản biện" count={counts.phanBien} required={2} />
              <RoleCounterPill label="Ủy viên"   count={counts.uyVien}   isN />
              <span className="ml-auto">
                {canSave ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                    <IcCheck cls="w-3 h-3" />
                    Cơ cấu hợp lệ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <IcAlert cls="w-3 h-3" />
                    Chưa đủ
                  </span>
                )}
              </span>
            </div>

            <div className="grid gap-2 px-0.5" style={{ gridTemplateColumns: "28px 1fr 1fr 170px 36px" }}>
              {["#", "Họ tên chuyên gia", "Email liên hệ", "Vai trò", ""].map((h, i) => (
                <p key={i} className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider ${i === 4 ? "" : "px-1"}`}>{h}</p>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {members.map((member, idx) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  rowNum={idx + 1}
                  onUpdate={updateMember}
                  onSelectExpert={selectExpert}
                  onRemove={removeMember}
                />
              ))}
              {members.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  Chưa có thành viên — nhấn "+ Thêm chuyên gia" để bắt đầu
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/70 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            {canSave ? (
              <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1.5">
                <IcCheck cls="w-3.5 h-3.5 flex-shrink-0" />
                Cơ cấu hội đồng hợp lệ — sẵn sàng lưu
              </p>
            ) : (
              <p className="text-[11px] text-amber-600 flex items-center gap-1.5 leading-snug">
                <IcAlert cls="w-3.5 h-3.5 flex-shrink-0" />
                Cần đúng: {quorumHints.join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="h-9 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Hủy bỏ
            </button>
            <button
              disabled={!canSave}
              onClick={handleSave}
              className={`h-9 px-6 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                canSave
                  ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <IcCheck cls="w-4 h-4" />
              {initialData ? "Cập nhật Hội đồng" : "Lưu và Kích hoạt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page: Council Management (SC-MAN-03) ───────────────────────────────────

const CouncilManagement = () => {
  const [councils,     setCouncils]     = useState(INITIAL_COUNCILS);
  const [navActive,    setNavActive]    = useState("council");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editCouncil,  setEditCouncil]  = useState(null); // FIXED ESLINT: Now used
  const [toast,        setToast]        = useState({ visible: false, msg: "" });

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "" }), 5500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = msg => setToast({ visible: true, msg });

  const handleSave = (councilData) => {
    // Nếu có ID tức là đang Edit
    if (councilData.id) {
      setCouncils(prev => prev.map(c => c.id === councilData.id ? { ...c, ...councilData } : c));
      showToast("Cập nhật thông tin Hội đồng thành công.");
    } else {
      setCouncils(prev => [{ ...councilData, id: Date.now() }, ...prev]);
      showToast("Thiết lập Hội đồng thành công. Hệ thống đang tiến hành khởi tạo tài khoản và gửi Email xác nhận đến các chuyên gia.");
    }
    setModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={navActive} setActive={setNavActive} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Quản lý Hội đồng Xét duyệt</h1>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">Phòng Quản lý Khoa học</p>
          </div>
          <button
            onClick={() => { setEditCouncil(null); setModalOpen(true); }}
            className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
          >
            <IcPlus cls="w-4 h-4" />
            Tạo Hội đồng mới
          </button>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {HEADERS.map(h => (
                    <th
                      key={h}
                      className={`py-3.5 px-5 text-xs font-bold text-gray-600 uppercase tracking-wider ${
                        ["Trạng thái", "Hành động"].includes(h) ? "text-center" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {councils.map(council => (
                  <tr key={council.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                    <td className="py-4 px-5">
                      <p className="font-bold text-gray-800 text-[13px] leading-tight">{council.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{council.memberCount} thành viên</p>
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <p className="text-[13px] text-gray-800 line-clamp-2 leading-snug">{council.topic}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Chủ nhiệm: {council.pi}</p>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <p className="text-sm text-gray-700 font-medium">{council.datetime}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{council.location}</p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <StatusBadge status={council.status} />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => { setEditCouncil(council); setModalOpen(true); }}
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
                      >
                        <IcEdit cls="w-3.5 h-3.5" />
                        Xem / Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-400">
                Tổng cộng <span className="font-semibold text-gray-600">{councils.length}</span> hội đồng
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Council Config Modal - NOW USING editCouncil PROP */}
      {modalOpen && (
        <CouncilModal
          initialData={editCouncil}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {toast.visible && <Toast msg={toast.msg} />}
    </div>
  );
};

export default CouncilManagement;