import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '../../api/auth.api';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

const schema = yup.object({
  currentPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .max(128, 'Mật khẩu mới không được vượt quá 128 ký tự')
    .notOneOf([yup.ref('currentPassword')], 'Mật khẩu mới phải khác mật khẩu hiện tại')
    .required('Vui lòng nhập mật khẩu mới'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

/**
 * ChangePasswordPage — Mandatory & voluntary password change form.
 *
 * Route: /change-password (authenticated, skipFirstLoginCheck)
 * Guard: PrivateRoute with allowedRoles=[] and skipFirstLoginCheck=true
 *
 * Dual-purpose page:
 *   1. MANDATORY: Rendered automatically when authStore.firstLogin === true.
 *      After success, full session purge and re-login (same as voluntary flow).
 *   2. VOLUNTARY: Accessible from sidebar/profile for any authenticated user.
 *
 * Backend contract: PATCH /api/v1/auth/password
 *   Request body: { currentPassword, newPassword }
 *   Response: 204 No Content
 *   Side effect: server clears firstLogin flag + invalidates refresh tokens.
 *
 * Client side-effects on 204 (Zero-Trust credential boundary):
 *   - authStore.clearAuth() purges JWT, refresh token, user claims, and firstLogin.
 *   - Global toast instructs the subject to re-authenticate with the new password.
 *   - Navigation to /login (replace) — session continuation is not permitted.
 */
export default function ChangePasswordPage() {
  const firstLogin = useAuthStore((s) => s.firstLogin);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const addToast = useUiStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      clearAuth();
      reset();
      addToast({
        type: 'warning',
        message:
          'Mật khẩu đã được cập nhật. Phiên làm việc hiện tại đã kết thúc. Vui lòng đăng nhập lại bằng mật khẩu mới.',
        duration: 8000,
      });
      window.location.replace('/login');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        const message = err?.response?.data?.message ?? 'Mật khẩu hiện tại không đúng.';
        setError('currentPassword', { type: 'server', message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-lg">
        {firstLogin && (
          <div className="mb-6 rounded-md bg-blue-50 border border-blue-200 px-4 py-3">
            <p className="text-sm font-semibold text-blue-800">
              Yêu cầu đổi mật khẩu lần đầu
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Đây là lần đầu bạn đăng nhập vào hệ thống. Vui lòng thay đổi mật khẩu
              trước khi tiếp tục sử dụng.
            </p>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">
          Mật khẩu mới phải có ít nhất 8 ký tự.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          {/* Current password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">
              Mật khẩu hiện tại
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register('currentPassword')}
              className={`w-full h-11 rounded-md border px-4 text-sm outline-none
                          transition duration-200 focus:ring-2 focus:ring-[#1a5ea8]/20
                          ${errors.currentPassword
                            ? 'border-red-400'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#1a5ea8]'
                          }`}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New password */}
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

          {/* Confirm new password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmNewPassword" className="text-sm font-semibold text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmNewPassword')}
              className={`w-full h-11 rounded-md border px-4 text-sm outline-none
                          transition duration-200 focus:ring-2 focus:ring-[#1a5ea8]/20
                          ${errors.confirmNewPassword
                            ? 'border-red-400'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#1a5ea8]'
                          }`}
            />
            {errors.confirmNewPassword && (
              <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md bg-[#1a3a7c] hover:bg-[#15306a] text-white
                       font-bold text-sm tracking-wide transition duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
