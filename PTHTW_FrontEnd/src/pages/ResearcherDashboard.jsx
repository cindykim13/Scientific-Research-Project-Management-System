import { useState, useEffect } from "react";
import logoOU from "../assets/ADMIN/logo-ou.svg";

// ─── Universal SVG Icon ────────────────────────────────────────────────────────

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
const IcSearch   = (p) => <Svg {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcPlus     = (p) => <Svg {...p} sw={2.5} d="M12 4v16m8-8H4" />;
const IcEdit     = (p) => <Svg {...p} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />;
const IcEye      = (p) => <Svg {...p} d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />;
const IcTrash    = (p) => <Svg {...p} d={["M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"]} />;
const IcX        = (p) => <Svg {...p} d="M6 18L18 6M6 6l12 12" />;
const IcUpload   = (p) => <Svg {...p} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />;
const IcLeft     = (p) => <Svg {...p} d="M11 17l-5-5m0 0l5-5m-5 5h12" />;
const IcWarning  = (p) => <Svg {...p} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
const IcFilter   = (p) => <Svg {...p} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />;
const IcSaved    = (p) => <Svg {...p} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;

// ─── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Thông tin chung" },
  { id: 2, label: "Tổng quan" },
  { id: 3, label: "Nội dung & Phương pháp" },
  { id: 4, label: "Sản phẩm & Kinh phí" },
  { id: 5, label: "Nhân sự & Đính kèm" },
];

const RESEARCH_TYPES = ["Cơ bản", "Ứng dụng", "Triển khai thực nghiệm", "Phát triển công nghệ"];
const SCIENCE_FIELDS = ["Khoa học tự nhiên", "Khoa học xã hội", "Kỹ thuật & Công nghệ", "Khoa học y dược", "Kinh tế & Kinh doanh"];
const MEMBER_ROLES  = ["Thành viên", "Thư ký", "Phó chủ nhiệm", "Cộng tác viên"];

const EMPTY_FORM = {
  titleVN: "", titleEN: "", researchType: "", scienceField: "",
  specialtyCode: "", duration: "", startDate: "",
  overview: "", urgency: "",
  generalObj: "", specificObj: "", researchScope: "", researchContent: "", methodology: "",
  product1: "", product2: "", budget: "",
};

const PI_INFO = {
  name: "Nguyễn Thị Hoài Thương",
  unit: "Đại Học Mở TP.HCM",
  email: "2351010207thuong@ou.edu.vn",
};

const INITIAL_TOPICS = [
  { id: 1, code: "DT001", title: "Nghiên cứu ứng dụng AI trong giáo dục đại học tại Việt Nam", submittedAt: "16/2/2026", status: "pending" },
  { id: 2, code: "DT002", title: "Phát triển hệ thống quản lý học tập thông minh dựa trên dữ liệu lớn", submittedAt: "16/2/2026", status: "revision" },
  { id: 3, code: "DT003", title: "Mô hình kinh tế tuần hoàn trong ngành dệt may Việt Nam", submittedAt: "16/2/2026", status: "approved" },
  { id: 4, code: "DT004", title: "Tác động của biến đổi khí hậu đến nông nghiệp đồng bằng sông Cửu Long", submittedAt: "16/2/2026", status: "approved" },
  { id: 5, code: "DT005", title: "Giải pháp năng lượng tái tạo cho khu vực nông thôn Việt Nam", submittedAt: "16/2/2026", status: "pending" },
  { id: 6, code: "DT006", title: "Đặc điểm ngôn ngữ học của tiếng Việt hiện đại và các biến thể vùng miền", submittedAt: "10/1/2026", status: "draft" },
];

const PAGE_SIZE = 5;

// ─── Shared Field Styles ───────────────────────────────────────────────────────

const fieldBorder = "border border-[#a8d4f0] bg-white rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-150";

// ─── Form Field Components ─────────────────────────────────────────────────────

const RichToolbar = () => (
  <div className="flex items-center gap-0.5">
    {[
      { t: "B", extra: "font-black" },
      { t: "I", extra: "italic" },
      { t: "U", extra: "underline" },
      { t: "≡", extra: "" },
    ].map(({ t, extra }) => (
      <button
        key={t}
        type="button"
        className={`w-7 h-7 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200 rounded border border-gray-200 transition ${extra}`}
      >
        {t}
      </button>
    ))}
  </div>
);

const RichField = ({ label, required, multiline = false, rows = 4, placeholder = "Nhập nội dung...", value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-2 min-h-[28px]">
      <label className="text-sm font-semibold text-gray-700 leading-snug">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <RichToolbar />
    </div>
    {multiline ? (
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 resize-none ${fieldBorder}`}
      />
    ) : (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-10 px-3.5 ${fieldBorder}`}
      />
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
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full h-10 px-3.5 rounded-lg text-sm outline-none transition duration-150 ${
        readOnly
          ? "bg-gray-100 border border-gray-200 text-gray-600 cursor-default"
          : fieldBorder
      }`}
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
    <select
      value={value}
      onChange={onChange}
      className={`w-full h-10 px-3.5 cursor-pointer ${fieldBorder}`}
    >
      <option value="">Nhập nội dung...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const FileDropzone = ({ label, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
    <label className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg border-2 border-dashed border-[#a8d4f0] bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition group">
      <IcUpload cls="w-4 h-4 text-[#1a5ea8]" />
      <span className="text-sm font-semibold text-[#1a5ea8]">Kéo thả hoặc nhấn để chọn tệp</span>
      <input type="file" className="hidden" />
    </label>
    {hint && <p className="text-xs text-gray-400 italic leading-relaxed">{hint}</p>}
  </div>
);

// ─── Form Stepper ───────────────────────────────────────────────────────────────

const FormStepper = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 bg-gray-50 border-b border-gray-200 px-6 py-3 overflow-x-auto flex-shrink-0">
    {STEPS.map((step, idx) => {
      const done   = step.id < currentStep;
      const active = step.id === currentStep;
      return (
        <div key={step.id} className="flex items-center shrink-0">
          {idx > 0 && (
            <div className={`h-px w-8 mx-1 ${done ? "bg-green-400" : "bg-gray-200"}`} />
          )}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md ${active ? "bg-blue-50" : ""}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              done   ? "bg-green-500 text-white"  :
              active ? "bg-[#1a5ea8] text-white"  :
                       "bg-gray-200 text-gray-500"
            }`}>
              {done ? "✓" : step.id}
            </span>
            <span className={`text-xs font-semibold whitespace-nowrap ${
              done   ? "text-green-600"  :
              active ? "text-[#1a5ea8]"  :
                       "text-gray-400"
            }`}>
              {step.label}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Form Step Content ─────────────────────────────────────────────────────────

const Step1 = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <RichField label="Tên đề tài (Tiếng Việt)" required value={form.titleVN} onChange={set("titleVN")} />
    <RichField label="Tên đề tài (Tiếng Anh)" value={form.titleEN} onChange={set("titleEN")} placeholder="Enter title in English..." />
    <div className="grid grid-cols-3 gap-4">
      <SelectField label="Loại hình nghiên cứu" required options={RESEARCH_TYPES} value={form.researchType} onChange={set("researchType")} />
      <SelectField label="Lĩnh vực Khoa học" required options={SCIENCE_FIELDS} value={form.scienceField} onChange={set("scienceField")} />
      <PlainField  label="Mã số chuyên ngành" value={form.specialtyCode} onChange={set("specialtyCode")} placeholder="Nhập mã số..." />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <PlainField label="Thời gian thực hiện (tháng)" type="number" value={form.duration} onChange={set("duration")} placeholder="Nhập số tháng..." />
      <PlainField label="Ngày bắt đầu dự kiến" required type="date" value={form.startDate} onChange={set("startDate")} />
    </div>
  </div>
);

const Step2 = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <RichField label="Tổng quan tình hình nghiên cứu (Trong và ngoài nước)" required multiline rows={6} value={form.overview} onChange={set("overview")} />
    <RichField label="Tính cấp thiết của đề tài" required value={form.urgency} onChange={set("urgency")} />
  </div>
);

const Step3 = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-2 gap-4">
      <RichField label="Mục tiêu tổng quát" required multiline rows={4} value={form.generalObj}     onChange={set("generalObj")} />
      <RichField label="Mục tiêu cụ thể"    required multiline rows={4} value={form.specificObj}    onChange={set("specificObj")} />
    </div>
    <PlainField label="Đối tượng và phạm vi nghiên cứu" required value={form.researchScope} onChange={set("researchScope")} />
    <div className="grid grid-cols-2 gap-4">
      <RichField label="Nội dung nghiên cứu"       required multiline rows={4} value={form.researchContent} onChange={set("researchContent")} />
      <RichField label="Phương pháp / Cách tiếp cận" required multiline rows={4} value={form.methodology}     onChange={set("methodology")} />
    </div>
  </div>
);

const Step4 = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <RichField label="Sản phẩm khoa học (Dạng I)"  required value={form.product1} onChange={set("product1")} />
    <RichField label="Sản phẩm khoa học (Dạng II)" value={form.product2} onChange={set("product2")} placeholder="Nhập nội dung... (Không bắt buộc)" />
    <div className="grid grid-cols-2 gap-4">
      <PlainField label="Dự toán kinh phí tổng thể" value={form.budget} onChange={set("budget")} placeholder="Nhập số tiền..." />
      <FileDropzone label="Chi tiết Kinh phí" />
    </div>
  </div>
);

const Step5 = ({ members, setMembers }) => {
  const addMember    = () => setMembers((m) => [...m, { id: Date.now(), name: "", unit: "", role: "" }]);
  const removeMember = (id) => setMembers((m) => m.filter((x) => x.id !== id));
  const updateMember = (id, field, val) =>
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  return (
    <div className="flex flex-col gap-6">
      {/* PI (read-only) */}
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Chủ nhiệm đề tài</p>
        <div className="grid grid-cols-3 gap-3">
          <PlainField label="Họ và tên Chủ nhiệm" value={PI_INFO.name}  readOnly />
          <PlainField label="Đơn vị công tác"      value={PI_INFO.unit}  readOnly />
          <PlainField label="Email liên hệ"         value={PI_INFO.email} readOnly />
        </div>
      </div>

      {/* Dynamic members */}
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Thành viên tham gia</p>
        <div className="flex flex-col gap-3">
          {members.map((m, idx) => (
            <div key={m.id} className="flex flex-col gap-2">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <PlainField
                  label={idx === 0 ? "Họ và tên" : undefined}
                  placeholder="Nhập nội dung..."
                  value={m.name}
                  onChange={(e) => updateMember(m.id, "name", e.target.value)}
                />
                <PlainField
                  label={idx === 0 ? "Đơn vị" : undefined}
                  placeholder="Nhập nội dung..."
                  value={m.unit}
                  onChange={(e) => updateMember(m.id, "unit", e.target.value)}
                />
                <SelectField
                  label={idx === 0 ? "Vai trò" : undefined}
                  options={MEMBER_ROLES}
                  value={m.role}
                  onChange={(e) => updateMember(m.id, "role", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeMember(m.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition flex-shrink-0"
                >
                  <IcTrash cls="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5ea8] hover:text-blue-700 transition w-fit mt-1"
          >
            <IcPlus cls="w-3.5 h-3.5" />
            Thêm thành viên tham gia
          </button>
        </div>
      </div>

      {/* Attachment */}
      <FileDropzone
        label="Tài liệu đính kèm"
        hint="Vui lòng tải lên bản Thuyết minh đề tài toàn văn theo mẫu chuẩn của Bộ KH&CN (Định dạng: PDF, Tối đa: 25MB)."
      />
    </div>
  );
};

// ─── Registration Modal ────────────────────────────────────────────────────────

const RegistrationModal = ({ editTopic, onClose, onSave }) => {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(editTopic ? { ...EMPTY_FORM, titleVN: editTopic.title } : EMPTY_FORM);
  const [members, setMembers] = useState([{ id: 1, name: "", unit: "", role: "" }]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSaveDraft = () => {
    onSave({ ...form, members, status: "draft" });
    onClose();
  };

  const handleSubmit = () => {
    onSave({ ...form, members, status: "pending" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Đăng ký Đề tài</h2>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">Nghiên cứu Khoa học</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
          >
            <IcLeft cls="w-4 h-4" />
            Quay lại
          </button>
        </div>

        {/* Stepper */}
        <FormStepper currentStep={step} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {step === 1 && <Step1 form={form} set={set} />}
          {step === 2 && <Step2 form={form} set={set} />}
          {step === 3 && <Step3 form={form} set={set} />}
          {step === 4 && <Step4 form={form} set={set} />}
          {step === 5 && <Step5 members={members} setMembers={setMembers} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          {/* Autosave indicator */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <IcSaved cls="w-4 h-4" />
            Đã lưu lúc 10:30
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2.5">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                <IcLeft cls="w-4 h-4" />
                Quay lại
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Lưu nháp
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
              >
                Tiếp tục →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="h-9 px-5 rounded-lg bg-[#1a3a7c] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
              >
                Gửi duyệt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Status Badge & Config ─────────────────────────────────────────────────────

const STATUS_CFG = {
  draft:    { label: "Nháp",         cls: "bg-gray-100 text-gray-600" },
  pending:  { label: "Chờ duyệt",    cls: "bg-yellow-100 text-yellow-700" },
  revision: { label: "Yêu cầu sửa",  cls: "bg-red-100 text-red-700" },
  approved: { label: "Đã duyệt",     cls: "bg-green-100 text-green-700" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ─── View Modal ────────────────────────────────────────────────────────────────

const ViewModal = ({ topic, onClose }) => {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const rows = [
    { label: "Mã đề tài",   value: topic.code },
    { label: "Tên đề tài",  value: topic.title, long: true },
    { label: "Trạng thái",  value: <StatusBadge status={topic.status} /> },
    { label: "Ngày nộp",    value: topic.submittedAt },
    { label: "Chủ nhiệm",   value: PI_INFO.name },
    { label: "Đơn vị",      value: PI_INFO.unit },
    { label: "Email",        value: PI_INFO.email },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Chi tiết Đề tài</h2>
            <p className="text-xs text-gray-400 mt-0.5">Thông tin tổng quan về đề tài nghiên cứu</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <IcX cls="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col divide-y divide-gray-50">
          {rows.map(({ label, value, long }) => (
            <div key={label} className="flex items-start gap-4 py-2.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider w-24 shrink-0 mt-0.5">
                {label}
              </span>
              <span className={`text-sm text-gray-800 leading-relaxed flex-1 ${long ? "" : "whitespace-nowrap"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end px-6 pb-5">
          <button
            onClick={onClose}
            className="h-9 px-5 rounded-lg bg-[#1a5ea8] hover:bg-[#15306a] text-white text-sm font-bold transition shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

const DeleteModal = ({ topic, onClose, onConfirm }) => {
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <IcX cls="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-8 pb-7 gap-4">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <IcWarning cls="w-10 h-10 text-red-500" />
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900">Xác nhận xóa đề tài</h2>
            <p className="text-xs font-semibold text-[#1a5ea8] mt-1">
              {topic?.code} — {topic?.title?.slice(0, 45)}{topic?.title?.length > 45 ? "..." : ""}
            </p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn xóa đề tài này không? Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => { onConfirm(topic); onClose(); }}
              className="flex-1 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition shadow-sm"
            >
              Xóa đề tài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const RES_NAV = [
  { id: "dashboard", label: "Dashboard",       icon: <IcHome /> },
  { id: "topics",    label: "Đề tài của tôi",  icon: <IcTopic /> },
  { id: "settings",  label: "Cài đặt",         icon: <IcSettings /> },
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
      {RES_NAV.map((item) => {
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

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ value, label, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
    <span className={`text-4xl font-black leading-none ${color}`}>
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-sm font-medium text-gray-600 leading-snug">{label}</span>
  </div>
);

// ─── Topic Table ───────────────────────────────────────────────────────────────

const TopicActions = ({ topic, onEdit, onView, onDelete }) => (
  <div className="flex items-center justify-center gap-4">
    <button
      onClick={() => onEdit(topic)}
      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
    >
      <IcEdit cls="w-3.5 h-3.5" /> Sửa
    </button>
    <button
      onClick={() => onView(topic)}
      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
    >
      <IcEye cls="w-3.5 h-3.5" /> Xem
    </button>
    {topic.status === "draft" && (
      <button
        onClick={() => onDelete(topic)}
        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition"
      >
        <IcTrash cls="w-3.5 h-3.5" /> Xóa
      </button>
    )}
  </div>
);

const HEADERS = ["Mã đề tài", "Tên đề tài", "Ngày nộp", "Trạng thái", "Hành động"];

const Pagination = ({ currentPage, totalPages, onChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-end gap-1 px-6 py-3 border-t border-gray-100">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-xs text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >‹</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-medium transition ${
            p === currentPage
              ? "bg-[#1a5ea8] border-[#1a5ea8] text-white shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
          }`}
        >{p}</button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-xs text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >›</button>
      <span className="ml-2 text-xs text-gray-400">Trang {currentPage} / {totalPages}</span>
    </div>
  );
};

const TopicTable = ({ topics, currentPage, totalPages, onPageChange, onEdit, onView, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {HEADERS.map((h) => (
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
        {topics.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
              Không tìm thấy đề tài nào phù hợp.
            </td>
          </tr>
        ) : (
          topics.map((topic) => (
            <tr key={topic.id} className="border-b border-gray-100 hover:bg-blue-50/40 transition">
              <td className="py-3.5 px-5 font-semibold text-gray-700 whitespace-nowrap">{topic.code}</td>
              <td className="py-3.5 px-5 text-gray-700 max-w-xs">
                <span className="line-clamp-2 leading-snug">{topic.title}</span>
              </td>
              <td className="py-3.5 px-5 text-gray-500 whitespace-nowrap">{topic.submittedAt}</td>
              <td className="py-3.5 px-5 text-center">
                <StatusBadge status={topic.status} />
              </td>
              <td className="py-3.5 px-5">
                <TopicActions topic={topic} onEdit={onEdit} onView={onView} onDelete={onDelete} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const ResearcherDashboard = () => {
  const [activeMenu,   setActiveMenu]   = useState("dashboard");
  const [topics,       setTopics]       = useState(INITIAL_TOPICS);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage,  setCurrentPage]  = useState(1);

  const [regModal,    setRegModal]    = useState({ open: false, editTopic: null });
  const [viewModal,   setViewModal]   = useState({ open: false, topic: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, topic: null });

  // Computed stats
  const pending  = topics.filter((t) => t.status === "pending").length;
  const revision = topics.filter((t) => t.status === "revision").length;
  const approved = topics.filter((t) => t.status === "approved").length;

  // Filtered + paginated
  const filtered = topics.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handleFilter = (e) => { setStatusFilter(e.target.value); setCurrentPage(1); };

  const handleSave = ({ status, titleVN }) => {
    if (regModal.editTopic) {
      setTopics((prev) =>
        prev.map((t) => t.id === regModal.editTopic.id ? { ...t, title: titleVN || t.title } : t)
      );
    } else {
      const id = Date.now();
      setTopics((prev) => [
        ...prev,
        {
          id,
          code:        `DT${String(prev.length + 1).padStart(3, "0")}`,
          title:       titleVN || "Đề tài mới (chưa đặt tên)",
          submittedAt: new Date().toLocaleDateString("vi-VN"),
          status:      status ?? "draft",
        },
      ]);
    }
  };

  const handleDeleteConfirm = (topic) => {
    setTopics((prev) => prev.filter((t) => t.id !== topic.id));
  };

  return (
    <div className="flex h-screen w-screen bg-[#eaf5fc] overflow-hidden">
      <Sidebar active={activeMenu} setActive={setActiveMenu} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Dashboard</h1>
            <p className="text-sm font-semibold text-[#1a5ea8] mt-0.5">Chủ nhiệm đề tài</p>
          </div>
          <button
            onClick={() => setRegModal({ open: true, editTopic: null })}
            className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#1a3a7c] hover:bg-[#15306a] active:bg-[#112960] text-white text-sm font-bold transition shadow-sm"
          >
            <IcPlus cls="w-4 h-4" />
            Đăng ký đề tài mới
          </button>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard value={pending}        label="Đề tài chờ duyệt"      color="text-yellow-500" />
            <StatCard value={revision}       label="Đề tài cần chỉnh sửa"  color="text-red-500" />
            <StatCard value={topics.length}  label="Tổng số đề tài"        color="text-blue-600" />
            <StatCard value={approved}       label="Đề tài đã duyệt"       color="text-green-600" />
          </div>

          {/* Table section */}
          <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1a5ea8]">Danh sách đề tài của bạn</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IcSearch cls="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Tìm kiếm tên đề tài..."
                    className="h-9 pl-9 pr-4 w-56 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 focus:bg-white transition"
                  />
                </div>
                {/* Filter */}
                <div className="relative flex items-center">
                  <span className="absolute left-3 pointer-events-none">
                    <IcFilter cls="w-4 h-4 text-gray-400" />
                  </span>
                  <select
                    value={statusFilter}
                    onChange={handleFilter}
                    className="h-9 pl-9 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/15 cursor-pointer appearance-none transition"
                  >
                    <option value="all">Lọc theo năm học</option>
                    <option value="draft">Nháp</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="revision">Yêu cầu sửa</option>
                    <option value="approved">Đã duyệt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <TopicTable
              topics={paginated}
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEdit={(t) => setRegModal({ open: true, editTopic: t })}
              onView={(t) => setViewModal({ open: true, topic: t })}
              onDelete={(t) => setDeleteModal({ open: true, topic: t })}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {regModal.open && (
        <RegistrationModal
          editTopic={regModal.editTopic}
          onClose={() => setRegModal({ open: false, editTopic: null })}
          onSave={handleSave}
        />
      )}
      {viewModal.open && (
        <ViewModal
          topic={viewModal.topic}
          onClose={() => setViewModal({ open: false, topic: null })}
        />
      )}
      {deleteModal.open && (
        <DeleteModal
          topic={deleteModal.topic}
          onClose={() => setDeleteModal({ open: false, topic: null })}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default ResearcherDashboard;
