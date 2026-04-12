import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import FormStepper from '../../components/forms/FormStepper';
import RichTextEditor from '../../components/forms/RichTextEditor';
import DragDropZone from '../../components/forms/DragDropZone';
import { topicsApi } from '../../api/topics.api';
import { referenceApi } from '../../api/reference.api';
import { departmentsApi } from '../../api/departments.api';
import useUiStore from '../../store/uiStore';
import { applyFieldErrors } from '../../utils/errorHandler';

const STEPS = ['Thông tin chung', 'Mục tiêu', 'Phương pháp', 'Sản phẩm & Kinh phí', 'Tệp đính kèm'];

const RESEARCH_TYPE_LABELS = {
  BASIC: 'Nghiên cứu cơ bản',
  APPLIED: 'Nghiên cứu ứng dụng',
  EXPERIMENTAL: 'Triển khai thực nghiệm',
};

const FALLBACK_RESEARCH_TYPES = Object.keys(RESEARCH_TYPE_LABELS);

const FALLBACK_RESEARCH_FIELDS = [
  'Công nghệ thông tin và Trí tuệ nhân tạo',
  'Khoa học tự nhiên',
  'Khoa học xã hội và Hành vi',
  'Kỹ thuật và Công nghệ',
  'Y sinh và Sức khỏe cộng đồng',
  'Kinh tế và Quản trị',
  'Giáo dục và Sư phạm',
  'Khác',
];

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

const richTextMinTest = (min) => ({
  name: 'min-text',
  message: `Tối thiểu ${min} ký tự`,
  test: (v) => stripHtml(v || '').length >= min,
});

const schemas = [
  // Step 0: Admin Info
  yup.object({
    titleVn: yup.string().required('Bắt buộc').min(10, 'Tối thiểu 10 ký tự').max(500),
    titleEn: yup.string().required('Bắt buộc').min(10, 'Tối thiểu 10 ký tự').max(500),
    researchField: yup.string().required('Bắt buộc'),
    researchType: yup.string().required('Bắt buộc'),
    durationMonths: yup.number().typeError('Phải là số').required('Bắt buộc').integer().min(6, 'Tối thiểu 6 tháng').max(48, 'Tối đa 48 tháng'),
    managingDepartmentId: yup.string().required('Bắt buộc'),
  }),
  // Step 1: Objectives
  yup.object({
    urgencyStatement: yup.string().required('Bắt buộc').test(richTextMinTest(50)),
    generalObjective: yup.string().required('Bắt buộc').test(richTextMinTest(50)),
    specificObjectives: yup.string().required('Bắt buộc').test(richTextMinTest(50)),
  }),
  // Step 2: Methodology
  yup.object({
    researchApproach: yup.string().required('Bắt buộc').test(richTextMinTest(30)),
    researchMethods: yup.string().required('Bắt buộc').test(richTextMinTest(30)),
    researchScope: yup.string().required('Bắt buộc').min(30, 'Tối thiểu 30 ký tự').max(2000),
    implementationPlan: yup.string().nullable(),
  }),
  // Step 3: Products & Budget
  yup.object({
    expectedProductsType1: yup.string().nullable(),
    expectedProductsType2: yup.string().nullable(),
    trainingPlan: yup.string().nullable(),
    expectedBudget: yup.number().typeError('Phải là số').required('Bắt buộc').positive('Phải lớn hơn 0').max(10000000000),
    budgetExplanation: yup.string().nullable(),
  }),
  // Step 4: Attachments
  yup.object({}),
];

const STEP_FIELDS = [
  ['titleVn', 'titleEn', 'researchField', 'researchType', 'durationMonths', 'managingDepartmentId'],
  ['urgencyStatement', 'generalObjective', 'specificObjectives'],
  ['researchApproach', 'researchMethods', 'researchScope', 'implementationPlan'],
  ['expectedProductsType1', 'expectedProductsType2', 'trainingPlan', 'expectedBudget', 'budgetExplanation'],
  [],
];

export default function TopicSubmissionWizardPage() {
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [proposalFile, setProposalFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enums, setEnums] = useState({});
  const [departments, setDepartments] = useState([]);

  const { register, handleSubmit, control, trigger, setError, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schemas[currentStep]),
    mode: 'onChange',
    defaultValues: {
      titleVn: '', titleEn: '', researchField: '', researchType: '',
      durationMonths: '', managingDepartmentId: '',
      urgencyStatement: '', generalObjective: '', specificObjectives: '',
      researchApproach: '', researchMethods: '', researchScope: '',
      implementationPlan: '',
      expectedProductsType1: '', expectedProductsType2: '',
      trainingPlan: '',
      expectedBudget: '', budgetExplanation: '',
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const enumRes = await referenceApi.getEnums();
        if (!cancelled) setEnums(enumRes.data?.enums ?? {});
      } catch { /* interceptor handles */ }
    })();
    (async () => {
      try {
        const list = await departmentsApi.fetchAllDepartments();
        if (!cancelled) setDepartments(list);
      } catch {
        if (!cancelled) setDepartments([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const goNext = useCallback(async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [currentStep, trigger]);

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const valid = await trigger(STEP_FIELDS[i]);
      if (!valid) { setCurrentStep(i); return; }
    }

    setIsSubmitting(true);
    try {
      const values = watch();
      const topicPayload = {
        titleVn: values.titleVn,
        titleEn: values.titleEn,
        researchField: values.researchField,
        researchType: values.researchType,
        durationMonths: Number(values.durationMonths),
        expectedBudget: Number(values.expectedBudget),
        managingDepartmentId: values.managingDepartmentId,
        urgencyStatement: values.urgencyStatement,
        generalObjective: values.generalObjective,
        specificObjectives: values.specificObjectives,
        researchApproach: values.researchApproach,
        researchMethods: values.researchMethods,
        researchScope: values.researchScope,
        implementationPlan: values.implementationPlan || null,
        expectedProductsType1: values.expectedProductsType1 || null,
        expectedProductsType2: values.expectedProductsType2 || null,
        trainingPlan: values.trainingPlan || null,
        budgetExplanation: values.budgetExplanation || null,
      };

      const createRes = await topicsApi.create(topicPayload);
      const topicId = createRes.data?.topicId;

      // CRITICAL: Await file upload to completion BEFORE any navigation.
      // Navigating prematurely unmounts this component and aborts the
      // multipart upload stream, causing a server-side EOFException and
      // leaving an orphan DRAFT record without its attachment.
      if (proposalFile && topicId) {
        try {
          await topicsApi.uploadAttachment(topicId, proposalFile);
        } catch (uploadErr) {
          addToast({
            type: 'warning',
            message: 'Đề tài đã tạo nhưng tải tệp thất bại. Bạn có thể tải lại từ trang chi tiết.',
          });
        }
      }

      addToast({ type: 'success', message: 'Đề tài đã được tạo thành công.' });
      navigate(`/researcher/topics/${topicId}`);
    } catch (err) {
      if (err.response?.status === 400) {
        applyFieldErrors(err, setError);
        const errFields = err.response?.data?.errors;
        if (Array.isArray(errFields)) {
          for (let i = 0; i < STEP_FIELDS.length; i++) {
            if (errFields.some((e) => STEP_FIELDS[i].includes(e.field))) {
              setCurrentStep(i);
              break;
            }
          }
        }
      } else if (err.response?.status === 409) {
        // Semantic duplication conflict: preserve form state, show inline toast.
        // Do NOT let the global interceptor navigate away.
        addToast({
          type: 'error',
          message: err.response?.data?.message ?? 'Tên đề tài trùng lặp với đề tài đã tồn tại. Vui lòng chỉnh sửa tiêu đề.',
          duration: 8000,
        });
        setCurrentStep(0);
      } else if (err.response) {
        addToast({
          type: 'error',
          message: `Nộp đề tài thất bại. Máy chủ phản hồi lỗi ${err.response.status}. Vui lòng thử lại.`,
        });
      } else {
        addToast({
          type: 'error',
          message: 'Nộp đề tài thất bại. Không thể kết nối đến máy chủ.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nộp đề tài nghiên cứu</h1>
      <p className="text-sm text-gray-500 mb-6">Hoàn thành các bước bên dưới để nộp đề tài mới.</p>

      <FormStepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} onStepClick={setCurrentStep} />

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {currentStep === 0 && (
          <StepAdmin
            register={register}
            errors={errors}
            enums={enums}
            departments={departments}
            control={control}
            researchFieldOptions={(enums.researchField?.length ? enums.researchField : FALLBACK_RESEARCH_FIELDS)}
            researchTypeOptions={(enums.researchType?.length ? enums.researchType : FALLBACK_RESEARCH_TYPES)}
          />
        )}
        {currentStep === 1 && <StepObjectives control={control} errors={errors} />}
        {currentStep === 2 && <StepMethodology control={control} register={register} errors={errors} watch={watch} />}
        {currentStep === 3 && <StepProductsBudget control={control} errors={errors} />}
        {currentStep === 4 && <StepAttachments file={proposalFile} onFileSelect={setProposalFile} onRemove={() => setProposalFile(null)} />}

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button type="button" onClick={goBack} disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50">
            Quay lại
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={goNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Tiếp theo
            </button>
          ) : (
            <button type="button" onClick={onSubmit} disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
              {isSubmitting ? 'Đang nộp...' : 'Nộp đề tài'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Step 0: Administrative Information ===== */
function StepAdmin({ register, errors, departments, control, researchFieldOptions, researchTypeOptions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đề tài (Tiếng Việt) *</label>
        <input {...register('titleVn')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.titleVn ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.titleVn && <p className="text-xs text-red-500 mt-1">{errors.titleVn.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đề tài (Tiếng Anh) *</label>
        <input {...register('titleEn')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.titleEn ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực nghiên cứu *</label>
        <select {...register('researchField')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.researchField ? 'border-red-500' : 'border-gray-300'}`}>
          <option value="">-- Chọn --</option>
          {researchFieldOptions.map((f) => (<option key={f} value={f}>{f}</option>))}
        </select>
        {errors.researchField && <p className="text-xs text-red-500 mt-1">{errors.researchField.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình nghiên cứu *</label>
        <div className="flex flex-wrap gap-4 mt-2" role="radiogroup" aria-label="Loại hình nghiên cứu">
          {researchTypeOptions.map((t) => (
            <label key={t} className="flex items-center gap-1.5 text-sm">
              <input type="radio" {...register('researchType')} value={t} className="text-blue-600" />
              {RESEARCH_TYPE_LABELS[t] ?? t}
            </label>
          ))}
        </div>
        {errors.researchType && <p className="text-xs text-red-500 mt-1">{errors.researchType.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian thực hiện (tháng) *</label>
        <input type="number" {...register('durationMonths')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.durationMonths ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.durationMonths && <p className="text-xs text-red-500 mt-1">{errors.durationMonths.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị quản lý *</label>
        <select {...register('managingDepartmentId')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.managingDepartmentId ? 'border-red-500' : 'border-gray-300'}`}>
          <option value="">-- Chọn --</option>
          {departments.map((d) => (<option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>))}
        </select>
        {errors.managingDepartmentId && <p className="text-xs text-red-500 mt-1">{errors.managingDepartmentId.message}</p>}
      </div>
    </div>
  );
}

/* ===== Step 1: Objectives ===== */
function StepObjectives({ control, errors }) {
  return (
    <div className="space-y-6">
      <Controller name="urgencyStatement" control={control} render={({ field }) => (
        <RichTextEditor label="Tính cấp thiết của đề tài *" value={field.value} onChange={field.onChange} minLength={50} error={errors.urgencyStatement?.message} />
      )} />
      <Controller name="generalObjective" control={control} render={({ field }) => (
        <RichTextEditor label="Mục tiêu tổng quát *" value={field.value} onChange={field.onChange} minLength={50} error={errors.generalObjective?.message} />
      )} />
      <Controller name="specificObjectives" control={control} render={({ field }) => (
        <RichTextEditor label="Mục tiêu cụ thể *" value={field.value} onChange={field.onChange} minLength={50} error={errors.specificObjectives?.message} />
      )} />
    </div>
  );
}

/* ===== Step 2: Methodology ===== */
function StepMethodology({ control, register, errors, watch }) {
  return (
    <div className="space-y-6">
      <Controller name="researchApproach" control={control} render={({ field }) => (
        <RichTextEditor label="Cách tiếp cận nghiên cứu *" value={field.value} onChange={field.onChange} minLength={30} error={errors.researchApproach?.message} />
      )} />
      <Controller name="researchMethods" control={control} render={({ field }) => (
        <RichTextEditor label="Phương pháp nghiên cứu *" value={field.value} onChange={field.onChange} minLength={30} error={errors.researchMethods?.message} />
      )} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phạm vi nghiên cứu *</label>
        <textarea {...register('researchScope')} rows={4} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.researchScope ? 'border-red-500' : 'border-gray-300'}`} />
        <div className="flex justify-between text-xs mt-1">
          {errors.researchScope && <span className="text-red-500">{errors.researchScope.message}</span>}
          <span className="text-gray-400 ml-auto">{(watch('researchScope') || '').length}/2000</span>
        </div>
      </div>
      <Controller name="implementationPlan" control={control} render={({ field }) => (
        <RichTextEditor label="Kế hoạch triển khai (không bắt buộc)" value={field.value} onChange={field.onChange} minLength={0} error={errors.implementationPlan?.message} />
      )} />
    </div>
  );
}

/* ===== Step 3: Products & Budget ===== */
function StepProductsBudget({ control, errors }) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-2">
        <h3 className="text-base font-semibold text-gray-800">Sản phẩm dự kiến</h3>
        <p className="text-xs text-gray-500 mt-1">Mô tả các sản phẩm khoa học dự kiến đạt được từ đề tài nghiên cứu.</p>
      </div>

      <Controller name="expectedProductsType1" control={control} render={({ field }) => (
        <RichTextEditor
          label="Sản phẩm khoa học Dạng I (Bài báo, sách chuyên khảo, báo cáo khoa học)"
          value={field.value} onChange={field.onChange} minLength={0}
          error={errors.expectedProductsType1?.message}
        />
      )} />

      <Controller name="expectedProductsType2" control={control} render={({ field }) => (
        <RichTextEditor
          label="Sản phẩm khoa học Dạng II (Sáng chế, giải pháp hữu ích, phần mềm, quy trình)"
          value={field.value} onChange={field.onChange} minLength={0}
          error={errors.expectedProductsType2?.message}
        />
      )} />

      <Controller name="trainingPlan" control={control} render={({ field }) => (
        <RichTextEditor
          label="Kế hoạch đào tạo (Thạc sĩ, Tiến sĩ, Sinh viên NCKH)"
          value={field.value} onChange={field.onChange} minLength={0}
          error={errors.trainingPlan?.message}
        />
      )} />

      <div className="border-t pt-6 mt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Kinh phí</h3>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tổng kinh phí dự kiến (VND) *</label>
          <Controller name="expectedBudget" control={control} render={({ field }) => (
            <NumericFormat
              value={field.value}
              onValueChange={(vals) => field.onChange(vals.floatValue)}
              thousandSeparator=","
              suffix=" VND"
              decimalScale={0}
              className={`w-full border rounded-md px-3 py-2 text-sm ${errors.expectedBudget ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0 VND"
            />
          )} />
          {errors.expectedBudget && <p className="text-xs text-red-500 mt-1">{errors.expectedBudget.message}</p>}
        </div>

        <Controller name="budgetExplanation" control={control} render={({ field }) => (
          <RichTextEditor
            label="Dự toán kinh phí chi tiết (phân bổ theo hạng mục)"
            value={field.value} onChange={field.onChange} minLength={0}
            error={errors.budgetExplanation?.message}
          />
        )} />
      </div>
    </div>
  );
}

/* ===== Step 4: Attachments ===== */
function StepAttachments({ file, onFileSelect, onRemove }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Tệp thuyết minh đề tài</h3>
      <DragDropZone file={file} onFileSelect={onFileSelect} onRemove={onRemove} />
      <p className="text-xs text-gray-400">Tệp sẽ được tải lên sau khi đề tài được tạo thành công. Chấp nhận: PDF, DOC, DOCX (tối đa 10 MB).</p>
    </div>
  );
}
