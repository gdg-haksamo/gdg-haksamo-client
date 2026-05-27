import { PencilLine } from 'lucide-react'

export function SelectKeyword() {
  const keywords = ['매운음식', '면류', '육류', '해산물', '채식', '일식', '양식', '고단백']

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E0E0E0]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">선호 음식 키워드</div>
          <div className="cursor-pointer flex items-center gap-1">
            <PencilLine size={12} className="text-[#E31E2D]" />
            <div className="text-[12px] font-regular text-[#E31E2D]">수정</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {keywords.map((keyword) => (
            <div
              key={keyword}
              className="flex items-center justify-center rounded-[20px] bg-[#F0F0F0] px-4 py-2 text-[12px] font-semibold text-[#606060]"
            >
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
