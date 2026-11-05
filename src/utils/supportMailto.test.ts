import { describe, expect, it } from 'vitest';

import { supportSchema } from '@/schemas/supportSchema';

import { buildSupportMailto } from './supportMailto';

describe('support form', () => {
  it('builds a prefilled mailto link', () => {
    const link = buildSupportMailto({
      name: 'Olena',
      email: 'olena@example.com',
      topic: 'documents',
      message: 'The invoice of my order is missing.',
    });
    const url = new URL(link);

    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('support@b2bar.tech');
    expect(url.searchParams.get('subject')).toBe(
      '[Order documents] Support request from Olena',
    );
    expect(url.searchParams.get('body')).toContain('Email: olena@example.com');
  });

  it('requires a topic and a meaningful message', () => {
    const result = supportSchema.safeParse({
      name: 'Olena',
      email: 'olena@example.com',
      message: 'Too short',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toEqual(expect.arrayContaining(['topic', 'message']));
    }
  });
});
