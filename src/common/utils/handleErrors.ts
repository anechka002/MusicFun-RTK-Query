import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {errorToast, isErrorWithProperty, isErrorWithDetailArray, trimToMaxLength} from "@/common/utils";

export const handleErrors = (error: FetchBaseQueryError) => {
  if(error) {
    // debugger
    switch (error.status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
      case 'TIMEOUT_ERROR':
        errorToast(error.error)
        break

      case 404:
        if(isErrorWithProperty(error.data, 'error')) {
          errorToast(error.data.error)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      case 403:
        if (isErrorWithDetailArray(error.data)) {
          errorToast(error.data.errors[0].detail,)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      case 400:
        if (isErrorWithDetailArray(error.data)) {
          errorToast(trimToMaxLength(error.data.errors[0].detail))
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      case 401:
      case 429: // API KEY
                // ✅ 1. Type Assertions
                // toast((result.error.data as { message: string }).message, { type: 'error', theme: 'colored' })
                // ✅ 2. JSON.stringify
                // toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
                // ✅ 3. Type Predicate
        if (isErrorWithProperty(error.data, 'message')) {
          errorToast(error.data.message)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      default:
        if (error.status >= 500 && error.status < 600) {
          errorToast("Server error occurred. Please try again later.", error)
        } else {
          errorToast("Some error occurred")
        }
    }
  }
}