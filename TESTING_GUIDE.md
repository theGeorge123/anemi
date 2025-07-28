# 🧪 Testing Guide - Anemi Project

## Overzicht

Dit document beschrijft de testing strategie en implementatie voor het Anemi project. We gebruiken Jest voor unit- en integratietests, en Playwright voor end-to-end tests.

## Test Categorieën

### 1. Unit Tests
- **Locatie**: `src/lib/`, `src/utils/`
- **Doel**: Testen van individuele functies en utilities
- **Uitvoeren**: `npm run test:unit`

### 2. Component Tests
- **Locatie**: `src/components/`
- **Doel**: Testen van React componenten
- **Uitvoeren**: `npm run test:component`

### 3. API Tests
- **Locatie**: `src/app/api/`
- **Doel**: Testen van API routes
- **Uitvoeren**: `npm run test:api`

### 4. Integration Tests
- **Locatie**: `src/app/api/`, `src/lib/`
- **Doel**: Testen van integratie tussen verschillende lagen
- **Uitvoeren**: `npm run test:integration`

### 5. End-to-End Tests
- **Locatie**: `e2e-tests/`
- **Doel**: Testen van volledige user flows
- **Uitvoeren**: `npm run e2e`

## Test Commando's

```bash
# Alle tests uitvoeren
npm run test:all

# Specifieke test categorieën
npm run test:unit
npm run test:component
npm run test:api
npm run test:integration

# Coverage rapport
npm run test:coverage

# Watch mode
npm run test:watch

# CI mode
npm run test:ci

# E2E tests
npm run e2e
npm run e2e:ui
```

## Test Bestanden Structuur

```
src/
├── lib/
│   ├── validation.test.ts          # Validation tests
│   ├── error-service.test.ts       # Error handling tests
│   └── utils.test.ts              # Utility function tests
├── components/
│   ├── meetups/
│   │   └── MeetupWizard.test.tsx  # Component tests
│   └── ui/
│       └── button.test.tsx        # UI component tests
└── app/
    └── api/
        ├── meetups/
        │   └── route.test.ts       # API route tests
        └── auth/
            └── send-password-reset/
                └── route.test.ts    # Auth API tests
```

## Test Patterns

### API Route Tests
```typescript
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

describe('/api/endpoint', () => {
  it('should handle valid requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interactions', () => {
    render(<Component />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Validation Tests
```typescript
import { validationSchema } from './validation'

describe('Validation Schema', () => {
  it('should validate correct data', () => {
    const validData = { email: 'test@example.com' }
    const result = validationSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
  
  it('should reject invalid data', () => {
    const invalidData = { email: 'invalid-email' }
    const result = validationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
```

## Mocking Strategie

### Prisma Mocking
```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
```

### Next.js Router Mocking
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))
```

### Supabase Mocking
```typescript
jest.mock('@/lib/supabase', () => ({
  useSupabase: () => ({
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    },
  }),
}))
```

## Coverage Doelen

- **Minimum Coverage**: 30% (MVP)
- **Target Coverage**: 80% (Post-launch)
- **Critical Paths**: 100% coverage

### Coverage Rapport
```bash
npm run test:coverage
```

Het coverage rapport wordt gegenereerd in `coverage/lcov-report/index.html`

## Test Data

### Test Databases
- **Development**: SQLite in-memory database
- **Testing**: Mocked Prisma client
- **E2E**: Test database met seed data

### Test Users
```typescript
const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
}
```

### Test Meetups
```typescript
const testMeetup = {
  id: 'test-meetup-id',
  token: 'test-token',
  organizerName: 'John Doe',
  organizerEmail: 'john@example.com',
  status: 'pending',
  cafe: {
    id: 'cafe1',
    name: 'Test Cafe',
    address: '123 Test St',
    city: 'Amsterdam',
  },
}
```

## Error Testing

### Network Errors
```typescript
it('should handle network errors', async () => {
  // Mock fetch to throw network error
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
  
  const result = await functionThatUsesFetch()
  expect(result.error).toBe('Network error')
})
```

### Validation Errors
```typescript
it('should show validation errors', async () => {
  render(<Form />)
  
  const submitButton = screen.getByText('Submit')
  fireEvent.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })
})
```

## Performance Testing

### Component Performance
```typescript
it('should render within performance budget', () => {
  const startTime = performance.now()
  render(<HeavyComponent />)
  const endTime = performance.now()
  
  expect(endTime - startTime).toBeLessThan(100) // 100ms budget
})
```

### API Performance
```typescript
it('should respond within time limit', async () => {
  const startTime = Date.now()
  const response = await fetch('/api/endpoint')
  const endTime = Date.now()
  
  expect(endTime - startTime).toBeLessThan(1000) // 1s limit
  expect(response.status).toBe(200)
})
```

## Continuous Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:coverage
```

### Pre-commit Hooks
```bash
# Husky pre-commit hook
npm run test:unit
npm run lint
npm run type-check
```

## Debugging Tests

### Jest Debug Mode
```bash
# Run specific test in debug mode
npm run test -- --verbose --no-coverage --testNamePattern="specific test name"
```

### Component Testing Debug
```typescript
import { screen } from '@testing-library/react'

// Debug component output
screen.debug()

// Debug specific element
screen.debug(screen.getByText('Button'))
```

### API Testing Debug
```typescript
// Log response details
const response = await POST(request)
console.log('Response status:', response.status)
console.log('Response body:', await response.json())
```

## Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow the pattern: "should [expected behavior] when [condition]"
- Example: `it('should show error message when email is invalid')`

### 2. Test Organization
- Group related tests in describe blocks
- Use beforeEach for common setup
- Use afterEach for cleanup

### 3. Mock Management
- Clear mocks between tests
- Use jest.clearAllMocks() in beforeEach
- Mock at the lowest level possible

### 4. Async Testing
- Always use async/await for async operations
- Use waitFor for DOM updates
- Handle promises properly

### 5. Error Testing
- Test both success and failure scenarios
- Mock external dependencies
- Test error boundaries

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check environment variables
   - Verify mock implementations
   - Check timezone differences

2. **Component tests not finding elements**
   - Use data-testid attributes
   - Check for async rendering
   - Verify component props

3. **API tests failing**
   - Check request/response format
   - Verify mock implementations
   - Check authentication headers

### Debug Commands
```bash
# Run tests with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- path/to/test.test.ts

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage
```

## Test Maintenance

### Regular Tasks
- [ ] Update tests when API changes
- [ ] Review coverage reports monthly
- [ ] Update mocks when dependencies change
- [ ] Add tests for new features

### Test Review Checklist
- [ ] All critical paths covered
- [ ] Error scenarios tested
- [ ] Performance requirements met
- [ ] Tests are readable and maintainable
- [ ] Mocks are appropriate and minimal

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing) 