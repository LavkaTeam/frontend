import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { getErrorFieldMessage } from './error';

// Error types set on form fields from backend responses:
// - 'server': belongs to one field and stays until that field is edited;
// - 'credentials': spans several fields (email + password), so editing any of
//   them re-validates and clears the others too (see useValidatedForm).
export const SERVER_ERROR_TYPE = 'server';
export const CREDENTIALS_ERROR_TYPE = 'credentials';

type FieldMap<T extends FieldValues> = Partial<Record<Path<T>, string[]>>;

/**
 * Puts backend validation errors (400 {"<field>": "<message>"}) under the
 * matching form fields and focuses the first one. `fields` maps every form
 * field to the backend field names that may describe it.
 * Returns true when at least one field error was applied.
 */
export const applyServerFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: FieldMap<T>,
) => {
  let applied = false;

  for (const [formField, backendFields = []] of Object.entries(fields) as Array<
    [Path<T>, string[] | undefined]
  >) {
    const message = backendFields
      .map((backendField) => getErrorFieldMessage(error, backendField))
      .find(Boolean);

    if (!message) continue;

    setError(
      formField,
      { type: SERVER_ERROR_TYPE, message },
      { shouldFocus: !applied },
    );
    applied = true;
  }

  return applied;
};
