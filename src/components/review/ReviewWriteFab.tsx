import { Pencil } from 'lucide-react'

type ReviewWriteFabProps = {
  onClick: () => void
}

export default function ReviewWriteFab({ onClick }: ReviewWriteFabProps) {
  return (
    <div className="pointer-events-none fixed bottom-[85px] left-1/2 z-40 flex w-full max-w-[600px] -translate-x-1/2 justify-end px-5">
      <button
        type="button"
        onClick={onClick}
        aria-label="리뷰 작성"
        className="pointer-events-auto flex size-[48px] items-center justify-center rounded-full bg-black shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)]"
      >
        <Pencil size={22} className="text-white" />
      </button>
    </div>
  )
}
