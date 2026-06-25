import { useState } from 'react'
import { X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPreferenceKeywords } from '@/apis/modules/preferences'
import { getMyPage, updatePreferences } from '@/apis/modules/me'
import type { KeywordCode } from '@/apis/types'

type Props = {
  onClose: () => void
  onSave: () => void
}

export default function FoodPreferenceModal({ onClose, onSave }: Props) {
  const queryClient = useQueryClient()

  const { data: keywords } = useQuery({
    queryKey: ['preference-keywords'],
    queryFn: getPreferenceKeywords,
  })
  const { data: myData } = useQuery({ queryKey: ['me'], queryFn: getMyPage })

  const serverValues = myData?.preferenceKeywords ?? []
  const serverCodes: KeywordCode[] =
    keywords
      ?.filter((kw) => serverValues.includes(kw.name) || serverValues.includes(kw.label))
      .map((kw) => kw.name) ?? []

  const [selected, setSelected] = useState<KeywordCode[] | null>(null)
  const draft = selected ?? serverCodes

  const groups =
    keywords?.reduce<Record<string, { name: KeywordCode; label: string }[]>>((acc, kw) => {
      if (!acc[kw.category]) acc[kw.category] = []
      acc[kw.category].push({ name: kw.name, label: kw.label })
      return acc
    }, {}) ?? {}

  const toggle = (code: KeywordCode) => {
    setSelected((prev) => {
      const base = prev ?? serverCodes
      return base.includes(code) ? base.filter((k) => k !== code) : [...base, code]
    })
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => updatePreferences(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['recommendation-today'] })
      onSave()
    },
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[360px] max-h-[80vh] overflow-y-auto rounded-[12px] border border-[#e0e0e0] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[14px] font-bold text-black">선호 음식 키워드</span>
          <button type="button" onClick={onClose}>
            <X size={18} className="text-[#a0a0a0]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(groups).map(([category, kws]) => (
            <div key={category} className="flex flex-col gap-2">
              <span className="text-[12px] text-[#606060]">{category}</span>
              <div className="flex flex-wrap gap-2">
                {kws.map(({ name, label }) => {
                  const isActive = draft.includes(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggle(name)}
                      className={`rounded-[20px] px-3 py-2 text-[12px] font-semibold transition-colors duration-75 ${
                        isActive ? 'bg-[#e31e2d] text-white' : 'bg-[#f0f0f0] text-[#606060]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => save()}
          disabled={isPending}
          className="mt-5 h-[44px] w-full rounded-[12px] bg-[#e31e2d] text-[14px] font-semibold text-white disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
