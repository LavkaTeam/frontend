import type { UseFormSetError } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import {
  extractErrorMessage,
  getErrorCode,
  getErrorFieldMessage,
  getRetryAfterSeconds,
  isSellerNotVerifiedError,
  retryOnServerError,
} from './error';
import { applyServerFieldErrors } from './formErrors';

describe('extractErrorMessage', () => {
  it('shows the text of coded backend errors as is', () => {
    expect(
      extractErrorMessage({
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      }),
    ).toBe('Invalid email or password.');
    expect(
      extractErrorMessage({
        error: 'Email provider is unavailable.',
        code: 'EMAIL_DELIVERY_FAILED',
        status: 503,
      }),
    ).toBe('Email provider is unavailable.');
  });

  it('uses the fallback for internal and uncoded server errors', () => {
    expect(
      extractErrorMessage(
        { error: 'Boom', code: 'INTERNAL_ERROR', status: 500 },
        'Registration failed.',
      ),
    ).toBe('Registration failed.');
    expect(
      extractErrorMessage({ error: 'Boom', status: 502 }, 'Try later.'),
    ).toBe('Try later.');
  });

  it('never shows the code as a message', () => {
    expect(extractErrorMessage({ code: 'FORBIDDEN' }, 'No access.')).toBe(
      'No access.',
    );
  });

  it('reports network failures', () => {
    expect(extractErrorMessage(new TypeError('Failed to fetch'))).toMatch(
      /unable to reach the server/i,
    );
  });
});

describe('error codes', () => {
  it('reads the code and detects unverified sellers', () => {
    const error = { error: 'Pending', code: 'SELLER_NOT_VERIFIED' };

    expect(getErrorCode(error)).toBe('SELLER_NOT_VERIFIED');
    expect(isSellerNotVerifiedError(error)).toBe(true);
    expect(isSellerNotVerifiedError({ code: 'FORBIDDEN' })).toBe(false);
  });
});

describe('retryOnServerError', () => {
  it('retries only network and server failures', () => {
    expect(retryOnServerError(0, { status: 503 })).toBe(true);
    expect(retryOnServerError(0, new TypeError('Failed to fetch'))).toBe(true);
    expect(retryOnServerError(0, { status: 403 })).toBe(false);
    expect(retryOnServerError(3, { status: 500 })).toBe(false);
  });
});

describe('getErrorFieldMessage', () => {
  it('returns the message for a validation field', () => {
    const error = { email: 'Please enter a valid email address' };

    expect(getErrorFieldMessage(error, 'email')).toBe(
      'Please enter a valid email address',
    );
    expect(getErrorFieldMessage(error, 'password')).toBe('');
  });

  it('ignores inherited properties of Error instances', () => {
    const networkError = new TypeError('Failed to fetch');

    expect(getErrorFieldMessage(networkError, 'name')).toBe('');
    expect(getErrorFieldMessage(networkError, 'message')).toBe('');
  });
});

describe('applyServerFieldErrors', () => {
  it('maps backend fields to form fields and focuses the first one', () => {
    const calls: Array<[string, string, boolean | undefined]> = [];
    const setError = ((
      name: string,
      error: { message?: string },
      options?: { shouldFocus?: boolean },
    ) => {
      calls.push([name, error.message || '', options?.shouldFocus]);
    }) as unknown as UseFormSetError<{ name: string; telephoneNumber: string }>;

    const applied = applyServerFieldErrors(
      { status: 400, firstName: 'Too short', phoneNumber: 'Bad phone' },
      setError,
      { name: ['firstName', 'name'], telephoneNumber: ['phoneNumber'] },
    );

    expect(applied).toBe(true);
    expect(calls).toEqual([
      ['name', 'Too short', true],
      ['telephoneNumber', 'Bad phone', false],
    ]);
  });

  it('applies nothing for errors without field messages', () => {
    const setError = (() => undefined) as unknown as UseFormSetError<{
      name: string;
    }>;

    expect(
      applyServerFieldErrors(new TypeError('Failed to fetch'), setError, {
        name: ['name'],
      }),
    ).toBe(false);
  });
});

describe('getRetryAfterSeconds', () => {
  it('reads details.retryAfterSeconds of 429 only', () => {
    expect(
      getRetryAfterSeconds({
        status: 429,
        code: 'TOO_MANY_REQUESTS',
        details: { retryAfterSeconds: 900 },
      }),
    ).toBe(900);
    expect(getRetryAfterSeconds({ status: 429, code: 'TOO_MANY_REQUESTS' })).toBe(
      60,
    );
    expect(getRetryAfterSeconds({ status: 401, code: 'INVALID_CREDENTIALS' })).toBe(
      0,
    );
  });
});
