// File: src/pages/SubmissionForm.jsx

import { useState, useEffect } from "react";

// 1. KÉO DỮ LIỆU TỪ FILE MOCK VÀO
import {
  STEPS,
  RESEARCH_TYPES,
  SCIENCE_FIELDS,
  MEMBER_ROLES,
  PI_INFO,
  EMPTY_FORM
} from "../mocks/submissionMock";

// ─── SVG Factory ─────────────────────────────────────────────────────────────────

const Svg = ({ d, cls = "w-5 h-5", sw = 2 }) => (
  <svg className={`flex-shrink-0 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
    {[].concat(d).map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
  </svg>
);

const IcLeft    = p => <Svg {...p} d="M10 19l-7-7m0 0l7-7m-7 7h18" />;
const IcCheck   = p => <Svg {...p} d="M5 13l4 4L19 7" />;
const IcUpload  = p => <Svg {...p} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />;
const IcTrash   = p => <Svg {...p} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />;
const IcPlus    = p => <Svg {...p} sw={2.5} d="M12 4v16m8-8H4" />;
const IcSave    = p => <Svg {...p} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />;
const IcSend    = p => <Svg {...p} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />;

// ─── Shared UI Components ────────────────────────────────────────────────────────

const fieldBorder = "border border-[#a8d4f0] bg-white rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-150";

const RichField = ({ label, required, multiline = false, rows = 4, placeholder = "Nhập nội dung...", value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 leading-snug">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {multiline ? (
      <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-3.5 py-2.5 resize-none ${fieldBorder}`} />
    ) : (
      <input type="text" placeholder={placeholder} value={value} onChange={onChange} className={`w-full h-10 px-3.5 ${fieldBorder}`} />
    )}
  </div>
);

const PlainField = ({ label, required, type = "text", placeholder = "Nhập nội dung...", value, onChange, readOnly = false }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly}
      className={`w-full h-10 px-3.5 rounded-lg text-sm outline-none transition duration-150 ${readOnly ? "bg-gray-100 border border-gray-200 text-gray-600 cursor-default" : fieldBorder}`}
    />
  </div>
);

const SelectField = ({ label, required, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select value={value} onChange={onChange} className={`w-full h-10 px-3.5 cursor-pointer ${fieldBorder}`}>
      <option value="">Chọn nội dung...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const FileDropzone = ({ label, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
    <label className="flex items-center justify-center gap-2.5 px-4 py-6 rounded-lg border-2 border-dashed border-[#a8d4f0] bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition group">
      <IcUpload cls="w-5 h-5 text-[#1a5ea8]" />
      <span className="text-sm font-semibold text-[#1a5ea8]">Kéo thả hoặc nhấn để chọn tệp đính kèm</span>
      <input type="file" className="hidden" />
    </label>
    {hint && <p className="text-xs text-gray-400 italic leading-relaxed">{hint}</p>}
  </div>
);

// ─── Step Components ─────────────────────────────────────────────────────────────

const Step1 = ({ form, set }) => (
  <div className="flex flex-col gap-5 max-w-4xl mx-auto">
    <RichField label="Tên đề tài (Tiếng Việt)" required value={form.titleVN} onChange={set("titleVN")} />
    <RichField label="Tên đề tài (Tiếng Anh)" value={form.titleEN} onChange={set("titleEN")} placeholder="Enter title in English..." />
    <div className="grid grid-cols-3 gap-4">
      <SelectField label="Loại hình nghiên cứu" required options={RESEARCH_TYPES} value={form.researchType} onChange={set("researchType")} />
      <SelectField label="Lĩnh vực Khoa học" required options={SCIENCE_FIELDS} value={form.scienceField} onChange={set("scienceField")} />
      <PlainField  label="Mã số chuyên ngành" value={form.specialtyCode} onChange={set("specialtyCode")} placeholder="VD: 48 06 01" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <PlainField label="Thời gian thực hiện (tháng)" type="number" value={form.duration} onChange={set("duration")} placeholder="VD: 24" />
      <PlainField label="Ngày bắt đầu dự kiến" required type="date" value={form.startDate} onChange={set("startDate")} />
    </div>
  </div>
);

const Step2 = ({ form, set }) => (
  <div className="flex flex-col gap-5 max-w-4xl mx-auto">
    <RichField label="Tổng quan tình hình nghiên cứu (Trong và ngoài nước)" required multiline rows={8} value={form.overview} onChange={set("overview")} />
    <RichField label="Tính cấp thiết của đề tài" required multiline rows={5} value={form.urgency} onChange={set("urgency")} />
  </div>
);

const Step3 = ({ form, set }) => (
  <div className="flex flex-col gap-5 max-w-4xl mx-auto">
    <div className="grid grid-cols-2 gap-4">
      <RichField label="Mục tiêu tổng quát" required multiline rows={5} value={form.generalObj}  onChange={set("generalObj")} />
      <RichField label="Mục tiêu cụ thể"    required multiline rows={5} value={form.specificObj} onChange={set("specificObj")} />
    </div>
    <PlainField label="Đối tượng và phạm vi nghiên cứu" required value={form.researchScope} onChange={set("researchScope")} />
    <div className="grid grid-cols-2 gap-4">
      <RichField label="Nội dung nghiên cứu chính"   required multiline rows={6} value={form.researchContent} onChange={set("researchContent")} />
      <RichField label="Phương pháp / Cách tiếp cận" required multiline rows={6} value={form.methodology}     onChange={set("methodology")} />
    </div>
  </div>
);

const Step4 = ({ form, set }) => (
  <div className="flex flex-col gap-5 max-w-4xl mx-auto">
    <RichField label="Sản phẩm khoa học (Dạng I - Bài báo, sách...)"  required multiline rows={3} value={form.product1} onChange={set("product1")} />
    <RichField label="Sản phẩm khoa học (Dạng II - Phần mềm, thiết bị...)" multiline rows={3} value={form.product2} onChange={set("product2")} placeholder="(Không bắt buộc)" />
    <div className="grid grid-cols-2 gap-4">
      <PlainField label="Dự toán kinh phí tổng thể (VNĐ)" value={form.budget} onChange={set("budget")} placeholder="VD: 150000000" />
      <FileDropzone label="Bản file Dự toán chi tiết (Excel)" />
    </div>
  </div>
);

const Step5 = ({ members, setMembers }) => {
  const addMember = () => setMembers(m => [...m, { id: Date.now(), name: "", unit: "", role: "" }]);
  const removeMember = (id) => setMembers(m => m.filter(x => x.id !== id));
  const updateMember = (id, field, val) => setMembers(m => m.map(x => (x.id === id ? { ...x, [field]: val } : x)));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Read-only PI */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <p className="text-sm font-bold text-[#1a5ea8] mb-3 uppercase tracking-wider">Chủ nhiệm đề tài</p>
        <div className="grid grid-cols-3 gap-3">
          <PlainField label="Họ và tên" value={PI_INFO.name} readOnly />
          <PlainField label="Đơn vị công tác" value={PI_INFO.unit} readOnly />
          <PlainField label="Email liên hệ" value={PI_INFO.email} readOnly />
        </div>
      </div>

      {/* Dynamic Members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-800">Thành viên tham gia nghiên cứu</p>
          <button type="button" onClick={addMember} className="flex items-center gap-1.5 text-xs font-bold text-[#1a5ea8] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
            <IcPlus cls="w-3.5 h-3.5" /> Thêm thành viên
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {members.map((m, idx) => (
            <div key={m.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <PlainField label={idx === 0 ? "Họ và tên" : ""} placeholder="Nhập họ tên..." value={m.name} onChange={e => updateMember(m.id, "name", e.target.value)} />
              <PlainField label={idx === 0 ? "Đơn vị công tác" : ""} placeholder="Nhập cơ quan..." value={m.unit} onChange={e => updateMember(m.id, "unit", e.target.value)} />
              <SelectField label={idx === 0 ? "Vai trò" : ""} options={MEMBER_ROLES} value={m.role} onChange={e => updateMember(m.id, "role", e.target.value)} />
              <button type="button" onClick={() => removeMember(m.id)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                <IcTrash cls="w-4 h-4" />
              </button>
            </div>
          ))}
          {members.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4 border-2 border-dashed rounded-lg">Chưa có thành viên nào được thêm.</p>}
        </div>
      </div>

      {/* Attachments */}
      <div className="border-t border-gray-200 pt-5">
        <FileDropzone label="Tài liệu đính kèm (Thuyết minh toàn văn)" hint="Định dạng: PDF. Dung lượng tối đa: 25MB." />
      </div>
    </div>
  );
};

// ─── Main Component: Submission Form ─────────────────────────────────────────────

const SubmissionForm = () => {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [members, setMembers] = useState([]);
  const [toast, setToast]     = useState({ visible: false, msg: "", type: "success" });

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const showToast = (msg, type = "success") => setToast({ visible: true, msg, type });

  const handleSaveDraft = () => showToast("Đã lưu bản nháp thành công!", "success");
  
  const handleSubmit = () => {
    showToast("Hồ sơ đề tài đã được gửi đi chờ xét duyệt!", "success");
    // Giả lập redirect sau khi gửi
    setTimeout(() => console.log("Redirecting to Dashboard..."), 1500);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F4F5F7] overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a5ea8] transition px-3 py-1.5 rounded-lg hover:bg-blue-50">
            <IcLeft cls="w-4 h-4" /> Quay lại
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Đăng ký Đề tài Nghiên cứu</h1>
            <p className="text-xs font-semibold text-[#1a5ea8] mt-0.5">Biểu mẫu trực tuyến</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
            <IcSave cls="w-4 h-4" /> Lưu nháp
          </button>
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-start max-w-4xl w-full pt-1 pb-4">
          {STEPS.map((s, idx) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} className="flex items-start flex-1 last:flex-none">
                {/* Tăng w-24 lên w-32 để có thêm không gian */}
                <div className={`flex flex-col items-center gap-2 w-32 relative z-10 cursor-pointer ${done || active ? 'opacity-100' : 'opacity-50'}`} onClick={() => setStep(s.id)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done ? "bg-green-500 text-white" : active ? "bg-[#1a5ea8] text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"
                  }`}>
                    {done ? <IcCheck cls="w-4 h-4" /> : s.id}
                  </div>
                  
                  {/* FIX LỖI TRÀN CHỮ: Bỏ whitespace-nowrap, thêm w-full và leading-tight để chữ tự động rớt dòng đều đẹp */}
                  <span className={`text-[11px] font-bold text-center absolute top-10 w-full leading-tight px-1 ${active ? "text-[#1a5ea8]" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
                
                {/* Đường nối giữa các bước (căn chỉnh margin top để nằm giữa hình tròn) */}
                {idx < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-[-16px] mt-3.5 rounded-full z-0 transition-colors ${done ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Form Content ── */}
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-28">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
            {STEPS.find(s => s.id === step)?.label}
          </h2>
          {step === 1 && <Step1 form={form} set={setField} />}
          {step === 2 && <Step2 form={form} set={setField} />}
          {step === 3 && <Step3 form={form} set={setField} />}
          {step === 4 && <Step4 form={form} set={setField} />}
          {step === 5 && <Step5 members={members} setMembers={setMembers} />}
        </div>
      </div>

      {/* ── Footer Navigation ── */}
      <footer className="bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center flex-shrink-0 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="w-[300px]">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 h-10 px-5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              <IcLeft cls="w-4 h-4" /> Bước trước
            </button>
          )}
        </div>
        
        {/* Indicators */}
        <div className="flex gap-1.5">
          {STEPS.map(s => (
            <div key={s.id} className={`w-2 h-2 rounded-full transition-colors ${s.id === step ? "bg-[#1a5ea8]" : "bg-gray-200"}`} />
          ))}
        </div>

        <div className="w-[300px] flex justify-end">
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex items-center justify-center gap-2 h-10 px-8 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm">
              Tiếp tục
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex items-center justify-center gap-2 h-10 px-8 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition shadow-sm">
              <IcSend cls="w-4 h-4" /> Nộp Hồ Sơ Đề Tài
            </button>
          )}
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl bg-green-600 text-white text-sm font-semibold animate-fade-in">
          <IcCheck cls="w-5 h-5 flex-shrink-0" />
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;