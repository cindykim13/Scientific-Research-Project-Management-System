import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import useUiStore from '../../store/uiStore';

const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .max(128, 'Mật khẩu mới không được vượt quá 128 ký tự')
    .required('Vui lòng nhập mật khẩu mới'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

/**
 * ResetPasswordPage — Password reset completion form.
 *
 * Route: /reset-password?token=<reset_token> (public)
 *
 * Extracts the reset token from the URL query parameter.
 * The backend accepts POST /api/v1/auth/reset-password with
 * { token: string, newPassword: string } — confirmPassword is
 * client-side validation only and is NOT sent to the backend.
 *
 * On 204: success toast + redirect to /login.
 * On 401: token is invalid or expired — display inline error.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') ?? '';
  const addToast = useUiStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data) => {
    if (!resetToken) {
      setTokenError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token: resetToken, newPassword: data.newPassword });
      addToast({ type: 'success', message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.' });
      navigate('/login', { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setTokenError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10)]
                        px-8 py-8 text-center">
          <p className="text-sm text-red-600 font-semibold">
            Liên kết đặt lại mật khẩu không hợp lệ.
          </p>
          <Link to="/forgot-password" className="mt-4 block text-sm text-[#1a5ea8] hover:underline">
            Yêu cầu liên kết mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10)]
                      px-8 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
          <p className="text-sm text-gray-500 mt-1">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        {tokenError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {tokenError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              {...register('newPassword')}
              className={`w-full h-11 rounded-md border px-4 text-sm outline-none
                          transition duration-200 focus:ring-2 focus:ring-[#1a5ea8]/20
                          ${errors.newPassword
                            ? 'border-red-400'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#1a5ea8]'
                          }`}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu mới"
              {...register('confirmPassword')}
              className={`w-full h-11 rounded-md border px-4 text-sm outline-none
                          transition duration-200 focus:ring-2 focus:ring-[#1a5ea8]/20
                          ${errors.confirmPassword
                            ? 'border-red-400'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#1a5ea8]'
                          }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md bg-[#1a3a7c] hover:bg-[#15306a] text-white
                       font-bold text-sm tracking-wide transition duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-[#1a5ea8] transition duration-150">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
