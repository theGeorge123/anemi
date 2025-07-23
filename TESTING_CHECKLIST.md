# 🧪 Comprehensive Testing Checklist

## User Types to Test

### 1. 🔐 Logged-in User (Organizer)
### 2. 📧 Non-logged-in User (Invitee)
### 3. 🆕 New User (Signing up)
### 4. 👤 Existing User (Logging in)

---

## 🔐 Logged-in User (Organizer) Tests

### ✅ Account & Authentication
- [ ] **Sign Up Flow**
  - [ ] Navigate to `/auth/signup`
  - [ ] Fill in email, password, name
  - [ ] Verify email verification works
  - [ ] Check welcome email is received
  - [ ] Confirm account is created in database

- [ ] **Sign In Flow**
  - [ ] Navigate to `/auth/signin`
  - [ ] Enter valid credentials
  - [ ] Verify redirect to dashboard
  - [ ] Check session persistence

- [ ] **Account Management**
  - [ ] Access dashboard at `/dashboard`
  - [ ] View user stats and meetups
  - [ ] Check profile information
  - [ ] Test logout functionality

### ✅ Meetup Creation Flow
- [ ] **Create New Meetup**
  - [ ] Navigate to `/create`
  - [ ] Select city (Amsterdam, Rotterdam, etc.)
  - [ ] Choose cafe from list
  - [ ] Set available dates (multiple dates)
  - [ ] Set available times (multiple times)
  - [ ] Enter invitee email
  - [ ] Submit meetup creation
  - [ ] Verify meetup appears in dashboard
  - [ ] Check invite email is sent to invitee

- [ ] **Meetup Management**
  - [ ] View meetup details in dashboard
  - [ ] Edit meetup information
  - [ ] Delete meetup
  - [ ] Verify cancellation email is sent
  - [ ] Check meetup is removed from database

### ✅ Dashboard Features
- [ ] **Meetup List**
  - [ ] View all created meetups
  - [ ] See meetup status (pending, accepted, confirmed)
  - [ ] Check organizer badge is shown
  - [ ] Verify meetup details are correct

- [ ] **Participant Meetups**
  - [ ] Accept an invite from another user
  - [ ] Verify participant badge is shown
  - [ ] Check meetup appears in dashboard

---

## 📧 Non-logged-in User (Invitee) Tests

### ✅ Invite Reception
- [ ] **Receive Invite Email**
  - [ ] Check invite email is received
  - [ ] Verify email contains correct meetup details
  - [ ] Test invite link works
  - [ ] Confirm email design looks good

- [ ] **Invite Page Access**
  - [ ] Navigate to invite URL `/invite/[token]`
  - [ ] Verify page loads correctly
  - [ ] Check meetup details are displayed
  - [ ] Test responsive design on mobile

### ✅ Meetup Response Flow
- [ ] **Accept Meetup**
  - [ ] Click "Accept" button
  - [ ] Select preferred date and time
  - [ ] Submit acceptance
  - [ ] Verify confirmation email is sent
  - [ ] Check calendar invite is generated
  - [ ] Test "Add to Calendar" functionality

- [ ] **Decline Meetup**
  - [ ] Click "Decline" button
  - [ ] Provide decline reason
  - [ ] Submit decline
  - [ ] Verify decline notification is sent

### ✅ Account Integration
- [ ] **Sign Up from Invite**
  - [ ] Click "Sign Up" on invite page
  - [ ] Complete signup process
  - [ ] Verify redirect back to invite page
  - [ ] Check user is logged in
  - [ ] Confirm meetup appears in dashboard

- [ ] **Sign In from Invite**
  - [ ] Click "Sign In" on invite page
  - [ ] Enter existing credentials
  - [ ] Verify redirect back to invite page
  - [ ] Check meetup appears in dashboard

### ✅ Find My Meetups Feature
- [ ] **Email Search**
  - [ ] Go to homepage
  - [ ] Use "Find My Meetups" feature
  - [ ] Enter email address
  - [ ] View meetups for that email
  - [ ] Test copy invite link functionality
  - [ ] Verify "Add to Calendar" works
  - [ ] Check responsive design

---

## 🆕 New User (Signing up) Tests

### ✅ Registration Process
- [ ] **Sign Up Form**
  - [ ] Navigate to `/auth/signup`
  - [ ] Test form validation
  - [ ] Check password requirements
  - [ ] Verify email format validation
  - [ ] Test duplicate email handling

- [ ] **Email Verification**
  - [ ] Check verification email is sent
  - [ ] Click verification link
  - [ ] Verify account is activated
  - [ ] Test verification page design

- [ ] **Welcome Experience**
  - [ ] Check welcome email is received
  - [ ] Verify email design and content
  - [ ] Test onboarding flow
  - [ ] Confirm redirect to dashboard

### ✅ First-time User Experience
- [ ] **Dashboard Onboarding**
  - [ ] Check empty state design
  - [ ] Test "Create Meetup" CTA
  - [ ] Verify helpful tips are shown
  - [ ] Test navigation to create page

- [ ] **Feature Discovery**
  - [ ] Test tooltips and help text
  - [ ] Check feature explanations
  - [ ] Verify intuitive navigation

---

## 👤 Existing User (Logging in) Tests

### ✅ Authentication
- [ ] **Sign In Process**
  - [ ] Navigate to `/auth/signin`
  - [ ] Test with valid credentials
  - [ ] Test with invalid credentials
  - [ ] Check error handling
  - [ ] Verify session management

- [ ] **Password Reset**
  - [ ] Click "Forgot Password"
  - [ ] Enter email address
  - [ ] Check reset email is sent
  - [ ] Test reset link functionality
  - [ ] Verify password can be changed

### ✅ Session Management
- [ ] **Session Persistence**
  - [ ] Refresh page while logged in
  - [ ] Close and reopen browser
  - [ ] Test session timeout
  - [ ] Verify logout clears session

- [ ] **Protected Routes**
  - [ ] Try accessing dashboard without login
  - [ ] Verify redirect to signin
  - [ ] Test auth guard functionality

---

## 🌐 General Functionality Tests

### ✅ Responsive Design
- [ ] **Mobile Testing**
  - [ ] Test on mobile viewport
  - [ ] Check touch targets are adequate
  - [ ] Verify navigation works
  - [ ] Test form inputs on mobile

- [ ] **Tablet Testing**
  - [ ] Test on tablet viewport
  - [ ] Check layout adapts properly
  - [ ] Verify touch interactions

- [ ] **Desktop Testing**
  - [ ] Test on desktop viewport
  - [ ] Check hover states
  - [ ] Verify keyboard navigation

### ✅ Email Functionality
- [ ] **Email Testing**
  - [ ] Go to `/debug-email`
  - [ ] Test all email types
  - [ ] Verify emails are received
  - [ ] Check email formatting
  - [ ] Test email links work

### ✅ Error Handling
- [ ] **Network Errors**
  - [ ] Test offline functionality
  - [ ] Check error messages
  - [ ] Verify retry mechanisms

- [ ] **Form Validation**
  - [ ] Test required field validation
  - [ ] Check input format validation
  - [ ] Verify error message display

### ✅ Performance
- [ ] **Loading States**
  - [ ] Check loading spinners
  - [ ] Test skeleton screens
  - [ ] Verify smooth transitions

- [ ] **Page Load Times**
  - [ ] Test initial page load
  - [ ] Check navigation speed
  - [ ] Verify image optimization

---

## 🔧 Technical Tests

### ✅ Database Operations
- [ ] **CRUD Operations**
  - [ ] Test meetup creation
  - [ ] Verify meetup updates
  - [ ] Check meetup deletion
  - [ ] Test user data persistence

- [ ] **Data Integrity**
  - [ ] Verify foreign key constraints
  - [ ] Check soft deletes work
  - [ ] Test data validation

### ✅ API Endpoints
- [ ] **Authentication APIs**
  - [ ] Test signup endpoint
  - [ ] Verify signin endpoint
  - [ ] Check email verification
  - [ ] Test password reset

- [ ] **Meetup APIs**
  - [ ] Test meetup creation
  - [ ] Verify meetup updates
  - [ ] Check meetup deletion
  - [ ] Test invite acceptance

- [ ] **Email APIs**
  - [ ] Test all email endpoints
  - [ ] Verify email delivery
  - [ ] Check error handling

### ✅ Security
- [ ] **Authentication Security**
  - [ ] Test password hashing
  - [ ] Verify JWT tokens
  - [ ] Check session security
  - [ ] Test CSRF protection

- [ ] **Data Security**
  - [ ] Verify RLS policies
  - [ ] Check input sanitization
  - [ ] Test SQL injection prevention
  - [ ] Verify XSS protection

---

## 📱 Browser Compatibility

### ✅ Modern Browsers
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

### ✅ Mobile Browsers
- [ ] **iOS Safari**
- [ ] **Chrome Mobile**
- [ ] **Samsung Internet**

---

## 🚀 Deployment Tests

### ✅ Production Environment
- [ ] **Environment Variables**
  - [ ] Verify all env vars are set
  - [ ] Check API keys are working
  - [ ] Test database connections

- [ ] **Domain & SSL**
  - [ ] Test HTTPS redirect
  - [ ] Verify SSL certificate
  - [ ] Check domain configuration

### ✅ Monitoring
- [ ] **Error Tracking**
  - [ ] Test error logging
  - [ ] Verify monitoring alerts
  - [ ] Check performance metrics

---

## 📋 Test Results Template

```
## Test Session: [Date]

### User Type: [Logged-in/Non-logged-in/New/Existing]
- [ ] All tests passed
- [ ] Issues found: [List issues]
- [ ] Notes: [Additional notes]

### Email Testing
- [ ] All emails working
- [ ] Issues: [List email issues]
- [ ] Tested on: [Email provider]

### Browser Testing
- [ ] Chrome: ✅/❌
- [ ] Firefox: ✅/❌
- [ ] Safari: ✅/❌
- [ ] Mobile: ✅/❌

### Performance
- [ ] Page load times acceptable
- [ ] Mobile performance good
- [ ] No major bottlenecks

### Security
- [ ] Authentication secure
- [ ] Data protection working
- [ ] No vulnerabilities found
```

---

## 🎯 Priority Testing Order

1. **High Priority** (Core functionality)
   - User registration/login
   - Meetup creation
   - Invite acceptance
   - Email delivery

2. **Medium Priority** (User experience)
   - Dashboard functionality
   - Responsive design
   - Error handling
   - Performance

3. **Low Priority** (Nice to have)
   - Advanced features
   - Browser compatibility
   - Monitoring setup

---

## 🚨 Common Issues to Watch For

- **Email not received**: Check spam folder, verify Resend API key
- **Invite links broken**: Verify token generation and validation
- **Mobile layout issues**: Test on actual devices
- **Database errors**: Check RLS policies and constraints
- **Authentication issues**: Verify JWT token handling
- **Performance problems**: Monitor page load times and API response times 