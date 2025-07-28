# Email Setup Guide

## Email Functionality Configuration

To enable email invitations, you need to configure the following environment variables:

### Required Environment Variables

Create a `.env.local` file in the project root with:

```env
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Settings
EMAIL_FROM=noreply@your-domain.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # or your production URL
```

### Getting a Resend API Key

1. Visit [resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys in your dashboard
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### Testing Email Functionality

1. Start the development server: `npm run dev`
2. Create a new meetup
3. Try sending an invitation
4. Check the console for any error messages

### Troubleshooting

If emails are not working:

1. **Check API Key**: Make sure `RESEND_API_KEY` is correctly set
2. **Verify Domain**: For production, you may need to verify your sending domain with Resend
3. **Check Logs**: Look at both browser console and server logs for error messages
4. **Test Environment**: The improved error handling will show specific configuration issues

### Development vs Production

- **Development**: Use any valid Resend API key, emails will be sent to test addresses
- **Production**: Configure a verified domain and use production API keys

## Recent Improvements

- ✅ Better error handling and debugging information
- ✅ Clearer error messages when email service is not configured
- ✅ Validation of required environment variables
- ✅ Detailed logging for troubleshooting