# Railway Deployment - Sanity Environment Variables Setup

## Issue
Railway build is failing with: `Error: Missing environment variable: NEXT_PUBLIC_SANITY_DATASET`

This happens because Next.js needs to fetch data from Sanity during the build process for static page generation.

## Required Environment Variables

You need to add these Sanity environment variables to your Railway project:

### 1. NEXT_PUBLIC_SANITY_PROJECT_ID
- **Description**: Your Sanity project ID
- **Where to find**: 
  - Go to https://www.sanity.io/manage
  - Select your project
  - Find the Project ID in the project settings
- **Example**: `abc123de`

### 2. NEXT_PUBLIC_SANITY_DATASET
- **Description**: Your Sanity dataset name
- **Where to find**: Same location as Project ID
- **Common values**: `production`, `development`, or `staging`
- **Recommended**: `production`

### 3. SANITY_API_READ_TOKEN (Optional but Recommended)
- **Description**: API token for reading draft content
- **Where to find**:
  - Go to https://www.sanity.io/manage
  - Select your project
  - Go to "API" → "Tokens"
  - Create a new token with "Read" permissions
- **Note**: Required for draft/preview mode

### 4. NEXT_PUBLIC_SANITY_API_VERSION (Optional)
- **Description**: Sanity API version
- **Default**: `2023-06-21` (already set in code)
- **Action**: Not required to set explicitly

## How to Add Environment Variables to Railway

### Method 1: Railway Dashboard (Recommended)

1. Go to https://railway.app
2. Open your project
3. Click on your Next.js service
4. Go to the "Variables" tab
5. Click "New Variable"
6. Add each variable:
   ```
   Name: NEXT_PUBLIC_SANITY_PROJECT_ID
   Value: <your-project-id>
   
   Name: NEXT_PUBLIC_SANITY_DATASET
   Value: production
   
   Name: SANITY_API_READ_TOKEN
   Value: <your-read-token>
   ```
7. Click "Deploy" or wait for auto-deploy

### Method 2: Railway CLI

```bash
# Install Railway CLI if not already installed
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Add variables
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_READ_TOKEN=<your-read-token>

# Trigger redeploy
railway up
```

## Finding Your Sanity Credentials

### If you don't have a Sanity project yet:

1. **Create a Sanity account**: https://www.sanity.io/get-started
2. **Create a new project**:
   ```bash
   npm create sanity@latest
   ```
3. Follow the prompts to create your project
4. Get your credentials from the Sanity dashboard

### If you already have a Sanity project:

1. Check your local `.env` file (if it exists)
2. Check `sanity.config.ts` in this repository
3. Go to https://www.sanity.io/manage and find your project

## Verification Steps

After adding the environment variables:

1. Railway will automatically trigger a new deployment
2. Monitor the build logs in Railway dashboard
3. The build should now pass the "Collecting page data" step
4. Verify the deployment is successful

## Common Issues

### Issue: "Dataset not found"
**Solution**: Make sure the dataset name matches exactly (case-sensitive)

### Issue: "Project not found"
**Solution**: Verify your Project ID is correct

### Issue: "Unauthorized"
**Solution**: Check your API token has correct permissions

## Alternative: Disable Static Generation (Not Recommended)

If you want to deploy without Sanity data temporarily:

1. Set dummy values:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=placeholder
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
2. Modify pages to use `export const dynamic = 'force-dynamic'` to skip static generation

**Note**: This is NOT recommended for production as it will break the site functionality.

## Next Steps

1. ✅ Add the required Sanity environment variables to Railway
2. ✅ Wait for automatic redeployment
3. ✅ Verify build succeeds
4. ✅ Test the deployed site

## Need Help?

If you don't have a Sanity project or can't find your credentials, you have two options:

1. **Create a new Sanity project** and populate it with your content
2. **Import existing content** to a new Sanity project using the migration tools

