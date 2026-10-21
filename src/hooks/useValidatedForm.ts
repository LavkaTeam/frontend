import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormRegister,
} from 'react-hook-form';

import { SERVER_ERROR_TYPE } from '@/utils/formErrors';

const isFilled = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim() !== '';

/**
 * useForm with "reward early, punish late" validation:
 * - no errors while the user is still typing a fresh value;
 * - a filled field is validated when it loses focus;
 * - empty required fields are reported on submit only;
 * - a field that already shows an error is re-validated on every keystroke,
 *   so the error disappears as soon as the value becomes valid.
 */
const useValidatedForm = <T extends FieldValues>(props: UseFormProps<T>) => {
  const form = useForm<T>({
    ...props,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  const { trigger, getFieldState, getValues, formState } = form;

  const revalidateErrorFields = async (changedField: Path<T>) => {
    // Also covers dependent fields, e.g. "confirm password" after the
    // password itself changes, and the shared "credentials" error. A
    // field-specific server error stays until that field is edited.
    const fields = (Object.keys(getValues()) as Path<T>[]).filter((name) => {
      const { error } = getFieldState(name);

      return (
        Boolean(error) &&
        (name === changedField || error?.type !== SERVER_ERROR_TYPE)
      );
    });

    if (fields.length > 0) {
      await trigger(fields);
    }
  };

  const register: UseFormRegister<T> = (name, options) => {
    const field = form.register(name, options);

    return {
      ...field,
      onChange: async (event) => {
        const result = await field.onChange(event);

        await revalidateErrorFields(name);

        return result;
      },
      onBlur: async (event) => {
        const result = await field.onBlur(event);

        // After the first submit, reValidateMode already validates on blur.
        if (!formState.isSubmitted && isFilled(getValues(name))) {
          await trigger(name);
        }

        return result;
      },
    };
  };

  return { ...form, register };
};

export { useValidatedForm };
