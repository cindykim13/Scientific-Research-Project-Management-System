// File: src/pages/AccountManagement.jsx

import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  ROLE_OPTIONS,
  CONFIRM_CONFIG,
  INITIAL_USERS,
  PAGE_SIZE,
  TABLE_HEADERS,
} from "../mocks/accountMock";

// ─── Icons ─────────────────────────────────────────────────────────────────────

const IconHome = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0" />
  </svg>
);
const IconBoard = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconSettings = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
  </svg>
);
const IconLock = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconActivate = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconX = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconWarningTriangle = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);
const IconShieldCheck = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const IconInfo = () => (
  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Modal Overlay Shell ───────────────────────────────────────────────────────

const ModalOverlay = ({ onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
};

// ─── Account Form Modal ────────────────────────────────────────────────────────

const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = `
  w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
  placeholder-gray-400 outline-none transition duration-200
  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
  hover:border-gray-300
`;

const AccountFormModal = ({ mode, user, onClose, onSave }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? ROLE_OPTIONS[0],
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? "Cập nhật tài khoản" : "Tạo mới tài khoản"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? "Chỉnh sửa thông tin nhân viên" : "Điền đầy đủ thông tin để tạo tài khoản mới"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition duration-150"
          >
            <IconX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <FormField label="Họ và tên" required>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nhập họ và tên đầy đủ"
              required
              className={inputCls}
            />
          </FormField>

          <FormField label="Email công vụ" required>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="example@ou.edu.vn"
              required
              className={inputCls}
            />
          </FormField>

          <FormField label="Chức vụ" required>
            <select
              value={form.role}
              onChange={handleChange("role")}
              className={inputCls + " cursor-pointer"}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </FormField>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition duration-150"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition duration-150 shadow-sm"
            >
              {isEdit ? "Cập nhật" : "Lưu"}
            </button>
          </div>
          
          {/* Security Note Alert */}
          {!isEdit && (
            <div className="mt-1 flex gap-2 items-start bg-blue-50/50 border border-blue-100/50 p-3 rounded-lg">
              <IconInfo />
              <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                Lưu ý: Mật khẩu mặc định sẽ được hệ thống tự động sinh ra và gửi mã hóa đến Email công vụ của nhân viên này.
              </p>
            </div>
          )}
        </form>
      </div>
    </ModalOverlay>
  );
};

// ─── Confirm Action Modal ──────────────────────────────────────────────────────

const ConfirmActionModal = ({ action, user, onClose, onConfirm }) => {
  const cfg = CONFIRM_CONFIG[action];
  
  // Re-assign icons because they can't be easily serialized into the mock file
  const actionIcon = action === 'lock' 
    ? <IconWarningTriangle className="w-11 h-11 text-amber-500" />
    : <IconShieldCheck className="w-11 h-11 text-green-600" />;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition duration-150"
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center text-center px-8 pb-6 gap-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${cfg.iconBg}`}>
            {actionIcon}
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900">{cfg.title}</h2>
            {user && (
              <p className="text-xs font-semibold text-[#1a5ea8] mt-1">{user.name}</p>
            )}
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{cfg.description}</p>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition duration-150"
            >
              Hủy
            </button>
            <button
              onClick={() => { onConfirm(user); onClose(); }}
              className={`flex-1 h-10 rounded-lg text-white text-sm font-bold transition duration-150 shadow-sm ${cfg.confirmCls}`}
            >
              {cfg.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",            icon: <IconHome /> },
  { id: "accounts",   label: "Quản lý tài khoản",    icon: <IconUsers /> },
  { id: "council",    label: "Quản lý hội đồng",     icon: <IconBoard /> },
  { id: "settings",  label: "Cài đặt",               icon: <IconSettings /> },
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
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg
              text-[13px] font-semibold transition duration-150
              ${isActive
                ? "bg-[#1a5ea8] text-white shadow-sm"
                : "text-[#1a5ea8] hover:bg-blue-200/60"
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    <div className="mx-3 mb-4 mt-2 bg-white/60 rounded-xl px-3 py-3 flex items-center gap-2.5 border border-blue-100">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4a90c4] to-[#1a5ea8] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        NT
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">
          Nguyễn Hoài Thương
        </p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">Admin</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition duration-150 flex-shrink-0">
        <IconLogout />
      </button>
    </div>
  </aside>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) =>
  status === "active" ? (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      Hoạt động
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      Đang khoá
    </span>
  );

// ─── Action Buttons ────────────────────────────────────────────────────────────

const ActionButtons = ({ user, onEdit, onLock, onActivate }) => (
  <div className="flex items-center justify-center gap-4">
    <button
      onClick={() => onEdit(user)}
      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition duration-150"
    >
      <IconEdit />
      Sửa
    </button>
    {user.status === "active" ? (
      <button
        onClick={() => onLock(user)}
        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-red-600 transition duration-150"
      >
        <IconLock />
        Khoá
      </button>
    ) : (
      <button
        onClick={() => onActivate(user)}
        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-green-600 transition duration-150"
      >
        <IconActivate />
        Kích hoạt
      </button>
    )}
  </div>
);

// ─── Pagination ────────────────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-end gap-1 px-6 py-3 border-t border-gray-200">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-xs text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`
            w-8 h-8 flex items-center justify-center rounded border text-xs font-medium transition
            ${p === currentPage
              ? "bg-[#1a5ea8] border-[#1a5ea8] text-white shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
            }
          `}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-xs text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        ›
      </button>
      <span className="ml-2 text-xs text-gray-400">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
};

// ─── User Table ────────────────────────────────────────────────────────────────

const UserTable = ({ users, currentPage, totalPages, onPageChange, onEdit, onLock, onActivate }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {TABLE_HEADERS.map((h) => (
            <th
              key={h}
              className={`py-3.5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider
                ${["Trạng thái", "Hành động"].includes(h) ? "text-center" : "text-left"}
              `}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50/40 transition">
            <td className="py-4 px-6 font-medium text-gray-800 whitespace-nowrap">{user.name}</td>
            <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{user.email}</td>
            <td className="py-4 px-6 text-gray-600">{user.role}</td>
            <td className="py-4 px-6 text-center">
              <StatusBadge status={user.status} />
            </td>
            <td className="py-4 px-6">
              <ActionButtons
                user={user}
                onEdit={onEdit}
                onLock={onLock}
                onActivate={onActivate}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const AccountManagement = () => {
  const [activeMenu, setActiveMenu]   = useState("accounts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers]             = useState(INITIAL_USERS);

  // Modal state
  const [formModal, setFormModal]       = useState({ open: false, mode: "create", user: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null,   user: null });

  // ── Form modal handlers
  const openCreateModal = () => setFormModal({ open: true, mode: "create", user: null });
  const openEditModal   = (user) => setFormModal({ open: true, mode: "edit", user });
  const closeFormModal  = () => setFormModal({ open: false, mode: "create", user: null });

  const handleSave = (formData) => {
    if (formModal.mode === "create") {
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), ...formData, status: "active" },
      ]);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === formModal.user.id ? { ...u, ...formData } : u))
      );
    }
  };

  // ── Confirm modal handlers
  const openLockModal     = (user) => setConfirmModal({ open: true, action: "lock",     user });
  const openActivateModal = (user) => setConfirmModal({ open: true, action: "activate", user });
  const closeConfirmModal = () => setConfirmModal({ open: false, action: null, user: null });

  const handleConfirmAction = (user) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: confirmModal.action === "lock" ? "locked" : "active" }
          : u
      )
    );
  };

  // ── Filtering & pagination
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={activeMenu} setActive={setActiveMenu} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">
              Quản lý Tài khoản
            </h1>
            <p className="text-sm text-gray-400 mt-0.5 font-medium">
              Phòng Quản lý Khoa Học
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Tìm kiếm nhân viên..."
                className="h-10 pl-9 pr-4 w-60 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 focus:bg-white transition duration-200"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#1a3a7c] hover:bg-[#15306a] active:bg-[#112960] text-white text-sm font-bold transition duration-150 shadow-sm"
            >
              <IconPlus />
              Tạo mới tài khoản
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <UserTable
            users={paginated}
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={openEditModal}
            onLock={openLockModal}
            onActivate={openActivateModal}
          />
        </div>
      </main>

      {/* Account Form Modal */}
      {formModal.open && (
        <AccountFormModal
          mode={formModal.mode}
          user={formModal.user}
          onClose={closeFormModal}
          onSave={handleSave}
        />
      )}

      {/* Confirm Action Modal */}
      {confirmModal.open && (
        <ConfirmActionModal
          action={confirmModal.action}
          user={confirmModal.user}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};

export default AccountManagement;