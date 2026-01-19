# Vercel Environment Variables Setup

This document explains how to set up environment variables for your portfolio deployment on Vercel.

## Required Environment Variables

### 1. Strapi CMS Configuration

#### `NEXT_PUBLIC_STRAPI_URL` (Required)
- **Description**: The URL of your Strapi CMS instance
- **Example**: `http://localhost:1337` (local) or `https://your-strapi-instance.com` (production)
- **Usage**: Used to fetch portfolio data (profile, projects, skills, work experiences, etc.)
- **Note**: Must use `NEXT_PUBLIC_` prefix to be accessible in client-side code

#### `STRAPI_API_TOKEN` (Optional but Recommended)
- **Description**: API token for authenticated Strapi requests
- **Example**: `your-strapi-api-token-here`
- **Usage**: Allows authenticated access to Strapi content
- **Note**: Without this, you can only access public content

### 2. Site URL (Optional)

#### `NEXT_PUBLIC_SITE_URL` (Optional)
- **Description**: The public URL of your deployed portfolio
- **Example**: `https://your-portfolio.vercel.app` or `https://yourdomain.com`
- **Usage**: Used for SEO metadata and structured data

## How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on **Settings** in the top navigation
4. Click on **Environment Variables** in the left sidebar
5. Add each environment variable:
   - **Name**: Enter the variable name (e.g., `NEXT_PUBLIC_STRAPI_URL`)
   - **Value**: Enter the variable value (e.g., `https://your-strapi-instance.com`)
   - **Environment**: Select which environments to apply to:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Click **Save**
7. **Important**: After adding/updating environment variables, you need to **redeploy** your application for changes to take effect

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_STRAPI_URL production
vercel env add STRAPI_API_TOKEN production
vercel env add NEXT_PUBLIC_SITE_URL production

# Pull environment variables (optional - for local development)
vercel env pull .env.local
```

## Example Environment Variables

Create a `.env.local` file in your project root for local development:

```bash
# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-local-token-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: `.env.local` is already in `.gitignore` and won't be committed to Git.

## Production Strapi URL

If your Strapi CMS is deployed, use the production URL:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-production-url.com
```

## Redeploy After Adding Variables

After adding environment variables in Vercel:

1. Go to your project's **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**
4. Confirm the redeploy

Or trigger a new deployment by pushing a commit to your repository.

## Verification

After deployment, check that environment variables are loaded:

1. Visit your deployed site
2. Open browser DevTools Console
3. Check if data is loading from Strapi (you should see portfolio content)
4. If data is missing, check the Network tab for API errors

## Troubleshooting

### Issue: "Strapi URL not configured"
- **Solution**: Ensure `NEXT_PUBLIC_STRAPI_URL` is set in Vercel and you've redeployed

### Issue: "401 Unauthorized" errors from Strapi
- **Solution**: Add `STRAPI_API_TOKEN` if your Strapi content requires authentication

### Issue: Environment variables not updating
- **Solution**: Make sure you've redeployed after adding/updating variables

### Issue: Variables work locally but not in production
- **Solution**: 
  - Verify variables are set for "Production" environment in Vercel
  - Ensure variable names match exactly (case-sensitive)
  - Check that `NEXT_PUBLIC_` prefix is included for client-side variables
