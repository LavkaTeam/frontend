import { afterEach, describe, expect, it } from 'vitest';

import { extractErrorMessage, setErrorMessageResolver } from '@/utils/error';

import { getCapacityRetrySeconds, getDemoErrorMessage } from './demoErrors';

const apiError = (code: string, status: number, details?: object) => ({
  error: 'backend text',
  code,
  status,
  details,
});

afterEach(() => setErrorMessageResolver(null));

describe('getDemoErrorMessage', () => {
  it('words the read-only error', () => {
    expect(getDemoErrorMessage(apiError('DEMO_READ_ONLY', 403))).toBe(
      'This action is disabled in the demo.',
    );
  });

  it('names the limit and its maximum', () => {
    expect(
      getDemoErrorMessage(
        apiError('DEMO_LIMIT_REACHED', 409, { limit: 'products', max: 60 }),
      ),
    ).toBe('Demo limit reached: products (max 60).');
  });

  it('shows the upload size limit in megabytes, not bytes', () => {
    expect(
      getDemoErrorMessage(
        apiError('DEMO_LIMIT_REACHED', 409, {
          limit: 'upload size in bytes',
          max: 2_097_152,
        }),
      ),
    ).toBe('Demo limit reached: upload size (max 2 MB).');
  });

  it('tells "starting up" (30 s) from "busy" (600 s)', () => {
    const starting = apiError('DEMO_CAPACITY_REACHED', 503, {
      retryAfterSeconds: 30,
    });
    const busy = apiError('DEMO_CAPACITY_REACHED', 503, {
      retryAfterSeconds: 600,
    });

    expect(getDemoErrorMessage(starting)).toMatch(/starting up/);
    expect(getDemoErrorMessage(busy)).toMatch(/busy right now/);
    expect(getCapacityRetrySeconds(starting)).toBe(30);
    expect(getCapacityRetrySeconds(busy)).toBe(600);
  });

  it('words an ended demo and leaves other errors alone', () => {
    expect(getDemoErrorMessage(apiError('DEMO_SESSION_EXPIRED', 401))).toMatch(
      /demo has ended/,
    );
    expect(getDemoErrorMessage(apiError('NOT_FOUND', 404))).toBeUndefined();
  });
});

describe('extractErrorMessage with the demo resolver', () => {
  it('uses the demo wording once the resolver is registered', () => {
    const error = apiError('DEMO_READ_ONLY', 403);

    expect(extractErrorMessage(error)).toBe('backend text');

    setErrorMessageResolver(getDemoErrorMessage);

    expect(extractErrorMessage(error)).toBe(
      'This action is disabled in the demo.',
    );
    expect(extractErrorMessage(apiError('NOT_FOUND', 404))).toBe(
      'backend text',
    );
  });
});
