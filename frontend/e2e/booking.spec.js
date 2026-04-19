import { test, expect } from '@playwright/test';

test.describe('Patient Booking Flow', () => {
  const timestamp = Date.now();
  const testEmail = `patient${timestamp}@test.com`;
  const testPassword = 'password123';
  
  // Future date for the appointment
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);
  const offset = futureDate.getTimezoneOffset() * 60000;
  const localIsoDate = (new Date(futureDate.getTime() - offset)).toISOString().slice(0, 16); // e.g. 2026-04-20T14:30

  test('registers, logs in, books appointment, and receives 409 on duplicate', async ({ page }) => {
    // 1. Register a Patient
    await page.goto('/register');
    await expect(page.locator('h2')).toContainText('Create an Account');
    
    await page.fill('input[type="text"]', 'E2E Test Patient');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.selectOption('select', 'PATIENT');
    
    await page.click('button[type="submit"]');

    // 2. Wait for auto-redirection to the Dashboard
    await expect(page).toHaveURL(/.*\/dashboard|.*\/patient-dashboard/);
    await expect(page.locator('h1')).toContainText('Patient Portal');

    // 3. Book Doctor ID 1
    // Fill the inputs. There are two inputs on Patient Dashboard.
    await page.fill('input[type="text"]', '1');
    await page.fill('input[type="datetime-local"]', localIsoDate);
    
    await page.click('button[type="submit"]');

    // Assert a 201 Success green message happens
    const successMsg = page.locator('text=Appointment successfully booked!');
    await expect(successMsg).toBeVisible({ timeout: 5000 });

    // 4. Attempt to book exactly the same time again to trigger 409
    await page.fill('input[type="text"]', '1');
    await page.fill('input[type="datetime-local"]', localIsoDate);
    
    await page.click('button[type="submit"]');

    // Assert the 409 Conflict red message appears
    const conflictMsg = page.locator('text=This time slot is already booked. Please select another time.');
    await expect(conflictMsg).toBeVisible({ timeout: 5000 });
  });
});
