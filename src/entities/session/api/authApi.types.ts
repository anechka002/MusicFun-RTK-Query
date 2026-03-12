import * as z from 'zod'
import {
  loginResponseSchema,
  type meResponseSchema
} from '@/entities/session/model/auth.schemas'

export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// Arguments
export type LoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL?: string
  rememberMe: boolean
}
