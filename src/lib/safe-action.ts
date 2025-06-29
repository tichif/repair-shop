import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { type NeonDbError } from '@neondatabase/serverless';

function isNeonDbError(error: unknown): error is NeonDbError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string'
  );
}

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(error, utils) {
    const { clientInput, metadata } = utils;

    const dbError = (error as any).cause ?? error;

    if (isNeonDbError(dbError)) {
      if (dbError.code === '23505') {
        return `Unique entry required. ${dbError.detail}`;
      }
    }

    Sentry.captureException(error, (scope) => {
      scope.clear();
      scope.setContext('serverError', { message: error.message });
      scope.setContext('metadata', { actionName: metadata?.actionName });
      scope.setContext('clientInput', { clientInput });
      return scope;
    });

    if (error.constructor.name === 'DrizzleQueryError') {
      return 'Database error occurred. Please try again later.';
    }

    return error.message;
  },
});
