import { describe, expect, it } from 'vitest';

import {
  ADDRESS_FIELD_RULES,
  getFieldFormatError,
  isValidIban,
  PROFILE_FIELD_RULES,
} from './fieldRules';
import {
  getProfileFieldErrors,
  validateProfileField,
} from './profileForm.utils';
import { getCompanyVerificationStateFromError } from '@/components/Checkout/CompanyVerificationModal/companyVerificationState';

const profileError = (field: string, value: string) =>
  getFieldFormatError(PROFILE_FIELD_RULES, field, value);

describe('isValidIban', () => {
  it('accepts the example from the backend contract, with spaces too', () => {
    expect(isValidIban('UA213223130000026007233566001')).toBe(true);
    expect(isValidIban('ua21 3223 1300 0002 6007 2335 6600 1')).toBe(true);
  });

  it('rejects a wrong checksum or shape', () => {
    expect(isValidIban('UA213223130000026007233566002')).toBe(false);
    expect(isValidIban('UA21')).toBe(false);
  });
});

describe('profile field formats', () => {
  it('accepts empty values: not filled yet', () => {
    expect(profileError('iban', '   ')).toBeUndefined();
    expect(profileError('firstName', '')).toBeUndefined();
  });

  it('normalizes phone, IBAN and BIC before checking', () => {
    expect(profileError('phoneNumber', '+38 (093) 123-45-67')).toBeUndefined();
    expect(profileError('bic', 'pban ua2x')).toBeUndefined();
    expect(profileError('phoneNumber', '12345')).toMatch(/international/);
  });

  it('allows Cyrillic where the backend does and rejects it elsewhere', () => {
    expect(profileError('bankName', 'ПриватБанк')).toBeUndefined();
    expect(profileError('legalCity', 'Київ')).toBeUndefined();
    expect(profileError('firstName', 'Назар')).toMatch(/Latin/);
  });

  it('checks address limits', () => {
    expect(
      getFieldFormatError(ADDRESS_FIELD_RULES, 'title', 'x'.repeat(51)),
    ).toMatch(/50/);
    expect(
      getFieldFormatError(ADDRESS_FIELD_RULES, 'street', 'Хрещатик, 1'),
    ).toBeUndefined();
  });
});

describe('validateProfileField', () => {
  it('reports missing required fields only when asked to', () => {
    expect(validateProfileField('iban', '')).toBeUndefined();
    expect(validateProfileField('iban', '', { requireFilled: true })).toBe(
      'IBAN is required.',
    );
  });
});

describe('getProfileFieldErrors', () => {
  it('maps nested legal address keys to form fields', () => {
    expect(
      getProfileFieldErrors({
        status: 400,
        iban: 'Please enter a valid IBAN',
        'legalAddress.zipCode': 'ZIP code may contain',
      }),
    ).toEqual({
      iban: 'Please enter a valid IBAN',
      legalZipCode: 'ZIP code may contain',
    });
  });
});

describe('getCompanyVerificationStateFromError', () => {
  it('reads missing fields of COMPANY_NOT_VERIFIED', () => {
    expect(
      getCompanyVerificationStateFromError({
        status: 403,
        code: 'COMPANY_NOT_VERIFIED',
        details: {
          verificationStatus: 'NOT_VERIFIED',
          missingFields: ['iban', 'legalAddress.zipCode'],
        },
      }),
    ).toEqual({ status: 'NOT_VERIFIED', missingFields: ['iban', 'legalZipCode'] });
  });

  it('distinguishes rejected and pending companies', () => {
    expect(
      getCompanyVerificationStateFromError({
        code: 'COMPANY_NOT_VERIFIED',
        details: { verificationStatus: 'REJECTED', missingFields: [] },
      }),
    ).toEqual({ status: 'REJECTED', missingFields: [] });
    expect(
      getCompanyVerificationStateFromError({
        code: 'COMPANY_VERIFICATION_PENDING',
      }),
    ).toEqual({ status: 'PENDING' });
    expect(getCompanyVerificationStateFromError({ code: 'FORBIDDEN' })).toBeNull();
  });
});
