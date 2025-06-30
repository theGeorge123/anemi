#!/bin/bash

# Anemi Meets - Supabase Setup Script
# This script helps you set up the Anemi Meets project with Supabase

set -e

echo "☕ Welcome to Anemi Meets Supabase Setup!"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI is installed"

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase and Resend credentials"
    echo "   You'll need to:"
    echo "   1. Create a Supabase project at https://supabase.com"
    echo "   2. Get your project credentials from Settings > API"
    echo "   3. Create a Resend account at https://resend.com"
    echo "   4. Get your API key from the Resend dashboard"
    echo ""
    echo "   Press Enter when you've updated .env.local..."
    read -r
fi

# Initialize Supabase project
echo "🚀 Initializing Supabase project..."
if [ ! -d .supabase ]; then
    supabase init
fi

# Check if user is logged in to Supabase
echo "🔐 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "📝 Please log in to Supabase..."
    supabase login
fi

# Ask if user wants to create a new project or link to existing
echo ""
echo "Choose an option:"
echo "1. Create a new Supabase project"
echo "2. Link to existing Supabase project"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "🚀 Creating new Supabase project..."
    supabase projects create anemi-meets
    echo "✅ Project created! Check the output above for your project reference."
elif [ "$choice" = "2" ]; then
    read -p "Enter your Supabase project reference: " project_ref
    echo "🔗 Linking to existing project..."
    supabase link --project-ref "$project_ref"
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Pushing database schema to Supabase..."
npx prisma db push

# Apply RLS policies
echo "🔐 Applying Row-Level Security policies..."
supabase db push

# Run the RLS migration
echo "🔐 Setting up RLS policies..."
PROJECT_REF=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'/' -f3 | cut -d'.' -f1)
if [ -n "$PROJECT_REF" ]; then
    echo "Applying RLS policies to project: $PROJECT_REF"
    psql "$(supabase db remote-url)" -f prisma/migrations/001_rls_policies.sql
else
    echo "⚠️  Could not determine project reference. Please manually run:"
    echo "   psql \"\$(supabase db remote-url)\" -f prisma/migrations/001_rls_policies.sql"
fi

# Seed database (optional)
echo ""
read -p "Do you want to seed the database with sample data? (y/n): " seed_choice
if [ "$seed_choice" = "y" ] || [ "$seed_choice" = "Y" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

# Start development server
echo ""
echo "🎉 Setup complete! Starting development server..."
echo "📱 Visit http://localhost:3000 to see your application"
echo ""
echo "📚 Next steps:"
echo "   1. Configure authentication providers in Supabase dashboard"
echo "   2. Set up email templates in Supabase dashboard"
echo "   3. Configure your domain in Resend dashboard"
echo "   4. Add your Google Maps and Mapbox API keys"
echo ""
echo "🔗 Useful links:"
echo "   - Supabase Dashboard: https://supabase.com/dashboard"
echo "   - Resend Dashboard: https://resend.com/dashboard"
echo "   - Documentation: https://supabase.com/docs"
echo ""

npm run dev 