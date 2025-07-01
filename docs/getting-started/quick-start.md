# Quick Start Guide

Get Anemi Meets up and running on your local machine in under 5 minutes.

## 🚀 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git**

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/theGeorge123/anemi.git
cd anemi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
# Database
DATABASE_URL="your-supabase-database-url"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Maps (Google Maps)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations (if you have a database)
npm run db:migrate
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 🎯 What's Next?

- **Explore the app**: Navigate through the different pages and features
- **Check the docs**: Read the [Installation Guide](./installation.md) for detailed setup
- **Join the community**: Create your first coffee meetup!

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

**Database connection issues**
- Check your `DATABASE_URL` in `.env.local`
- Ensure your Supabase project is active

**Build errors**
```bash
npm run build
npm run type-check
```

### Need Help?

- Check the [Troubleshooting Guide](../operations/troubleshooting.md)
- Create an issue on GitHub
- Reach out to the development team

## 📱 Features to Try

1. **Create a Meetup**: Use the meetup creation form
2. **Discover Coffee Shops**: Browse the coffee shop directory
3. **Send Invites**: Test the email invitation system
4. **Mobile Experience**: Test on mobile devices

---

*Ready to build something amazing? Let's go! 🚀* 