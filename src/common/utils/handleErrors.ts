import {toast} from "react-toastify";
import {isErrorWithProperty} from "@/common/utils/isErrorWithProperty.ts";
import {isErrorWithDetailArray} from "@/common/utils/isErrorWithDetailArray.ts";
import {trimToMaxLength} from "@/common/utils/trimToMaxLength.ts";
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

export const handleErrors = (error: FetchBaseQueryError) => {
  if(error) {
    // debugger
    switch (error.status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
      case 'TIMEOUT_ERROR':
        toast(error.error, { type: 'error', theme: 'colored' })
        break

      case 404:
        if(isErrorWithProperty(error.data, 'error')) {
          toast(error.data.error, { type: 'error', theme: 'colored' })
        } else {
          toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
        }
        break

      case 403:
        if (isErrorWithDetailArray(error.data)) {
          toast(error.data.errors[0].detail, { type: "error", theme: "colored" })
        } else {
          toast(JSON.stringify(error.data), { type: "error", theme: "colored" })
        }
        break

      case 400:
        if (isErrorWithDetailArray(error.data)) {
          toast(trimToMaxLength(error.data.errors[0].detail), { type: "error", theme: "colored" })
        } else {
          toast(JSON.stringify(error.data), { type: "error", theme: "colored" })
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
          toast(error.data.message, { type: 'error', theme: 'colored' })
        } else {
          toast(JSON.stringify(error.data), { type: 'error', theme: 'colored' })
        }
        break

      default:
        if (error.status >= 500 && error.status < 600) {
          toast("Server error occurred. Please try again later.", { type: "error", theme: "colored" })
        } else {
          toast("Some error occurred", { type: "error", theme: "colored" })
        }
    }
  }
}