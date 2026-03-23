import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// ─── SVG Factory ────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcHome      = p => <Svg {...p} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />;
const IcCouncil   = p => <Svg {...p} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />;
const IcAccount   = p => <Svg {...p} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
const IcSettings  = p => <Svg {...p} d={["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"]} />;
const IcLogout    = p => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcSearch    = p => <Svg {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcFilter    = p => <Svg {...p} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />;
const IcX         = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcLeft      = p => <Svg {...p} d="M11 17l-5-5m0 0l5-5m-5 5h12" />;
const IcCheck     = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcAlert     = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcDoc       = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcExport    = p => <Svg {...p} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />;
const IcChevDown  = p => <Svg {...p} d="M19 9l-7 7-7-7" />;
const IcChevUp    = p => <Svg {...p} d="M5 15l7-7 7 7" />;
const IcZoomPlus  = p => <Svg {...p} d="M21 21l-4.35-4.35M10 7v6m-3-3h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcZoomMinus = p => <Svg {...p} d="M21 21l-4.35-4.35M7 11h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcClipboard = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", "M9 12h6m-6 4h4"]} />;
const IcTag       = p => <Svg {...p} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />;
const IcInbox     = p => <Svg {...p} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />;
const IcEye       = p => <Svg {...p} d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />;
const IcSparkle   = p => <Svg {...p} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />;

// ─── Constants ───────────────────────────────────────────────────────────────────

const FACULTIES    = ["CNTT", "Kỹ thuật", "Kinh tế", "Khoa học tự nhiên", "Y dược"];
const SCHOOL_YEARS = ["2025-2026", "2024-2025", "2023-2024"];
const PAGE_SIZE    = 5;

const STATUS_CFG = {
  pending_check:    { label: "Chờ kiểm tra",    bg: "bg-yellow-100", text: "text-yellow-800" },
  pending_council:  { label: "Chờ lập HĐ",      bg: "bg-blue-100",   text: "text-blue-700"   },
  council_done:     { label: "Đã lập HĐ",        bg: "bg-green-100",  text: "text-green-700"  },
  needs_supplement: { label: "Yêu cầu bổ sung", bg: "bg-red-100",    text: "text-red-700"    },
};

const CHECKLIST_ITEMS = [
  { id: "format",     label: "Hồ sơ đúng biểu mẫu quy định"             },
  { id: "leader",     label: "Chủ nhiệm đề tài đủ điều kiện chủ trì"     },
  { id: "noPenalty",  label: "Không vi phạm / không nợ đọng đề tài cũ"   },
  { id: "budget",     label: "Dự toán kinh phí đúng tiêu chuẩn quy định" },
  { id: "signatures", label: "Đầy đủ chữ ký và xác nhận từ Khoa"         },
];

const MOCK_FACULTY_NOTES =
  "Trưởng Khoa đã xem xét và phê duyệt về mặt học thuật. Nội dung đề tài phù hợp với định hướng nghiên cứu của Khoa. Chủ nhiệm đề tài có năng lực và kinh nghiệm chuyên môn tốt. Đề nghị Phòng QLKH kiểm tra thủ tục hành chính và xử lý theo quy định.";

const INITIAL_TOPICS = [
  { id: 1,  code: "DT001", title: "Nghiên cứu ứng dụng AI trong giáo dục đại học Việt Nam",              pi: "Nguyễn Thị Hoa",   faculty: "CNTT",              year: "2025-2026", status: "pending_check"    },
  { id: 2,  code: "DT002", title: "Phát triển hệ thống IoT thông minh cho nông nghiệp bền vững",         pi: "Trần Văn Minh",    faculty: "Kỹ thuật",          year: "2025-2026", status: "pending_council"  },
  { id: 3,  code: "DT003", title: "Blockchain trong quản lý chuỗi cung ứng dược phẩm Việt Nam",          pi: "Lê Thị Lan",       faculty: "Kinh tế",           year: "2025-2026", status: "needs_supplement" },
  { id: 4,  code: "DT004", title: "Mô hình học máy dự đoán và phòng ngừa dịch bệnh đô thị",             pi: "Phạm Quốc Hùng",   faculty: "CNTT",              year: "2025-2026", status: "pending_check"    },
  { id: 5,  code: "DT005", title: "Tối ưu hóa thuật toán xử lý ngôn ngữ tự nhiên tiếng Việt",           pi: "Hoàng Thị Thu",    faculty: "CNTT",              year: "2025-2026", status: "council_done"     },
  { id: 6,  code: "DT006", title: "Nghiên cứu vật liệu nano ứng dụng trong y học tái tạo",              pi: "Đặng Văn Long",    faculty: "Y dược",            year: "2024-2025", status: "pending_council"  },
  { id: 7,  code: "DT007", title: "Phân tích tác động kinh tế của chuyển đổi số doanh nghiệp",          pi: "Bùi Thị Duyên",    faculty: "Kinh tế",           year: "2024-2025", status: "council_done"     },
  { id: 8,  code: "DT008", title: "Ứng dụng GIS và viễn thám trong quản lý tài nguyên nước",            pi: "Võ Minh Khoa",     faculty: "Khoa học tự nhiên", year: "2024-2025", status: "pending_check"    },
  { id: 9,  code: "DT009", title: "Nghiên cứu giải pháp năng lượng tái tạo cho khu vực nông thôn",      pi: "Nguyễn Hoàng Anh", faculty: "Kỹ thuật",          year: "2025-2026", status: "needs_supplement" },
  { id: 10, code: "DT010", title: "Xây dựng mô hình dự báo thị trường chứng khoán bằng Deep Learning", pi: "Trịnh Thị Mai",    faculty: "Kinh tế",           year: "2024-2025", status: "pending_check"    },
];

// ─── Toast ────────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type = "success" }) => (
  <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold pointer-events-none ${
    type === "success" ? "bg-green-600" : "bg-red-600"
  }`}>
    {type === "success"
      ? <IcCheck cls="w-5 h-5 flex-shrink-0" />
      : <IcAlert cls="w-5 h-5 flex-shrink-0" />}
    {msg}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────────

const ConfirmModal = ({ onConfirm, onClose }) => {
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
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <IcCheck cls="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Xác nhận hồ sơ hợp lệ?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Đề tài sẽ được xác nhận thủ tục hành chính hợp lệ và chuyển sang giai đoạn <strong className="text-gray-700">Lập Hội đồng xét duyệt</strong>. Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-10 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────────

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
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending_check;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
      <IcInbox cls="w-8 h-8 text-[#4a90c4]" />
    </div>
    <p className="text-sm font-bold text-gray-600">Không tìm thấy đề tài nào</p>
    <p className="text-xs text-gray-400 mt-1">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
  </div>
);

// ─── Mock PDF Page ────────────────────────────────────────────────────────────────

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
          <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">I. THÔNG TIN CHUNG</p>
          {[
            ["Tên đề tài (Tiếng Việt):", topic.title],
            ["Tên đề tài (Tiếng Anh):",  "Research on Advanced Technologies and Scientific Applications"],
            ["Lĩnh vực Khoa học:",        topic.faculty],
            ["Loại hình nghiên cứu:",     "Nghiên cứu ứng dụng"],
            ["Thời gian thực hiện:",      "24 tháng (2026–2028)"],
            ["Chủ nhiệm đề tài:",         topic.pi],
            ["Đơn vị công tác:",          "Trường Đại học Mở TP. HCM"],
            ["Năm học:",                  topic.year],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3 mb-1.5 items-start">
              <span className="font-semibold text-gray-600 w-48 flex-shrink-0">{label}</span>
              <span className="text-gray-800 flex-1">{value}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">II. TỔNG QUAN NGHIÊN CỨU</p>
          <p className="text-gray-700 leading-relaxed">
            Trong bối cảnh phát triển mạnh mẽ của khoa học và công nghệ, đề tài này hướng đến việc nghiên cứu
            và ứng dụng các giải pháp tiên tiến vào thực tiễn, nhằm nâng cao chất lượng giáo dục và nghiên cứu
            khoa học tại Trường Đại học Mở TP.HCM.
          </p>
        </div>
      </div>
    )}

    {page === 2 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">III. MỤC TIÊU VÀ NỘI DUNG NGHIÊN CỨU</p>
        <p className="font-semibold text-gray-700 mb-1">3.1 Mục tiêu tổng quát</p>
        <p className="text-gray-700 leading-relaxed">Xây dựng và phát triển một hệ thống toàn diện nhằm giải quyết các thách thức trong lĩnh vực nghiên cứu, đề xuất mô hình có thể nhân rộng tại các cơ sở giáo dục đại học Việt Nam.</p>
        <p className="font-semibold text-gray-700 mb-1 mt-2">3.2 Nội dung nghiên cứu</p>
        {["Khảo sát và đánh giá tổng quan tình hình thực tiễn hiện tại.", "Nghiên cứu, thiết kế mô hình và các giải pháp đề xuất.", "Triển khai thử nghiệm và đánh giá hiệu quả tại đơn vị.", "Hoàn thiện và đề xuất nhân rộng kết quả nghiên cứu."].map((item, i) => (
          <p key={i} className="text-gray-700 ml-3 mb-1">• {item}</p>
        ))}
      </div>
    )}

    {page === 3 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">IV. DỰ TOÁN KINH PHÍ</p>
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
                ["1", "Chi phí nhân công nghiên cứu", "24 tháng", "5.000.000",  "120.000.000"],
                ["2", "Chi phí thiết bị, vật tư",     "Trọn gói", "—",          "80.000.000" ],
                ["3", "Chi phí hội thảo, khảo sát",   "2 lần",   "15.000.000", "30.000.000" ],
                ["4", "Chi phí quản lý",               "Trọn gói", "—",          "20.000.000" ],
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

// ─── VIEW 1: Scientific Management Dashboard (SC-MAN-01) ─────────────────────────

const ManDashboard = ({ topics, onCheckTopic, onCouncilPlaceholder, navActive, setNavActive }) => {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [yearFilter,    setYearFilter]    = useState("");
  const [currentPage,   setCurrentPage]   = useState(1);

  const resetPage = () => setCurrentPage(1);

  const pendingCheck    = topics.filter(t => t.status === "pending_check").length;
  const pendingCouncil  = topics.filter(t => t.status === "pending_council").length;
  const needsSupplement = topics.filter(t => t.status === "needs_supplement").length;

  const activeTags = [
    ...(facultyFilter ? [{ id: "faculty", label: `Khoa: ${facultyFilter}`,                             onRemove: () => { setFacultyFilter(""); resetPage(); } }] : []),
    ...(statusFilter  ? [{ id: "status",  label: `Trạng thái: ${STATUS_CFG[statusFilter]?.label ?? ""}`, onRemove: () => { setStatusFilter("");  resetPage(); } }] : []),
    ...(yearFilter    ? [{ id: "year",    label: `Năm học: ${yearFilter}`,                              onRemove: () => { setYearFilter("");    resetPage(); } }] : []),
    ...(searchQuery   ? [{ id: "q",       label: `Tìm: "${searchQuery}"`,                               onRemove: () => { setSearchQuery("");   resetPage(); } }] : []),
  ];

  const filtered = topics.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch  = !q || t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.pi.toLowerCase().includes(q);
    const matchFaculty = !facultyFilter || t.faculty === facultyFilter;
    const matchStatus  = !statusFilter  || t.status  === statusFilter;
    const matchYear    = !yearFilter    || t.year     === yearFilter;
    return matchSearch && matchFaculty && matchStatus && matchYear;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const HEADERS = ["Mã ĐT", "Tên đề tài", "Chủ nhiệm", "Khoa", "Trạng thái Thủ tục", "Hành động"];

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={navActive} setActive={setNavActive} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Dashboard Quản lý Đề tài</h1>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">Phòng Quản lý Khoa học</p>
          </div>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg border border-[#1a5ea8] text-[#1a5ea8] text-sm font-semibold hover:bg-blue-50 transition">
            <IcExport cls="w-4 h-4" />
            Xuất danh sách (Excel)
          </button>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-5">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Chờ kiểm tra",    value: pendingCheck,    color: "text-yellow-500" },
              { label: "Chờ lập HĐ",      value: pendingCouncil,  color: "text-blue-600"   },
              { label: "Yêu cầu bổ sung", value: needsSupplement, color: "text-red-500"    },
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
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IcSearch cls="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); resetPage(); }}
                  placeholder="Tìm mã, tên đề tài, chủ nhiệm..."
                  className="h-9 pl-9 pr-4 w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 focus:bg-white transition"
                />
              </div>
              {/* Faculty filter */}
              <select
                value={facultyFilter}
                onChange={e => { setFacultyFilter(e.target.value); resetPage(); }}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] cursor-pointer appearance-none transition pr-7"
              >
                <option value="">Khoa (Tất cả)</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); resetPage(); }}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] cursor-pointer appearance-none transition pr-7"
              >
                <option value="">Trạng thái (Tất cả)</option>
                {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              {/* Year filter */}
              <select
                value={yearFilter}
                onChange={e => { setYearFilter(e.target.value); resetPage(); }}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] cursor-pointer appearance-none transition pr-7"
              >
                <option value="">Năm học (Tất cả)</option>
                {SCHOOL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {/* Apply */}
              <button
                onClick={resetPage}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-semibold transition shadow-sm"
              >
                <IcFilter cls="w-3.5 h-3.5" />
                Lọc
              </button>
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
                  onClick={() => { setSearchQuery(""); setFacultyFilter(""); setStatusFilter(""); setYearFilter(""); resetPage(); }}
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
                          ["Trạng thái Thủ tục", "Hành động"].includes(h) ? "text-center" : "text-left"
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">{topic.faculty}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={topic.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {topic.status === "pending_check" && (
                          <button
                            onClick={() => onCheckTopic(topic)}
                            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-xs font-bold transition shadow-sm"
                          >
                            <IcClipboard cls="w-3.5 h-3.5" />
                            Kiểm tra thủ tục
                          </button>
                        )}
                        {topic.status === "pending_council" && (
                          <button
                            onClick={() => onCouncilPlaceholder(topic)}
                            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                          >
                            <IcCouncil cls="w-3.5 h-3.5" />
                            Lập Hội đồng
                          </button>
                        )}
                        {topic.status === "needs_supplement" && (
                          <button className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">
                            <IcEye cls="w-3.5 h-3.5" />
                            Xem phản hồi
                          </button>
                        )}
                        {topic.status === "council_done" && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <IcCheck cls="w-3.5 h-3.5" />
                            Hoàn thành
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
                <p className="text-xs text-gray-400">
                  Hiển thị{" "}
                  <span className="font-semibold text-gray-600">
                    {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
                  đề tài
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-semibold transition ${
                        p === safePage
                          ? "bg-[#1a5ea8] border-[#1a5ea8] text-white shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >{p}</button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >›</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── VIEW 2: Administrative Check Split-Screen (SC-MAN-02) ───────────────────────

const AdminCheckView = ({ topic, onBack, onDecision }) => {
  const [activeDocTab,  setActiveDocTab]  = useState("thuyetminh");
  const [zoom,          setZoom]          = useState(100);
  const [page,          setPage]          = useState(1);
  const [alertExpanded, setAlertExpanded] = useState(false);
  const [checks,        setChecks]        = useState(
    Object.fromEntries(CHECKLIST_ITEMS.map(item => [item.id, false]))
  );
  const [feedback,     setFeedback]     = useState("");
  const [confirmOpen,  setConfirmOpen]  = useState(false);

  const allChecked  = CHECKLIST_ITEMS.every(item => checks[item.id]);
  const hasText     = feedback.trim().length > 0;
  const canRevision = hasText;
  const canApprove  = allChecked;

  const toggleCheck = id => setChecks(c => ({ ...c, [id]: !c[id] }));

  // ── Auto-fill feature ──
  // When the user focuses the empty textarea, auto-populate with a template
  // listing all unchecked checklist items so the reviewer doesn't need to type manually.
  const handleFeedbackFocus = () => {
    if (feedback.trim() !== "") return;
    const unchecked = CHECKLIST_ITEMS.filter(item => !checks[item.id]);
    if (unchecked.length === 0) return;
    const itemList = unchecked.map(item => `"${item.label}"`).join("; ");
    setFeedback(`Hồ sơ cần bổ sung do chưa đạt các tiêu chí sau: ${itemList}.`);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDecision(topic.id, "approve");
  };

  const checkedCount = CHECKLIST_ITEMS.filter(item => checks[item.id]).length;

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 overflow-hidden">

      {/* ── Top header ── */}
      <header className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#1a5ea8] hover:text-blue-900 transition flex-shrink-0"
        >
          <IcLeft cls="w-4 h-4" />
          Quay lại Dashboard
        </button>
        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kiểm tra Thủ tục Hành chính</p>
          <h2 className="text-sm font-bold text-gray-800 truncate leading-tight mt-0.5">{topic.title}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">Mã:</span>
          <span className="text-xs font-bold text-[#1a5ea8] bg-blue-50 px-2 py-0.5 rounded">{topic.code}</span>
          <StatusBadge status={topic.status} />
        </div>
      </header>

      {/* ── Split-screen body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ────────────────────── Left Panel: Document Viewer (60%) ────────────────────── */}
        <div className="flex flex-col bg-[#E0E0E0]" style={{ width: "60%" }}>

          {/* File Switcher Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-gray-300 flex-shrink-0">
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
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-gray-500 hover:text-gray-800 transition disabled:opacity-30"
                >
                  <IcChevUp cls="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-gray-700 mx-1 min-w-[40px] text-center">{page} / 3</span>
                <button
                  onClick={() => setPage(p => Math.min(3, p + 1))}
                  disabled={page === 3}
                  className="text-gray-500 hover:text-gray-800 transition disabled:opacity-30"
                >
                  <IcChevDown cls="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-1">
                <button onClick={() => setZoom(z => Math.max(50,  z - 10))} className="text-gray-500 hover:text-gray-800 transition">
                  <IcZoomMinus cls="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-gray-700 mx-1 min-w-[36px] text-center">{zoom}%</span>
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

        {/* ────────────────────── Right Panel: Admin Task Panel (40%) ────────────────────── */}
        <div className="flex flex-col bg-white border-l border-gray-200 shadow-xl overflow-hidden" style={{ width: "40%" }}>

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <IcClipboard cls="w-4 h-4 text-[#1a5ea8]" />
              <h3 className="text-sm font-bold text-gray-800">Phiếu Kiểm tra Thủ tục Hành chính</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">Hoàn thành các mục bên dưới để xử lý hồ sơ</p>
          </div>

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            {/* ── 1. Expandable Faculty Approval Alert ── */}
            <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
              <button
                onClick={() => setAlertExpanded(e => !e)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <IcCheck cls="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-800">Đề tài đã được Trưởng Khoa phê duyệt</p>
                    <p className="text-[10px] text-green-600 mt-0.5">
                      Nhấn để {alertExpanded ? "thu gọn" : "xem"} ý kiến từ Khoa
                    </p>
                  </div>
                </div>
                <span className="text-green-500 flex-shrink-0">
                  {alertExpanded ? <IcChevUp cls="w-4 h-4" /> : <IcChevDown cls="w-4 h-4" />}
                </span>
              </button>

              {alertExpanded && (
                <div className="px-4 pb-4 border-t border-green-200">
                  <div className="mt-3 p-3 rounded-lg bg-white border border-green-100">
                    <p className="text-[11px] text-green-900 leading-relaxed italic">"{MOCK_FACULTY_NOTES}"</p>
                    <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-green-100">
                      <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">TK</span>
                      <p className="text-[10px] text-green-700 font-semibold">Trưởng Khoa {topic.faculty} — 15/03/2026</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* ── 2. Checklist ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kiểm tra Tính hợp lệ Thủ tục</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition ${
                  allChecked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {checkedCount} / {CHECKLIST_ITEMS.length} mục
                </span>
              </div>

              <div className="flex flex-col gap-2.5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                {CHECKLIST_ITEMS.map(item => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
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
                <p className="text-[11px] text-amber-600 flex items-center gap-1.5">
                  <IcSparkle cls="w-3.5 h-3.5 flex-shrink-0" />
                  Nhấn vào khung ý kiến để <strong>tự động điền</strong> các mục chưa đạt
                </p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* ── 3. Feedback / Auto-fill Textarea ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ý kiến phản hồi / Yêu cầu bổ sung
                </h4>
                <div className="flex items-center gap-1.5">
                  {!allChecked && !hasText && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      ✦ Auto-fill
                    </span>
                  )}
                  {hasText && (
                    <button
                      onClick={() => setFeedback("")}
                      className="text-[10px] text-red-400 hover:text-red-600 transition"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                onFocus={handleFeedbackFocus}
                placeholder="Nhấn vào đây — nếu có mục chưa đạt, nội dung phản hồi sẽ được điền tự động..."
                rows={6}
                className={`w-full px-3.5 py-3 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none resize-none transition border ${
                  hasText
                    ? "border-[#1a5ea8] ring-2 ring-[#1a5ea8]/10 bg-white"
                    : "border-gray-200 hover:border-gray-300 focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 bg-white"
                }`}
              />

              {hasText ? (
                <p className="text-[11px] text-green-600 flex items-center gap-1">
                  <IcCheck cls="w-3.5 h-3.5" />
                  Đã có ý kiến phản hồi
                </p>
              ) : (
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <IcAlert cls="w-3.5 h-3.5" />
                  Bắt buộc nếu muốn gửi yêu cầu bổ sung
                </p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* ── 4. Action Buttons ── */}
            <div className="flex flex-col gap-3 pb-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quyết định</h4>

              {/* Button A: Request supplement — enabled only when feedback has text */}
              <button
                disabled={!canRevision}
                onClick={() => onDecision(topic.id, "supplement")}
                className={`w-full h-11 rounded-lg border-2 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  canRevision
                    ? "border-red-400 text-red-600 hover:bg-red-50 active:bg-red-100"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <IcAlert cls="w-4 h-4" />
                Yêu cầu bổ sung
              </button>

              {/* Button B: Approve and forward — enabled only when ALL checkboxes are checked */}
              <button
                disabled={!canApprove}
                onClick={() => setConfirmOpen(true)}
                className={`w-full h-11 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                  canApprove
                    ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IcCheck cls="w-4 h-4" />
                Thủ tục hợp lệ — Lập Hội đồng
              </button>

              {/* Logic hint card */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  <strong className="text-gray-600">Yêu cầu bổ sung:</strong> Cần nhập ý kiến phản hồi.<br />
                  <strong className="text-gray-600">Thủ tục hợp lệ:</strong> Cần tích đủ {CHECKLIST_ITEMS.length}/5 mục kiểm tra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmOpen && (
        <ConfirmModal
          onConfirm={handleConfirm}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

// ─── Main Controller ──────────────────────────────────────────────────────────────

const SciManDashboard = () => {
  const [topics,        setTopics]        = useState(INITIAL_TOPICS);
  const [currentView,   setCurrentView]   = useState("dashboard");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [navActive,     setNavActive]     = useState("dashboard");
  const [toast,         setToast]         = useState({ visible: false, msg: "", type: "success" });

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "", type: "success" }), 3500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = (msg, type = "success") => setToast({ visible: true, msg, type });

  const handleCheckTopic = topic => {
    setSelectedTopic(topic);
    setCurrentView("adminCheck");
  };

  const handleCouncilPlaceholder = topic => {
    showToast(`Chuyển sang SC-MAN-03: Lập Hội đồng cho ${topic.code}`, "success");
  };

  const handleDecision = (topicId, action) => {
    if (action === "approve") {
      setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: "pending_council" } : t));
      setCurrentView("dashboard");
      showToast("✓ Thủ tục hợp lệ! Đề tài đã chuyển sang giai đoạn Lập Hội đồng.", "success");
    } else if (action === "supplement") {
      setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: "needs_supplement" } : t));
      setCurrentView("dashboard");
      showToast("Đã gửi yêu cầu bổ sung đến Chủ nhiệm đề tài.", "error");
    }
  };

  return (
    <>
      {toast.visible && <Toast msg={toast.msg} type={toast.type} />}
      {currentView === "dashboard" ? (
        <ManDashboard
          topics={topics}
          onCheckTopic={handleCheckTopic}
          onCouncilPlaceholder={handleCouncilPlaceholder}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      ) : (
        <AdminCheckView
          topic={selectedTopic}
          onBack={() => setCurrentView("dashboard")}
          onDecision={handleDecision}
        />
      )}
    </>
  );
};

export default SciManDashboard;
