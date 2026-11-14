import type { ErrorRequestHandler } from 'express';

import {
  AuthServiceError
} from '../modules/auth/services/auth.service.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {

  // ========================================
  // 1. AUTHENTICATION ERRORS
  // ========================================

  if (error instanceof AuthServiceError) {

    response.status(error.statusCode).json({
      error: error.message
    });

    return;
  }

  // ========================================
  // 2. INTERNAL SERVER ERRORS
  // ========================================

  console.error('Unhandled request error:', error);

  response.status(500).json({
    error: 'Internal server error'
  });

};