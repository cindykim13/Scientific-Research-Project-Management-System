import { useState, useEffect, useRef } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2, fill = "none" }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcLeft     = p => <Svg {...p} d="M10 19l-7-7m0 0l7-7m-7 7h18" />;
const IcDoc      = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcChat     = p => <Svg {...p} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
const IcSparkle  = p => <Svg {...p} d="M5 3v4M3 5h4M6.343 6.343l2.829 2.829M3 12h4m-4 4h4m.343-4.343l2.829 2.829M12 3v4m4-4v4m4-4v4m-4 4h4m-4 4h4m-4-8l2.829 2.829M12 17v4m4-4v4m4-4v4" />;
const IcCheck    = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcX        = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcAlert    = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcEdit     = p => <Svg {...p} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />;
const IcLoader   = p => <Svg {...p} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
const IcUsers    = p => <Svg {...p} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />;
const IcStar     = p => <Svg {...p} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;
const IcClipboard = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"]} />;
const IcPublish  = p => <Svg {...p} d={["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"]} />;
const IcInfo     = p => <Svg {...p} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;

// ─── Constants & Mock Data ────────────────────────────────────────────────────────

const MOCK_TOPIC = {
  code:      "DT001",
  title:     "Nghiên cứu Hệ thống AI trong Hỗ trợ Chẩn đoán Y tế",
  pi:        "TS. Nguyễn Minh Khoa",
  unit:      "Khoa Công nghệ Thông tin",
  field:     "Khoa học Máy tính / AI",
  duration:  "24 tháng",
  startDate: "01/01/2026",
  council:   "HĐ CNTT – 01/2026",
  abstract:  "Đề tài nhằm nghiên cứu và phát triển một hệ thống trí tuệ nhân tạo (AI) có khả năng hỗ trợ các bác sĩ trong quá trình chẩn đoán bệnh thông qua việc phân tích hình ảnh y tế (X-quang, MRI, CT scan). Hệ thống sử dụng các mô hình học sâu (Deep Learning) kết hợp với kỹ thuật xử lý ảnh số để phát hiện các bất thường và đưa ra gợi ý chẩn đoán với độ chính xác cao, góp phần nâng cao chất lượng chăm sóc sức khỏe cộng đồng.",
  objectives: [
    "Xây dựng bộ dữ liệu hình ảnh y tế chuẩn hóa phục vụ huấn luyện mô hình AI.",
    "Nghiên cứu và cải tiến các kiến trúc mạng neural tích chập (CNN) phù hợp với bài toán chẩn đoán hình ảnh.",
    "Phát triển giao diện tích hợp hỗ trợ bác sĩ tra cứu và phản hồi kết quả AI.",
    "Đánh giá hiệu quả hệ thống trên bộ dữ liệu thực tế tại cơ sở y tế hợp tác.",
  ],
  products:  ["01 Bài báo khoa học đăng trên tạp chí quốc tế (Q2 trở lên)", "01 Phần mềm hỗ trợ chẩn đoán y tế có giấy chứng nhận ĐKBQ", "01 Báo cáo kết quả nghiên cứu toàn diện"],
};

const ROLE_CFG = {
  "Chủ tịch":    { avatarGrad: "from-rose-500 to-rose-700",    pill: "bg-rose-50 text-rose-800 border-rose-200"   },
  "Thư ký":      { avatarGrad: "from-blue-500 to-blue-700",    pill: "bg-blue-50 text-blue-800 border-blue-200"   },
  "Phản biện 1": { avatarGrad: "from-orange-400 to-orange-600",pill: "bg-orange-50 text-orange-700 border-orange-200" },
  "Phản biện 2": { avatarGrad: "from-amber-400 to-amber-600",  pill: "bg-amber-50 text-amber-700 border-amber-200"   },
  "Ủy viên":     { avatarGrad: "from-gray-400 to-gray-500",    pill: "bg-gray-50 text-gray-600 border-gray-200"   },
};

const MOCK_MEMBERS = [
  {
    id: 1, name: "GS.TS. Nguyễn Văn An", role: "Chủ tịch",    initials: "NA", score: 88,
    comment: "Đề tài có tính khoa học cao và tính thực tiễn rõ ràng. Phương pháp nghiên cứu phù hợp với mục tiêu đặt ra. Nhóm nghiên cứu có năng lực tốt. Đề nghị bổ sung thêm phần đánh giá rủi ro trong quá trình triển khai hệ thống AI vào môi trường y tế thực tế.",
  },
  {
    id: 2, name: "PGS.TS. Trần Thị Bình", role: "Thư ký",     initials: "TB", score: 84,
    comment: "Tổng quan tài liệu đầy đủ và có chiều sâu. Cần bổ sung rõ hơn phần mục tiêu cụ thể và chỉ số đo lường (KPI) để thuận tiện cho đánh giá nghiệm thu. Dự toán kinh phí cần được chi tiết hóa ở một số hạng mục còn mờ.",
  },
  {
    id: 3, name: "TS. Lê Minh Cường",      role: "Phản biện 1", initials: "LC", score: 87,
    comment: "Phương pháp nghiên cứu hợp lý và có cơ sở khoa học. Đề nghị nhóm làm rõ hơn về đối tượng nghiên cứu cụ thể (loại bệnh, loại hình ảnh y tế nào được ưu tiên). Phần sản phẩm dự kiến cần bổ sung thêm kế hoạch thương mại hóa hoặc chuyển giao công nghệ.",
  },
  {
    id: 4, name: "GS.TS. Phạm Quốc Dũng", role: "Phản biện 2", initials: "PD", score: 82,
    comment: "Nhóm nghiên cứu có năng lực và kinh nghiệm tốt trong lĩnh vực AI. Tuy nhiên, kinh phí dự toán một số hạng mục thiết bị còn cao so với thực tế thị trường. Đề nghị rà soát và điều chỉnh cho phù hợp trước khi phê duyệt chính thức.",
  },
  {
    id: 5, name: "TS. Hoàng Thị Oanh",     role: "Ủy viên",    initials: "HO", score: 86,
    comment: "Sản phẩm đầu ra được xác định rõ ràng và có tính khả thi. Đề nghị bổ sung kế hoạch triển khai thử nghiệm lâm sàng và cơ chế phối hợp với các cơ sở y tế đối tác. Cần có mốc kiểm tra tiến độ giữa kỳ rõ ràng hơn.",
  },
];

const AVG_SCORE = +(MOCK_MEMBERS.reduce((s, m) => s + m.score, 0) / MOCK_MEMBERS.length).toFixed(1);
const MAX_SCORE = Math.max(...MOCK_MEMBERS.map(m => m.score));
const MIN_SCORE = Math.min(...MOCK_MEMBERS.map(m => m.score));

const scoreGrade = (avg) => {
  if (avg >= 90) return { label: "XUẤT SẮC", bg: "bg-purple-100", text: "text-purple-800", bar: "bg-purple-500" };
  if (avg >= 80) return { label: "KHÁ / ĐẠT",  bg: "bg-green-100",  text: "text-green-800",  bar: "bg-green-500"  };
  if (avg >= 70) return { label: "ĐẠT",         bg: "bg-blue-100",   text: "text-blue-700",   bar: "bg-blue-500"   };
  return               { label: "KHÔNG ĐẠT",    bg: "bg-red-100",    text: "text-red-700",    bar: "bg-red-500"    };
};

const buildAutoFetch = () =>
  `TỔNG HỢP Ý KIẾN THÀNH VIÊN HỘI ĐỒNG\nĐề tài: ${MOCK_TOPIC.code} – ${MOCK_TOPIC.title}\n` +
  `Ngày họp: 20/10/2026 | Hội đồng: ${MOCK_TOPIC.council}\n\n` +
  MOCK_MEMBERS.map(m =>
    `▸ ${m.name} (${m.role}) – Điểm: ${m.score}/100\n   ${m.comment}`
  ).join("\n\n") +
  `\n\n─────────────────────────────────────────────\nĐiểm trung bình của Hội đồng: ${AVG_SCORE}/100\nKết quả đánh giá tổng thể: ${scoreGrade(AVG_SCORE).label}\n─────────────────────────────────────────────`;

const DECISION_OPTIONS = [
  {
    id:       "approved",
    title:    "Đồng ý thông qua",
    subtitle: "Không yêu cầu chỉnh sửa",
    icon:     <IcCheck cls="w-6 h-6" />,
    accent: {
      border: "border-green-500", bg: "bg-green-50", text: "text-green-800",
      sub: "text-green-600", ring: "ring-2 ring-green-200", iconBg: "bg-green-100 text-green-600",
      badge: "bg-green-100 text-green-700",
    },
  },
  {
    id:       "conditional",
    title:    "Thông qua có điều kiện",
    subtitle: "Yêu cầu chỉnh sửa theo góp ý của Hội đồng",
    icon:     <IcEdit cls="w-6 h-6" />,
    accent: {
      border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-900",
      sub: "text-amber-700", ring: "ring-2 ring-amber-200", iconBg: "bg-amber-100 text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
  },
  {
    id:       "rejected",
    title:    "Không thông qua",
    subtitle: "Yêu cầu bảo vệ lại ở phiên tiếp theo",
    icon:     <IcX cls="w-6 h-6" />,
    accent: {
      border: "border-red-500", bg: "bg-red-50", text: "text-red-900",
      sub: "text-red-600", ring: "ring-2 ring-red-200", iconBg: "bg-red-100 text-red-600",
      badge: "bg-red-100 text-red-700",
    },
  },
];

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg }) => (
  <div className="fixed top-5 right-5 z-[200] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl bg-green-600 text-white text-sm font-semibold max-w-sm pointer-events-none">
    <IcCheck cls="w-5 h-5 flex-shrink-0 mt-0.5" />
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Legal Confirmation Modal ─────────────────────────────────────────────────────

const ConfirmModal = ({ decision, avgScore, onClose, onConfirm }) => {
  const [legalChecked, setLegalChecked] = useState(false);
  const opt = DECISION_OPTIONS.find(o => o.id === decision);

  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <IcAlert cls="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900 leading-tight">Xác nhận Công bố Biên bản</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Hành động không thể hoàn tác</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <IcX cls="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Warning notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-[12.5px] text-amber-800 leading-relaxed font-medium">
              Sau khi công bố, Biên bản Hội đồng sẽ được ghi nhận chính thức vào hệ thống và gửi thông báo đến Chủ nhiệm đề tài. <strong>Bạn sẽ không thể hoàn tác hành động này.</strong>
            </p>
          </div>

          {/* Summary row */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Điểm Trung bình</p>
              <p className="text-2xl font-black text-[#1a5ea8]">{avgScore}<span className="text-sm font-semibold text-gray-400">/100</span></p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kết luận</p>
              {opt && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${opt.accent.border} ${opt.accent.bg} ${opt.accent.text}`}>
                  {opt.icon}
                  {opt.title}
                </span>
              )}
            </div>
          </div>

          {/* Legal poka-yoke checkbox */}
          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition select-none ${
            legalChecked ? "border-[#1a5ea8] bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"
          }`}>
            <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 border-2 transition ${
              legalChecked ? "bg-[#1a5ea8] border-[#1a5ea8]" : "border-gray-300 bg-white"
            }`}>
              {legalChecked && <IcCheck cls="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" className="sr-only" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} />
            <p className={`text-[12.5px] leading-relaxed font-medium ${legalChecked ? "text-[#1a5ea8]" : "text-gray-600"}`}>
              Tôi xác nhận nội dung biên bản đã phản ánh <strong>trung thực kết quả</strong> của phiên họp Hội đồng và có đầy đủ căn cứ để công bố chính thức.
            </p>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Hủy bỏ
          </button>
          <button
            disabled={!legalChecked}
            onClick={onConfirm}
            className={`flex-1 h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
              legalChecked
                ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IcPublish cls="w-4 h-4" />
            Xác nhận & Công bố
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Left Panel ───────────────────────────────────────────────────────────────────

const TopicAbstractTab = () => (
  <div className="p-5 flex flex-col gap-5">
    {/* Topic header */}
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#c5e2f5] flex items-center justify-center flex-shrink-0 mt-0.5">
          <IcDoc cls="w-5 h-5 text-[#1a5ea8]" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-[#1a5ea8] uppercase tracking-wider">{MOCK_TOPIC.code}</span>
          <p className="text-[12.5px] font-bold text-gray-900 leading-tight mt-0.5">{MOCK_TOPIC.title}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 pt-3">
        {[
          ["Chủ nhiệm", MOCK_TOPIC.pi],
          ["Đơn vị",    MOCK_TOPIC.unit],
          ["Lĩnh vực",  MOCK_TOPIC.field],
          ["Thời gian", MOCK_TOPIC.duration],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{label}</p>
            <p className="text-[11.5px] font-semibold text-gray-700 leading-snug mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Abstract */}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tóm tắt</p>
      <p className="text-[12px] text-gray-600 leading-relaxed">{MOCK_TOPIC.abstract}</p>
    </div>

    {/* Objectives */}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mục tiêu cụ thể</p>
      <ul className="flex flex-col gap-2">
        {MOCK_TOPIC.objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#c5e2f5] text-[#1a5ea8] text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-[11.5px] text-gray-600 leading-snug">{obj}</p>
          </li>
        ))}
      </ul>
    </div>

    {/* Products */}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sản phẩm dự kiến</p>
      <ul className="flex flex-col gap-1.5">
        {MOCK_TOPIC.products.map((prod, i) => (
          <li key={i} className="flex items-start gap-2">
            <IcCheck cls="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-gray-600 leading-snug">{prod}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MemberCommentsTab = () => (
  <div className="flex flex-col divide-y divide-gray-100">
    {MOCK_MEMBERS.map(member => {
      const cfg = ROLE_CFG[member.role] ?? { avatarGrad: "from-gray-400 to-gray-500", pill: "bg-gray-50 text-gray-600 border-gray-200" };
      const pct = Math.round((member.score / 100) * 100);
      const barColor = member.score >= 90 ? "bg-purple-500" : member.score >= 80 ? "bg-green-500" : member.score >= 70 ? "bg-blue-500" : "bg-red-500";
      return (
        <div key={member.id} className="p-4 hover:bg-white/60 transition">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${cfg.avatarGrad} flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold shadow-sm`}>
              {member.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[12.5px] font-bold text-gray-800 leading-tight">{member.name}</p>
                <div className="flex items-center gap-1.5">
                  <IcStar cls="w-3 h-3 text-amber-400" fill="currentColor" />
                  <span className="text-[13px] font-black text-gray-700">{member.score}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">/100</span>
                </div>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.pill}`}>
                {member.role}
              </span>
              {/* Score bar */}
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed mt-2">{member.comment}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const LeftPanel = () => {
  const [tab, setTab] = useState("thuyetminh");
  return (
    <div className="flex flex-col w-[40%] min-w-0 flex-shrink-0 bg-[#F4F5F7] border-r border-gray-200 overflow-hidden">
      {/* Tab nav */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        {[
          { id: "thuyetminh", label: "Thuyết minh Đề tài", icon: <IcDoc cls="w-4 h-4" /> },
          { id: "yKien",      label: "Ý kiến Thành viên",  icon: <IcChat cls="w-4 h-4" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold transition border-b-2 ${
              tab === t.id
                ? "border-[#1a5ea8] text-[#1a5ea8] bg-[#eaf5fc]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.icon}
            {t.label}
            {t.id === "yKien" && (
              <span className="w-5 h-5 rounded-full bg-[#c5e2f5] text-[#1a5ea8] text-[9px] font-black flex items-center justify-center">
                {MOCK_MEMBERS.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {tab === "thuyetminh" ? <TopicAbstractTab /> : <MemberCommentsTab />}
      </div>
    </div>
  );
};

// ─── Score Section ────────────────────────────────────────────────────────────────

const ScoreSection = () => {
  const grade = scoreGrade(AVG_SCORE);
  const pct   = Math.round((AVG_SCORE / 100) * 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">1</span>
        <h2 className="text-[14px] font-bold text-gray-800">Tổng hợp Điểm đánh giá</h2>
        <span className="text-xs text-gray-400 font-medium">(Chỉ đọc)</span>
      </div>

      <div className="flex gap-5 items-stretch">
        {/* Score table */}
        <div className="flex-1 min-w-0 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2.5 px-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thành viên</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map((m, i) => {
                const cfg = ROLE_CFG[m.role] ?? {};
                const barColor = m.score >= 80 ? "bg-green-400" : m.score >= 70 ? "bg-blue-400" : "bg-red-400";
                return (
                  <tr key={m.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${cfg.avatarGrad} flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>
                          {m.initials}
                        </div>
                        <span className="text-[12px] font-semibold text-gray-700 truncate">{m.name.replace(/^[A-Z]+\.[A-Z]+\. /, '')}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${cfg.pill}`}>{m.role}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${m.score}%` }} />
                        </div>
                        <span className="text-[13px] font-black text-gray-800 w-7 text-right">{m.score}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Average row */}
              <tr className="bg-blue-50/60 border-t border-blue-100">
                <td colSpan={2} className="py-3 px-4 text-[11.5px] font-bold text-[#1a5ea8] uppercase tracking-wide">Điểm Trung bình Hội đồng</td>
                <td className="py-3 px-3 text-right">
                  <span className="text-[14px] font-black text-[#1a5ea8]">{AVG_SCORE}</span>
                  <span className="text-[10px] text-blue-400 font-semibold">/100</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Score Highlight Card */}
        <div className="w-36 flex-shrink-0 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm p-4 gap-3">
          {/* Circular arc */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1a5ea8" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[18px] font-black text-[#1a5ea8] leading-none">{AVG_SCORE}</span>
              <span className="text-[9px] text-gray-400 font-bold">/100</span>
            </div>
          </div>
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${grade.bg} ${grade.text}`}>{grade.label}</span>
          <div className="w-full flex flex-col gap-1 text-center border-t border-gray-100 pt-2">
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Min</span><span className="font-bold text-gray-600">{MIN_SCORE}</span>
            </div>
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Max</span><span className="font-bold text-gray-600">{MAX_SCORE}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Minutes Content Section ──────────────────────────────────────────────────────

const MinutesContentSection = ({ minutesText, setMinutesText }) => {
  const [isFetching,  setIsFetching]  = useState(false);
  const [autoFetched, setAutoFetched] = useState(false);
  const textRef = useRef(null);

  const handleAutoFetch = () => {
    if (isFetching || autoFetched) return;
    setIsFetching(true);
    setTimeout(() => {
      setMinutesText(buildAutoFetch());
      setIsFetching(false);
      setAutoFetched(true);
      setTimeout(() => textRef.current?.focus(), 50);
    }, 900);
  };

  const handleClear = () => {
    setMinutesText("");
    setAutoFetched(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">2</span>
        <h2 className="text-[14px] font-bold text-gray-800">Nội dung Nhận xét & Giải trình</h2>
      </div>

      {/* Auto-fetch toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Ghi lại nhận xét tổng hợp của Hội đồng. Bạn có thể tự động trích xuất từ ý kiến thành viên.
        </p>
        <button
          onClick={handleAutoFetch}
          disabled={isFetching || autoFetched}
          className={`inline-flex items-center gap-2 h-8 px-4 rounded-lg border text-xs font-bold flex-shrink-0 transition ${
            autoFetched
              ? "border-green-300 text-green-600 bg-green-50 cursor-default"
              : isFetching
              ? "border-blue-200 text-blue-400 bg-blue-50 cursor-wait"
              : "border-[#1a5ea8] text-[#1a5ea8] bg-white hover:bg-blue-50"
          }`}
        >
          {isFetching
            ? <><IcLoader cls="w-3.5 h-3.5 animate-spin" />Đang trích xuất...</>
            : autoFetched
            ? <><IcCheck cls="w-3.5 h-3.5" />Đã trích xuất ({MOCK_MEMBERS.length} ý kiến)</>
            : <><IcSparkle cls="w-3.5 h-3.5" />Tự động trích xuất ý kiến</>}
        </button>
      </div>

      {/* Textarea */}
      <div className="relative">
        {autoFetched && (
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2">
            <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              ✦ Đã trích xuất tự động
            </span>
            <button
              onClick={handleClear}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition"
              title="Xóa nội dung"
            >
              <IcX cls="w-3 h-3" />
            </button>
          </div>
        )}
        <textarea
          ref={textRef}
          value={minutesText}
          onChange={e => { setMinutesText(e.target.value); if (autoFetched && !e.target.value) setAutoFetched(false); }}
          placeholder="Nhập nội dung tổng hợp của Biên bản Hội đồng tại đây. Ghi lại các ý kiến, yêu cầu chỉnh sửa và kết luận..."
          rows={10}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/20 text-[12.5px] text-gray-700 leading-relaxed px-4 py-3.5 outline-none transition placeholder:text-gray-400 font-mono"
        />
        {minutesText && (
          <p className="text-[10px] text-gray-400 mt-1 text-right font-medium">{minutesText.length} ký tự</p>
        )}
      </div>
    </div>
  );
};

// ─── Decision Section ─────────────────────────────────────────────────────────────

const DecisionSection = ({ decision, setDecision }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">3</span>
      <h2 className="text-[14px] font-bold text-gray-800">Kết luận của Hội đồng <span className="text-red-500">*</span></h2>
    </div>
    <p className="text-[12px] text-gray-500">Chọn một trong ba kết luận dưới đây. Kết luận này sẽ được ghi nhận chính thức vào Biên bản.</p>
    <div className="grid grid-cols-3 gap-3">
      {DECISION_OPTIONS.map(opt => {
        const isSelected = decision === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setDecision(opt.id)}
            className={`flex flex-col items-center text-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? `${opt.accent.border} ${opt.accent.bg} ${opt.accent.ring} shadow-sm`
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            {/* Icon badge */}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
              isSelected ? opt.accent.iconBg : "bg-gray-100 text-gray-400"
            }`}>
              {opt.icon}
            </div>
            {/* Title */}
            <div>
              <p className={`text-[12.5px] font-bold leading-tight ${isSelected ? opt.accent.text : "text-gray-700"}`}>
                {opt.title}
              </p>
              <p className={`text-[11px] mt-1 leading-snug ${isSelected ? opt.accent.sub : "text-gray-400"}`}>
                {opt.subtitle}
              </p>
            </div>
            {/* Selected indicator */}
            {isSelected && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${opt.accent.badge}`}>
                ✓ Đã chọn
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Sticky Footer ────────────────────────────────────────────────────────────────

const StickyFooter = ({ canPublish, minutesText, decision, onCancel, onPublish, submitted }) => {
  const missingText     = !minutesText.trim();
  const missingDecision = !decision;

  const getHelperText = () => {
    if (submitted)        return "Biên bản đã được công bố thành công";
    if (missingText && missingDecision) return "Vui lòng nhập nội dung biên bản và chọn kết luận";
    if (missingText)      return "Vui lòng nhập nội dung biên bản (Mục 2)";
    if (missingDecision)  return "Vui lòng chọn kết luận của Hội đồng (Mục 3)";
    return null;
  };

  const helperText = getHelperText();

  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {/* Left: helper */}
      <div className="flex items-center gap-2 min-w-0">
        {helperText && !submitted && (
          <div className="flex items-center gap-2 text-[11.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <IcInfo cls="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
            {helperText}
          </div>
        )}
        {submitted && (
          <div className="flex items-center gap-2 text-[11.5px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <IcCheck cls="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
            Biên bản đã được công bố và ghi nhận chính thức
          </div>
        )}
      </div>

      {/* Right: buttons */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onCancel}
          className="h-10 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Hủy bỏ
        </button>
        <button
          disabled={!canPublish}
          onClick={onPublish}
          className={`flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold transition ${
            canPublish
              ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <IcPublish cls="w-4 h-4" />
          {submitted ? "Đã Công bố" : "Lưu & Công bố Biên bản"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component: Council Minutes E-Form (SC-COUNCIL-04) ──────────────────────

const CouncilMinutesForm = () => {
  const [minutesText,  setMinutesText]  = useState("");
  const [decision,     setDecision]     = useState(null);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [toast,        setToast]        = useState({ visible: false, msg: "" });

  // ── Toast auto-dismiss ──
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "" }), 4500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const canPublish = minutesText.trim().length > 0 && decision !== null && !submitted;

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSubmitted(true);
    const opt = DECISION_OPTIONS.find(o => o.id === decision);
    setToast({
      visible: true,
      msg: `Biên bản Hội đồng đã được công bố thành công! Kết luận: "${opt?.title}". Hệ thống đã gửi thông báo đến Chủ nhiệm đề tài.`,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#eaf5fc] overflow-hidden">

      {/* ── Global Header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-3.5 flex items-center gap-4 flex-shrink-0 z-10">
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a5ea8] transition px-3 py-1.5 rounded-lg hover:bg-blue-50 flex-shrink-0">
          <IcLeft cls="w-4 h-4" />
          Quay lại
        </button>
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img src={logoOU} alt="OU" className="h-8 w-auto object-contain flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SC-COUNCIL-04</p>
            <h1 className="text-sm font-bold text-gray-800 truncate leading-tight">
              Lập Biên bản Họp Hội đồng —{" "}
              <span className="text-[#1a5ea8]">{MOCK_TOPIC.code}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hidden sm:inline-flex items-center gap-1.5">
            <IcUsers cls="w-3 h-3" />
            {MOCK_MEMBERS.length} thành viên · Điểm TB: <strong className="text-[#1a5ea8]">{AVG_SCORE}/100</strong>
          </span>
          {submitted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
              <IcCheck cls="w-3.5 h-3.5" />
              Đã Công bố
            </span>
          )}
        </div>
      </header>

      {/* ── Main split area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel */}
        <LeftPanel />

        {/* Right Panel */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
          {/* Scrollable form area */}
          <div className="flex-1 overflow-auto px-8 py-8 flex flex-col gap-8">

            {/* Section 1: Score Report */}
            <ScoreSection />

            {/* Divider */}
            <div className="w-full h-px bg-gray-100" />

            {/* Section 2: Minutes Content */}
            <MinutesContentSection minutesText={minutesText} setMinutesText={setMinutesText} />

            {/* Divider */}
            <div className="w-full h-px bg-gray-100" />

            {/* Section 3: Decision */}
            <DecisionSection decision={decision} setDecision={submitted ? () => {} : setDecision} />

            {/* Bottom padding spacer */}
            <div className="h-4" />
          </div>

          {/* Sticky footer */}
          <StickyFooter
            canPublish={canPublish}
            minutesText={minutesText}
            decision={decision}
            submitted={submitted}
            onCancel={() => {}}
            onPublish={() => setConfirmOpen(true)}
          />
        </div>
      </div>

      {/* Legal Confirmation Modal */}
      {confirmOpen && (
        <ConfirmModal
          decision={decision}
          avgScore={AVG_SCORE}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast */}
      {toast.visible && <Toast msg={toast.msg} />}
    </div>
  );
};

export default CouncilMinutesForm;
