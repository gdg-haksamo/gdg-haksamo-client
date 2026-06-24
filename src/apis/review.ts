import { httpDelete, httpGet, httpPost } from './http'
import { ENDPOINTS } from './endpoints'

// 리뷰 목록 조회 응답 타입
export type ReviewResponse = {
  reviewId: number
  userId: number
  restaurant: string
  menuName: string
  rating: number
  content: string
  createdAt: string
  helpfulCount: number
}

// 리뷰 작성 요청 타입
export type ReviewCreateRequest = {
  rating: number
  content: string
}

// 메뉴 리뷰 목록 조회
export const getMenuReviews = (menuId: number) =>
  httpGet<ReviewResponse[]>(ENDPOINTS.MENUS.REVIEWS(menuId))

// 리뷰 작성
export const createReview = (menuId: number, data: ReviewCreateRequest) =>
  httpPost<ReviewResponse>(ENDPOINTS.MENUS.REVIEWS(menuId), data)

// 도움됐어요 토글
export const toggleHelpful = (reviewId: number) => httpPost(ENDPOINTS.REVIEWS.HELPFUL(reviewId))

// 리뷰 삭제
export const deleteReview = (reviewId: number) => httpDelete(ENDPOINTS.REVIEWS.DELETE(reviewId))
