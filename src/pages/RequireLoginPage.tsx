import { useNavigate } from 'react-router-dom'

export default function RequireLoginPage() {
  const navigate = useNavigate()

  return (
    <div className="fixed top-[65px] bottom-[65px] left-1/2 z-10 flex w-full max-w-[600px] -translate-x-1/2 flex-col items-center justify-center gap-4 bg-white/75 p-5 backdrop-blur-[2px]">
      <p className="text-center text-[16px] font-semibold text-black">로그인이 필요해요</p>
      <p className="text-center text-[14px] text-[#606060]">로그인 후 이용할 수 있어요</p>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-2 rounded-[12px] bg-[#E31E2D] px-8 py-3 text-[14px] font-bold text-white"
      >
        로그인하기
      </button>
    </div>
  )
}
