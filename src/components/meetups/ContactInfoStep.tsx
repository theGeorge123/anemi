import { NameInput } from './NameInput';
import { Button } from '@/components/ui/button';
import { useFormValidation } from '@/lib/use-form-validation';
import { Validators } from '@/lib/validators';
import { useSupabase } from '@/components/SupabaseProvider';

export interface ContactInfoStepProps {
  name: string;
  email: string;
  onNext: (data: { name: string; email: string }) => void;
}

export function ContactInfoStep({ name, email, onNext }: ContactInfoStepProps) {
  const { session } = useSupabase();
  
  const form = useFormValidation(
    { name },
    {
      name: [Validators.required],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit((values) => {
      // Use the logged-in user's email
      const userEmail = session?.user?.email || email;
      onNext({ name: values.name, email: userEmail });
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="font-medium">📧 Email:</span> {session?.user?.email || 'Loading...'}
        </p>
        <p className="text-xs text-amber-600 mt-1">
          We&apos;ll use your account email for notifications
        </p>
      </div>
      <p className="text-gray-600">Don&apos;t worry, you can change this later.</p>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3">Next</Button>
    </form>
  );
} 