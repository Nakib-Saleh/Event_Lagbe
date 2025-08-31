# Railway Deployment Guide

## Environment Variables Required

Set these environment variables in your Railway project dashboard:

### Database
- `MONGODB_URI`: Your MongoDB connection string
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

### Email Configuration
- `MAIL_HOST`: SMTP host (e.g., `smtp.gmail.com`)
- `MAIL_PORT`: SMTP port (e.g., `587`)
- `MAIL_USERNAME`: Your email address
- `MAIL_PASSWORD`: Your email app password

### Firebase Configuration
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account JSON
  - For Railway, you can either:
    1. Store the JSON content as an environment variable and reference it
    2. Use Railway's file system to store the JSON file

### Server Configuration
- `PORT`: Railway will automatically set this (usually 8080)

## Firebase Service Account Setup

### Option 1: Environment Variable (Recommended)
1. Copy the entire content of your `firebase-service-account.json` file
2. In Railway dashboard, create an environment variable named `FIREBASE_SERVICE_ACCOUNT_JSON`
3. Paste the JSON content as the value
4. Set `FIREBASE_SERVICE_ACCOUNT_PATH` to `/tmp/firebase-service-account.json`

### Option 2: File Upload
1. Upload your `firebase-service-account.json` to Railway's file system
2. Set `FIREBASE_SERVICE_ACCOUNT_PATH` to the uploaded file path

## Deployment Steps

1. **Push your code to Git** (make sure sensitive files are in .gitignore)
2. **Connect your repository to Railway**
3. **Set all environment variables** in Railway dashboard
4. **Deploy**

## Security Notes

- Never commit sensitive data to Git
- Use Railway's environment variables for all secrets
- The `application.properties` file now uses environment variables with fallbacks for local development
- The `firebase-service-account.json` file is excluded from Git via .gitignore

## Local Development

For local development, you can:
1. Use the default values in `application.properties`
2. Create a local `application-local.properties` file (already in .gitignore)
3. Use environment variables locally

## Troubleshooting

- Check Railway logs for any configuration errors
- Verify all environment variables are set correctly
- Ensure Firebase service account JSON is properly formatted
- Make sure MongoDB connection string is accessible from Railway's servers
