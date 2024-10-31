import { Elysia } from 'elysia'

export const errorHandler = new Elysia().onError(({ code, error, set }) => {
  console.error(`[${code}] ${error.message}`)

  switch (code) {
    case 'VALIDATION':
      set.status = 400
      return {
        success: false,
        message: 'Validation error',
        error: error.message,
      }
    case 'NOT_FOUND':
      set.status = 404
      return {
        success: false,
        message: 'Resource not found',
        error: error.message,
      }
    default:
      set.status = 500
      return {
        success: false,
        message: 'Internal server error',
        error: error.message,
      }
  }
})
