import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// ─── SVG Factory ───────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => (
      <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />
    ))}
  </svg>
);

const IcHome     = (p) => <Svg {...p} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />;
const IcTopic    = (p) => <Svg {...p} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
const IcSettings = (p) => <Svg {...p} d={["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"]} />;
const IcLogout   = (p) => <Svg {...p} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />;
const IcEdit     = (p) => <Svg {...p} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />;
const IcX        = (p) => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcLeft     = (p) => <Svg {...p} d="M11 17l-5-5m0 0l5-5m-5 5h12" />;
const IcDoc      = (p) => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcDownload = (p) => <Svg {...p} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />;
const IcWarning  = (p) => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcUsers    = (p) => <Svg {...p} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0" />;
const IcCash     = (p) => <Svg {...p} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />;
const IcInfo     = (p) => <Svg {...p} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcStar     = (p) => <Svg {...p} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;

// ─── Constants & Mock Data ─────────────────────────────────────────────────────

const MACRO_STAGES = ["Khởi tạo", "Khoa duyệt", "QLKH duyệt", "Hội đồng đánh giá", "Kết luận"];

const STATUS_CFG = {
  draft:    { label: "Nháp",               bg: "bg-gray-100",   text: "text-gray-700" },
  pending:  { label: "Chờ duyệt",          bg: "bg-yellow-100", text: "text-yellow-800" },
  revision: { label: "Yêu cầu chỉnh sửa",  bg: "bg-red-100",    text: "text-red-700"  },
  approved: { label: "Đã duyệt",           bg: "bg-green-100",  text: "text-green-800" },
};

const MOCK_TOPIC = {
  code: "DT001",
  status: "revision",
  currentStageIdx: 3,
  titleVN: "Nghiên cứu ứng dụng trí tuệ nhân tạo (AI) trong hỗ trợ giảng dạy và đánh giá kết quả học tập tại các trường đại học Việt Nam",
  titleEN: "Research on Applying Artificial Intelligence in Teaching Support and Learning Assessment at Vietnamese Universities",
  researchType: "Ứng dụng",
  scienceField: "Kỹ thuật & Công nghệ",
  specialtyCode: "48 06 01",
  duration: "24 tháng",
  startDate: "01/03/2026",
  overview: "Trong bối cảnh Cách mạng công nghiệp 4.0, AI đang dần trở thành công cụ không thể thiếu trong lĩnh vực giáo dục toàn cầu. Các hệ thống học tập thích ứng, đánh giá tự động và trợ lý ảo giảng dạy đã cho thấy tiềm năng to lớn trong việc nâng cao chất lượng và hiệu quả giáo dục.",
  urgency: "Hiện nay, chất lượng giáo dục đại học tại Việt Nam đang đối mặt với nhiều thách thức về cá nhân hóa học tập và đánh giá khách quan. Việc ứng dụng AI không chỉ giải quyết bài toán tải lượng công việc của giảng viên mà còn cá nhân hóa lộ trình học tập cho từng sinh viên.",
  generalObj: "Nghiên cứu, xây dựng và triển khai thử nghiệm một nền tảng AI tích hợp hỗ trợ giảng dạy và đánh giá học tập tại Trường Đại học Mở TP.HCM, từ đó đề xuất mô hình nhân rộng cho các trường đại học Việt Nam.",
  specificObj: "1. Phân tích và đánh giá hiện trạng ứng dụng AI trong giáo dục đại học tại Việt Nam và thế giới.\n2. Thiết kế mô hình tích hợp AI vào Hệ thống Quản lý Học tập (LMS) hiện có.\n3. Phát triển prototype các module AI: hỗ trợ giảng dạy, chấm điểm tự động, và phân tích học tập.",
  researchScope: "Sinh viên và giảng viên tại Trường Đại học Mở TP.HCM, năm học 2026–2027",
  methodology: "Sử dụng phương pháp nghiên cứu hỗn hợp (Mixed Methods) kết hợp định lượng và định tính, cùng với phương pháp phát triển phần mềm Agile/Scrum.",
  product1: "01 báo cáo tổng quan về ứng dụng AI trong giáo dục đại học Việt Nam; 01 hệ thống phần mềm prototype với ít nhất 3 module AI đã thử nghiệm; 01 quy trình triển khai chuẩn.",
  product2: "01 bài báo khoa học đăng trên tạp chí ISI/Scopus Q2 trở lên về kết quả nghiên cứu.",
  budget: "350.000.000 VNĐ",
  pi: { name: "Nguyễn Thị Hoài Thương", unit: "Khoa CNTT, Trường ĐH Mở TP.HCM", email: "2351010207thuong@ou.edu.vn" },
  members: [
    { name: "TS. Trần Minh Tuấn",  unit: "Khoa CNTT",        role: "Thành viên" },
    { name: "ThS. Lê Thị Mai Anh", unit: "Phòng QLKH",       role: "Thư ký" },
    { name: "TS. Phạm Văn Đức",    unit: "Khoa Kinh tế",     role: "Cộng tác viên" },
  ],
};

const TIMELINE_DATA = [
  {
    id: 1, roleType: "system",
    actor: "Hệ thống", role: "Hệ thống tự động",
    action: "đã tạo và lưu nháp đề tài",
    date: "01/02/2026", time: "09:00",
  },
  {
    id: 2, roleType: "researcher",
    actor: "Nguyễn Thị Hoài Thương", role: "Chủ nhiệm",
    action: "đã nộp đề tài để xét duyệt",
    date: "05/02/2026", time: "14:30",
  },
  {
    id: 3, roleType: "khoa",
    actor: "PGS.TS Lê Hoàng Nam", role: "Trưởng Khoa CNTT",
    action: "đã duyệt và chuyển lên Phòng QLKH",
    date: "08/02/2026", time: "10:15",
    comment: "Đề tài có hướng nghiên cứu phù hợp với định hướng phát triển của Khoa. Nội dung nghiên cứu có tính ứng dụng cao và mang tính thời sự. Đề xuất chuyển tiếp xét duyệt.",
  },
  {
    id: 4, roleType: "qlkh",
    actor: "TS. Phạm Thanh Bình", role: "Phòng QLKH",
    action: "đã xét duyệt và trình Hội đồng",
    date: "12/02/2026", time: "16:00",
    comment: "Hồ sơ đề tài đầy đủ, đảm bảo các điều kiện theo quy định. Dự toán kinh phí hợp lý. Đề nghị đưa vào lịch họp Hội đồng đánh giá.",
  },
  {
    id: 5, roleType: "council", type: "council_minutes",
    actor: "Hội đồng Đánh giá", role: "Hội đồng KH",
    action: "đã ban hành Biên bản Hội đồng",
    date: "16/02/2026", time: "09:00",
    minutesId: "BB-2026/HĐ-001",
  },
  {
    id: 6, roleType: "council", type: "revision", isLatest: true,
    actor: "GS.TS Nguyễn Văn Khoa", role: "Chủ tịch Hội đồng",
    action: "đã yêu cầu chỉnh sửa đề tài",
    date: "16/02/2026", time: "11:30",
    comment: "Hội đồng đã xem xét và ghi nhận đề tài có hướng nghiên cứu tốt. Tuy nhiên, đề nghị chủ nhiệm bổ sung và làm rõ các nội dung sau:\n\n1. Phần phương pháp nghiên cứu cần được trình bày chi tiết hơn, đặc biệt là cách thức thu thập và xử lý dữ liệu thực nghiệm.\n\n2. Cần làm rõ tính mới và điểm khác biệt so với các mô hình AI giáo dục hiện có trên thị trường quốc tế.\n\n3. Bổ sung kế hoạch triển khai thực nghiệm cụ thể với số lượng mẫu đủ lớn và có kiểm soát.",
  },
];

const MOCK_MINUTES = {
  id: "BB-2026/HĐ-001",
  date: "16/02/2026",
  location: "Phòng Hội thảo A102, Trường Đại học Mở TP.HCM",
  council: [
    { name: "GS.TS Nguyễn Văn Khoa",   title: "Chủ tịch Hội đồng" },
    { name: "PGS.TS Trần Thị Hương",   title: "Phó Chủ tịch" },
    { name: "TS Lê Minh Đức",          title: "Ủy viên phản biện 1" },
    { name: "TS Phạm Thành Long",      title: "Ủy viên phản biện 2" },
    { name: "ThS Bùi Thị Kim Anh",     title: "Thư ký Hội đồng" },
  ],
  scores: [
    { criteria: "Tính khoa học và tính mới", score: 8.5, max: 10 },
    { criteria: "Tính ứng dụng thực tiễn",  score: 7.0, max: 10 },
    { criteria: "Tính khả thi của kế hoạch", score: 7.5, max: 10 },
    { criteria: "Năng lực nhóm nghiên cứu", score: 8.0, max: 10 },
    { criteria: "Dự toán kinh phí hợp lý",  score: 8.0, max: 10 },
  ],
  summary: "Hội đồng ghi nhận đề tài có hướng nghiên cứu bám sát xu hướng công nghệ hiện đại và có ý nghĩa thực tiễn cao đối với lĩnh vực giáo dục đại học Việt Nam. Chủ nhiệm đề tài có năng lực và kinh nghiệm phù hợp.",
  decision: "Yêu cầu chỉnh sửa",
  decisionNote: "Đề nghị chủ nhiệm bổ sung phần phương pháp nghiên cứu và kế hoạch triển khai thực nghiệm trong vòng 15 ngày làm việc kể từ ngày nhận biên bản.",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const ROLE_COLORS = {
  system:     "bg-gray-200 text-gray-600",
  researcher: "bg-blue-100 text-blue-700",
  khoa:       "bg-amber-100 text-amber-700",
  qlkh:       "bg-indigo-100 text-indigo-700",
  council:    "bg-purple-100 text-purple-700",
};

// ─── Modal Overlay ─────────────────────────────────────────────────────────────

const ModalOverlay = ({ onClose, children }) => {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", label: "Dashboard",      icon: <IcHome /> },
  { id: "topics",    label: "Đề tài của tôi", icon: <IcTopic /> },
  { id: "settings",  label: "Cài đặt",        icon: <IcSettings /> },
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
      {NAV.map((item) => {
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
        NT
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold text-gray-800 truncate leading-tight">Nguyễn Thị Hoài Thương</p>
        <p className="text-[10px] text-[#4a7faa] font-medium mt-0.5">Vai trò: Chủ nhiệm</p>
      </div>
      <button className="text-[#4a7faa] hover:text-red-500 transition flex-shrink-0">
        <IcLogout cls="w-4 h-4" />
      </button>
    </div>
  </aside>
);

// ─── Progress Stepper ──────────────────────────────────────────────────────────

const ProgressStepper = ({ currentIdx }) => {
  const elements = [];
  MACRO_STAGES.forEach((stage, idx) => {
    const done   = idx < currentIdx;
    const active = idx === currentIdx;
    if (idx > 0) {
      elements.push(
        <div
          key={`line-${idx}`}
          className={`flex-1 h-0.5 mt-4 flex-shrink ${idx <= currentIdx ? "bg-green-400" : "bg-gray-200"}`}
        />
      );
    }
    elements.push(
      <div key={stage} className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
          done   ? "bg-green-500 text-white" :
          active ? "bg-[#1a5ea8] text-white ring-4 ring-[#1a5ea8]/20" :
                   "bg-white border-2 border-gray-200 text-gray-400"
        }`}>
          {done ? "✓" : idx + 1}
        </div>
        <span className={`mt-1.5 text-[11px] font-semibold text-center leading-snug max-w-[72px] ${
          done   ? "text-green-600" :
          active ? "text-[#1a5ea8]" :
                   "text-gray-400"
        }`}>
          {stage}
        </span>
      </div>
    );
  });

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
      <div className="flex items-start max-w-3xl mx-auto">
        {elements}
      </div>
    </div>
  );
};

// ─── Shared Section Card ───────────────────────────────────────────────────────

const SectionCard = ({ title, icon, children, accentColor }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${accentColor ? `border-l-4 ${accentColor} border-t border-r border-b border-gray-100` : "border border-gray-100"}`}>
    <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <span className="text-[#1a5ea8]">{icon}</span>
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const InfoRow = ({ label, value, full = false }) => (
  <div className={`flex flex-col gap-0.5 ${full ? "col-span-2" : ""}`}>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm text-gray-800 leading-snug">{value || "—"}</span>
  </div>
);

// ─── Tab 1: Details ────────────────────────────────────────────────────────────

const GeneralInfoCard = ({ topic }) => (
  <SectionCard title="Thông tin chung" icon={<IcInfo cls="w-4 h-4" />}>
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      <InfoRow label="Mã đề tài"            value={topic.code} />
      <InfoRow label="Loại hình nghiên cứu" value={topic.researchType} />
      <InfoRow label="Tên đề tài (Tiếng Việt)" value={topic.titleVN} full />
      <InfoRow label="Tên đề tài (Tiếng Anh)"  value={topic.titleEN}  full />
      <InfoRow label="Lĩnh vực Khoa học"    value={topic.scienceField} />
      <InfoRow label="Mã số chuyên ngành"   value={topic.specialtyCode} />
      <InfoRow label="Thời gian thực hiện"  value={topic.duration} />
      <InfoRow label="Ngày bắt đầu dự kiến" value={topic.startDate} />
    </div>
  </SectionCard>
);

const ResearchContentCard = ({ topic }) => (
  <SectionCard title="Tổng quan & Nội dung Nghiên cứu" icon={<IcDoc cls="w-4 h-4" />}>
    <div className="flex flex-col gap-5">
      {[
        { label: "Tổng quan tình hình nghiên cứu",   value: topic.overview },
        { label: "Tính cấp thiết của đề tài",         value: topic.urgency },
        { label: "Mục tiêu tổng quát",                value: topic.generalObj },
        { label: "Mục tiêu cụ thể",                   value: topic.specificObj },
        { label: "Đối tượng và phạm vi nghiên cứu",   value: topic.researchScope },
        { label: "Phương pháp / Cách tiếp cận",       value: topic.methodology },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            {value || "—"}
          </p>
        </div>
      ))}
    </div>
  </SectionCard>
);

const PersonnelCard = ({ topic }) => (
  <SectionCard title="Nhân sự & Kinh phí" icon={<IcUsers cls="w-4 h-4" />}>
    <div className="flex flex-col gap-5">
      {/* PI */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Chủ nhiệm đề tài</p>
        <div className="grid grid-cols-3 gap-3 bg-blue-50/40 rounded-lg p-3 border border-blue-100">
          {[
            { label: "Họ và tên",     value: topic.pi.name },
            { label: "Đơn vị công tác", value: topic.pi.unit },
            { label: "Email liên hệ", value: topic.pi.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</span>
              <span className="text-xs font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Thành viên tham gia</p>
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Họ và tên", "Đơn vị", "Vai trò"].map((h) => (
                  <th key={h} className="py-2.5 px-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topic.members.map((m, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                  <td className="py-2.5 px-4 font-medium text-gray-800">{m.name}</td>
                  <td className="py-2.5 px-4 text-gray-500">{m.unit}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">{m.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget */}
      <div className="flex items-center justify-between bg-green-50 rounded-lg px-4 py-3 border border-green-100">
        <div className="flex items-center gap-2">
          <IcCash cls="w-4 h-4 text-green-600" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Dự toán kinh phí tổng thể</span>
        </div>
        <span className="text-base font-black text-green-700">{topic.budget}</span>
      </div>

      {/* Products */}
      <div className="flex flex-col gap-3">
        {[
          { label: "Sản phẩm khoa học (Dạng I) *",     value: topic.product1 },
          { label: "Sản phẩm khoa học (Dạng II)",      value: topic.product2 },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-100">{value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  </SectionCard>
);

const FileCard = ({ name, type, size, iconBg }) => (
  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm transition group">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${iconBg}`}>
      {type}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-800 truncate">{name}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{size}</p>
    </div>
    <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5ea8] hover:text-blue-900 transition opacity-70 group-hover:opacity-100">
      <IcDownload cls="w-3.5 h-3.5" />
      Tải xuống
    </button>
  </div>
);

const AttachmentsCard = () => (
  <SectionCard title="Tài liệu đính kèm" icon={<IcDownload cls="w-4 h-4" />}>
    <div className="grid grid-cols-2 gap-3">
      <FileCard
        name="Thuyết minh đề tài - DT001.pdf"
        type="PDF"
        size="2.4 MB · Cập nhật 05/02/2026"
        iconBg="bg-red-100 text-red-600"
      />
      <FileCard
        name="Dự toán kinh phí - DT001.xlsx"
        type="XLS"
        size="380 KB · Cập nhật 05/02/2026"
        iconBg="bg-green-100 text-green-700"
      />
    </div>
  </SectionCard>
);

const DetailsTab = ({ topic }) => (
  <div className="flex flex-col gap-5">
    <GeneralInfoCard topic={topic} />
    <ResearchContentCard topic={topic} />
    <PersonnelCard topic={topic} />
    <AttachmentsCard />
  </div>
);

// ─── Tab 2: History & Feedback ─────────────────────────────────────────────────

const CouncilMinutesCard = ({ item, onViewMinutes }) => (
  <div className="flex-1 pb-6">
    <div className="rounded-xl p-4 bg-purple-50 border border-purple-200 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <IcDoc cls="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-purple-900">Biên bản Hội đồng Đánh giá</p>
            <p className="text-xs text-purple-600 mt-0.5">
              Số biên bản: <span className="font-semibold">{item.minutesId}</span> &nbsp;·&nbsp; Ngày họp: {item.date} {item.time}
            </p>
          </div>
        </div>
        <button
          onClick={onViewMinutes}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm flex-shrink-0"
        >
          <IcDoc cls="w-3.5 h-3.5" />
          Xem chi tiết Biên bản
        </button>
      </div>
    </div>
  </div>
);

const StandardTimelineContent = ({ item }) => {
  const isRevision = item.type === "revision" && item.isLatest;
  return (
    <div className={`flex-1 pb-6 ${isRevision ? "-ml-0" : ""}`}>
      <div className={`rounded-xl shadow-sm overflow-hidden transition ${
        isRevision
          ? "border border-red-200 border-l-4 border-l-red-400 bg-red-50/30"
          : "border border-gray-100 bg-white"
      }`}>
        {/* Card header */}
        <div className={`flex items-center justify-between gap-2 px-4 py-3 border-b ${isRevision ? "border-red-100" : "border-gray-100"}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-800">{item.actor}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isRevision ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
              {item.role}
            </span>
            <span className={`text-xs ${isRevision ? "text-red-600 font-semibold" : "text-gray-500"}`}>
              {item.action}
            </span>
            {isRevision && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                <IcWarning cls="w-3 h-3" />
                Cần hành động
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
            {item.date} · {item.time}
          </span>
        </div>
        {/* Comment */}
        {item.comment && (
          <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${isRevision ? "text-red-800" : "text-gray-600"}`}>
            {item.comment}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryTab = ({ onViewMinutes }) => (
  <div className="relative flex flex-col">
    {TIMELINE_DATA.map((item, idx) => {
      const isLast   = idx === TIMELINE_DATA.length - 1;
      const avatarCls = ROLE_COLORS[item.roleType] ?? ROLE_COLORS.system;
      return (
        <div key={item.id} className="flex gap-4">
          {/* Left: avatar + connector */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarCls}`}>
              {getInitials(item.actor)}
            </div>
            {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-1.5 min-h-[24px]" />}
          </div>

          {/* Right: content */}
          {item.type === "council_minutes" ? (
            <CouncilMinutesCard item={item} onViewMinutes={onViewMinutes} />
          ) : (
            <StandardTimelineContent item={item} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Edit Topic Modal ──────────────────────────────────────────────────────────

const EditTopicModal = ({ onClose }) => (
  <ModalOverlay onClose={onClose}>
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Cập nhật Hồ sơ Đề tài</h2>
          <p className="text-xs text-gray-400 mt-0.5">DT001 · Nguyễn Thị Hoài Thương</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <IcX cls="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <IcEdit cls="w-8 h-8 text-[#1a5ea8]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">Form cập nhật 5 bước sẽ hiển thị ở đây</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
            Toàn bộ form đăng ký đề tài 5 bước (Thông tin chung → Nhân sự & Đính kèm) sẽ được mở, cho phép chỉnh sửa và bổ sung nội dung theo yêu cầu của Hội đồng.
          </p>
        </div>
        <div className="w-full bg-amber-50 rounded-lg border border-amber-200 px-4 py-3 text-left">
          <p className="text-xs font-bold text-amber-700 mb-1">Yêu cầu chỉnh sửa từ Hội đồng:</p>
          <ul className="text-xs text-amber-600 list-disc list-inside space-y-0.5 leading-relaxed">
            <li>Bổ sung chi tiết phương pháp nghiên cứu</li>
            <li>Làm rõ tính khác biệt so với các mô hình hiện có</li>
            <li>Bổ sung kế hoạch triển khai thực nghiệm cụ thể</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onClose}
          className="h-9 px-4 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <button
          onClick={onClose}
          className="h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
        >
          Mở form cập nhật
        </button>
      </div>
    </div>
  </ModalOverlay>
);

// ─── Council Minutes Modal ─────────────────────────────────────────────────────

const ScoreRow = ({ criteria, score, max }) => {
  const pct = (score / max) * 100;
  const barColor = score >= 8 ? "bg-green-500" : score >= 6.5 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 flex-1 min-w-0">{criteria}</span>
      <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-800 w-12 text-right flex-shrink-0">{score}/{max}</span>
    </div>
  );
};

const CouncilMinutesModal = ({ onClose }) => {
  const avg = (MOCK_MINUTES.scores.reduce((s, r) => s + r.score, 0) / MOCK_MINUTES.scores.length).toFixed(2);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-purple-50 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Biên bản Hội đồng Đánh giá</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Số: {MOCK_MINUTES.id} &nbsp;·&nbsp; Ngày họp: {MOCK_MINUTES.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-purple-100 transition"
          >
            <IcX cls="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Meeting info */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
            {[
              { label: "Ngày họp",    value: MOCK_MINUTES.date },
              { label: "Địa điểm",   value: MOCK_MINUTES.location },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-sm text-gray-800 leading-snug">{value}</span>
              </div>
            ))}
          </div>

          {/* Council members */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Thành phần Hội đồng</p>
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {MOCK_MINUTES.council.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                      <td className="py-2.5 px-4 font-medium text-gray-800">{m.name}</td>
                      <td className="py-2.5 px-4 text-xs text-gray-500">{m.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scores */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Điểm đánh giá theo tiêu chí</p>
              <span className="text-xs font-bold text-[#1a5ea8] bg-blue-50 px-3 py-1 rounded-full">
                Điểm TB: {avg} / 10
              </span>
            </div>
            <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              {MOCK_MINUTES.scores.map((s) => (
                <ScoreRow key={s.criteria} {...s} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nhận xét tổng quan của Hội đồng</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {MOCK_MINUTES.summary}
            </p>
          </div>

          {/* Decision */}
          <div className={`rounded-xl border px-5 py-4 flex flex-col gap-2 ${
            MOCK_MINUTES.decision === "Yêu cầu chỉnh sửa"
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center gap-2">
              <IcStar cls="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Kết luận của Hội đồng</span>
              <span className={`ml-auto text-xs font-black px-3 py-1 rounded-full ${
                MOCK_MINUTES.decision === "Yêu cầu chỉnh sửa"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {MOCK_MINUTES.decision}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{MOCK_MINUTES.decisionNote}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-6 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ─── Tab Bar ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "details", label: "Thông tin chi tiết" },
  { id: "history", label: "Lịch sử & Phản hồi" },
];

const TabBar = ({ active, onChange }) => (
  <div className="flex bg-white border-b border-gray-200 px-8 flex-shrink-0">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition duration-150 ${
          active === tab.id
            ? "border-[#1a5ea8] text-[#1a5ea8]"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const TopicDetail = () => {
  const topic = MOCK_TOPIC;
  const statusCfg = STATUS_CFG[topic.status] ?? STATUS_CFG.draft;

  const [activeMenu,          setActiveMenu]          = useState("topics");
  const [activeTab,           setActiveTab]           = useState("details");
  const [editModalOpen,       setEditModalOpen]       = useState(false);
  const [minutesModalOpen,    setMinutesModalOpen]    = useState(false);

  const canEdit = topic.status === "revision";

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={activeMenu} setActive={setActiveMenu} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5ea8] hover:text-blue-900 transition">
                  <IcLeft cls="w-3.5 h-3.5" />
                  Đề tài của tôi
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-xs text-gray-400">{topic.code}</span>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Chi tiết Đề tài</p>
              <h1 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2">
                {topic.titleVN}
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 mt-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                {statusCfg.label}
              </span>
              {canEdit && (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
                >
                  <IcEdit cls="w-4 h-4" />
                  Cập nhật hồ sơ
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Progress stepper */}
        <ProgressStepper currentIdx={topic.currentStageIdx} />

        {/* Tab bar */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {activeTab === "details" && <DetailsTab topic={topic} />}
          {activeTab === "history" && (
            <HistoryTab onViewMinutes={() => setMinutesModalOpen(true)} />
          )}
        </div>
      </main>

      {editModalOpen    && <EditTopicModal       onClose={() => setEditModalOpen(false)} />}
      {minutesModalOpen && <CouncilMinutesModal  onClose={() => setMinutesModalOpen(false)} />}
    </div>
  );
};

export default TopicDetail;
