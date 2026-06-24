import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { sendCode, verifyCode, signUp, login } from '@/apis/auth'
import { setAccessToken } from '@/apis/http'
import { useAuthStore } from '@/store/authStore'
import { Footer } from '@/components/layouts/Footer'
import type { KeywordCode } from '@/apis/types'

const RESTAURANTS = [
  { restaurantId: 1, name: '정보센터' },
  { restaurantId: 2, name: '복지관' },
  { restaurantId: 3, name: '카페테리아 첨성' },
  { restaurantId: 4, name: '글로벌플라자' },
  { restaurantId: 5, name: '공식당 학생식당' },
  { restaurantId: 6, name: '공식당 교직원식당' },
]

const KEYWORD_GROUPS = [
  {
    category: '맛 취향',
    keywords: [
      { name: 'SPICY', label: '매운 음식' },
      { name: 'MILD', label: '순한 음식' },
      { name: 'SWEET', label: '단 음식' },
      { name: 'SOUR', label: '신 음식' },
    ],
  },
  {
    category: '음식 종류',
    keywords: [
      { name: 'NOODLE', label: '면류' },
      { name: 'RICE', label: '밥류' },
      { name: 'MEAT', label: '육류' },
      { name: 'SEAFOOD', label: '해산물' },
      { name: 'VEGETARIAN', label: '채식' },
      { name: 'SOUP', label: '국/찌개' },
      { name: 'SALAD', label: '샐러드' },
      { name: 'SANDWICH', label: '빵/샌드위치' },
    ],
  },
  {
    category: '요리 종류',
    keywords: [
      { name: 'KOREAN', label: '한식' },
      { name: 'CHINESE', label: '중식' },
      { name: 'JAPANESE', label: '일식' },
      { name: 'WESTERN', label: '양식' },
    ],
  },
  {
    category: '건강 목표',
    keywords: [
      { name: 'LOW_CALORIE', label: '저칼로리' },
      { name: 'HIGH_PROTEIN', label: '고단백' },
    ],
  },
] as const

const TIMER_INITIAL = 157

function formatTimer(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ── 스텝 인디케이터 ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center">
      {([1, 2, 3] as const).map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex size-7 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
              step <= currentStep
                ? 'border-[#E31E2D] bg-[#E31E2D] text-white'
                : 'border-[#D0D0D0] bg-white text-[#D0D0D0]'
            }`}
          >
            {step}
          </div>
          {i < 2 && (
            <div
              className={`h-[2px] w-[100px] ${step < currentStep ? 'bg-[#E31E2D]' : 'bg-[#D0D0D0]'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── 공통 입력 ────────────────────────────────────────────────────────────────

function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-4 py-4 text-[14px] text-black outline-none placeholder:text-[#A0A0A0] ${props.className ?? ''}`}
    />
  )
}

// ── 칩 선택 ──────────────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
        selected ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'
      }`}
    >
      {label}
    </button>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [timer, setTimer] = useState(TIMER_INITIAL)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Step 2
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [selectedRestaurantIds, setSelectedRestaurantIds] = useState<number[]>([])

  // Step 3
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(TIMER_INITIAL)
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendCodeMutation = useMutation({
    mutationFn: () => sendCode(email),
    onSuccess: () => {
      setEmailSent(true)
      setCode('')
      setCodeError(false)
      startTimer()
    },
  })

  const verifyCodeMutation = useMutation({
    mutationFn: () => verifyCode(email, code),
    onSuccess: () => setStep(2),
    onError: () => setCodeError(true),
  })

  const setAuth = useAuthStore((s) => s.setAuth)

  const signupMutation = useMutation({
    mutationFn: async () => {
      await signUp({
        email,
        password,
        nickname,
        department: department || undefined,
        restaurantIds: selectedRestaurantIds.length > 0 ? selectedRestaurantIds : undefined,
        keywords: selectedKeywords.length > 0 ? (selectedKeywords as KeywordCode[]) : undefined,
      })
      const { accessToken } = await login({ email, password })
      setAccessToken(accessToken)
    },
    onSuccess: () => {
      setAuth(nickname)
      navigate('/')
    },
  })

  const toggleRestaurant = (id: number) => {
    setSelectedRestaurantIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    )
  }

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw],
    )
  }

  const isStep1Valid = emailSent && code.length === 6 && !codeError
  const isStep2Valid = nickname.length >= 2 && nickname.length <= 8 && password.length >= 1

  const handleNext = () => {
    if (step === 1) verifyCodeMutation.mutate()
    if (step === 2) setStep(3)
  }

  const handleBack = () => {
    if (step === 1) navigate(-1)
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  return (
    <div className="min-h-dvh bg-white md:bg-[#eceef3]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col overflow-hidden bg-white md:shadow-[0_0_20px_rgba(29,32,56,0.14)]">
        <header className="flex h-[65px] w-full shrink-0 items-center justify-between px-5 shadow-[0px_2px_4px_0px_rgba(205,205,205,0.25)]">
          <button type="button" onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft size={28} className="text-black" />
          </button>
          <p className="text-[20px] font-extrabold leading-none text-black">회원가입</p>
          <div className="size-7" />
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <div className="mb-6 flex justify-center">
            <StepIndicator currentStep={step} />
          </div>

          {/* ── Step 1: 이메일 인증 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[18px] font-bold text-black">이메일 인증</h2>
                <p className="text-[13px] text-[#A0A0A0]">이메일을 인증해주세요</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[14px] font-semibold text-black">이메일</label>
                <div className="flex gap-2">
                  <AuthInput
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={emailSent}
                  />
                  <button
                    type="button"
                    onClick={() => sendCodeMutation.mutate()}
                    disabled={!email || sendCodeMutation.isPending}
                    className="shrink-0 rounded-[8px] bg-[#E31E2D] px-4 py-3 text-[13px] font-bold text-white disabled:opacity-50"
                  >
                    {emailSent ? '인증번호 재전송' : '인증번호 받기'}
                  </button>
                </div>

                {emailSent && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-semibold text-black">인증번호</label>
                    <div
                      className={`flex items-center rounded-[12px] border bg-[#F5F5F5] px-4 py-4 ${codeError ? 'border-[#E31E2D]' : 'border-[#E0E0E0]'}`}
                    >
                      <input
                        type="text"
                        placeholder="인증번호 6자리를 입력하세요"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value)
                          setCodeError(false)
                        }}
                        maxLength={6}
                        className="flex-1 bg-transparent text-[14px] text-black outline-none placeholder:text-[#A0A0A0]"
                      />
                      <span className="text-[14px] text-[#A0A0A0]">{formatTimer(timer)}</span>
                    </div>
                    {codeError && (
                      <p className="text-[12px] text-[#E31E2D]">인증번호를 다시 입력해주세요</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: 기본 정보 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[18px] font-bold text-black">기본 정보</h2>
                <p className="text-[13px] text-[#A0A0A0]">닉네임과 비밀번호를 설정해주세요</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-black">닉네임</label>
                  <AuthInput
                    type="text"
                    placeholder="닉네임을 입력하세요 (2~8자)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={8}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-black">비밀번호</label>
                  <AuthInput
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-black">학과</label>
                  <AuthInput
                    type="text"
                    placeholder="학과를 입력하세요"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-black">식당 선택</p>
                    <p className="text-[12px] text-[#A0A0A0]">
                      자주 가는 식당을 선택해주세요 (복수 선택 가능)
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RESTAURANTS.map((r) => (
                      <Chip
                        key={r.restaurantId}
                        label={r.name}
                        selected={selectedRestaurantIds.includes(r.restaurantId)}
                        onToggle={() => toggleRestaurant(r.restaurantId)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: 키워드 선택 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[18px] font-bold text-black">키워드 선택</h2>
                <p className="text-[13px] text-[#A0A0A0]">
                  선호하는 음식 키워드를 선택해주세요 (복수 선택 가능)
                </p>
                <p className="mt-1 text-[12px] text-[#606060]">
                  선택된 키워드 : {selectedKeywords.length}개
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {KEYWORD_GROUPS.map(({ category, keywords }) => (
                  <div key={category} className="flex flex-col gap-2">
                    <p className="text-[13px] font-semibold text-black">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <Chip
                          key={kw.name}
                          label={kw.label}
                          selected={selectedKeywords.includes(kw.name)}
                          onToggle={() => toggleKeyword(kw.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* 하단 버튼 */}
        <div className="px-5 pb-2 pt-3 shrink-0">
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                verifyCodeMutation.isPending
              }
              className="w-full rounded-[12px] bg-[#E31E2D] py-4 text-[16px] font-bold text-white disabled:opacity-40"
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signupMutation.mutate()}
              disabled={signupMutation.isPending}
              className="w-full rounded-[12px] bg-[#E31E2D] py-4 text-[16px] font-bold text-white disabled:opacity-50"
            >
              완료
            </button>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
