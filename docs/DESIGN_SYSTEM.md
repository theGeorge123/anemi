# Anemi Meets Design System

## 🎨 Color Palette

### Primary Colors
- **Amber 500** (`#f59e0b`) - Primary brand color
- **Amber 600** (`#d97706`) - Primary hover state
- **Amber 400** (`#fbbf24`) - Primary light variant
- **Amber 100** (`#fef3c7`) - Primary background

### Secondary Colors
- **Orange 500** (`#f97316`) - Secondary brand color
- **Orange 600** (`#ea580c`) - Secondary hover state
- **Orange 400** (`#fb923c`) - Secondary light variant
- **Orange 100** (`#fed7aa`) - Secondary background

### Neutral Colors
- **Gray 900** (`#111827`) - Primary text
- **Gray 700** (`#374151`) - Secondary text
- **Gray 500** (`#6b7280`) - Muted text
- **Gray 300** (`#d1d5db`) - Borders
- **Gray 100** (`#f3f4f6`) - Background
- **Gray 50** (`#f9fafb`) - Light background

### Status Colors
- **Green 500** (`#10b981`) - Success
- **Red 500** (`#ef4444`) - Error
- **Yellow 400** (`#facc15`) - Warning
- **Blue 500** (`#3b82f6`) - Info

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
```css
.text-xs    /* 12px */
.text-sm    /* 14px */
.text-base  /* 16px */
.text-lg    /* 18px */
.text-xl    /* 20px */
.text-2xl   /* 24px */
.text-3xl   /* 30px */
.text-4xl   /* 36px */
.text-5xl   /* 48px */
```

### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## 🧩 Components

### Button Component
```tsx
// Primary button
<Button className="bg-amber-500 hover:bg-amber-600">
  Primary Action
</Button>

// Outline button
<Button variant="outline">
  Secondary Action
</Button>

// Ghost button
<Button variant="ghost">
  Tertiary Action
</Button>

// Loading state
<Button disabled>
  <Spinner className="w-4 h-4 mr-2" />
  Loading...
</Button>
```

**Variants:**
- `default` - Primary amber background
- `outline` - Transparent with border
- `ghost` - Transparent without border
- `destructive` - Red background for dangerous actions

**Sizes:**
- `sm` - Small (32px height)
- `default` - Medium (40px height)
- `lg` - Large (48px height)

### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input Component
```tsx
<Input
  type="email"
  placeholder="Enter your email"
  className="w-full"
/>
```

**States:**
- Default - Gray border
- Focus - Amber border
- Error - Red border
- Disabled - Gray background

### Badge Component
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## 🎭 Animations

### Transitions
```css
/* Standard transition */
transition: all 0.2s ease-in-out

/* Fast transition */
transition: all 0.1s ease-in-out

/* Slow transition */
transition: all 0.3s ease-in-out
```

### Loading States
```tsx
// Spinner component
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>

// Pulse animation
<div className="animate-pulse bg-gray-200 h-4 rounded"></div>
```

### Hover Effects
```css
/* Button hover */
hover:bg-amber-600
hover:scale-105

/* Card hover */
hover:shadow-lg
hover:-translate-y-1
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Mobile-First Approach
```css
/* Mobile styles (default) */
.text-sm

/* Tablet and up */
md:text-base

/* Desktop and up */
lg:text-lg
```

### Touch Targets
- **Minimum size**: 44px × 44px
- **Recommended**: 48px × 48px
- **Spacing**: 8px minimum between touch targets

## 🎨 Layout Patterns

### Container
```tsx
<div className="max-w-4xl mx-auto px-4">
  Content
</div>
```

### Grid System
```tsx
// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Flexbox Patterns
```tsx
// Center content
<div className="flex items-center justify-center">
  Centered content
</div>

// Space between
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Stack vertically
<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## 🎯 Spacing System

### Margin & Padding
```css
/* Extra small */
.m-1, .p-1  /* 4px */

/* Small */
.m-2, .p-2  /* 8px */

/* Medium */
.m-4, .p-4  /* 16px */

/* Large */
.m-6, .p-6  /* 24px */

/* Extra large */
.m-8, .p-8  /* 32px */
```

### Component Spacing
- **Section spacing**: 24px (1.5rem)
- **Card padding**: 16px (1rem)
- **Button padding**: 12px horizontal, 8px vertical
- **Input padding**: 12px horizontal, 8px vertical

## 🌟 Icons

### Icon System
- **Primary**: Lucide React
- **Size variants**: 16px, 20px, 24px, 32px
- **Color**: Inherit from parent or specific colors

```tsx
import { Coffee, MapPin, Calendar, Users } from 'lucide-react'

<Coffee className="w-6 h-6 text-amber-500" />
<MapPin className="w-4 h-4 text-gray-500" />
```

### Common Icons
- **Coffee** - Primary brand icon
- **MapPin** - Location
- **Calendar** - Date/time
- **Users** - People/social
- **Heart** - Favorites
- **Star** - Ratings
- **Check** - Success/confirmation

## 🎨 Visual Hierarchy

### Text Hierarchy
1. **H1** - Page titles (text-4xl, font-bold)
2. **H2** - Section titles (text-2xl, font-semibold)
3. **H3** - Subsection titles (text-xl, font-semibold)
4. **Body** - Regular text (text-base)
5. **Caption** - Small text (text-sm, text-gray-500)

### Color Hierarchy
1. **Primary text** - Gray 900
2. **Secondary text** - Gray 700
3. **Muted text** - Gray 500
4. **Brand accent** - Amber 500

## 📐 Accessibility

### Color Contrast
- **Text on background**: 4.5:1 minimum ratio
- **Large text**: 3:1 minimum ratio
- **UI components**: 3:1 minimum ratio

### Focus States
```css
/* Default focus */
focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2

/* Button focus */
focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
```

### Screen Reader Support
```tsx
// Proper labeling
<label htmlFor="email">Email address</label>
<input id="email" type="email" aria-describedby="email-help" />

// ARIA labels
<button aria-label="Close modal">×</button>
<div role="alert" aria-live="polite">Success message</div>
```

## 🎨 Brand Guidelines

### Logo Usage
- **Primary logo**: Full color on light backgrounds
- **Inverted logo**: White on dark backgrounds
- **Minimum size**: 32px height
- **Clear space**: Equal to logo height

### Voice & Tone
- **Friendly** - Warm and approachable
- **Professional** - Reliable and trustworthy
- **Casual** - Not overly formal
- **Helpful** - Clear and supportive

### Photography Style
- **Coffee shops** - Warm, inviting atmosphere
- **People** - Natural, candid moments
- **Food/Drinks** - High-quality, appetizing
- **Color palette** - Warm tones, amber/orange accents

## 📱 Mobile Guidelines

### Touch Interactions
- **Tap targets**: Minimum 44px × 44px
- **Gesture support**: Swipe, pinch, tap
- **Feedback**: Visual and haptic feedback

### Mobile Navigation
- **Bottom navigation** - Primary actions
- **Hamburger menu** - Secondary actions
- **Floating action button** - Primary action

### Mobile Forms
- **Large inputs** - Easy to tap
- **Clear labels** - Above inputs
- **Validation** - Real-time feedback
- **Auto-complete** - Reduce typing

## 🎨 Dark Mode (Future)

### Color Palette
```css
/* Light mode */
--background: #ffffff
--foreground: #111827
--primary: #f59e0b
--primary-foreground: #ffffff

/* Dark mode */
--background: #111827
--foreground: #f9fafb
--primary: #fbbf24
--primary-foreground: #111827
```

### Implementation
```tsx
// Theme provider
<ThemeProvider>
  <Component />
</ThemeProvider>

// CSS variables
:root {
  --background: theme(colors.white);
  --foreground: theme(colors.gray.900);
}

[data-theme="dark"] {
  --background: theme(colors.gray.900);
  --foreground: theme(colors.gray.100);
}
```

---

**Last Updated**: January 2025
**Version**: 1.0.0 