# Anemi Meets ☕

A production-ready meetup and coffee suggestion platform built with Next.js 14, Supabase, and Resend, featuring mobile-first design, location-based discovery, and community building tools.

## 🎯 Tiny-MVP (Current Version)

**Anemi Meets Tiny-MVP** is a lean, focused version that does exactly what you need - create coffee meetups and send invites. No extra features, just the core functionality.

### ✨ Tiny-MVP Features

- **☕ Simple Landing** - One sentence + "Start a Meetup" button
- **📝 Create Form** - Name, email, date picker, price filter, shuffle cafe
- **🎲 Shuffle Coffee Shops** - Random cafe selection based on price range
- **📧 Send Invites** - Email-based invitation system with secure tokens
- **📅 Date Selection** - Friend picks from available dates
- **✅ Confirmation** - Success page with calendar integration
- **📱 Mobile-First** - Responsive design optimized for all devices

### 🚀 Tiny-MVP Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd anemi-meets
npm install

# 2. Set up environment (optional for basic testing)
cp env.example .env.local
# Add RESEND_API_KEY for email functionality

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to test the Tiny-MVP.

### 📱 Tiny-MVP User Flow

1. **Landing Page** (`/`) → Simple "Connect Over Coffee" + "Start a Meetup" button
2. **Create Form** (`/create`) → Fill name, email, select dates, choose price range
3. **Shuffle Cafe** → Click "Shuffle Coffee Shop" to get random cafe
4. **Result Page** (`/result`) → See cafe card, "Shuffle Again" or "Send Invite"
5. **Send Invite** → Email sent with secure token link
6. **Invite Page** (`/invite/[token]`) → Friend sees cafe + dates, picks one
7. **Confirmation** (`/confirmed`) → Success message + calendar links

### 🔧 Tiny-MVP API Endpoints

- `POST /api/shuffle-cafe` - Randomly select coffee shop by price range
- `POST /api/send-invite` - Create invite record and send email
- `GET /api/invite/[token]` - Load invite data by token
- `POST /api/invite/[token]/confirm` - Save chosen date and confirm meetup

### 📊 Tiny-MVP Database Schema

```sql
-- Core tables for Tiny-MVP
CoffeeShop (id, name, address, priceRange, rating, hours, isVerified)
MeetupInvite (id, token, organizerName, organizerEmail, cafeId, availableDates, chosenDate, status)
```

---

## ✨ Full Platform Features (Future)

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
- Supabase account (for full platform)
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
# Edit .env.local with your credentials

# 4. Set up database (for full platform)
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
- **Authentication**: Supabase Auth (full platform)
- **Email**: Resend
- **Maps**: Google Maps API, Mapbox (full platform)
- **Real-time**: Supabase Realtime (full platform)
- **Testing**: Jest, Playwright
- **Deployment**: Vercel, Supabase

### Project Structure

```
anemi-meets/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing page (Tiny-MVP)
│   │   ├── create/          # Create meetup form
│   │   ├── result/          # Cafe result page
│   │   ├── invite/[token]/  # Invite page
│   │   ├── confirmed/       # Confirmation page
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utilities and configurations
│   │   ├── supabase.ts      # Supabase client
│   │   ├── email.ts         # Resend email service
│   │   ├── prisma.ts        # Prisma client
│   │   └── location-utils.ts # Location utilities
│   └── styles/              # Global styles
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── tests/                   # Test files
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
# Database (for full platform)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase (for full platform)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Email (Resend) - Required for Tiny-MVP invites
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@anemi-meets.com"

# Maps & Location Services (for full platform)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

## 🧪 Testing

### Tiny-MVP Testing

```bash
# Test the core flow
1. Visit http://localhost:3000
2. Click "Start a Meetup"
3. Fill the form and click "Shuffle Coffee Shop"
4. Test "Shuffle Again" and "Send Invite" buttons
5. Check invite flow (requires email setup)
```

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

### Tiny-MVP Deployment

The Tiny-MVP can be deployed immediately without database setup:

1. **Push to GitHub**
2. **Deploy to Vercel** (connects automatically)
3. **Set RESEND_API_KEY** in Vercel environment variables
4. **Deploy!**

### Full Platform Deployment

1. **Set up Supabase database**
2. **Configure all environment variables**
3. **Deploy to Vercel with database connection**

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
- **Push Notifications**: Real-time meetup reminders (full platform)
- **PWA Installation**: Install as native app (full platform)
- **Location Services**: GPS-based meetup discovery (full platform)

## 🔐 Security

- **Authentication**: Secure login with Supabase Auth (full platform)
- **Row-Level Security**: Database-level access control
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Sanitized user inputs
- **Security Headers**: Comprehensive security configuration
- **Location Privacy**: User-controlled location sharing (full platform)

## 📊 Performance

- **Database Optimization**: Spatial indexes for location queries
- **Soft Deletes**: Preserve data while hiding cancelled events
- **Caching**: Redis for session and data caching (full platform)
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