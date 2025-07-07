import { useState } from 'react';

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ((value: any) => string | true)[]>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validate = (fieldName?: keyof T): boolean => {
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(validationRules) as (keyof T)[];
    let isValid = true;
    const newErrors = { ...errors };
    fieldsToValidate.forEach(field => {
      const fieldRules = validationRules[field] || [];
      for (const rule of fieldRules) {
        const result = rule(values[field]);
        if (result !== true) {
          newErrors[field] = result as string;
          isValid = false;
          break;
        } else {
          newErrors[field] = '';
        }
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({ ...values, [field]: value });
    if (touched[field]) validate(field);
  };

  const handleBlur = (field: keyof T) => () => {
    setTouched({ ...touched, [field]: true });
    validate(field);
  };

  const handleSubmit = (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(validationRules).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);
    if (validate()) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  };
} 