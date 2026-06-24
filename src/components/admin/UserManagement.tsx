import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, KeyRound, UserCog, Plus, X } from 'lucide-react'
import {
  createRestaurantAdmin,
  deleteUser,
  getAdminUsers,
  resetUserPassword,
  updateUserRole,
} from '@/apis/admin'
import { getRestaurants } from '@/apis/restaurants'
import type { AdminUserResponse, UserRole } from '@/apis/types'

const ROLE_LABEL: Record<UserRole, string> = {
  USER: '일반',
  RESTAURANT_ADMIN: '식당 관리자',
  SUPER_ADMIN: '슈퍼 관리자',
}

const ROLE_BADGE: Record<UserRole, string> = {
  USER: 'bg-[#f0f0f0] text-[#606060]',
  RESTAURANT_ADMIN: 'bg-[#fff3e0] text-[#e65100]',
  SUPER_ADMIN: 'bg-[#fce8ea] text-[#e31e2d]',
}

type Modal =
  | { type: 'create' }
  | { type: 'role'; user: AdminUserResponse }
  | { type: 'password'; user: AdminUserResponse }
  | { type: 'delete'; user: AdminUserResponse }
  | null

export default function UserManagement() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<Modal>(null)
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getAdminUsers(page),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-users'] })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-4 p-5">
      <button
        type="button"
        onClick={() => setModal({ type: 'create' })}
        className="flex items-center gap-2 self-start rounded-xl bg-[#e31e2d] px-4 py-2.5 text-[13px] font-bold text-white"
      >
        <Plus size={15} />
        식당 운영자 계정 발급
      </button>

      <div className="flex flex-col gap-2">
        {data?.users.map((u) => (
          <div
            key={u.userId}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)]"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-black">{u.nickname}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_BADGE[u.role]}`}
                >
                  {ROLE_LABEL[u.role]}
                </span>
              </div>
              <span className="text-[12px] text-[#a0a0a0]">{u.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconBtn onClick={() => setModal({ type: 'role', user: u })} label="역할 변경">
                <UserCog size={16} />
              </IconBtn>
              <IconBtn
                onClick={() => setModal({ type: 'password', user: u })}
                label="비밀번호 재설정"
              >
                <KeyRound size={16} />
              </IconBtn>
              <IconBtn onClick={() => setModal({ type: 'delete', user: u })} label="삭제" danger>
                <Trash2 size={16} />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-[13px] disabled:opacity-30"
          >
            이전
          </button>
          <span className="text-[13px] text-[#606060]">
            {page + 1} / {data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-[13px] disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}

      {modal?.type === 'create' && (
        <CreateAdminModal onClose={() => setModal(null)} onSuccess={invalidate} />
      )}
      {modal?.type === 'role' && (
        <RoleModal user={modal.user} onClose={() => setModal(null)} onSuccess={invalidate} />
      )}
      {modal?.type === 'password' && (
        <PasswordModal user={modal.user} onClose={() => setModal(null)} onSuccess={invalidate} />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal user={modal.user} onClose={() => setModal(null)} onSuccess={invalidate} />
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

function Input({
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

function CreateAdminModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ email: '', password: '', nickname: '', restaurantId: '' })
  const { data: restaurants } = useQuery({ queryKey: ['restaurants'], queryFn: getRestaurants })

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      createRestaurantAdmin({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        restaurantId: Number(form.restaurantId),
      }),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title="식당 운영자 계정 발급" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Input
          label="이메일"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <Input
          label="닉네임"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">담당 식당</label>
          <select
            value={form.restaurantId}
            onChange={(e) => setForm((f) => ({ ...f, restaurantId: e.target.value }))}
            className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none"
          >
            <option value="">식당 선택</option>
            {restaurants?.map((r) => (
              <option key={r.restaurantId} value={r.restaurantId}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-[12px] text-[#e31e2d]">{(error as Error).message}</p>}
        <button
          type="button"
          disabled={
            isPending || !form.email || !form.password || !form.nickname || !form.restaurantId
          }
          onClick={() => mutate()}
          className="mt-1 w-full rounded-xl bg-[#e31e2d] py-3.5 text-[14px] font-bold text-white disabled:opacity-40"
        >
          발급
        </button>
      </div>
    </BottomSheet>
  )
}

function RoleModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUserResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const [role, setRole] = useState<UserRole>(user.role)
  const [restaurantId, setRestaurantId] = useState(String(user.managedRestaurantId ?? ''))
  const { data: restaurants } = useQuery({ queryKey: ['restaurants'], queryFn: getRestaurants })

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateUserRole(user.userId, {
        role,
        managedRestaurantId: role === 'RESTAURANT_ADMIN' ? Number(restaurantId) : undefined,
      }),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title={`역할 변경 · ${user.nickname}`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#606060]">역할</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none"
          >
            <option value="USER">일반 사용자</option>
            <option value="RESTAURANT_ADMIN">식당 관리자</option>
            <option value="SUPER_ADMIN">슈퍼 관리자</option>
          </select>
        </div>
        {role === 'RESTAURANT_ADMIN' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#606060]">담당 식당</label>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="rounded-xl bg-[#f5f5f5] px-4 py-3 text-[14px] outline-none"
            >
              <option value="">식당 선택</option>
              {restaurants?.map((r) => (
                <option key={r.restaurantId} value={r.restaurantId}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={() => mutate()}
          className="mt-1 w-full rounded-xl bg-[#e31e2d] py-3.5 text-[14px] font-bold text-white disabled:opacity-40"
        >
          변경
        </button>
      </div>
    </BottomSheet>
  )
}

function PasswordModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUserResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const [newPassword, setNewPassword] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: () => resetUserPassword(user.userId, { newPassword }),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title={`비밀번호 재설정 · ${user.nickname}`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Input
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          disabled={isPending || !newPassword}
          onClick={() => mutate()}
          className="mt-1 w-full rounded-xl bg-[#e31e2d] py-3.5 text-[14px] font-bold text-white disabled:opacity-40"
        >
          재설정
        </button>
      </div>
    </BottomSheet>
  )
}

function DeleteModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUserResponse
  onClose: () => void
  onSuccess: () => void
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUser(user.userId),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <BottomSheet title="계정 삭제" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#333]">
          <span className="font-bold">{user.nickname}</span> ({user.email}) 계정을 삭제할까요?
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
