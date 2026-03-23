import bgBuilding from "../assets/ADMIN/bg-building.svg";
import logoOU from "../assets/ADMIN/logo-ou.svg";

const InputField = ({ label, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700 tracking-wide">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full h-11 rounded-md border border-gray-300 bg-white
        px-4 text-sm text-gray-800 placeholder-gray-400
        outline-none transition duration-200
        focus:border-[#1a5ea8] focus:ring-2 focus:ring-[#1a5ea8]/20
        hover:border-gray-400
      "
    />
  </div>
);

const UniversityBranding = () => (
  <div className="flex flex-col items-center gap-3">
    <img src={logoOU} alt="OU Logo" className="h-[88px] w-auto object-contain" />
    <div className="text-center leading-snug">
      <p className="text-[12.5px] font-bold text-[#1a5ea8] uppercase tracking-wider">
        Trường Đại học Mở TP. Hồ Chí Minh
      </p>
      <p className="text-[9.5px] font-medium text-[#4a90c4] uppercase tracking-[0.18em] mt-0.5">
        Ho Chi Minh City Open University
      </p>
    </div>
  </div>
);

const LoginForm = () => (
  <div
    className="
      w-full max-w-[360px] rounded-2xl bg-white
      shadow-[0_8px_40px_rgba(0,0,0,0.13)]
      px-10 pt-9 pb-7
      flex flex-col items-center gap-5
    "
  >
    {/* Branding */}
    <UniversityBranding />

    {/* Title + tagline */}
    <div className="text-center mt-1">
      <h1 className="text-[19px] font-bold text-gray-900 leading-tight">
        Đăng nhập
      </h1>
      {/* Đã sửa: Chữ to rõ, in đậm, đổi màu xanh thương hiệu */}
      <p className="text-[15px] font-bold text-[#1a5ea8] mt-2 tracking-wide">
        Hệ thống Xét duyệt Nghiên cứu Khoa học
      </p>
    </div>

    {/* Inputs */}
    <div className="w-full flex flex-col gap-4 mt-1">
      <InputField label="Tên đăng nhập" placeholder="Nhập tài khoản" type="text" />
      <InputField label="Mật khẩu" placeholder="Nhập mật khẩu" type="password" />
    </div>

    {/* Login button */}
    <button
      type="button"
      className="
        w-full h-12 mt-1 rounded-md
        bg-[#1a3a7c] hover:bg-[#15306a] active:bg-[#112960]
        text-white font-bold text-[15px] tracking-wide
        transition duration-200 shadow-sm
      "
    >
      Đăng nhập
    </button>

    {/* Forgot password */}
    <a
      href="#"
      className="
        text-[13px] text-gray-500 underline underline-offset-2
        hover:text-[#1a5ea8] transition duration-150
      "
    >
      Quên mật khẩu?
    </a>

    {/* Divider */}
    <div className="w-full border-t border-gray-100 mt-1" />

    {/* Footer */}
    <p className="text-[10px] text-gray-400 text-center leading-relaxed -mt-1">
      Bản quyền © 2026 Trường Đại học Mở TP.HCM
      <br />
      Hỗ trợ:{" "}
      <a
        href="mailto:phongqlkh@ou.edu.vn"
        className="hover:text-[#1a5ea8] transition duration-150"
      >
        phongqlkh@ou.edu.vn
      </a>
    </p>
  </div>
);

const Login = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left panel — building photo */}
      <div className="hidden md:block w-1/2 h-full flex-shrink-0">
        <img
          src={bgBuilding}
          alt="OU Building"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right panel — vibrant brand blue */}
      {/* Đã sửa: Cập nhật mã màu nền sang 9BD3F1 bằng class của Tailwind */}
      <div className="flex flex-1 items-center justify-center px-6 bg-[#9BD3F1]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;