// File: src/pages/CouncilEvalForm.jsx

import { useState, useEffect } from "react";

// KÉO DỮ LIỆU VÀ LOGIC TỪ FILE MOCK VÀO ĐÂY
import {
  MOCK_TOPIC,
  CRITERIA,
  MAX_TOTAL,
  GRADE_OPTIONS,
  GRADE_CFG,
  suggestGrade,
  mkScores,
} from "../mocks/councilEvalMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcLeft      = p => <Svg {...p} d="M11 17l-5-5m0 0l5-5m-5 5h12" />;
const IcZoomIn    = p => <Svg {...p} d="M21 21l-4.35-4.35M10 7v6m-3-3h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcZoomOut   = p => <Svg {...p} d="M21 21l-4.35-4.35M7 11h6M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcSearch    = p => <Svg {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcDoc       = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcCheck     = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcX         = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcAlert     = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcChevUp    = p => <Svg {...p} d="M5 15l7-7 7 7" />;
const IcChevDown  = p => <Svg {...p} d="M19 9l-7 7-7-7" />;
const IcSave      = p => <Svg {...p} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />;
const IcSparkle   = p => <Svg {...p} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />;
const IcClipboard = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"]} />;
const IcStar      = p => <Svg {...p} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg }) => (
  <div className="fixed top-5 right-5 z-[200] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl bg-green-600 text-white text-sm font-semibold pointer-events-none max-w-sm">
    <IcCheck cls="w-5 h-5 flex-shrink-0 mt-0.5" />
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Confirmation Modal ───────────────────────────────────────────────────────────

const ConfirmModal = ({ totalScore, grade, onClose, onConfirm }) => {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const gradeCfg = GRADE_CFG[grade];

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
            <IcSave cls="w-8 h-8 text-[#1a5ea8]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Xác nhận nộp Phiếu đánh giá?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Bạn sẽ <strong className="text-gray-700">không thể sửa lại</strong> sau khi Thư ký chốt Biên bản Hội đồng.
            </p>
          </div>

          {/* Score summary card */}
          <div className="w-full bg-gray-50 rounded-xl p-3.5 flex items-center justify-between border border-gray-100 gap-3">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tổng điểm</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-[#1a5ea8] leading-none">{totalScore}</span>
                <span className="text-sm font-semibold text-gray-400">/ {MAX_TOTAL}</span>
              </div>
            </div>
            {gradeCfg && (
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${gradeCfg.style}`}>
                {gradeCfg.short}
              </span>
            )}
          </div>

          <div className="flex gap-3 w-full">
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
              Xác nhận nộp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Mock PDF Document ────────────────────────────────────────────────────────────

const MockPDFPage = ({ page }) => (
  <div className="bg-white shadow-md rounded-sm p-10 text-[11px] leading-relaxed text-gray-800 min-h-[700px] w-full max-w-[680px]">
    <div className="text-center mb-7 pb-5 border-b border-gray-200">
      <p className="font-bold text-[12px] uppercase tracking-wider text-gray-900">THUYẾT MINH ĐỀ TÀI NGHIÊN CỨU KHOA HỌC</p>
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Trường Đại học Mở TP. Hồ Chí Minh</p>
    </div>

    {page === 1 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">I. THÔNG TIN CHUNG</p>
        {[
          ["Tên đề tài (Tiếng Việt):", MOCK_TOPIC.title],
          ["Tên đề tài (Tiếng Anh):",  "Research on AI Systems for Medical Diagnosis Support"],
          ["Lĩnh vực Khoa học:",        "Công nghệ thông tin – Trí tuệ nhân tạo"],
          ["Loại hình nghiên cứu:",     "Nghiên cứu ứng dụng"],
          ["Thời gian thực hiện:",      "24 tháng (01/2026 – 12/2027)"],
          ["Chủ nhiệm đề tài:",         MOCK_TOPIC.pi],
          ["Đơn vị công tác:",          "Khoa CNTT – Trường Đại học Mở TP. HCM"],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-3 mb-1.5 items-start">
            <span className="font-semibold text-gray-600 w-52 flex-shrink-0">{label}</span>
            <span className="text-gray-800 flex-1">{value}</span>
          </div>
        ))}
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700 mt-2">II. TỔNG QUAN NGHIÊN CỨU</p>
        <p className="text-gray-700 leading-relaxed">Trí tuệ nhân tạo (AI) đang tạo ra cuộc cách mạng trong lĩnh vực y tế, đặc biệt là hỗ trợ chẩn đoán hình ảnh và phát hiện sớm bệnh tật. Đề tài này nghiên cứu và phát triển một hệ thống AI tích hợp có khả năng phân tích ảnh y tế (X-quang, MRI, CT scan) và hỗ trợ bác sĩ đưa ra chẩn đoán chính xác hơn, nhanh hơn với độ tin cậy cao.</p>
      </div>
    )}

    {page === 2 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">III. MỤC TIÊU VÀ NỘI DUNG NGHIÊN CỨU</p>
        <p className="font-semibold text-gray-700 mb-1">3.1 Mục tiêu tổng quát</p>
        <p className="text-gray-700 leading-relaxed">Xây dựng hệ thống AI đạt độ chính xác ≥ 90% trong chẩn đoán các bệnh lý phổ biến từ ảnh y tế, triển khai thử nghiệm tại Bệnh viện Đại học Y Dược TP.HCM.</p>
        <p className="font-semibold text-gray-700 mb-1 mt-2">3.2 Nội dung nghiên cứu</p>
        {["Thu thập, làm sạch và chuẩn hóa bộ dữ liệu ảnh y tế từ các cơ sở hợp tác.", "Nghiên cứu và áp dụng các mô hình Deep Learning tiên tiến (ResNet, EfficientNet, Vision Transformer).", "Xây dựng hệ thống API backend và giao diện bác sĩ thân thiện.", "Triển khai thử nghiệm và đánh giá lâm sàng tại đơn vị y tế đối tác.", "Hoàn thiện, đề xuất quy trình nhân rộng kết quả nghiên cứu."].map((item, i) => (
          <p key={i} className="text-gray-700 ml-3 mb-1">• {item}</p>
        ))}
      </div>
    )}

    {page === 3 && (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[11px] uppercase border-b border-gray-200 pb-1 mb-3 text-gray-700">IV. SẢN PHẨM & DỰ TOÁN KINH PHÍ</p>
        <p className="font-semibold text-gray-700 mb-1.5">4.1 Sản phẩm dự kiến</p>
        {["02 bài báo đăng trên tạp chí ISI/Scopus Q1–Q2.", "01 hệ thống phần mềm AI chẩn đoán hình ảnh y tế.", "01 bằng sáng chế / giải pháp hữu ích."].map((item, i) => (
          <p key={i} className="text-gray-700 ml-3 mb-1">• {item}</p>
        ))}
        <div className="mt-3 rounded border border-gray-200 overflow-hidden">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["STT", "Hạng mục", "Số lượng", "Thành tiền (VNĐ)"].map(h => (
                  <th key={h} className="py-1.5 px-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["1","Chi phí nhân công","24 tháng","120.000.000"],["2","Chi phí thiết bị, GPU","Trọn gói","80.000.000"],["3","Chi phí hội thảo, điều tra","2 lần","30.000.000"],["4","Chi phí quản lý","Trọn gói","20.000.000"]].map(([no, item, qty, total]) => (
                <tr key={no} className="border-b border-gray-100">
                  <td className="py-1.5 px-2">{no}</td>
                  <td className="py-1.5 px-2">{item}</td>
                  <td className="py-1.5 px-2">{qty}</td>
                  <td className="py-1.5 px-2 font-semibold">{total}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={3} className="py-1.5 px-2 text-right">Tổng cộng:</td>
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

// ─── Criterion Row ────────────────────────────────────────────────────────────────
// Renders one scoring criterion: title + description, number input with
// real-time validation, animated progress bar, and optional comment textarea.

const CriterionRow = ({ criterion, data, onChange, disabled }) => {
  const { score, comment } = data;
  const numVal  = score === "" ? null : parseFloat(score);
  const isInvalid = numVal !== null && (isNaN(numVal) || numVal < 0 || numVal > criterion.maxScore);
  const isValid   = numVal !== null && !isInvalid;
  const pct = isValid ? Math.min(100, (numVal / criterion.maxScore) * 100) : 0;

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${
      disabled     ? "border-gray-100 bg-gray-50/50 opacity-60"
      : isInvalid  ? "border-red-200 bg-red-50/30"
      : isValid    ? "border-green-200 bg-green-50/20"
      :              "border-gray-100 bg-white hover:border-blue-100"
    }`}>
      {/* Criterion header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-[#1a5ea8] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
            {criterion.num}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 leading-tight">{criterion.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{criterion.description}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#1a5ea8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          Tối đa: {criterion.maxScore}đ
        </span>
      </div>

      {/* Score input + progress bar */}
      <div className="flex items-center gap-3">
        {/* Number input */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">Điểm</span>
          <input
            type="number"
            min="0"
            max={criterion.maxScore}
            value={score}
            onChange={e => onChange(criterion.id, "score", e.target.value)}
            disabled={disabled}
            placeholder="—"
            className={`w-[72px] h-11 px-2 text-center text-lg font-black rounded-lg border-2 outline-none transition disabled:cursor-not-allowed ${
              isInvalid
                ? "border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-200"
                : isValid
                  ? "border-green-400 bg-green-50 text-green-800 focus:ring-2 focus:ring-green-200"
                  : "border-gray-200 bg-gray-50 text-gray-700 focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 focus:bg-white"
            }`}
          />
        </div>

        {/* Progress area */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">
              {isValid ? `${numVal}` : "—"} / {criterion.maxScore} điểm
            </span>
            {isValid && (
              <span className={`text-[11px] font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-500" : "text-red-400"}`}>
                {Math.round(pct)}%
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isInvalid ? "bg-red-400" : pct >= 80 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-blue-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Validation error */}
          {isInvalid && (
            <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <IcAlert cls="w-3 h-3 flex-shrink-0" />
              Điểm không hợp lệ — tối đa {criterion.maxScore} điểm, nhập số ≥ 0
            </p>
          )}
        </div>
      </div>

      {/* Optional comment */}
      <textarea
        value={comment}
        onChange={e => onChange(criterion.id, "comment", e.target.value)}
        disabled={disabled}
        placeholder="Nhận xét cho phần này (nếu có)..."
        rows={2}
        className="w-full px-3 py-2 text-[12px] text-gray-700 rounded-lg border border-gray-100 bg-gray-50/70 placeholder-gray-300 outline-none resize-none focus:border-[#1a5ea8] focus:ring-1 focus:ring-[#1a5ea8]/10 focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
};

// ─── Main Component: Council Evaluation E-Form (SC-COUNCIL-02) ────────────────────

const CouncilEvalForm = () => {
  // ── Left panel state ──
  const [activeDocTab, setActiveDocTab] = useState("thuyetminh");
  const [zoom,         setZoom]         = useState(100);
  const [page,         setPage]         = useState(1);

  // ── Form state ──
  const [scores,              setScores]              = useState(mkScores);
  const [conclusion,          setConclusion]          = useState("");
  const [grade,               setGrade]               = useState("");
  const [gradeAutoSuggested,  setGradeAutoSuggested]  = useState(false);
  const [confirmOpen,         setConfirmOpen]         = useState(false);
  const [submitted,           setSubmitted]           = useState(false);
  const [toast,               setToast]               = useState({ visible: false, msg: "" });

  // ── Toast auto-dismiss ──
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "" }), 5000);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  // ── Derived: per-criterion validity ──
  const criteriaState = CRITERIA.map(c => {
    const raw = scores[c.id].score;
    const v   = parseFloat(raw);
    const filled   = raw !== "";
    const invalid  = filled && (isNaN(v) || v < 0 || v > c.maxScore);
    const valid    = filled && !invalid;
    return { ...c, raw, v: valid ? v : 0, filled, invalid, valid };
  });

  // ── Derived: total score (sum of only valid inputs) ──
  const totalScore = criteriaState.reduce((sum, c) => sum + c.v, 0);

  // ── Derived: all criteria valid ──
  const allCriteriaValid = criteriaState.every(c => c.valid);

  // ── AUTO-SUGGEST GRADE via useEffect ──
  useEffect(() => {
    if (allCriteriaValid) {
      const suggested = suggestGrade(totalScore);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrade(suggested);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradeAutoSuggested(true);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradeAutoSuggested(false);
    }
  }, [totalScore, allCriteriaValid]);
  
  // ── STRICT canSave logic ──
  const canSave =
    allCriteriaValid &&                 // (1) all 6 scores filled & valid
    totalScore <= MAX_TOTAL &&          // (2) total <= 100
    conclusion.trim().length > 0 &&    // (3) conclusion not empty
    grade !== "" &&                    // (4) grade selected
    !submitted;                        // not already submitted

  // ── Handlers ──
  const handleScoreChange = (id, field, value) => {
    setScores(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleGradeChange = val => {
    setGrade(val);
    setGradeAutoSuggested(false);  // user override: clear auto flag
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSubmitted(true);
    setToast({ visible: true, msg: "Đã lưu phiếu đánh giá thành công. Cảm ơn bạn đã hoàn thành nhiệm vụ Hội đồng!" });
    setTimeout(() => {
      console.info("[SC-COUNCIL-02] Phiếu submitted. Redirecting to SC-COUNCIL-01...");
    }, 2000);
  };

  // ── Rendering helpers ──
  const totalPct   = Math.round((totalScore / MAX_TOTAL) * 100);
  const gradeCfg   = GRADE_CFG[grade];
  const filledCount = criteriaState.filter(c => c.valid).length;

  const totalColor =
    totalScore >= 90 ? "text-green-600"
    : totalScore >= 70 ? "text-[#1a5ea8]"
    : totalScore >= 1  ? "text-amber-500"
    : "text-gray-300";

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">

      {/* ══ Top Header ══ */}
      <header className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-[#1a5ea8] hover:text-blue-900 transition flex-shrink-0">
          <IcLeft cls="w-4 h-4" />
          Quay lại
        </button>
        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phiếu đánh giá đề tài</p>
          <h2 className="text-sm font-bold text-gray-800 truncate leading-tight mt-0.5">
            <span className="text-[#1a5ea8]">{MOCK_TOPIC.code}</span> — {MOCK_TOPIC.title}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11.5px] font-bold text-gray-700 leading-tight">{MOCK_TOPIC.evaluatorName}</p>
            <p className="text-[10px] text-[#4a7faa]">
              {MOCK_TOPIC.evaluatorRole} · {MOCK_TOPIC.council}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            NA
          </div>
          {submitted && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <IcCheck cls="w-3 h-3" />
              Đã nộp
            </span>
          )}
        </div>
      </header>

      {/* ══ Split-screen body ══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ────────────────────── Left Panel: Document Viewer (60%) ────────────────────── */}
        <div className="flex flex-col bg-[#E0E0E0]" style={{ width: "60%" }}>

          {/* File Switcher Tabs + Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-gray-300 flex-shrink-0">
            {/* File tabs */}
            <div className="flex items-center gap-1">
              {[
                { id: "thuyetminh", label: "Thuyết minh đề tài.pdf", iconCls: "text-red-500"   },
                { id: "dutoan",     label: "Dự toán kinh phí.xlsx",  iconCls: "text-green-600" },
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

            {/* PDF toolbar */}
            <div className="flex items-center gap-1">
              {/* Page navigation */}
              <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md px-2 py-1">
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

              {/* Zoom */}
              <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md px-2 py-1">
                <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-gray-500 hover:text-gray-800 transition">
                  <IcZoomOut cls="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-gray-700 mx-1 min-w-[36px] text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-gray-500 hover:text-gray-800 transition">
                  <IcZoomIn cls="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search */}
              <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition">
                <IcSearch cls="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* Document canvas */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
              <MockPDFPage page={page} />
            </div>
          </div>
        </div>

        {/* ────────────────────── Right Panel: Evaluation Form (40%) ────────────────────── */}
        <div className="flex flex-col bg-white border-l border-gray-200 shadow-2xl" style={{ width: "40%" }}>

          {/* Panel header (non-scrolling) */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IcClipboard cls="w-4 h-4 text-[#1a5ea8]" />
                <h3 className="text-sm font-bold text-gray-800">Phiếu Chấm điểm & Đánh giá</h3>
              </div>
              {/* Progress summary pill */}
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                filledCount === CRITERIA.length
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-100 border-gray-200 text-gray-500"
              }`}>
                {filledCount} / {CRITERIA.length} tiêu chí
              </span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[11px] text-gray-500">
                Vai trò: <strong className="text-gray-700">{MOCK_TOPIC.evaluatorRole}</strong>
                <span className="mx-1.5 text-gray-300">·</span>
                {MOCK_TOPIC.date} · {MOCK_TOPIC.location}
              </p>
            </div>
          </div>

          {/* ── Scrollable form body ── */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">

            {/* Scoring criteria section header */}
            <div className="flex items-center gap-2">
              <IcStar cls="w-3.5 h-3.5 text-[#1a5ea8]" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tiêu chí chấm điểm</span>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">Tổng tối đa: {MAX_TOTAL} điểm</span>
            </div>

            {/* 6 criterion rows */}
            {CRITERIA.map(c => (
              <CriterionRow
                key={c.id}
                criterion={c}
                data={scores[c.id]}
                onChange={handleScoreChange}
                disabled={submitted}
              />
            ))}

            {/* Running subtotal hint */}
            {allCriteriaValid && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
                totalScore >= 90 ? "bg-green-50 border-green-200"
                : totalScore >= 70 ? "bg-blue-50 border-blue-200"
                : "bg-amber-50 border-amber-200"
              }`}>
                <IcCheck cls={`w-4 h-4 ${totalScore >= 70 ? "text-green-500" : "text-amber-400"} flex-shrink-0`} />
                <p className="text-[12px] font-semibold text-gray-700">
                  Tổng điểm hiện tại: <strong className={totalColor}>{totalScore}</strong> / {MAX_TOTAL}
                  {gradeCfg && (
                    <span className={`ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full border ${gradeCfg.style}`}>
                      → {gradeCfg.short}
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="border-t border-dashed border-gray-200 my-1" />

            {/* ── Mandatory: General Conclusion ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-gray-700">
                  Kết luận chung & Kiến nghị của chuyên gia
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <span className="text-[10px] text-gray-400">Bắt buộc</span>
              </div>
              <textarea
                value={conclusion}
                onChange={e => setConclusion(e.target.value)}
                disabled={submitted}
                placeholder="Nhập kết luận tổng thể về chất lượng đề tài, nhận định về tính khả thi, các kiến nghị cụ thể về điều chỉnh nội dung, phương pháp, kinh phí (nếu có)..."
                rows={5}
                className={`w-full px-3.5 py-3 text-sm text-gray-800 placeholder-gray-400 rounded-lg outline-none resize-none transition border disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed ${
                  conclusion.trim()
                    ? "border-[#1a5ea8] ring-2 ring-[#1a5ea8]/10 bg-white"
                    : "border-gray-200 hover:border-gray-300 focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/10 bg-white"
                }`}
              />
              {!conclusion.trim() && !submitted && (
                <p className="text-[11px] text-amber-600 flex items-center gap-1">
                  <IcAlert cls="w-3 h-3 flex-shrink-0" />
                  Cần điền kết luận chung trước khi lưu phiếu
                </p>
              )}
            </div>

            {/* ── Mandatory: Grade Dropdown (with auto-suggest) ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-gray-700">
                  Kết luận xếp loại
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                {gradeAutoSuggested && grade && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    <IcSparkle cls="w-2.5 h-2.5" />
                    Gợi ý tự động
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  value={grade}
                  onChange={e => handleGradeChange(e.target.value)}
                  disabled={submitted}
                  className={`h-11 w-full pl-4 pr-9 rounded-lg border-2 text-sm font-bold outline-none transition appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    grade
                      ? `${GRADE_CFG[grade]?.style ?? ""} border-current`
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                >
                  {GRADE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IcChevDown cls="w-4 h-4 text-gray-400" />
                </span>
              </div>
              <p className="text-[10.5px] text-gray-400 leading-relaxed flex items-start gap-1">
                <IcSparkle cls="w-3 h-3 flex-shrink-0 mt-0.5 text-purple-400" />
                Xếp loại được gợi ý tự động từ tổng điểm khi đủ 6 tiêu chí. Bạn có thể thay đổi thủ công.
              </p>
            </div>

            {/* Bottom spacer */}
            <div className="h-1" />
          </div>

          {/* ── Sticky Footer ── */}
          <div className="border-t border-gray-200 bg-white px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
            {/* Total score display */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tổng điểm</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-2xl font-black leading-none transition-colors ${totalColor}`}>
                  {allCriteriaValid ? totalScore : "—"}
                </span>
                <span className="text-sm text-gray-400 font-semibold">/ {MAX_TOTAL}</span>
                {grade && allCriteriaValid && gradeCfg && (
                  <span className={`ml-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${gradeCfg.style}`}>
                    {gradeCfg.short}
                  </span>
                )}
              </div>
              {allCriteriaValid && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        totalScore >= 90 ? "bg-green-400" : totalScore >= 70 ? "bg-blue-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${totalPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{totalPct}%</span>
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="flex flex-col items-end gap-1">
              <button
                disabled={!canSave}
                onClick={() => setConfirmOpen(true)}
                className={`flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold transition ${
                  canSave
                    ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IcSave cls="w-4 h-4" />
                Lưu phiếu điểm
              </button>
              {!canSave && !submitted && (
                <p className="text-[9.5px] text-gray-400 text-right max-w-[160px] leading-snug">
                  {!allCriteriaValid ? "Cần điền đủ 6 tiêu chí hợp lệ"
                    : !conclusion.trim() ? "Cần điền kết luận chung"
                    : grade === "" ? "Cần chọn mức xếp loại"
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <ConfirmModal
          totalScore={totalScore}
          grade={grade}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast */}
      {toast.visible && <Toast msg={toast.msg} />}
    </div>
  );
};

export default CouncilEvalForm;