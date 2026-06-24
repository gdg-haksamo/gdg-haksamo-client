import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { createEvent, deleteEvent, updateEvent } from '@/apis/admin'
import { getEvents } from '@/apis/events'
import type { EventResponse } from '@/apis/types'

type EventFormData = {
  type: 'EVENT' | 'NOTICE'
  title: string
  content: string
  imageUrl: string
  linkUrl: string
  startDate: string
  endDate: string
}

const DEFAULT_FORM: EventFormData = {
  type: 'NOTICE',
  title: '',
  content: '',
  imageUrl: '',
  linkUrl: '',
  startDate: '',
  endDate: '',
}

type Modal =
  | { mode: 'create' }
  | { mode: 'edit'; event: EventResponse }
  | { mode: 'delete'; event: EventResponse }
  | null

export default function EventManagement() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<Modal>(null)

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['events'] })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-4 p-5">
      <button
        type="button"
        onClick={() => setModal({ mode: 'create' })}
        className="flex items-center gap-2 self-start rounded-xl bg-[#e31e2d] px-4 py-2.5 text-[13px] font-bold text-white"
      >
        <Plus size={15} />
        추가
      </button>

      <div className="flex flex-col gap-2">
        {events?.map((ev) => (
          <div
            key={ev.eventId}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)]"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    ev.type === 'EVENT'
                      ? 'bg-[#ffedd4] text-[#f54a00]'
                      : 'bg-[#f0f0f0] text-[#606060]'
                  }`}
                >
                  {ev.type === 'EVENT' ? '이벤트' : '공지'}
                </span>
                <span className="truncate text-[14px] font-semibold text-black">{ev.title}</span>
              </div>
              <span className="text-[11px] text-[#a0a0a0]">{ev.createdAt.slice(0, 10)}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1 pl-2">
              <IconBtn onClick={() => setModal({ mode: 'edit', event: ev })} label="수정">
                <Pencil size={15} />
              </IconBtn>
              <IconBtn onClick={() => setModal({ mode: 'delete', event: ev })} label="삭제" danger>
                <Trash2 size={15} />
              </IconBtn>
            </div>
          </div>
        ))}
        {events?.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#a0a0a0]">
            등록된 이벤트/공지가 없습니다.
          </p>
        )}
      </div>

      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <EventFormModal
          initial={modal.mode === 'edit' ? modal.event : undefined}
          onClose={() => setModal(null)}
          onSuccess={invalidate}
        />
      )}
      {modal?.mode === 'delete' && (
        <DeleteModal event={modal.event} onClose={() => setModal(null)} onSuccess={invalidate} />
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#e31e2d] border-t-transparent" />
    </div>
  )
}

function IconBtn({
  onClick,
  label,
  danger,
  children,
}: {
  onClick: () => void
  label: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-8 items-center justify-center rounded-lg ${danger ? 'text-[#e31e2d]' : 'text-[#606060]'} hover:bg-[#f5f5f5]`}
    >
      {children}
    </button>
  )
}

function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/30" onClick={onClose}>
      <div
        className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[16px] font-bold text-black">{title}</p>
          <button type="button" onClick={onClose}>
            <X size={20} className="text-[#606060]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FieldInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#606060]">{label}</label>
      <input
        {...props}
        className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none placeholder:text-[#b0b0b0]"
      />
    </div>
  )
}

function EventFormModal({
  initial,
  onClose,
  onSuccess,
}: {
  initial?: EventResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const isEdit = !!initial
  const [form, setForm] = useState<EventFormData>(() =>
    initial
      ? {
          type: initial.type,
          title: initial.title,
          content: initial.content ?? '',
          imageUrl: initial.imageUrl ?? '',
          linkUrl: initial.linkUrl ?? '',
          startDate: initial.startDate?.slice(0, 10) ?? '',
          endDate: initial.endDate?.slice(0, 10) ?? '',
        }
      : DEFAULT_FORM,
  )

  const set = <K extends keyof EventFormData>(key: K, val: EventFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => {
      const payload = {
        type: form.type,
        title: form.title,
        content: form.content || undefined,
        imageUrl: form.imageUrl || undefined,
        linkUrl: form.linkUrl || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }
      return isEdit ? updateEvent(initial!.eventId, payload) : createEvent(payload)
    },
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title={isEdit ? '이벤트/공지 수정' : '이벤트/공지 추가'} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">유형</label>
          <div className="flex gap-2">
            {(['NOTICE', 'EVENT'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-colors ${
                  form.type === t ? 'bg-[#e31e2d] text-white' : 'bg-[#f5f5f5] text-[#606060]'
                }`}
              >
                {t === 'NOTICE' ? '공지사항' : '이벤트'}
              </button>
            ))}
          </div>
        </div>

        <FieldInput
          label="제목"
          placeholder="제목"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">내용</label>
          <textarea
            placeholder="내용 (선택)"
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            rows={3}
            className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none placeholder:text-[#b0b0b0] resize-none"
          />
        </div>

        <FieldInput
          label="이미지 URL"
          placeholder="https://... (선택)"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
        />
        <FieldInput
          label="링크 URL"
          placeholder="https://... (선택)"
          value={form.linkUrl}
          onChange={(e) => set('linkUrl', e.target.value)}
        />

        {form.type === 'EVENT' && (
          <>
            <FieldInput
              label="시작일"
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
            <FieldInput
              label="종료일"
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </>
        )}

        {error && <p className="text-[12px] text-[#e31e2d]">{(error as Error).message}</p>}

        <button
          type="button"
          disabled={isPending || !form.title}
          onClick={() => mutate()}
          className="mt-1 w-full rounded-xl bg-[#e31e2d] py-3.5 text-[14px] font-bold text-white disabled:opacity-40"
        >
          {isEdit ? '수정' : '추가'}
        </button>
      </div>
    </BottomSheet>
  )
}

function DeleteModal({
  event,
  onClose,
  onSuccess,
}: {
  event: EventResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEvent(event.eventId),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title="삭제 확인" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#333]">
          <span className="font-bold">"{event.title}"</span>을(를) 삭제할까요?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#e0e0e0] py-3 text-[14px] font-bold text-[#606060]"
          >
            취소
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate()}
            className="flex-1 rounded-xl bg-[#e31e2d] py-3 text-[14px] font-bold text-white disabled:opacity-40"
          >
            삭제
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
