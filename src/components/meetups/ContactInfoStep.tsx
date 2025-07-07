import { NameInput } from './NameInput';
import { EmailInput } from './EmailInput';
import { Button } from '@/components/ui/button';
import { useFormValidation } from '@/lib/use-form-validation';
import { Validators } from '@/lib/validators';

export interface ContactInfoStepProps {
  name: string;
  email: string;
  onNext: (data: { name: string; email: string }) => void;
}

export function ContactInfoStep({ name, email, onNext }: ContactInfoStepProps) {
  const form = useFormValidation(
    { name, email },
    {
      name: [Validators.required],
      email: [Validators.required, Validators.email],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((values) => {
      onNext(values);
    })(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">👋 Nice to meet you!</h3>
        <p className="text-gray-600">Let&apos;s get started by entering your details.</p>
      </div>
      <NameInput value={form.values.name} onChange={(value) => form.handleChange('name')({ target: { value } } as any)} />
      {form.errors.name && <p className="text-red-500 text-sm">{form.errors.name}</p>}
      <EmailInput value={form.values.email} onChange={(value) => form.handleChange('email')({ target: { value } } as any)} />
      {form.errors.email && <p className="text-red-500 text-sm">{form.errors.email}</p>}
      <p className="text-gray-600">Don&apos;t worry, you can change this later.</p>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3">Next</Button>
    </form>
  );
} 