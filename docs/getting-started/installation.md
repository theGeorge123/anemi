# Installation Guide

Complete setup guide for Anemi Meets development environment.

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

### Recommended
- **Node.js**: 20.x LTS
- **npm**: 10.x
- **VS Code**: With recommended extensions
- **RAM**: 8GB or higher
- **Storage**: 5GB free space

## 🔧 Development Environment Setup

### 1. Install Node.js

**macOS (using Homebrew)**
```bash
brew install node
```

**Windows**
Download from [nodejs.org](https://nodejs.org/)

**Linux (Ubuntu/Debian)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation**
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### 2. Install Git

**macOS**
```bash
brew install git
```

**Windows**
Download from [git-scm.com](https://git-scm.com/)

**Linux**
```bash
sudo apt-get install git
```

### 3. Clone the Repository

```bash
git clone https://github.com/theGeorge123/anemi.git
cd anemi
```

### 4. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 14
- React 18
- Prisma ORM
- Tailwind CSS
- TypeScript
- Testing libraries

## 🔐 Environment Configuration

### 1. Create Environment File

```bash
cp env.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` with your values:

```env
# Database (Supabase)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Maps (Google Maps)
GOOGLE_MAPS_API_KEY="AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 3. Set Up External Services

#### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get database URL from Settings > Database
4. Enable Row Level Security (RLS)

#### Resend Setup
1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key from dashboard

#### Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Maps JavaScript API
4. Create API key with restrictions

## 🗄️ Database Setup

### 1. Generate Prisma Client

```bash
npm run db:generate
```

### 2. Run Database Migrations

```bash
npm run db:migrate
```

### 3. Seed Database (Optional)

```bash
npm run db:seed
```

### 4. Open Prisma Studio (Optional)

```bash
npm run db:studio
```

## 🚀 Development Server

### Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🧪 Testing Setup

### 1. Install Testing Dependencies

Testing dependencies are already included in `package.json`:
- Jest
- React Testing Library
- Playwright (E2E)

### 2. Run Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run e2e

# E2E with UI
npm run e2e:ui
```

## 🔧 IDE Setup

### VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 🔍 Verification

### 1. Check Installation

```bash
# Verify Node.js and npm
node --version
npm --version

# Verify dependencies
npm list --depth=0

# Verify TypeScript
npx tsc --version

# Verify Prisma
npx prisma --version
```

### 2. Test Build

```bash
npm run build
npm run type-check
npm run lint
```

### 3. Test Database Connection

```bash
npm run db:studio
```

## 🐛 Troubleshooting

### Common Issues

**Node.js Version Issues**
```bash
# Use nvm to manage Node.js versions
nvm install 20
nvm use 20
```

**Permission Issues (Linux/macOS)**
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000
# Kill process
kill -9 <PID>
```

**Database Connection Issues**
- Check `DATABASE_URL` format
- Verify Supabase project is active
- Check network connectivity

### Getting Help

1. Check the [Troubleshooting Guide](../operations/troubleshooting.md)
2. Search existing GitHub issues
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Expected vs actual behavior

## 📚 Next Steps

- Read the [Project Structure](../development/project-structure.md) guide
- Explore the [API Documentation](../development/api-documentation.md)
- Check out the [Testing Strategy](../testing/testing-strategy.md)
- Review [Security Guidelines](../security/security-guidelines.md)

---

*Your development environment is ready! Happy coding! 🎉* 