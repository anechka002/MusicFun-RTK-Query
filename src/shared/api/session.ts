import { Path } from '@/shared/config/routes'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null
let isUnauthorizedHandled = false

export const registerUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null
    }
  }
}

export const resetUnauthorizedHandling = () => {
  isUnauthorizedHandled = false
}

export const handleUnauthorizedSession = () => {
  if (isUnauthorizedHandled) {
    return
  }

  isUnauthorizedHandled = true
  unauthorizedHandler?.()
  window.location.replace(Path.Main)
}
