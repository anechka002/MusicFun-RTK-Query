import * as z from 'zod'
import {
  loginResponseSchema,
  type meResponseSchema
} from "@/features/auth/model/auth.schemas.ts";

export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// Arguments
export type LoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL?: string
  rememberMe: boolean
}