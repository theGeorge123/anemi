# Anemi Meets ☕

A modern platform for creating coffee meetups and discovering great local spots with friends.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/theGeorge123/anemi.git
cd anemi

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📚 Documentation

We have comprehensive documentation to help you get started:

### 🎯 Quick Navigation
- **[Quick Start Guide](docs/getting-started/quick-start.md)** - Get up and running in 5 minutes
- **[Installation Guide](docs/getting-started/installation.md)** - Complete setup instructions
- **[API Documentation](docs/development/api-documentation.md)** - All API endpoints and usage
- **[Deployment Guide](docs/deployment/vercel.md)** - Deploy to Vercel
- **[Production Checklist](docs/deployment/production-checklist.md)** - Pre-launch checklist

### 📖 Full Documentation
- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **[Project Structure](docs/development/project-structure.md)** - Codebase organization
- **[Database Schema](docs/development/database-schema.md)** - Data models and relationships
- **[Testing Strategy](docs/testing/testing-strategy.md)** - Testing approach and guidelines
- **[Security Guidelines](docs/security/security-guidelines.md)** - Security best practices

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Email**: Resend
- **Maps**: Google Maps API
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library, Playwright

## 🎨 Features

- ☕ **Coffee Shop Discovery** - Find great local spots
- 👥 **Meetup Creation** - Create and manage coffee meetups
- 📧 **Email Invitations** - Send beautiful invitation emails
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🔒 **Secure Authentication** - User management and security
- 🗺️ **Location Services** - Maps and geolocation
- 📊 **Analytics** - Track usage and performance

## 🔧 Development

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run e2e          # Run E2E tests

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-supabase-database-url"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Service
RESEND_API_KEY="your-resend-api-key"

# Maps
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Optional
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

See our [Vercel Deployment Guide](docs/deployment/vercel.md) for detailed instructions.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

We use a comprehensive testing strategy:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for full user flows
- **Type Checking**: TypeScript strict mode

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test -- --grep "meetup"
npm run test -- --grep "invitation"

# Run E2E tests
npm run e2e
```

## 🔒 Security

- Row Level Security (RLS) policies
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure authentication with NextAuth.js
- Environment variable protection
- Regular security audits

## 📱 PWA Features

- Offline functionality
- Mobile app installation
- Push notifications (coming soon)
- Background sync (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the [Cursor Rules](.cursorrules) for code quality
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [comprehensive docs](docs/README.md)
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🗺️ Roadmap

### Phase 1 (MVP) ✅
- [x] Basic meetup creation
- [x] Email invitations
- [x] Coffee shop discovery
- [x] Mobile-responsive design

### Phase 2 (Enhancement)
- [ ] User authentication
- [ ] Meetup management dashboard
- [ ] Advanced search and filters
- [ ] Push notifications

### Phase 3 (Scale)
- [ ] Multi-city support
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Mobile app

---

**Built with ❤️ for the coffee community**

*Anemi Meets - Where great conversations happen over great coffee*