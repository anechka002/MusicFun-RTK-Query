export function isErrorWithDetailArray(error: unknown): error is { errors: {detail: string}[] } {
  return (
    typeof error === 'object' && // Проверяем, что error – это объект
    error != null && // Убеждаемся, что это не null
    'errors' in error && // Проверяем, что у объекта есть свойство 'errors'
    Array.isArray((error as any).errors) && // Проверяем, что это массив
    (error as any).errors.length > 0 && // Проверяем, что длина массива > 0
    typeof (error as any).errors[0].detail === 'string' // Проверяем, что в массиве[0] есть detail и является строкой
  )
}