# 🚀 Quick Testing Guide

## 🎯 Priority Testing (Start Here)

### 1. 🔐 Test Logged-in User Flow
```bash
# Start the development server
npm run dev

# Open in browser: http://localhost:3000
```

**Quick Test Steps:**
1. Go to `/auth/signup`
2. Create a new account with test email
3. Verify email (check inbox)
4. Sign in at `/auth/signin`
5. Go to `/create` and create a meetup
6. Check dashboard at `/dashboard`
7. Delete the meetup and verify cancellation email

### 2. 📧 Test Non-logged-in User Flow
1. Use the invite link from step 1
2. Test the invite page at `/invite/[token]`
3. Try accepting the meetup
4. Test declining the meetup
5. Test "Find My Meetups" on homepage

### 3. 📧 Test Email Functionality
1. Go to `/debug-email`
2. Test all email types:
   - Welcome email
   - Invite email
   - Confirmation email
   - Cancellation email
   - Calendar invite
3. Check your inbox for received emails

---

## 🧪 Automated Testing

### Run Basic Tests
```bash
# Test basic functionality
node scripts/test-basic-functionality.js

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

### Test Email System
```bash
# Test all email types
curl -X POST http://localhost:3000/api/debug-email \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "welcome",
    "to": "your-email@example.com",
    "userName": "Test User"
  }'
```

---

## 📱 Mobile Testing

### Test Responsive Design
1. Open browser dev tools (F12)
2. Toggle device toolbar
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1200px+)

### Test Touch Interactions
1. Test on actual mobile device
2. Check touch targets are adequate
3. Verify scrolling works smoothly
4. Test form inputs on mobile keyboard

---

## 🔍 Manual Testing Checklist

### High Priority (Test First)
- [ ] **User Registration**
  - [ ] Sign up with valid email
  - [ ] Verify email verification
  - [ ] Check welcome email received

- [ ] **Meetup Creation**
  - [ ] Create meetup with all fields
  - [ ] Verify invite email sent
  - [ ] Check meetup appears in dashboard

- [ ] **Invite Acceptance**
  - [ ] Open invite link
  - [ ] Accept meetup with date/time
  - [ ] Verify confirmation email
  - [ ] Check calendar invite

- [ ] **Meetup Deletion**
  - [ ] Delete meetup from dashboard
  - [ ] Verify cancellation email sent

### Medium Priority
- [ ] **Dashboard Features**
  - [ ] View all meetups
  - [ ] Check organizer/participant badges
  - [ ] Test edit functionality

- [ ] **Find My Meetups**
  - [ ] Enter email on homepage
  - [ ] View meetups for email
  - [ ] Test copy link functionality
  - [ ] Test add to calendar

- [ ] **Account Integration**
  - [ ] Sign up from invite page
  - [ ] Sign in from invite page
  - [ ] Verify redirect back to invite

### Low Priority
- [ ] **Error Handling**
  - [ ] Test invalid form inputs
  - [ ] Check error messages
  - [ ] Test network errors

- [ ] **Performance**
  - [ ] Check page load times
  - [ ] Test smooth transitions
  - [ ] Verify no major bottlenecks

---

## 🐛 Common Issues & Solutions

### Email Not Received
```bash
# Check Resend API key
echo $RESEND_API_KEY

# Test email endpoint
curl -X POST http://localhost:3000/api/debug-email \
  -H "Content-Type: application/json" \
  -d '{"testType": "welcome", "to": "test@example.com"}'
```

### Invite Links Broken
1. Check token generation in database
2. Verify invite URL format
3. Test invite page directly

### Mobile Layout Issues
1. Check CSS media queries
2. Test on actual device
3. Verify viewport meta tag

### Database Errors
```bash
# Check database connection
npm run db:push

# Reset database (if needed)
npm run db:reset
```

---

## 📊 Test Results Template

```
## Test Session: [Date/Time]

### ✅ Working Features
- User registration and login
- Meetup creation and management
- Email functionality
- Invite acceptance flow
- Dashboard functionality

### ❌ Issues Found
- [List any issues found]

### 📧 Email Testing
- Welcome emails: ✅/❌
- Invite emails: ✅/❌
- Confirmation emails: ✅/❌
- Cancellation emails: ✅/❌
- Calendar invites: ✅/❌

### 📱 Mobile Testing
- iPhone: ✅/❌
- Android: ✅/❌
- Tablet: ✅/❌

### 🌐 Browser Testing
- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

### 🚀 Performance
- Page load times: ✅/❌
- Mobile performance: ✅/❌
- Email delivery: ✅/❌
```

---

## 🎯 Testing Priorities

### Phase 1: Core Functionality (Do First)
1. User registration/login
2. Meetup creation
3. Email delivery
4. Invite acceptance

### Phase 2: User Experience (Do Second)
1. Dashboard functionality
2. Mobile responsiveness
3. Error handling
4. Performance

### Phase 3: Advanced Features (Do Last)
1. Browser compatibility
2. Edge cases
3. Security testing
4. Load testing

---

## 🚨 Quick Fixes

### If Emails Don't Work
1. Check `RESEND_API_KEY` in `.env.local`
2. Verify Resend domain configuration
3. Check spam folder
4. Test with debug email tool

### If Database Errors
1. Run `npm run db:push`
2. Check database connection
3. Verify environment variables
4. Check RLS policies

### If Mobile Issues
1. Check viewport meta tag
2. Test on actual device
3. Verify CSS media queries
4. Check touch targets

---

## 📞 Need Help?

1. Check the full `TESTING_CHECKLIST.md` for detailed tests
2. Use the debug tools at `/debug-email` and `/debug-env`
3. Check browser console for errors
4. Verify all environment variables are set
5. Test on different devices and browsers 