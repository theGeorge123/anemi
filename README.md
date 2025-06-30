# Anemi Meets ☕

A production-ready meetup and coffee suggestion platform built with Next.js 14, Supabase, and Resend, featuring mobile-first design, location-based discovery, and community building tools.

## ✨ Features

- **☕ Coffee Shop Discovery** - Find the best local coffee shops with ratings and reviews
- **📱 Mobile-First Design** - Optimized for all devices and screen sizes
- **📍 Location-Based Meetups** - Discover meetups near you with precise location matching
- **🤝 Community Building** - Connect with like-minded people through various meetup categories
- **🎯 Personalized Recommendations** - Get coffee and meetup suggestions based on your preferences
- **📅 Easy Meetup Planning** - Create and join meetups with simple scheduling
- **🔔 Real-time Notifications** - Push notifications and email alerts for meetup updates
- **📱 PWA Support** - Install as a native app on mobile devices
- **🔐 Secure Authentication** - Supabase Auth with social login options
- **📧 Email Notifications** - Beautiful email templates with Resend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- Resend account (for email notifications)
- Git

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd anemi-meets

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase and Resend credentials

# 4. Set up Supabase database
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: Supabase Auth
- **Email**: Resend
- **Maps**: Google Maps API, Mapbox
- **Real-time**: Supabase Realtime
- **Testing**: Jest, Playwright
- **Deployment**: Vercel, Supabase

### Project Structure

```
anemi-meets/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   │   ├── supabase.ts      # Supabase client
│   │   ├── email.ts         # Resend email service
│   │   ├── prisma.ts        # Prisma client
│   │   └── location-utils.ts # Location utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── tests/                   # Test files
└── docs/                    # Documentation
```

## 📋 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run e2e          # Run end-to-end tests

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run security:scan # Run security scan
```

### Environment Variables

Create a `.env.local` file based on `env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@anemi-meets.com"

# Maps & Location Services
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"

# Other services...
```

## 🔐 Authentication Setup

### Supabase Auth Configuration

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings > API
3. **Configure authentication providers** in Authentication > Providers
4. **Set up email templates** in Authentication > Email Templates

### Social Login Providers

The platform supports:
- Google OAuth
- GitHub OAuth
- Email/Password authentication
- Magic link authentication

## 📧 Email Setup

### Resend Configuration

1. **Create a Resend account** at [resend.com](https://resend.com)
2. **Get your API key** from the dashboard
3. **Verify your domain** for sending emails
4. **Configure email templates** in the code

### Email Templates

The platform includes beautiful email templates for:
- Welcome emails
- Meetup invitations
- Meetup reminders
- Meetup cancellations

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run e2e
```

### Test Coverage

```bash
npm run test:coverage
```

## 🚀 Deployment

### Supabase Deployment

1. **Push your code to GitHub**
2. **Connect your repository to Supabase**
3. **Set environment variables** in Supabase dashboard
4. **Deploy automatically** on push

### Vercel Deployment

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Set environment variables** in Vercel dashboard
4. **Deploy automatically** on push

### Docker

```bash
# Build the image
docker build -t anemi-meets .

# Run the container
docker run -p 3000:3000 anemi-meets
```

## 📱 Mobile Features

- **Responsive Design**: Optimized for all screen sizes
- **Touch Gestures**: Swipe, pinch, and tap interactions
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time meetup reminders
- **PWA Installation**: Install as native app
- **Location Services**: GPS-based meetup discovery

## 🔐 Security

- **Authentication**: Secure login with Supabase Auth
- **Row-Level Security**: Database-level access control
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Sanitized user inputs
- **Security Headers**: Comprehensive security configuration
- **Location Privacy**: User-controlled location sharing

## 📊 Performance

- **Database Optimization**: Spatial indexes for location queries
- **Soft Deletes**: Preserve data while hiding cancelled events
- **Caching**: Redis for session and data caching
- **CDN**: Global content delivery
- **Image Optimization**: Automatic image compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-org/anemi-meets/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/anemi-meets/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/anemi-meets/discussions)
- **Email**: support@anemi-meets.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://www.prisma.io/) for the modern database toolkit
- [Google Maps](https://developers.google.com/maps) for location services
- [Radix UI](https://www.radix-ui.com/) for the accessible UI primitives

---

**Built with ❤️ by the Anemi Team**