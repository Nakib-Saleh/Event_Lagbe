# Email Setup Guide for Event Lagbe

## Step 1: Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn it on

2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Event Lagbe"
   - Copy the 16-digit password

3. **Update application.properties**:
   ```properties
   spring.mail.username=eventlagbe@gmail.com
   spring.mail.password=your-16-digit-app-password-here
   ```

## Step 2: Test Email Configuration

1. **Start the backend server**
2. **Test with a simple email** using Postman:
   ```
   POST http://localhost:2038/api/events/test-event-id/send-mail
   Content-Type: application/json
   
   {
     "subject": "Test Email",
     "message": "This is a test email from Event Lagbe",
     "senderEmail": "eventlagbe@gmail.com",
     "participantEmails": ["your-test-email@gmail.com"]
   }
   ```

## Step 3: Frontend Testing

1. **Start the frontend server**
2. **Login as an organizer**
3. **Go to Registered List**
4. **Select an event with participants**
5. **Click "Send Mail"**
6. **Fill in subject and message**
7. **Click "Send Mail"**

## Troubleshooting

### Common Issues:

1. **Authentication failed**:
   - Check if 2FA is enabled
   - Verify app password is correct
   - Make sure you're using app password, not regular password

2. **Connection timeout**:
   - Check internet connection
   - Verify Gmail SMTP settings
   - Try different port (587 or 465)

3. **Email not received**:
   - Check spam folder
   - Verify recipient email is correct
   - Check Gmail sending limits

### Gmail Sending Limits:
- Daily limit: 500 emails
- Per minute: 20 emails
- Per second: 5 emails

## Production Setup

For production, consider using:
- **SendGrid**: Professional email service
- **Mailgun**: Reliable email delivery
- **AWS SES**: Enterprise-grade service

## Security Notes

1. **Never commit email passwords** to version control
2. **Use environment variables** for sensitive data
3. **Enable email authentication** (SPF, DKIM, DMARC)
4. **Monitor email sending** for abuse
