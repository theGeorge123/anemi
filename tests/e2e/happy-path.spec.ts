import { test, expect } from '@playwright/test'

test.describe('Anemi Meets Happy Path', () => {
  test('should create a meetup successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')
    
    // Verify the page loads
    await expect(page).toHaveTitle(/Anemi Meets/)
    await expect(page.locator('h1')).toContainText('Coffee Meetups')
    
    // Start creating a meetup
    await page.click('text=Create Meetup')
    
    // Fill in the form step by step
    // Step 1: Name
    await expect(page.locator('text=What\'s your name?')).toBeVisible()
    await page.fill('input[placeholder="Enter your name"]', 'John Doe')
    await page.click('button:has-text("Next")')
    
    // Step 2: Email
    await expect(page.locator('text=What\'s your email?')).toBeVisible()
    await page.fill('input[type="email"]', 'john@example.com')
    await page.click('button:has-text("Next")')
    
    // Step 3: City
    await expect(page.locator('text=Which city?')).toBeVisible()
    await page.click('button:has-text("Amsterdam")')
    await page.click('button:has-text("Next")')
    
    // Step 4: Date
    await expect(page.locator('text=When?')).toBeVisible()
    // Select tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0] || ''
    await page.fill('input[type="date"]', tomorrowStr)
    await page.click('button:has-text("Next")')
    
    // Step 5: Time
    await expect(page.locator('text=What time?')).toBeVisible()
    await page.click('button:has-text("14:00")')
    await page.click('button:has-text("Next")')
    
    // Step 6: Price
    await expect(page.locator('text=What\'s your budget?')).toBeVisible()
    await page.click('button:has-text("€€")')
    await page.click('button:has-text("Next")')
    
    // Step 7: Shuffle
    await expect(page.locator('text=Ready to shuffle?')).toBeVisible()
    await page.click('button:has-text("Shuffle")')
    
    // Wait for the result page
    await expect(page.locator('text=Your coffee meetup is ready!')).toBeVisible()
    
    // Verify the meetup details are displayed
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=john@example.com')).toBeVisible()
    await expect(page.locator('text=Amsterdam')).toBeVisible()
    
    // Check that the invite link is generated
    const inviteLink = page.locator('a[href*="/invite/"]')
    await expect(inviteLink).toBeVisible()
    
    // Copy the invite link
    await page.click('button:has-text("Copy")')
    
    // Verify copy success message
    await expect(page.locator('text=Link copied!')).toBeVisible()
  })
  
  test('should handle form validation', async ({ page }) => {
    await page.goto('/create')
    
    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")')
    
    // Should show validation error
    await expect(page.locator('text=Name is required')).toBeVisible()
    
    // Fill name and proceed
    await page.fill('input[placeholder="Enter your name"]', 'Jane Doe')
    await page.click('button:has-text("Next")')
    
    // Try to proceed without email
    await page.click('button:has-text("Next")')
    
    // Should show email validation error
    await expect(page.locator('text=Valid email is required')).toBeVisible()
  })
  
  test('should handle navigation between steps', async ({ page }) => {
    await page.goto('/create')
    
    // Fill name and go to next step
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.click('button:has-text("Next")')
    
    // Go back to previous step
    await page.click('button:has-text("Back")')
    
    // Should be back on name step
    await expect(page.locator('text=What\'s your name?')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter your name"]')).toHaveValue('Test User')
  })
  
  test('should display step indicators correctly', async ({ page }) => {
    await page.goto('/create')
    
    // Check initial step indicator
    await expect(page.locator('[data-step="1"]')).toHaveClass(/active/)
    
    // Fill name and go to next step
    await page.fill('input[placeholder="Enter your name"]', 'Test User')
    await page.click('button:has-text("Next")')
    
    // Check step 2 is active
    await expect(page.locator('[data-step="2"]')).toHaveClass(/active/)
    await expect(page.locator('[data-step="1"]')).toHaveClass(/completed/)
  })
}) 