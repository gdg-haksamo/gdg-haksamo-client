import { useMemo, useState } from 'react'
import { PencilLine } from 'lucide-react'

const KEYWORD_GROUPS = [
  {
    title: '맛 취향',
    items: ['매운 음식', '순한 음식', '단맛', '신맛'],
  },
  {
    title: '음식 종류',
    items: ['면류', '밥류', '육류', '해산물', '채식', '국/찌개', '샐러드', '빵/샌드위치'],
  },
  {
    title: '요리 종류',
    items: ['한식', '중식', '일식', '양식'],
  },
  {
    title: '건강 목표',
    items: ['저칼로리', '고단백'],
  },
] as const

type KeywordId = (typeof KEYWORD_GROUPS)[number]['items'][number]

export function SelectKeyword() {
  const initialSelected = useMemo<Record<KeywordId, boolean>>(
    () => ({
      '매운 음식': true,
      '순한 음식': false,
      단맛: false,
      신맛: false,
      면류: false,
      밥류: false,
      육류: true,
      해산물: true,
      채식: true,
      '국/찌개': false,
      샐러드: false,
      '빵/샌드위치': false,
      한식: false,
      중식: false,
      일식: true,
      양식: true,
      저칼로리: false,
      고단백: true,
    }),
    [],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState<Record<KeywordId, boolean>>(initialSelected)

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k as KeywordId)

  const toggleKeyword = (id: KeywordId) => {
    if (!isEditing) return
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const renderChip = (label: KeywordId) => {
    const enabled = selected[label]
    const activeStyle =
      isEditing && enabled ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'

    return (
      <button
        key={label}
        type="button"
        onClick={() => toggleKeyword(label)}
        className={`flex items-center justify-center rounded-[20px] px-4 py-2 text-[12px] font-semibold ${activeStyle} ${
          isEditing ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E0E0E0]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">선호 음식 키워드</div>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="cursor-pointer flex items-center gap-1"
          >
            <PencilLine size={12} className="text-[#E31E2D]" />
            <div className="text-[12px] font-regular text-[#E31E2D]">
              {isEditing ? '저장' : '수정'}
            </div>
          </button>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            {KEYWORD_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <div className="text-[12px] font-regular text-[#606060]">{group.title}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {group.items.map((label) => renderChip(label))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length === 0
              ? null
              : KEYWORD_GROUPS.flatMap((g) =>
                  g.items.filter((label) => selected[label]).map((label) => renderChip(label)),
                )}
          </div>
        )}
      </div>
    </div>
  )
}
