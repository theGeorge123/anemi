# Logo Assets

This directory contains the logo assets for Anemi Meets.

## Files

- `logo.svg` - Full logo with gradients and text (120x120px)
- `logo-simple.svg` - Simplified logo without text (48x48px)
- `favicon.svg` - Favicon version (32x32px)

## Usage

### In Components
```tsx
import { Logo } from '@/components/ui/logo'

// Different sizes
<Logo size="sm" />     // 24x24px
<Logo size="md" />     // 32x32px
<Logo size="lg" />     // 48x48px
<Logo size="xl" />     // 64x64px

// Different variants
<Logo variant="default" />    // Full logo with gradients
<Logo variant="simple" />     // Simplified version
<Logo variant="text-only" />  // Text only

// With text
<Logo showText />     // Shows "Anemi Meets" text
```

### Direct SVG Usage
```tsx
// For favicon
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

// For images
<img src="/logo.svg" alt="Anemi Meets Logo" />
```

## Design

The logo represents:
- **Coffee Cup**: The central element representing coffee shops
- **Steam**: Warmth and comfort
- **Connection Dots**: Community and people coming together
- **Connection Lines**: Networking and relationships
- **Colors**: Warm coffee tones with blue accent for trust and community

## Brand Colors

- Primary Coffee: `#f59e0b` (amber-500)
- Coffee Dark: `#d97706` (amber-600)
- Community Blue: `#3b82f6` (blue-500)
- Text Dark: `#1e293b` (slate-800) 