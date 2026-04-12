import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersApi } from '../../api/users.api';
import { departmentsApi } from '../../api/departments.api';
import useUiStore from '../../store/uiStore';
import { applyFieldErrors } from '../../utils/errorHandler';

const ROLE_CONFIG = {
  researcher: { label: 'Nghiên cứu viên', createFn: (data) => usersApi.createResearcher(data), needsDept: true },
  manager: { label: 'Quản lý Khoa học', createFn: (data) => usersApi.createManager(data), needsDept: false },
  'dept-head': { label: 'Trưởng khoa', createFn: (data) => usersApi.createDeptHead(data), needsDept: true },
};

const schema = yup.object({
  email: yup.string().required('Bắt buộc').email('Email không hợp lệ'),
  fullName: yup.string().required('Bắt buộc').max(150),
  academicTitle: yup.string().max(50),
  initialPassword: yup.string().required('Bắt buộc').min(8, 'Tối thiểu 8 ký tự'),
  departmentId: yup.string().when('$needsDept', {
    is: true,
    then: (s) => s.required('Bắt buộc'),
    otherwise: (s) => s.nullable(),
  }),
});

export default function CreateUserPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const config = ROLE_CONFIG[role];
  if (!config) return <div className="text-center py-12 text-gray-500">Vai trò không hợp lệ.</div>;

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    context: { needsDept: config.needsDept },
  });

  useEffect(() => {
    if (config.needsDept) {
      departmentsApi.fetchAllDepartments().then(setDepartments).catch(() => {});
    }
  }, [config.needsDept]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { email: data.email, fullName: data.fullName, academicTitle: data.academicTitle || null, initialPassword: data.initialPassword };
      if (config.needsDept) payload.departmentId = data.departmentId;
      await config.createFn(payload);
      addToast({ type: 'success', message: `Đã tạo tài khoản ${config.label}.` });
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.status === 400) applyFieldErrors(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/admin/users')} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Quay lại</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo tài khoản {config.label}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" {...register('email')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
          <input {...register('fullName')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Học hàm/Học vị</label>
          <input {...register('academicTitle')} placeholder="VD: PGS.TS" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu ban đầu *</label>
          <input type="password" {...register('initialPassword')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.initialPassword ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.initialPassword && <p className="text-xs text-red-500 mt-1">{errors.initialPassword.message}</p>}
        </div>
        {config.needsDept && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoa *</label>
            <select {...register('departmentId')} className={`w-full border rounded-md px-3 py-2 text-sm ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">— Chọn —</option>
              {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
            </select>
            {errors.departmentId && <p className="text-xs text-red-500 mt-1">{errors.departmentId.message}</p>}
          </div>
        )}

        {errors.root && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{errors.root.message}</div>}

        <button type="submit" disabled={submitting}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm">
          {submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
    </div>
  );
}
