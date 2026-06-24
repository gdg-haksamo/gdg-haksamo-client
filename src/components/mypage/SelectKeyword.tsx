import { useState } from 'react'
import { PencilLine } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPreferenceKeywords } from '@/apis/modules/preferences'
import { getMyPage, updatePreferences } from '@/apis/modules/me'
import type { KeywordCode } from '@/apis/types'

export function SelectKeyword() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<KeywordCode[]>([])

  const { data: keywords } = useQuery({
    queryKey: ['preference-keywords'],
    queryFn: getPreferenceKeywords,
  })
  const { data: myData } = useQuery({ queryKey: ['me'], queryFn: getMyPage })

  // API는 라벨 문자열로 내려줌 → 코드로 변환해서 사용
  const serverLabels = myData?.preferenceKeywords ?? []
  const serverCodes: KeywordCode[] =
    keywords?.filter((kw) => serverLabels.includes(kw.label)).map((kw) => kw.name) ?? []

  const selected = isEditing ? draft : serverCodes

  const groups =
    keywords?.reduce<Record<string, { name: KeywordCode; label: string }[]>>((acc, kw) => {
      if (!acc[kw.category]) acc[kw.category] = []
      acc[kw.category].push({ name: kw.name, label: kw.label })
      return acc
    }, {}) ?? {}

  const startEdit = () => {
    setDraft(serverCodes)
    setIsEditing(true)
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => updatePreferences(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setIsEditing(false)
    },
  })

  const toggle = (code: KeywordCode) => {
    setDraft((prev) => (prev.includes(code) ? prev.filter((k) => k !== code) : [...prev, code]))
  }

  const renderChip = (name: KeywordCode, label: string) => {
    const isSelected = selected.includes(name)
    const activeStyle =
      isEditing && isSelected ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'

    return (
      <button
        key={name}
        type="button"
        onClick={() => isEditing && toggle(name)}
        className={`flex items-center justify-center rounded-[20px] px-4 py-2 text-[12px] font-semibold ${activeStyle} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
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
            onClick={() => {
              if (isEditing) save()
              else startEdit()
            }}
            disabled={isPending}
            className="cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            <PencilLine size={12} className="text-[#E31E2D]" />
            <div className="text-[12px] font-regular text-[#E31E2D]">
              {isEditing ? '저장' : '수정'}
            </div>
          </button>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            {Object.entries(groups).map(([category, kws]) => (
              <div key={category} className="flex flex-col gap-2">
                <div className="text-[12px] font-regular text-[#606060]">{category}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {kws.map(({ name, label }) => renderChip(name, label))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {keywords
              ?.filter((kw) => selected.includes(kw.name))
              .map((kw) => renderChip(kw.name, kw.label))}
          </div>
        )}
      </div>
    </div>
  )
}
