import { test, expect } from '@playwright/test'

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display user meetups', async ({ page }) => {
    // Check if meetups are displayed
    await expect(page.locator('text=Mijn Meetups')).toBeVisible()
    
    // Should show meetup cards or empty state
    const meetupCards = page.locator('[data-testid="meetup-card"]')
    const emptyState = page.locator('text=Je hebt nog geen meetups')
    
    await expect(meetupCards.or(emptyState)).toBeVisible()
  })

  test('should allow creating new meetup', async ({ page }) => {
    // Click create meetup button
    await page.click('text=Maak een meetup')
    
    // Should navigate to meetup creation
    await expect(page).toHaveURL('/create')
    
    // Check if wizard steps are visible
    await expect(page.locator('text=Stap 1 van 6')).toBeVisible()
  })

  test('should allow editing meetup', async ({ page }) => {
    // Find and click edit button on first meetup
    const editButton = page.locator('[data-testid="edit-meetup"]').first()
    
    if (await editButton.isVisible()) {
      await editButton.click()
      
      // Should open edit modal
      await expect(page.locator('text=Bewerk Meetup')).toBeVisible()
      
      // Test editing
      await page.fill('input[name="organizerName"]', 'Updated Name')
      await page.click('text=Opslaan')
      
      // Should show success message
      await expect(page.locator('text=Meetup bijgewerkt')).toBeVisible()
    }
  })

  test('should allow deleting meetup', async ({ page }) => {
    // Find and click delete button on first meetup
    const deleteButton = page.locator('[data-testid="delete-meetup"]').first()
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
      
      // Should show confirmation dialog
      await expect(page.locator('text=Weet je zeker dat je deze meetup wilt verwijderen?')).toBeVisible()
      
      // Confirm deletion
      await page.click('text=Verwijderen')
      
      // Should show success message
      await expect(page.locator('text=Meetup verwijderd')).toBeVisible()
    }
  })

  test('should display user profile information', async ({ page }) => {
    // Check if user info is displayed
    await expect(page.locator('text=Welkom')).toBeVisible()
    
    // Should show user email
    await expect(page.locator('text=test@example.com')).toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    // Refresh page to trigger loading
    await page.reload()
    
    // Should show loading indicator
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
    
    // Wait for content to load
    await expect(page.locator('text=Mijn Meetups')).toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Mock API error by modifying network request
    await page.route('**/api/meetups', route => {
      route.fulfill({ status: 500, body: '{"error": "Server error"}' })
    })
    
    // Refresh page
    await page.reload()
    
    // Should show error message
    await expect(page.locator('text=Er is een fout opgetreden')).toBeVisible()
  })
}) 