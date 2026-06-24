import { useMutation } from '@tanstack/react-query'
import { RefreshCw, CheckCircle } from 'lucide-react'
import { triggerCrawl } from '@/apis/modules/admin'

export default function CrawlSection() {
  const { mutate, isPending, isSuccess, error, reset } = useMutation({
    mutationFn: triggerCrawl,
  })

  return (
    <div className="flex flex-col items-center gap-6 px-5 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[16px] font-bold text-black">메뉴 크롤링 실행</p>
        <p className="text-[13px] text-[#a0a0a0]">버튼을 누르면 서버에서 최신 메뉴를 수집합니다.</p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle size={40} className="text-[#1a9e5c]" />
          <p className="text-[14px] font-semibold text-[#1a9e5c]">크롤링이 시작되었습니다.</p>
          <button type="button" onClick={reset} className="text-[13px] text-[#a0a0a0] underline">
            다시 실행
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => mutate()}
          className="flex items-center gap-2 rounded-xl bg-[#e31e2d] px-8 py-4 text-[15px] font-bold text-white disabled:opacity-50"
        >
          <RefreshCw size={18} className={isPending ? 'animate-spin' : ''} />
          {isPending ? '실행 중...' : '크롤링 실행'}
        </button>
      )}

      {error && <p className="text-[13px] text-[#e31e2d]">{(error as Error).message}</p>}
    </div>
  )
}
