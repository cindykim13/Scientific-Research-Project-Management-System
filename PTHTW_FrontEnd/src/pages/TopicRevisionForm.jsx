// File: src/pages/TopicRevisionForm.jsx

import { useState, useRef, useCallback } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// KÉO DỮ LIỆU TỪ FILE MOCK VÀO ĐÂY
import {
  MOCK_TOPIC,
  COUNCIL_FEEDBACK,
  SEVERITY_CFG,
  INITIAL_FORM
} from "../mocks/topicRevisionMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2, fill = "none" }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcLeft       = p => <Svg {...p} d="M10 19l-7-7m0 0l7-7m-7 7h18" />;
const IcDoc        = p => <Svg {...p} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
const IcDownload   = p => <Svg {...p} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />;
const IcUpload     = p => <Svg {...p} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />;
const IcCheck      = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcX          = p => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcAlert      = p => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcTrash      = p => <Svg {...p} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />;
const IcClipboard  = p => <Svg {...p} d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2","M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"]} />;
const IcHistory    = p => <Svg {...p} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcStar       = p => <Svg {...p} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" fill="currentColor" sw={0} />;
const IcZoomIn     = p => <Svg {...p} d={["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"]} />;
const IcZoomOut    = p => <Svg {...p} d={["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"]} />;
const IcChevLeft   = p => <Svg {...p} d="M15 19l-7-7 7-7" />;
const IcChevRight  = p => <Svg {...p} d="M9 5l7 7-7 7" />;
const IcSend       = p => <Svg {...p} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />;
const IcSave       = p => <Svg {...p} d={["M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"]} />;
const IcInfo       = p => <Svg {...p} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const IcEdit       = p => <Svg {...p} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />;

// ─── Toast ───────────────────────────────────────────────────────────────────────

const Toast = ({ msg }) => (
  <div className="fixed top-5 right-5 z-[200] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl bg-green-600 text-white text-sm font-semibold max-w-sm pointer-events-none">
    <IcCheck cls="w-5 h-5 flex-shrink-0 mt-0.5" />
    <span className="leading-snug">{msg}</span>
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────────

const ConfirmModal = ({ newFile, onClose, onConfirm }) => {
  const [importing, setImporting] = useState(false);

  const handleConfirm = () => {
    setImporting(true);
    setTimeout(() => { setImporting(false); onConfirm(); }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <IcSend cls="w-5 h-5 text-[#1a5ea8]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900 leading-tight">Xác nhận nộp lại hồ sơ</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">SC-RES-04 · {MOCK_TOPIC.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <IcX cls="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Bản chỉnh sửa và giải trình của bạn sẽ được gửi đến <strong className="text-gray-800">Phòng Quản lý Khoa học</strong> để nghiệm thu lại. Sau khi nộp bạn không thể chỉnh sửa hồ sơ này cho đến khi có phản hồi mới.
          </p>

          {/* Submission summary */}
          <div className="bg-[#eaf5fc] rounded-xl border border-blue-100 p-4 flex flex-col gap-2.5">
            <p className="text-[10px] font-bold text-[#1a5ea8] uppercase tracking-wider">Tóm tắt hồ sơ nộp</p>
            <div className="flex items-center gap-2">
              <IcDoc cls="w-4 h-4 text-[#1a5ea8]" />
              <span className="text-[12.5px] font-semibold text-gray-700">
                {newFile ? newFile.name : "Thuyết_minh_v1.pdf"}
                {newFile && <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">v2 mới</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IcClipboard cls="w-4 h-4 text-[#1a5ea8]" />
              <span className="text-[12.5px] font-semibold text-gray-700">Kèm giải trình chỉnh sửa</span>
            </div>
            <div className="flex items-center gap-2">
              <IcAlert cls="w-4 h-4 text-amber-500" />
              <span className="text-[12px] text-amber-700">
                {COUNCIL_FEEDBACK.items.filter(i => i.severity === "high").length} yêu cầu bắt buộc đã được xử lý
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={importing} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={importing}
            className="flex-1 h-10 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-70 disabled:cursor-wait"
          >
            {importing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Đang gửi...
              </>
            ) : (
              <><IcSend cls="w-4 h-4" />Xác nhận nộp lại</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Component độc lập: Field nhập liệu (Đã tách ra ngoài để fix lỗi Cascading Renders) ──────────

const Field = ({ label, name, rows, hint, mandatory = false, form, setForm }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12.5px] font-bold text-gray-700 leading-none">
      {label} {mandatory && <span className="text-red-500 ml-0.5">*</span>}
      {hint && <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">{hint}</span>}
    </label>
    {rows ? (
      <textarea
        value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        rows={rows}
        className="resize-none rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/20 text-[12.5px] text-gray-700 leading-relaxed px-3.5 py-3 outline-none transition placeholder:text-gray-400"
      />
    ) : (
      <input
        type="text"
        value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/20 text-[12.5px] text-gray-700 px-3.5 outline-none transition"
      />
    )}
  </div>
);

// ─── Section 1: Content Form ──────────────────────────────────────────────────────

const ContentSection = ({ form, setForm }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-1">
        <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">1</span>
        <h2 className="text-[14px] font-bold text-gray-800">Nội dung đề tài</h2>
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 ml-1">
          <IcEdit cls="w-3 h-3 text-[#1a5ea8]" />
          <span className="text-[10px] font-bold text-[#1a5ea8]">Đang chỉnh sửa</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {/* Truyền form và setForm xuống Field component độc lập */}
        <Field label="Tên đề tài (Tiếng Việt)" name="title"     mandatory form={form} setForm={setForm} />
        <Field label="Tên đề tài (Tiếng Anh)"  name="titleEn"   hint="(tuỳ chọn)" form={form} setForm={setForm} />
        <Field label="Mục tiêu nghiên cứu"      name="objectives" rows={4} mandatory hint="— đã chỉnh sửa theo yêu cầu HĐ" form={form} setForm={setForm} />
        <Field label="Đối tượng & Phạm vi"       name="scope"     rows={3} mandatory form={form} setForm={setForm} />
        <Field label="Phương pháp nghiên cứu"   name="methods"   rows={4} mandatory form={form} setForm={setForm} />
        <Field label="Sản phẩm dự kiến"         name="products"  rows={2} form={form} setForm={setForm} />
      </div>
    </div>
  );
};


// ─── Left Panel: Council Minutes Tab ─────────────────────────────────────────────

const CouncilMinutesTab = () => {
  const [checked, setChecked] = useState([]);
  const toggle = id => setChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="flex flex-col">
      {/* Score card */}
      <div className="mx-4 mt-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-stretch divide-x divide-gray-100">
          <div className="flex-1 p-4 flex flex-col items-center justify-center gap-1">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-[#1a5ea8]">{COUNCIL_FEEDBACK.avgScore}</span>
              <span className="text-sm font-bold text-gray-400 mb-1">/100</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <IcStar key={s} cls={`w-3 h-3 ${s <= Math.round(COUNCIL_FEEDBACK.avgScore/20) ? "text-amber-400" : "text-gray-200"}`} />
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Điểm TB</p>
          </div>
          <div className="flex-1 p-4 flex flex-col justify-center gap-1">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wide">
              {COUNCIL_FEEDBACK.decision}
            </span>
            <p className="text-[11px] text-gray-500 leading-snug mt-1">{COUNCIL_FEEDBACK.decisionSub}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/60 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-medium">HĐ phê duyệt: {COUNCIL_FEEDBACK.reviewer}</span>
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            Hạn: {COUNCIL_FEEDBACK.deadline}
          </span>
        </div>
      </div>

      {/* Required changes */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Yêu cầu chỉnh sửa ({COUNCIL_FEEDBACK.items.length})
          </p>
          <span className="text-[10px] font-semibold text-green-600">
            {checked.length}/{COUNCIL_FEEDBACK.items.length} đã xử lý
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${(checked.length / COUNCIL_FEEDBACK.items.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4">
        {COUNCIL_FEEDBACK.items.map(item => {
          const cfg = SEVERITY_CFG[item.severity];
          const isDone = checked.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full text-left flex gap-3 p-3.5 rounded-xl border transition-all ${
                isDone
                  ? "bg-green-50 border-green-200"
                  : `${cfg.bg} ${cfg.border}`
              }`}
            >
              {/* Checkbox area */}
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition ${
                isDone ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
              }`}>
                {isDone && <IcCheck cls="w-3 h-3 text-white" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isDone ? "bg-green-100 text-green-700" : `${cfg.bg} ${cfg.text}`
                  }`}>
                    {isDone ? "Đã xử lý" : cfg.label}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{item.section}</span>
                </div>
                <p className={`text-[11.5px] leading-snug mt-1 ${isDone ? "text-gray-400 line-through" : "text-gray-700"}`}>
                  {item.content}
                </p>
              </div>
            </button>
          );
        })}
        <p className="text-[10px] text-gray-400 text-center mt-1">
          Click vào từng mục để đánh dấu đã xử lý
        </p>
      </div>
    </div>
  );
};

// ─── Left Panel: Old Version PDF Tab ─────────────────────────────────────────────

const OldVersionTab = () => {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const TOTAL_PAGES = 8;

  return (
    <div className="flex flex-col h-full">
      {/* File tab */}
      <div className="flex border-b border-gray-200 bg-white px-3 pt-2 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-t-lg bg-[#eaf5fc] border border-b-0 border-blue-100 text-xs font-semibold text-[#1a5ea8]">
          <IcDoc cls="w-3.5 h-3.5" />
          Thuyết_minh_v1.pdf
          <span className="ml-1 text-[9px] font-bold bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">v1</span>
        </div>
      </div>

      {/* PDF Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition">
            <IcChevLeft cls="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-gray-600 px-2">
            {page} / {TOTAL_PAGES}
          </span>
          <button onClick={() => setPage(p => Math.min(TOTAL_PAGES, p+1))} disabled={page===TOTAL_PAGES}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition">
            <IcChevRight cls="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(60, z-10))}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
            <IcZoomOut cls="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-gray-500 w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z+10))}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 transition">
            <IcZoomIn cls="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document canvas */}
      <div className="flex-1 overflow-auto bg-[#E0E0E0] p-4 flex justify-center">
        <div
          className="bg-white shadow-md rounded-sm origin-top transition-all"
          style={{ width: `${zoom}%`, minWidth: 200 }}
        >
          <div className="px-8 py-10 flex flex-col gap-4" style={{ fontSize: "0.65rem" }}>
            <div className="text-center border-b border-gray-300 pb-6 flex flex-col gap-1">
              <p className="font-bold text-[9px] uppercase tracking-widest text-gray-500">Trường Đại học Mở TP.HCM</p>
              <p className="font-black text-[13px] text-gray-900 mt-2 leading-tight">THUYẾT MINH ĐỀ TÀI KHOA HỌC CẤP TRƯỜNG</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Mã số: {MOCK_TOPIC.code} · Ngày nộp: {MOCK_TOPIC.submittedDate}</p>
            </div>
            <div className="flex flex-col gap-2 text-gray-700">
              <p className="font-bold text-[9px] uppercase tracking-wider text-gray-500 mt-2">I. Thông tin chung</p>
              {[
                ["Tên đề tài", MOCK_TOPIC.title],
                ["Chủ nhiệm", MOCK_TOPIC.pi],
                ["Đơn vị", MOCK_TOPIC.unit],
                ["Thời gian", "24 tháng (01/01/2026 – 31/12/2027)"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="font-bold flex-shrink-0 w-20 text-gray-500">{k}:</span>
                  <span className="text-gray-700">{v}</span>
                </div>
              ))}
              <p className="font-bold text-[9px] uppercase tracking-wider text-gray-500 mt-3">II. Mục tiêu & Nội dung</p>
              <p className="text-gray-600 leading-relaxed">{INITIAL_FORM.objectives}</p>
              <p className="font-bold text-[9px] uppercase tracking-wider text-gray-500 mt-3">III. Phương pháp</p>
              <p className="text-gray-600 leading-relaxed">{INITIAL_FORM.methods}</p>
              {page > 4 && (
                <>
                  <p className="font-bold text-[9px] uppercase tracking-wider text-gray-500 mt-3">IV. Dự toán Kinh phí</p>
                  <p className="text-gray-400 italic">Trang {page} — Nội dung dự toán chi tiết...</p>
                </>
              )}
            </div>
            <p className="text-center text-[9px] text-gray-300 mt-6">— Trang {page}/{TOTAL_PAGES} —</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Left Panel ───────────────────────────────────────────────────────────────────

const LeftPanel = () => {
  const [tab, setTab] = useState("minutes");
  return (
    <div className="flex flex-col w-[40%] min-w-0 flex-shrink-0 bg-[#F4F5F7] border-r border-gray-200 overflow-hidden">
      {/* Tab nav */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        {[
          { id: "minutes", label: "Biên bản Hội đồng", icon: <IcClipboard cls="w-3.5 h-3.5" /> },
          { id: "oldver",  label: "Hồ sơ phiên bản cũ", icon: <IcHistory cls="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition border-b-2 ${
              tab === t.id
                ? "border-[#1a5ea8] text-[#1a5ea8] bg-[#eaf5fc]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {tab === "minutes" ? <CouncilMinutesTab /> : <OldVersionTab />}
      </div>
    </div>
  );
};


// ─── Section 2: File Versioning ───────────────────────────────────────────────────

const FileVersioningSection = ({ newFile, setNewFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setNewFile({ name: file.name.replace(/\.pdf$/i, "_v2.pdf"), size: (file.size / 1024 / 1024).toFixed(1) + " MB", raw: file });
  }, [setNewFile]);

  const handleFileInput = e => {
    const file = e.target.files?.[0];
    if (file) setNewFile({ name: file.name.replace(/\.pdf$/i, "_v2.pdf"), size: (file.size / 1024 / 1024).toFixed(1) + " MB", raw: file });
  };

  // Mock upload shortcut for demo
  const handleMockUpload = () => {
    setNewFile({ name: "Thuyết_minh_v2.pdf", size: "2.8 MB", raw: null });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-1">
        <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">2</span>
        <h2 className="text-[14px] font-bold text-gray-800">Cập nhật Tệp đính kèm</h2>
      </div>

      {/* Existing v1 file */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tệp hiện tại</p>
        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
          newFile ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200 shadow-sm"
        }`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${newFile ? "bg-gray-100" : "bg-red-50"}`}>
            <IcDoc cls={`w-5 h-5 ${newFile ? "text-gray-400" : "text-red-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[13px] font-bold leading-tight ${newFile ? "text-gray-400 line-through" : "text-gray-700"}`}>
              Thuyết_minh_v1.pdf
            </p>
            <p className={`text-[11px] mt-0.5 ${newFile ? "text-gray-300" : "text-gray-400"}`}>
              2.4 MB · Nộp ngày {MOCK_TOPIC.submittedDate}
              {newFile && <span className="ml-2 font-semibold text-gray-400">— Đã thay thế bởi v2</span>}
            </p>
          </div>
          {!newFile && (
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition flex-shrink-0">
              <IcDownload cls="w-3.5 h-3.5" />
              Tải xuống
            </button>
          )}
          {newFile && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">Phiên bản cũ</span>
          )}
        </div>

        {/* New v2 file (shown after upload) */}
        {newFile && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-green-300 bg-green-50 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <IcDoc cls="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[13px] font-bold text-gray-800 leading-tight">{newFile.name}</p>
                <span className="text-[9px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">New v2</span>
              </div>
              <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                {newFile.size} · Vừa tải lên
              </p>
            </div>
            <button
              onClick={() => setNewFile(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-100 hover:text-red-600 transition flex-shrink-0"
              title="Xóa tệp mới"
            >
              <IcTrash cls="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Dropzone (hidden if v2 is already uploaded) */}
      {!newFile && (
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tải lên bản chỉnh sửa mới</p>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={handleMockUpload}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-8 px-6 cursor-pointer transition-all ${
              isDragging
                ? "border-[#1a5ea8] bg-[#eaf5fc] scale-[1.01]"
                : "border-gray-300 bg-gray-50/60 hover:border-[#1a5ea8] hover:bg-[#eaf5fc]/60"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isDragging ? "bg-[#c5e2f5]" : "bg-gray-100"}`}>
              <IcUpload cls={`w-6 h-6 transition ${isDragging ? "text-[#1a5ea8]" : "text-gray-400"}`} />
            </div>
            <div className="text-center">
              <p className={`text-[13px] font-semibold ${isDragging ? "text-[#1a5ea8]" : "text-gray-600"}`}>
                {isDragging ? "Thả tệp vào đây..." : "Kéo & thả tệp vào đây, hoặc click để chọn"}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Hỗ trợ định dạng PDF · Tối đa 25 MB</p>
            </div>
            <span className="text-[10px] font-bold text-[#1a5ea8] bg-[#c5e2f5] px-3 py-1 rounded-full">
              Tải lên bản (v2)
            </span>
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
        </div>
      )}
    </div>
  );
};

// ─── Section 3: Rebuttal ─────────────────────────────────────────────────────────

const RebuttalSection = ({ rebuttalText, setRebuttalText }) => {
  const highItems = COUNCIL_FEEDBACK.items.filter(i => i.severity === "high");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-1">
        <span className="w-6 h-6 rounded-full bg-[#c5e2f5] flex items-center justify-center text-[#1a5ea8] text-[11px] font-black">3</span>
        <h2 className="text-[14px] font-bold text-gray-800">
          Giải trình chỉnh sửa
          <span className="text-red-500 ml-1">*</span>
        </h2>
        <span className="text-[10px] text-red-500 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full ml-1">Bắt buộc</span>
      </div>

      {/* Required items reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex gap-3">
        <IcAlert cls="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-bold text-amber-800">Vui lòng giải trình rõ từng nội dung Hội đồng yêu cầu:</p>
          <ul className="flex flex-col gap-1">
            {highItems.map(item => (
              <li key={item.id} className="flex items-start gap-2 text-[11.5px] text-amber-700">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">[{item.section}]</span>
                <span>{item.content.substring(0, 60)}...</span>
              </li>
            ))}
            {COUNCIL_FEEDBACK.items.filter(i => i.severity !== "high").map(item => (
              <li key={item.id} className="flex items-start gap-2 text-[11px] text-amber-600">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">[{item.section}]</span>
                <span>{item.content.substring(0, 55)}...</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-gray-700">
          Nội dung giải trình chi tiết <span className="text-red-500">*</span>
        </label>
        <textarea
          value={rebuttalText}
          onChange={e => setRebuttalText(e.target.value)}
          placeholder="Mô tả chi tiết những thay đổi bạn đã thực hiện để đáp ứng từng yêu cầu của Hội đồng. Ví dụ:&#10;&#10;1. [Mục III – Rủi ro] Đã bổ sung toàn bộ Mục III.4 về đánh giá rủi ro, bao gồm:...&#10;2. [Mục II – Đối tượng] Đã làm rõ đối tượng nghiên cứu: tập trung vào X-quang phổi và MRI não..."
          rows={10}
          className="resize-none rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/20 text-[12.5px] text-gray-700 leading-relaxed px-4 py-4 outline-none transition placeholder:text-gray-400"
        />
        <div className="flex items-center justify-between">
          <p className={`text-[11px] font-medium ${rebuttalText.trim() ? "text-green-600" : "text-gray-400"}`}>
            {rebuttalText.trim()
              ? <><IcCheck cls="w-3 h-3 inline mr-1" />Nội dung hợp lệ</>
              : "Trường này là bắt buộc để nộp hồ sơ"}
          </p>
          <p className="text-[11px] text-gray-400">{rebuttalText.length} ký tự</p>
        </div>
      </div>
    </div>
  );
};

// ─── Sticky Footer ────────────────────────────────────────────────────────────────

const StickyFooter = ({ canSubmit, onDraft, onSubmit, submitted }) => (
  <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
    <div className="flex items-center gap-2 min-w-0">
      {!canSubmit && !submitted && (
        <div className="flex items-center gap-2 text-[11.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <IcInfo cls="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
          Nhập nội dung giải trình (Mục 3) để mở khoá nút Nộp lại
        </div>
      )}
      {submitted && (
        <div className="flex items-center gap-2 text-[11.5px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <IcCheck cls="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
          Hồ sơ đã được nộp thành công — đang chờ Phòng QLKH nghiệm thu
        </div>
      )}
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      <button
        onClick={onDraft}
        disabled={submitted}
        className="flex items-center gap-2 h-10 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
      >
        <IcSave cls="w-4 h-4" />
        Lưu nháp
      </button>
      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className={`flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold transition shadow-sm ${
          canSubmit
            ? "bg-[#1a5ea8] hover:bg-[#15306a] text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <IcSend cls="w-4 h-4" />
        {submitted ? "Đã nộp lại" : "Nộp lại bản chỉnh sửa"}
      </button>
    </div>
  </div>
);

// ─── Main Component: Topic Revision Form (SC-RES-04) ─────────────────────────────

const TopicRevisionForm = () => {
  const [form,         setForm]         = useState(INITIAL_FORM);
  const [newFile,      setNewFile]      = useState(null);
  const [rebuttalText, setRebuttalText] = useState("");
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [toast,        setToast]        = useState({ visible: false, msg: "" });
  const [draftSaved,   setDraftSaved]   = useState(false);

  const canSubmit = rebuttalText.trim().length > 0 && !submitted;

  const handleDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSubmitted(true);
    setToast({ visible: true, msg: "Đã nộp hồ sơ chỉnh sửa thành công! Phòng QLKH sẽ nghiệm thu trong 5–7 ngày làm việc." });
    setTimeout(() => setToast({ visible: false, msg: "" }), 5000);
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SC-RES-04 · Chủ nhiệm đề tài</p>
            <h1 className="text-sm font-bold text-gray-800 truncate leading-tight">
              Cập nhật Hồ sơ Đề tài —{" "}
              <span className="text-[#1a5ea8]">{MOCK_TOPIC.code}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Deadline badge */}
          <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] font-bold text-red-600">Hạn nộp: {COUNCIL_FEEDBACK.deadline}</span>
          </div>
          {/* Auto-save indicator */}
          {draftSaved && (
            <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg">
              <IcCheck cls="w-3 h-3" />
              Đã lưu nháp
            </span>
          )}
          {submitted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
              <IcCheck cls="w-3.5 h-3.5" />
              Đã nộp lại
            </span>
          )}
        </div>
      </header>

      {/* ── Main content area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel (Reference) */}
        <LeftPanel />

        {/* Right Panel (Editing Form) */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
          {/* Scrollable form */}
          <div className="flex-1 overflow-auto px-8 py-8 flex flex-col gap-8">

            {/* Section 1: Content */}
            <ContentSection form={form} setForm={setForm} />
            <div className="w-full h-px bg-gray-100" />

            {/* Section 2: File Versioning */}
            <FileVersioningSection newFile={newFile} setNewFile={setNewFile} />
            <div className="w-full h-px bg-gray-100" />

            {/* Section 3: Rebuttal */}
            <RebuttalSection rebuttalText={rebuttalText} setRebuttalText={setRebuttalText} />
            <div className="h-4" />
          </div>

          {/* Sticky Footer */}
          <StickyFooter
            canSubmit={canSubmit}
            submitted={submitted}
            onDraft={handleDraft}
            onSubmit={() => setConfirmOpen(true)}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <ConfirmModal
          newFile={newFile}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast */}
      {toast.visible && <Toast msg={toast.msg} />}
    </div>
  );
};

export default TopicRevisionForm;