import { useState } from 'react'
import { Gift, Moon, Sun, Utensils, type LucideIcon } from 'lucide-react'

type NotificationId = 'morning' | 'lunch' | 'dinner' | 'event'

type NotificationItem = {
  id: NotificationId
  title: string
  subtitle: string
  icon: LucideIcon
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'morning',
    title: '아침 알림',
    subtitle: '07:30 | 추천 메뉴 알림',
    icon: Sun,
  },
  {
    id: 'lunch',
    title: '점심 알림',
    subtitle: '11:30 | 추천 메뉴 알림',
    icon: Utensils,
  },
  {
    id: 'dinner',
    title: '저녁 알림',
    subtitle: '17:30 | 추천 메뉴 알림',
    icon: Moon,
  },
  {
    id: 'event',
    title: '이벤트/공지 알림',
    subtitle: '새 이벤트 등록 시',
    icon: Gift,
  },
]

const INITIAL_SETTINGS: Record<NotificationId, boolean> = {
  morning: true,
  lunch: true,
  dinner: true,
  event: true,
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? 'bg-[#E31E2D]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

export function PushNotification() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)

  const allEnabled = Object.values(settings).every(Boolean)

  const handleMasterToggle = () => {
    const nextValue = !allEnabled
    setSettings({
      morning: nextValue,
      lunch: nextValue,
      dinner: nextValue,
      event: nextValue,
    })
  }

  const handleItemToggle = (id: NotificationId) => {
    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">푸시 알림</div>
          <ToggleSwitch checked={allEnabled} onChange={handleMasterToggle} label="푸시 알림 전체" />
        </div>

        <div className="flex flex-col gap-2">
          {NOTIFICATIONS.map(({ id, title, subtitle, icon: Icon }) => {
            const enabled = settings[id]

            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-[12px] border border-[#E0E0E0] bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${
                      enabled ? 'bg-[#FCE8EA]' : 'bg-[#E0E0E0]'
                    }`}
                  >
                    <Icon size={18} className={enabled ? 'text-[#E31E2D]' : 'text-[#606060]'} />
                  </div>

                  <div className="flex flex-col">
                    <div className="text-[12px] font-bold">{title}</div>
                    <div className="text-[11px] font-regular text-[#A0A0A0]">{subtitle}</div>
                  </div>
                </div>

                <ToggleSwitch
                  checked={enabled}
                  onChange={() => handleItemToggle(id)}
                  label={title}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
