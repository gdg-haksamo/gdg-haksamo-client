import { getAccessToken } from '@/apis/http'
import RequireLoginPage from '@/pages/RequireLoginPage'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = getAccessToken()

  if (!token) {
    return (
      <div className="relative flex flex-1 flex-col">
        {children}
        <RequireLoginPage />
      </div>
    )
  }

  return <>{children}</>
}
