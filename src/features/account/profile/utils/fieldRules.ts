// Field formats shared with the backend. Source of truth:
// LAVKA_BACKEND/backend/docs/7-profile-validation.md (section 2).
// Every rule checks a non-empty, normalized value: empty means "not filled
// yet" and is always accepted by the backend.

interface FieldRule {
  normalize?: (value: string) => string;
  pattern?: RegExp;
  maxLength?: number;
  check?: (value: string) => boolean;
  message: string;
}

const removePhoneFormatting = (value: string) => value.replace(/[\s()-]/g, '');
const compactUpper = (value: string) => value.replace(/\s/g, '').toUpperCase();

// ISO 13616 mod-97 checksum, as given in the backend contract.
export const isValidIban = (raw: string): boolean => {
  const iban = compactUpper(raw);
  if (!iban) return true;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;

  for (const ch of rearranged) {
    const value = /\d/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
    for (const digit of value) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder === 1;
};

const PHONE_RULE: FieldRule = {
  normalize: removePhoneFormatting,
  pattern: /^\+?[1-9]\d{9,14}$/,
  message:
    'Please enter the phone number in international format, e.g. +380931234567',
};

const COUNTRY_RULE: FieldRule = {
  pattern: /^[\p{L}][\p{L} .'-]{1,55}$/u,
  message: "Country may contain only letters, spaces and . ' - (2-56 characters)",
};

const CITY_RULE: FieldRule = {
  pattern: /^[\p{L}][\p{L} .'-]{1,84}$/u,
  message: "City may contain only letters, spaces and . ' - (2-85 characters)",
};

const STREET_RULE: FieldRule = {
  pattern: /^[\p{L}0-9][\p{L}0-9 .,'/#№-]{4,119}$/u,
  message:
    "Street may contain letters, numbers, spaces and . , ' / # № - (5-120 characters)",
};

const ZIP_RULE: FieldRule = {
  pattern: /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/,
  message:
    'ZIP code may contain letters, numbers, spaces and hyphens (3-10 characters)',
};

const companyCode = (label: string): FieldRule => ({
  pattern: /^[A-Za-z0-9-]{4,20}$/,
  message: `${label} may contain only letters, numbers and hyphens (4-20 characters)`,
});

export const PROFILE_FIELD_RULES: Record<string, FieldRule> = {
  firstName: {
    pattern: /^[A-Za-z-]{2,50}$/,
    message:
      'First name may contain only Latin letters and hyphens (2-50 characters)',
  },
  lastName: {
    pattern: /^[A-Za-z-]{2,50}$/,
    message:
      'Last name may contain only Latin letters and hyphens (2-50 characters)',
  },
  phoneNumber: PHONE_RULE,
  companyName: {
    pattern: /^[A-Za-z0-9&.\-'\s]{2,100}$/,
    message:
      "Company name may contain Latin letters, numbers, spaces and & . - ' (2-100 characters)",
  },
  registrationNumber: companyCode('Registration number'),
  taxId: companyCode('Tax ID'),
  vatNumber: companyCode('VAT number'),
  liquorLicenseNumber: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9 /.-]{3,29}$/,
    message:
      'License number may contain letters, numbers, spaces and / . - (4-30 characters)',
  },
  bankName: {
    pattern: /^[\p{L}0-9][\p{L}0-9 &.,'()-]{1,99}$/u,
    message:
      "Bank name may contain letters, numbers, spaces and & . , ' ( ) - (2-100 characters)",
  },
  iban: {
    normalize: compactUpper,
    check: isValidIban,
    message: 'Please enter a valid IBAN, e.g. UA213223130000026007233566001',
  },
  bic: {
    normalize: compactUpper,
    pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    message: 'BIC must be 8 or 11 characters, e.g. PBANUA2X',
  },
  // logoUrl and liquorLicenseDocumentUrl are never typed: they always come
  // from POST /api/user/me/upload, so their format is not re-checked here.
  legalCountry: COUNTRY_RULE,
  legalCity: CITY_RULE,
  legalStreet: STREET_RULE,
  legalZipCode: ZIP_RULE,
};

export const ADDRESS_FIELD_RULES: Record<string, FieldRule> = {
  title: {
    maxLength: 50,
    message: 'Address title must be up to 50 characters',
  },
  country: COUNTRY_RULE,
  city: CITY_RULE,
  street: STREET_RULE,
  zipCode: ZIP_RULE,
  recipientName: {
    pattern: /^[\p{L}][\p{L} .'-]{1,99}$/u,
    message:
      "Recipient name may contain only letters, spaces and . ' - (2-100 characters)",
  },
  recipientPhone: PHONE_RULE,
  deliveryNotes: {
    maxLength: 500,
    message: 'Delivery notes must be up to 500 characters',
  },
};

/** Format error for a filled value, or undefined when it is valid or empty. */
export const getFieldFormatError = (
  rules: Record<string, FieldRule>,
  field: string,
  value: string,
): string | undefined => {
  const rule = rules[field];
  const trimmed = value.trim();
  if (!rule || !trimmed) return undefined;

  const normalized = rule.normalize ? rule.normalize(trimmed) : trimmed;
  const isValid =
    (!rule.pattern || rule.pattern.test(normalized)) &&
    (!rule.maxLength || normalized.length <= rule.maxLength) &&
    (!rule.check || rule.check(normalized));

  return isValid ? undefined : rule.message;
};
