import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import {
  createAdminMenu,
  deleteAdminMenu,
  getAdminMenus,
  toggleSoldOut,
  updateAdminMenu,
} from '@/apis/modules/admin'
import type { ManagedMenuResponse, MealTime } from '@/apis/types'

const MEAL_TIME_LABEL: Record<MealTime, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
}

type Modal =
  | { type: 'create' }
  | { type: 'edit'; menu: ManagedMenuResponse }
  | { type: 'delete'; menu: ManagedMenuResponse }
  | null

type Props = {
  managedRestaurantId: number | null
}

export default function MenuManagement({ managedRestaurantId }: Props) {
  const qc = useQueryClient()
  const [modal, setModal] = useState<Modal>(null)

  const { data: menus, isLoading } = useQuery({
    queryKey: ['admin-menus'],
    queryFn: () => getAdminMenus(),
  })

  const { mutate: toggleSoldOutMutate } = useMutation({
    mutationFn: (scheduleId: number) => toggleSoldOut(scheduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-menus'] }),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-menus'] })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-4 p-5">
      <button
        type="button"
        onClick={() => setModal({ type: 'create' })}
        className="flex items-center gap-2 self-start rounded-xl bg-[#e31e2d] px-4 py-2.5 text-[13px] font-bold text-white"
      >
        <Plus size={15} />
        메뉴 추가
      </button>

      <div className="flex flex-col gap-2">
        {menus?.map((menu) => (
          <div
            key={menu.scheduleId}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)]"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-[14px] font-semibold text-black">{menu.name}</span>
                <span className="shrink-0 rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-semibold text-[#606060]">
                  {MEAL_TIME_LABEL[menu.time]}
                </span>
                {menu.soldOut && (
                  <span className="shrink-0 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[10px] font-bold text-[#a0a0a0]">
                    품절
                  </span>
                )}
              </div>
              <span className="text-[12px] text-[#606060]">{menu.price.toLocaleString()}원</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 pl-2">
              <button
                type="button"
                onClick={() => toggleSoldOutMutate(menu.scheduleId)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                  menu.soldOut ? 'bg-[#1a9e5c] text-white' : 'bg-[#f5f5f5] text-[#606060]'
                }`}
              >
                {menu.soldOut ? '품절 해제' : '품절'}
              </button>
              <IconBtn onClick={() => setModal({ type: 'edit', menu })} label="수정">
                <Pencil size={15} />
              </IconBtn>
              <IconBtn onClick={() => setModal({ type: 'delete', menu })} label="삭제" danger>
                <Trash2 size={15} />
              </IconBtn>
            </div>
          </div>
        ))}
        {menus?.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#a0a0a0]">등록된 메뉴가 없습니다.</p>
        )}
      </div>

      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <MenuFormModal
          initial={modal.type === 'edit' ? modal.menu : undefined}
          managedRestaurantId={managedRestaurantId}
          onClose={() => setModal(null)}
          onSuccess={invalidate}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal menu={modal.menu} onClose={() => setModal(null)} onSuccess={invalidate} />
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
      <div className="w-full rounded-t-2xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
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

function MenuFormModal({
  initial,
  managedRestaurantId,
  onClose,
  onSuccess,
}: {
  initial?: ManagedMenuResponse
  managedRestaurantId: number | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [time, setTime] = useState<MealTime>(initial?.time ?? 'LUNCH')

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      isEdit
        ? updateAdminMenu(initial!.menuId, { name, price: Number(price) })
        : createAdminMenu({
            restaurantId: managedRestaurantId!,
            name,
            price: Number(price),
            time,
          }),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title={isEdit ? '메뉴 수정' : '메뉴 추가'} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">메뉴명</label>
          <input
            placeholder="메뉴 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none placeholder:text-[#b0b0b0]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">가격 (원)</label>
          <input
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none placeholder:text-[#b0b0b0]"
          />
        </div>
        {!isEdit && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#606060]">끼니</label>
            <div className="flex gap-2">
              {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-colors ${
                    time === t ? 'bg-[#e31e2d] text-white' : 'bg-[#f5f5f5] text-[#606060]'
                  }`}
                >
                  {MEAL_TIME_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-[12px] text-[#e31e2d]">{(error as Error).message}</p>}
        <button
          type="button"
          disabled={isPending || !name || !price || (!isEdit && !managedRestaurantId)}
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
  menu,
  onClose,
  onSuccess,
}: {
  menu: ManagedMenuResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteAdminMenu(menu.menuId),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title="메뉴 삭제" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#333]">
          <span className="font-bold">"{menu.name}"</span>을(를) 삭제할까요?
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
