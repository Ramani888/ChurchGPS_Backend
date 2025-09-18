# Vercel Serverless Function Fix - Deployment Guide

I've made several changes to fix the serverless function crash in your ChurchGPS backend application. Here's a summary of the changes and what you need to do:

## Changes Made

1. **Modified `index.ts`**:
   - Added proper export of the Express app for serverless environments
   - Changed the MongoDB connection logic to handle serverless environments
   - Added environment detection to avoid running server.listen() in production

2. **Updated `vercel.json`**:
   - Added NODE_ENV configuration to ensure the app knows it's running in production

## Required Environment Variables

Make sure the following environment variables are set in your Vercel project settings:

- `DATABASE_URL`: Your MongoDB connection string
- Any other environment variables your application needs (check your .env file)

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your ChurchGPS_Backend project
3. Go to Settings > Environment Variables
4. Add each variable with its corresponding value
5. Redeploy your application

## Testing the Deployment

After setting up the environment variables and redeploying:

1. Visit your Vercel deployment URL
2. You should see "server working...." message
3. Test your API endpoints by appending "/api/..." to your URL

## Troubleshooting

If you still encounter issues:

1. Check Vercel logs for any specific error messages
2. Ensure your MongoDB database is accessible from Vercel's servers
3. Verify that all environment variables are correctly set

## Local Development

For local development, your app will continue to work as before. The changes only affect how the app runs in the Vercel environment.