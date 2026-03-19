import {
  errorToast,
  isErrorWithDetailArray,
  isErrorWithProperty,
  trimToMaxLength
} from '@/shared/lib/utils'

export type QueryErrorStatus =
  | number
  | 'FETCH_ERROR'
  | 'PARSING_ERROR'
  | 'CUSTOM_ERROR'
  | 'TIMEOUT_ERROR'

export type QueryError = {
  status: QueryErrorStatus
  data?: unknown
  error?: string
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Unknown error'
}

export const toFetchError = (error: unknown): QueryError => ({
  status: 'FETCH_ERROR',
  error: getErrorMessage(error),
})

export const toQueryError = (
  status: number | 'CUSTOM_ERROR',
  data?: unknown,
  error?: string
): QueryError => ({
  status,
  data,
  error,
})

export const handleErrors = (error: QueryError | undefined) => {
  if (!error) return

  switch (error.status) {
    case 'FETCH_ERROR':
    case 'PARSING_ERROR':
    case 'CUSTOM_ERROR':
    case 'TIMEOUT_ERROR':
      errorToast(error.error ?? 'Unknown error')
      break

    case 404:
      if (isErrorWithProperty(error.data, 'error')) {
        errorToast(String(error.data.error))
      } else {
        errorToast(JSON.stringify(error.data))
      }
      break

    case 403: {
      if (isErrorWithDetailArray(error.data)) {
        const detail = error.data.errors?.[0]?.detail
        errorToast(detail ?? JSON.stringify(error.data))
      } else {
        errorToast(JSON.stringify(error.data))
      }
      break
    }

    case 400: {
      if (isErrorWithDetailArray(error.data)) {
        const errorMessage = error.data.errors?.[0]?.detail

        if (!errorMessage) {
          errorToast(JSON.stringify(error.data))
          return
        }

        if (errorMessage.includes('refresh')) return

        errorToast(trimToMaxLength(errorMessage))
      } else {
        errorToast(JSON.stringify(error.data))
      }
      break
    }

    case 429:
      if (isErrorWithProperty(error.data, 'message')) {
        errorToast(String(error.data.message))
      } else {
        errorToast(JSON.stringify(error.data))
      }
      break

    default:
      if (error.status >= 500 && error.status < 600) {
        errorToast('Server error occurred. Please try again later.')
      } else {
        errorToast(error.error ?? 'Some error occurred')
      }
  }
}


// export const handleErrors = (error: FetchBaseQueryError) => {
//   if(error) {
//     // debugger
//     switch (error.status) {
//       case 'FETCH_ERROR':
//       case 'PARSING_ERROR':
//       case 'CUSTOM_ERROR':
//       case 'TIMEOUT_ERROR':
//         errorToast(error.error)
//         break
//
//       case 404:
//         if(isErrorWithProperty(error.data, 'error')) {
//           errorToast(error.data.error)
//         } else {
//           errorToast(JSON.stringify(error.data))
//         }
//         break
//
//       case 403:
//         if (isErrorWithDetailArray(error.data)) {
//           errorToast(error.data.errors[0].detail,)
//         } else {
//           errorToast(JSON.stringify(error.data))
//         }
//         break
//
//       case 400:
//         if (isErrorWithDetailArray(error.data)) {
//           const errorMessage = error.data.errors[0].detail
//           if(errorMessage.includes('refresh')) return
//           errorToast(trimToMaxLength(error.data.errors[0].detail))
//         } else {
//           errorToast(JSON.stringify(error.data))
//         }
//         break
//
//       case 429: // API KEY
//                 // ✅ 1. Type Assertions
//                 // toast((result.error.data as { message: string }).message, { type: 'error', theme: 'colored' })
//                 // ✅ 2. JSON.stringify
//                 // toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
//                 // ✅ 3. Type Predicate
//         if (isErrorWithProperty(error.data, 'message')) {
//           errorToast(error.data.message)
//         } else {
//           errorToast(JSON.stringify(error.data))
//         }
//         break
//
//       default:
//         if (error.status >= 500 && error.status < 600) {
//           errorToast("Server error occurred. Please try again later.", error)
//         } else {
//           errorToast("Some error occurred")
//         }
//     }
//   }
// }
