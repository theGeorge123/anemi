import { Button } from '@/components/ui/button';
import { Coffee, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Connect Over Coffee
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create coffee meetups and discover great local spots with friends.
          </p>
        </div>

        <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
          <Link href="/create">
            <Users className="w-5 h-5 mr-2" />
            Start a Meetup
          </Link>
        </Button>
      </div>
    </div>
  );
} 