import { test, expect } from '@playwright/test'

test.describe('Create Meetup Flow', () => {
  test('should create a meetup successfully', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/')
    
    // Verify we're on the landing page
    await expect(page).toHaveTitle(/Anemi Meets/)
    
    // Click "Start a Meetup" button
    await page.click('text=Start a Meetup')
    
    // Should navigate to create page
    await expect(page).toHaveURL('/create')
    
    // Fill in the form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    
    // Select city (Amsterdam)
    await page.selectOption('select[name="city"]', 'Amsterdam')
    
    // Select date (next week)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const dateString = nextWeek.toISOString().split('T')[0]
    await page.fill('input[type="date"]', dateString)
    
    // Select time
    await page.selectOption('select[name="time"]', '14:00')
    
    // Select price range
    await page.selectOption('select[name="priceRange"]', 'MODERATE')
    
    // Click shuffle button to get a cafe
    await page.click('button:has-text("Shuffle")')
    
    // Wait for cafe to be selected
    await page.waitForSelector('[data-testid="selected-cafe"]', { timeout: 10000 })
    
    // Verify a cafe was selected
    const cafeName = await page.textContent('[data-testid="selected-cafe"]')
    expect(cafeName).toBeTruthy()
    expect(cafeName).not.toBe('')
    expect(cafeName).not.toBeNull()
    expect(typeof cafeName).toBe('string')
    
    // Click create meetup button
    await page.click('button:has-text("Create Meetup")')
    
    // Should navigate to result page
    await expect(page).toHaveURL('/result')
    
    // Verify success message
    await expect(page.locator('text=Meetup Created!')).toBeVisible()
    
    // Verify invite link is generated
    await expect(page.locator('text=Invite Link')).toBeVisible()
  })

  test('should show validation errors for invalid form', async ({ page }) => {
    await page.goto('/create')
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Create Meetup")')
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=City is required')).toBeVisible()
  })

  test('should handle invalid email format', async ({ page }) => {
    await page.goto('/create')
    
    // Fill in form with invalid email
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.selectOption('select[name="city"]', 'Amsterdam')
    
    // Should show email validation error
    await expect(page.locator('text=Invalid email format')).toBeVisible()
  })

  test('should allow going back to previous steps', async ({ page }) => {
    await page.goto('/create')
    
    // Fill in first step
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    
    // Go to next step
    await page.click('button:has-text("Next")')
    
    // Should be on step 2
    await expect(page.locator('text=Step 2')).toBeVisible()
    
    // Go back
    await page.click('button:has-text("Back")')
    
    // Should be back on step 1
    await expect(page.locator('text=Step 1')).toBeVisible()
    
    // Verify form data is preserved
    await expect(page.locator('input[name="name"]')).toHaveValue('John Doe')
    await expect(page.locator('input[name="email"]')).toHaveValue('john@example.com')
  })
}) 