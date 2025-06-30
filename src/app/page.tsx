import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee, 
  Calendar, 
  Users, 
  MapPin, 
  Heart, 
  Star, 
  Smartphone, 
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-background to-orange-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover amazing local meetups
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Connect Over
              <span className="text-amber-600 block">Coffee & Conversation</span>
              in Your City
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find the perfect coffee shop meetups, discover new people, and explore your local community. 
              From casual chats to professional networking, there's a meetup for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
                <Link href="/auth/signup">
                  Find Meetups Near You
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/explore">
                  Explore Coffee Shops
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need for meaningful connections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From discovering local coffee shops to organizing meetups, we've got you covered 
              with features designed for community building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Discover Coffee Shops</CardTitle>
                <CardDescription>
                  Find the best local coffee shops with ratings, reviews, and meetup-friendly features.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Easy Meetup Planning</CardTitle>
                <CardDescription>
                  Create and join meetups with simple scheduling and location-based discovery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Community Building</CardTitle>
                <CardDescription>
                  Connect with like-minded people in your area through various meetup categories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Location-Based Discovery</CardTitle>
                <CardDescription>
                  Find meetups and coffee shops near you with precise location matching.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Get coffee and meetup suggestions based on your preferences and interests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Verified Venues</CardTitle>
                <CardDescription>
                  Trusted coffee shops and venues with verified information and community reviews.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-First Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Mobile-first design for meetups on the go
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Discover and join meetups from anywhere with our responsive mobile app. 
                Optimized for finding coffee shops and connecting with people nearby.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Location-based meetup discovery</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>One-tap meetup joining</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Offline coffee shop browsing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Real-time meetup updates</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl p-8">
                <div className="bg-background rounded-2xl shadow-2xl p-4">
                  <div className="bg-muted rounded-xl h-96 flex items-center justify-center">
                    <Smartphone className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meetup Categories Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Find your perfect meetup type
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From casual coffee chats to professional networking, discover meetups that match your interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Social', icon: '👥', color: 'bg-blue-100 text-blue-600' },
              { name: 'Networking', icon: '🤝', color: 'bg-green-100 text-green-600' },
              { name: 'Study Group', icon: '📚', color: 'bg-purple-100 text-purple-600' },
              { name: 'Book Club', icon: '📖', color: 'bg-red-100 text-red-600' },
              { name: 'Tech Meetup', icon: '💻', color: 'bg-gray-100 text-gray-600' },
              { name: 'Creative', icon: '🎨', color: 'bg-pink-100 text-pink-600' },
              { name: 'Fitness', icon: '💪', color: 'bg-orange-100 text-orange-600' },
              { name: 'Food & Drink', icon: '🍽️', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Language Exchange', icon: '🗣️', color: 'bg-indigo-100 text-indigo-600' },
              { name: 'Other', icon: '✨', color: 'bg-amber-100 text-amber-600' },
            ].map((category) => (
              <Card key={category.name} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2 text-2xl`}>
                    {category.icon}
                  </div>
                  <p className="text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to discover your local community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who use Anemi Meets to connect over coffee and build meaningful relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                Start Discovering
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-amber-600" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 