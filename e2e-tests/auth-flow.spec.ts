import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should allow user to sign up with email verification', async ({ page }) => {
    // Navigate to signup
    await page.click('text=Registreren')
    await expect(page).toHaveURL('/auth/signup')

    // Fill signup form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    await page.fill('input[name="confirmPassword"]', 'testpassword123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show verification message
    await expect(page.locator('text=Controleer je e-mail')).toBeVisible()
  })

  test('should allow user to sign in', async ({ page }) => {
    // Navigate to signin
    await page.click('text=Inloggen')
    await expect(page).toHaveURL('/auth/signin')

    // Fill signin form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard or show success
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Ongeldige inloggegevens')).toBeVisible()
  })

  test('should allow user to sign out', async ({ page }) => {
    // First sign in
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    
    // Click logout
    await page.click('text=Uitloggen')
    
    // Should redirect to home page
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Inloggen')).toBeVisible()
  })

  test('should protect dashboard when not authenticated', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard')
    
    // Should redirect to signin
    await expect(page).toHaveURL('/auth/signin')
  })
}) 