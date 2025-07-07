export const Validators = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email',
  minLength: (min: number) => (value: string) =>
    !value || value.length >= min || `Must be at least ${min} characters`,
  maxLength: (max: number) => (value: string) =>
    !value || value.length <= max || `Must be at most ${max} characters`,
}; 