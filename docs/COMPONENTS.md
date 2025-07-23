# Anemi Meets Component Documentation

## 🧩 UI Components

### Button Component
**File**: `src/components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui/button'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With loading state
<Button disabled>
  <Spinner className="w-4 h-4 mr-2" />
  Loading...
</Button>
```

**Props:**
- `variant`: 'default' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'default' | 'lg'
- `disabled`: boolean
- `children`: ReactNode

### Card Component
**File**: `src/components/ui/card.tsx`

A container component for grouping related content.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input Component
**File**: `src/components/ui/input.tsx`

A form input component with consistent styling.

```tsx
import { Input } from '@/components/ui/input'

<Input
  type="email"
  placeholder="Enter your email"
  className="w-full"
/>
```

**Props:**
- All standard HTML input props
- `className`: Additional CSS classes

### Label Component
**File**: `src/components/ui/label.tsx`

A label component for form inputs.

```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />
```

### Badge Component
**File**: `src/components/ui/badge.tsx`

A status indicator component.

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'
- `children`: ReactNode

### Logo Component
**File**: `src/components/ui/logo.tsx`

The Anemi Meets logo component.

```tsx
import { Logo } from '@/components/ui/logo'

<Logo className="w-8 h-8" />
<Logo size="lg" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `className`: Additional CSS classes

## 🎯 Layout Components

### LayoutWrapper Component
**File**: `src/components/layout/LayoutWrapper.tsx`

Handles the main layout structure and conditional rendering of header/footer.

```tsx
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'

<LayoutWrapper>
  {children}
</LayoutWrapper>
```

**Features:**
- Conditionally shows header/footer based on route
- Handles cookie consent
- Provides consistent layout structure

### Header Component
**File**: `src/components/layout/header.tsx`

The main navigation header (currently removed for cleaner design).

### Footer Component
**File**: `src/components/layout/footer.tsx`

The site footer with links and legal information.

```tsx
import { Footer } from '@/components/layout/footer'

<Footer />
```

**Features:**
- Legal links (Privacy Policy, Terms of Service)
- Social media links
- Copyright information

## 🔐 Authentication Components

### SupabaseProvider Component
**File**: `src/components/SupabaseProvider.tsx`

Provides Supabase client context to the application.

```tsx
import { SupabaseProvider } from '@/components/SupabaseProvider'

<SupabaseProvider>
  {children}
</SupabaseProvider>
```

**Features:**
- Supabase client initialization
- Session management
- Auth state context

### AuthGuard Component
**File**: `src/components/auth/AuthGuard.tsx`

Protects routes that require authentication.

```tsx
import { AuthGuard } from '@/components/auth/AuthGuard'

<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

### AuthForm Component
**File**: `src/components/auth/auth-form.tsx`

A reusable authentication form component.

```tsx
import { AuthForm } from '@/components/auth/auth-form'

<AuthForm
  mode="signin"
  onSubmit={handleSubmit}
  loading={isLoading}
/>
```

**Props:**
- `mode`: 'signin' | 'signup'
- `onSubmit`: (data: AuthData) => void
- `loading`: boolean

## 📊 Meetup Components

### MeetupWizard Component
**File**: `src/components/meetups/MeetupWizard.tsx`

The main meetup creation wizard with multi-step form.

```tsx
import { MeetupWizard } from '@/components/meetups/MeetupWizard'

<MeetupWizard />
```

**Features:**
- Multi-step form process
- Progress indicator
- Form validation
- Error handling

### StepContent Component
**File**: `src/components/meetups/StepContent.tsx`

Manages the content for each step in the meetup creation process.

```tsx
import { StepContent } from '@/components/meetups/StepContent'

<StepContent
  currentStep={currentStep}
  formData={formData}
  onFormDataChange={updateFormData}
  onNext={handleNext}
  onBack={handleBack}
  onFinish={handleFinish}
/>
```

**Steps:**
1. Name and Email
2. City Selection
3. Date and Time Selection
4. Cafe Choice
5. View Selection (Map/List)
6. Cafe Selection
7. Summary

### StepIndicator Component
**File**: `src/components/meetups/StepIndicator.tsx`

Shows the progress through the meetup creation steps.

```tsx
import { StepIndicator } from '@/components/meetups/StepIndicator'

<StepIndicator
  currentStep={currentStep}
  totalSteps={totalSteps}
/>
```

### StepNavigation Component
**File**: `src/components/meetups/StepNavigation.tsx`

Navigation controls for the meetup creation wizard.

```tsx
import { StepNavigation } from '@/components/meetups/StepNavigation'

<StepNavigation
  currentStep={currentStep}
  totalSteps={totalSteps}
  onNext={handleNext}
  onBack={handleBack}
  isNextDisabled={!isStepValid()}
/>
```

### CafeChoiceStep Component
**File**: `src/components/meetups/CafeChoiceStep.tsx`

Allows users to choose between a random cafe or selecting their own.

```tsx
import { CafeChoiceStep } from '@/components/meetups/CafeChoiceStep'

<CafeChoiceStep
  selectedCity={city}
  onCafeSelect={handleCafeSelect}
  onChooseOwn={handleChooseOwn}
/>
```

**Features:**
- Random cafe suggestion
- Shuffle functionality
- Self-selection option

### ViewSelector Component
**File**: `src/components/meetups/ViewSelector.tsx`

Allows users to choose between map and list view for cafe selection.

```tsx
import { ViewSelector } from '@/components/meetups/ViewSelector'

<ViewSelector
  selectedView={viewType}
  onViewSelect={handleViewSelect}
/>
```

### MapView Component
**File**: `src/components/meetups/MapView.tsx`

Interactive map component for cafe selection using Leaflet.

```tsx
import { MapView } from '@/components/meetups/MapView'

<MapView
  selectedCity={city}
  selectedCafeId={selectedCafeId}
  onCafeSelect={handleCafeSelect}
  onSkip={handleSkip}
/>
```

**Features:**
- Interactive map with cafe markers
- Cafe details in popups
- Mobile-responsive design
- Hover effects and animations

### CafeSelector Component
**File**: `src/components/meetups/CafeSelector.tsx`

List view component for cafe selection.

```tsx
import { CafeSelector } from '@/components/meetups/CafeSelector'

<CafeSelector
  selectedCity={city}
  selectedCafeId={selectedCafeId}
  onCafeSelect={handleCafeSelect}
  onSkip={handleSkip}
/>
```

### InviteModal Component
**File**: `src/components/meetups/InviteModal.tsx`

Modal component for displaying the generated invite code.

```tsx
import { InviteModal } from '@/components/meetups/InviteModal'

<InviteModal
  inviteCode={inviteCode}
  isOpen={showModal}
  onClose={handleClose}
/>
```

## 🎨 Form Components

### NameInput Component
**File**: `src/components/meetups/NameInput.tsx`

Input component for the organizer's name.

```tsx
import { NameInput } from '@/components/meetups/NameInput'

<NameInput
  value={name}
  onChange={setName}
/>
```

### EmailInput Component
**File**: `src/components/meetups/EmailInput.tsx`

Input component for the organizer's email.

```tsx
import { EmailInput } from '@/components/meetups/EmailInput'

<EmailInput
  value={email}
  onChange={setEmail}
/>
```

### CitySelector Component
**File**: `src/components/meetups/CitySelector.tsx`

Dropdown component for city selection.

```tsx
import { CitySelector } from '@/components/meetups/CitySelector'

<CitySelector
  selectedCity={city}
  onChange={setCity}
/>
```

### DatePicker Component
**File**: `src/components/meetups/DatePicker.tsx`

Component for selecting available dates.

```tsx
import { DatePicker } from '@/components/meetups/DatePicker'

<DatePicker
  selectedDates={dates}
  onDateToggle={handleDateToggle}
/>
```

### TimeSelector Component
**File**: `src/components/meetups/TimeSelector.tsx`

Component for selecting available times.

```tsx
import { TimeSelector } from '@/components/meetups/TimeSelector'

<TimeSelector
  selectedTimes={times}
  onChange={setTimes}
/>
```

### DateTimePreferences Component
**File**: `src/components/meetups/DateTimePreferences.tsx`

Component for setting specific times per date.

```tsx
import { DateTimePreferences } from '@/components/meetups/DateTimePreferences'

<DateTimePreferences
  dates={dates}
  availableTimes={times}
  dateTimePreferences={preferences}
  onPreferencesChange={setPreferences}
/>
```

### PriceSelector Component
**File**: `src/components/meetups/PriceSelector.tsx`

Component for selecting price range preference.

```tsx
import { PriceSelector } from '@/components/meetups/PriceSelector'

<PriceSelector
  selectedPrice={price}
  onChange={setPrice}
/>
```

## 🔧 Utility Components

### ErrorBoundary Component
**File**: `src/components/ErrorBoundary.tsx`

Catches and handles React errors gracefully.

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

**Features:**
- Error catching and display
- Development debug information
- Retry functionality
- User-friendly error messages

### CookieConsent Component
**File**: `src/components/CookieConsent.tsx`

GDPR-compliant cookie consent banner.

```tsx
import { CookieConsent } from '@/components/CookieConsent'

<CookieConsent />
```

**Features:**
- Accept/decline options
- Privacy policy link
- Local storage persistence
- GDPR compliance

### Toaster Component
**File**: `src/components/ui/toaster.tsx`

Toast notification system.

```tsx
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

// In component
const { toast } = useToast()

toast({
  title: "Success",
  description: "Your action was completed successfully.",
})
```

## 📱 Mobile Components

### Mobile Navigation
The application uses a mobile-first approach with:

- **Bottom navigation** - Primary actions
- **Hamburger menu** - Secondary actions (removed for cleaner design)
- **Touch-friendly interfaces** - Large touch targets
- **Responsive layouts** - Adaptive design

### Mobile Optimizations
- **Touch targets**: Minimum 44px × 44px
- **Gesture support**: Swipe, tap, pinch
- **Loading states**: Clear feedback
- **Error handling**: User-friendly messages

## 🎨 Styling Components

### Global Styles
**File**: `src/styles/globals.css`

Contains:
- CSS variables for theming
- Custom animations
- Utility classes
- Responsive design utilities

### Utility Functions
**File**: `src/lib/utils.ts`

Contains:
- `cn()` function for class merging
- Utility functions for styling
- Helper functions for components

## 🔧 Custom Hooks

### useSupabase Hook
**File**: `src/components/SupabaseProvider.tsx`

Provides Supabase client and session management.

```tsx
import { useSupabase } from '@/components/SupabaseProvider'

const { session, supabase } = useSupabase()
```

### useToast Hook
**File**: `src/hooks/use-toast.ts`

Provides toast notification functionality.

```tsx
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()
```

## 📝 Component Guidelines

### Naming Conventions
- **Components**: PascalCase (e.g., `MeetupWizard`)
- **Files**: kebab-case (e.g., `meetup-wizard.tsx`)
- **Props**: camelCase (e.g., `onFormDataChange`)

### File Structure
```
src/components/
├── ui/           # Reusable UI components
├── layout/       # Layout components
├── auth/         # Authentication components
├── meetups/      # Meetup-specific components
└── [feature]/    # Feature-specific components
```

### Component Patterns
- **Composition over inheritance**
- **Props for configuration**
- **Children for content**
- **Consistent error handling**
- **Accessibility support**

### Testing Guidelines
- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for complex flows
- **E2E tests** for critical paths

---

**Last Updated**: January 2025
**Version**: 1.0.0 