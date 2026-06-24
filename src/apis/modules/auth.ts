import { httpPost } from '../http'
import { ENDPOINTS } from '../endpoints'
import type {
  SendCodeRequest,
  VerifyCodeRequest,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  TokenResponse,
} from '../types'

export const sendCode = (email: string) =>
  httpPost(ENDPOINTS.AUTH.SEND_CODE, { email } satisfies SendCodeRequest)

export const verifyCode = (email: string, code: string) =>
  httpPost(ENDPOINTS.AUTH.VERIFY_CODE, { email, code } satisfies VerifyCodeRequest)

export const signUp = (data: SignUpRequest) => httpPost<SignUpResponse>(ENDPOINTS.AUTH.SIGNUP, data)

export const login = (data: LoginRequest) =>
  httpPost<TokenResponse>(ENDPOINTS.AUTH.LOGIN, data, { skipRefresh: true })

export const logout = () => httpPost(ENDPOINTS.AUTH.LOGOUT)
