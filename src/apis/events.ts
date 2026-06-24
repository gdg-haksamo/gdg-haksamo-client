import { httpGet } from './http'
import { ENDPOINTS } from './endpoints'
import type { EventResponse } from './types'

export const getEvents = () => httpGet<EventResponse[]>(ENDPOINTS.EVENTS.LIST)
export const getEvent = (eventId: number) =>
  httpGet<EventResponse>(ENDPOINTS.EVENTS.DETAIL(eventId))
