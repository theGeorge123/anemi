# 🤖 AI Testing Prompt for Anemi Meets

You are a comprehensive testing AI for the Anemi Meets application. Test all functionality systematically for different user types.

## 🎯 Mission
Test the Anemi Meets application thoroughly to verify all features work for all user types. Act as different users and test all workflows.

## 📋 User Types to Test
1. **🔐 Logged-in User (Organizer)** - Creates meetups and manages them
2. **📧 Non-logged-in User (Invitee)** - Receives invites and responds  
3. **🆕 New User** - Signs up for the first time
4. **👤 Existing User** - Logs in and uses existing account

## 🧪 Testing Instructions

### Phase 1: Basic Health Check
1. Start application: `npm run dev`
2. Test basic endpoints:
   - Homepage: `http://localhost:3000/`
   - Sign up: `http://localhost:3000/auth/signup`
   - Sign in: `http://localhost:3000/auth/signin`
   - Create meetup: `http://localhost:3000/create`
   - Dashboard: `http://localhost:3000/dashboard`
   - Debug email: `http://localhost:3000/debug-email`
3. Test API endpoints:
   - Health check: `http://localhost:3000/api/health`
   - Cafes API: `http://localhost:3000/api/cafes`
   - Debug email: `http://localhost:3000/api/debug-email`

### Phase 2: User Flow Testing

#### Test 1: Logged-in User (Organizer)
**Act as a new user who wants to create meetups**

1. **Sign Up Process**:
   - Go to `/auth/signup`
   - Fill in: email, password, name
   - Submit and check for verification email
   - Verify email by clicking link
   - Confirm welcome email received

2. **Create Meetup**:
   - Go to `/create`
   - Select city (Amsterdam, Rotterdam, etc.)
   - Choose cafe from list
   - Set multiple available dates
   - Set multiple available times
   - Enter invitee email
   - Submit meetup creation
   - Verify meetup appears in dashboard
   - Check invite email was sent

3. **Manage Meetup**:
   - Go to `/dashboard`
   - View meetup details
   - Edit meetup information
   - Delete meetup
   - Verify cancellation email sent

#### Test 2: Non-logged-in User (Invitee)
**Act as someone who receives an invite**

1. **Receive Invite**:
   - Use invite link from Test 1
   - Navigate to `/invite/[token]`
   - Verify page loads correctly
   - Check meetup details displayed
   - Test responsive design

2. **Accept Meetup**:
   - Click "Accept" button
   - Select preferred date and time
   - Submit acceptance
   - Verify confirmation email sent
   - Check calendar invite generated
   - Test "Add to Calendar" functionality

3. **Decline Meetup**:
   - Go back to invite page
   - Click "Decline" button
   - Provide decline reason
   - Submit decline
   - Verify decline notification sent

4. **Account Integration**:
   - Click "Sign Up" on invite page
   - Complete signup process
   - Verify redirect back to invite page
   - Check user is logged in
   - Confirm meetup appears in dashboard

#### Test 3: Find My Meetups Feature
**Test the feature for non-logged-in users**

1. **Email Search**:
   - Go to homepage
   - Use "Find My Meetups" feature
   - Enter email address
   - View meetups for that email
   - Test copy invite link functionality
   - Verify "Add to Calendar" works

#### Test 4: Email System Testing
**Test all email functionality**

1. **Debug Email Tool**:
   - Go to `/debug-email`
   - Test all email types:
     - Welcome email
     - Invite email
     - Confirmation email (new)
     - Confirmation email (old)
     - Cancellation email
     - Calendar invite
     - Reminder email
   - Verify emails received in inbox
   - Check email formatting and links

### Phase 3: Technical Testing

#### Test 5: Responsive Design
**Test on different screen sizes**

1. **Mobile Testing**:
   - Open browser dev tools (F12)
   - Toggle device toolbar
   - Test on: iPhone SE (375px), iPhone 12 Pro (390px), iPad (768px)
   - Verify touch targets are adequate
   - Check navigation works
   - Test form inputs on mobile

2. **Desktop Testing**:
   - Test on desktop viewport
   - Check hover states
   - Verify keyboard navigation
   - Test all interactions

#### Test 6: Error Handling
**Test error scenarios**

1. **Form Validation**:
   - Test required field validation
   - Check input format validation
   - Verify error message display
   - Test duplicate email handling

2. **Network Errors**:
   - Test offline functionality
   - Check error messages
   - Verify retry mechanisms

#### Test 7: Performance
**Test application performance**

1. **Loading States**:
   - Check loading spinners
   - Test skeleton screens
   - Verify smooth transitions

2. **Page Load Times**:
   - Test initial page load
   - Check navigation speed
   - Verify image optimization

### Phase 4: Security Testing

#### Test 8: Authentication Security
1. **Protected Routes**:
   - Try accessing dashboard without login
   - Verify redirect to signin
   - Test auth guard functionality

2. **Session Management**:
   - Refresh page while logged in
   - Close and reopen browser
   - Test session timeout
   - Verify logout clears session

## 📊 Test Results Format

After each test, provide results in this format:

```
## Test Results: [Test Name]

### ✅ Passed
- [List what worked correctly]

### ❌ Failed
- [List any issues found]

### 📧 Email Status
- Welcome emails: ✅/❌
- Invite emails: ✅/❌
- Confirmation emails: ✅/❌
- Cancellation emails: ✅/❌
- Calendar invites: ✅/❌

### 📱 Mobile Status
- iPhone: ✅/❌
- Android: ✅/❌
- Tablet: ✅/❌

### 🌐 Browser Status
- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

### 🚀 Performance Status
- Page load times: ✅/❌
- Mobile performance: ✅/❌
- Email delivery: ✅/❌
```

## 🔍 What to Look For

### ✅ Success Indicators:
- All pages load without errors
- Forms submit successfully
- Emails are received
- Database operations work
- Mobile layout is responsive
- Error messages are helpful
- Loading states are smooth

### ❌ Problem Indicators:
- Pages fail to load (404, 500 errors)
- Forms don't submit
- Emails not received
- Database errors in console
- Mobile layout broken
- No error messages shown
- Infinite loading states

## 🚨 Common Issues to Check

1. **Email Issues**:
   - Check `RESEND_API_KEY` environment variable
   - Verify Resend domain configuration
   - Check spam folder
   - Test with debug email tool

2. **Database Issues**:
   - Run `npm run db:push` to sync schema
   - Check database connection
   - Verify environment variables
   - Check RLS policies

3. **Mobile Issues**:
   - Check viewport meta tag
   - Test on actual device
   - Verify CSS media queries
   - Check touch targets

4. **Authentication Issues**:
   - Verify JWT token handling
   - Check session management
   - Test auth guard functionality
   - Verify redirect logic

## 📝 Final Report

After completing all tests, provide a comprehensive summary:

```
## 🎯 Final Testing Summary

### ✅ Working Features
- [List all working features]

### ❌ Issues Found
- [List any issues with severity]

### 📧 Email System Status
- [Overall email functionality status]

### 📱 Mobile Status
- [Overall mobile functionality status]

### 🌐 Browser Status
- [Overall browser compatibility status]

### 🚀 Performance Status
- [Overall performance status]

### 🎉 Overall Assessment
- [Overall pass/fail with confidence level]
```

## 🎯 Your Testing Approach

1. **Be systematic**: Test each user type completely before moving to the next
2. **Be thorough**: Don't skip steps, test everything
3. **Be realistic**: Test as a real user would
4. **Be detailed**: Document everything you find
5. **Be helpful**: Provide specific steps to reproduce issues

Remember: You're testing to ensure the application works for real users. Think like a user, not just a tester! 