# Docker CI/CD Setup Guide

This guide walks you through setting up the complete Docker CI/CD pipeline for your pAIn-less application using GitHub Actions and DigitalOcean.

## Overview

The workflow automatically:

- ✅ **Validates builds** on all PRs and pushes
- 🐳 **Builds Docker images** with proper tagging (`dev-abc123f`, `prod-abc123f`)
- 🔒 **Scans for vulnerabilities** using Trivy
- 📦 **Pushes to DigitalOcean Container Registry**
- 🚀 **Deploys to production** (master branch only)
- 💬 **Comments on PRs** with build status

## Prerequisites

1. **DigitalOcean Account** with Container Registry enabled
2. **DigitalOcean App Platform** app created (optional, for auto-deployment)
3. **GitHub repository** with the workflow files

## Step 1: DigitalOcean Container Registry Setup

### Create Container Registry

1. Go to DigitalOcean Console → Container Registry
2. Create a new registry (e.g., `painless-registry`)
3. Note the registry name for later

### Generate Registry Token

1. Go to API → Tokens/Keys
2. Generate a new token with **read/write** scope for Container Registry
3. Copy the token securely

## Step 2: DigitalOcean App Platform Setup (Optional)

If you want automatic deployments to App Platform:

### Create App

1. Go to App Platform → Create App
2. Choose "Docker Hub or Container Registry"
3. Configure:
   - **Registry:** DigitalOcean Container Registry
   - **Repository:** `your-registry/painless-app`
   - **Tag:** `prod-latest` (will be updated automatically)

### Get App Details

1. Note your **App Name** from the dashboard
2. Generate an **API Token** with App Platform permissions

## Step 3: GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings → Secrets and variables → Actions`):

### Required Secrets

```env
# DigitalOcean Container Registry
DO_REGISTRY_NAME=your-registry-name           # e.g., painless-registry
DO_REGISTRY_TOKEN=your-do-registry-token      # Token from Step 1

# Application Secrets (for runtime)
OPENROUTER_API_KEY=your-openrouter-api-key    # Your OpenRouter API key

# Optional: For automatic deployment
DO_APP_NAME=your-app-name                     # App name from Step 2
DO_API_TOKEN=your-do-api-token               # API token from Step 2

# Optional: Supabase (if using)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Secret Setup Example

| Secret Name          | Example Value        | Description                     |
| -------------------- | -------------------- | ------------------------------- |
| `DO_REGISTRY_NAME`   | `painless-registry`  | Your DigitalOcean registry name |
| `DO_REGISTRY_TOKEN`  | `dop_v1_abc123...`   | Registry access token           |
| `OPENROUTER_API_KEY` | `sk-or-v1-abc123...` | OpenRouter API key              |
| `DO_APP_NAME`        | `painless-app-prod`  | App Platform app name           |
| `DO_API_TOKEN`       | `dop_v1_def456...`   | App Platform API token          |

## Step 4: Workflow Behavior

### Branch Strategy

- **`develop` branch:** Builds `dev-abc123f` images locally (validation only, not pushed to registry)
- **`master` branch:** Builds `prod-abc123f` images, pushes to registry, deploys to production
- **Pull Requests:** Builds images locally for testing, doesn't push to registry

### Image Tagging

**Production builds only** create registry images with two tags:

- **Version tag:** `painless-app:prod-abc123f` (with commit SHA)
- **Latest tag:** `painless-app:prod-latest` (always current)

**Development/PR builds** create local images only:

- **Local tag:** `local-painless-app:dev-abc123f` (validation only)

### Security Features

- 🔒 Vulnerability scanning with Trivy
- 📋 Security reports in GitHub Security tab
- 🚫 No secrets in Docker images
- 👤 Non-root container execution

## Step 5: Testing the Setup

### Test Pull Request

1. Create a feature branch: `git checkout -b feature/test-docker`
2. Make a small change and push
3. Create PR to `master`
4. Check the workflow runs and comments on your PR

### Test Development Build

1. Push to `develop` branch
2. Verify Docker build completes successfully (check Actions tab)
3. Confirm commit comment shows local build validation
4. Note: No images are pushed to DigitalOcean Container Registry

### Test Production Deploy

1. Merge PR to `master`
2. Verify production deployment occurs
3. Check App Platform for updated deployment

## Step 6: Manual Deployment

If you prefer manual deployment or need to deploy specific versions:

### Using Docker

```bash
# Pull and run specific version
docker pull registry.digitalocean.com/your-registry/painless-app:prod-abc123f
docker run -p 8080:8080 \
  -e OPENROUTER_API_KEY=your-key \
  registry.digitalocean.com/your-registry/painless-app:prod-abc123f
```

### Using DigitalOcean CLI

```bash
# Deploy specific image to App Platform
doctl apps update your-app-id \
  --image registry.digitalocean.com/your-registry/painless-app:prod-abc123f
```

## Troubleshooting

### Common Issues

**Build Fails:**

- Check GitHub Secrets are properly set
- Verify DigitalOcean registry permissions
- Ensure Dockerfile builds locally

**Registry Push Fails:**

- Confirm `DO_REGISTRY_TOKEN` has write permissions
- Check registry name matches `DO_REGISTRY_NAME`
- Verify token hasn't expired

**Deployment Fails:**

- Ensure `DO_API_TOKEN` has App Platform permissions
- Check app name matches `DO_APP_NAME`
- Verify image exists in registry

**Vulnerability Scan Fails:**

- This is non-blocking - check Trivy action logs
- Review security tab for specific vulnerabilities
- Update base image or dependencies as needed

### Debug Commands

```bash
# Check if image exists in registry
doctl registry repository list-tags your-registry/painless-app

# View workflow logs
# Go to GitHub → Actions → Select failed workflow

# Test local build
docker build -t test-image .
docker run -p 8080:8080 -e OPENROUTER_API_KEY=test test-image
```

## Monitoring and Maintenance

### Regular Tasks

- 🔄 **Review vulnerability scans** weekly
- 🧹 **Clean old images** from registry monthly
- 📊 **Monitor deployment metrics** in App Platform
- 🔑 **Rotate tokens** quarterly

### Performance Optimization

- 📦 Images are multi-arch (AMD64/ARM64)
- ⚡ Build caching enabled for faster builds
- 🎯 Production images optimized for size

### Cost Management

- 💰 Registry storage costs apply
- 🗑️ Set up image cleanup policies
- 📈 Monitor App Platform usage

## Advanced Configuration

### Custom Environment Variables

Add to GitHub Secrets and update workflow:

```yaml
environment:
  - CUSTOM_VAR=${{ secrets.CUSTOM_VAR }}
```

### Multiple Environments

Extend the workflow for staging:

```yaml
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  # Add staging deployment logic
```

### Custom Registry

Update workflow to use different registry:

```yaml
env:
  REGISTRY: your-custom-registry.com
```

## Security Best Practices

- 🔐 Never commit secrets to code
- 🔄 Rotate all tokens regularly
- 📋 Review vulnerability scan results
- 🚫 Use least-privilege access tokens
- 🔍 Monitor access logs regularly

---

Need help? Check the [GitHub Actions documentation](https://docs.github.com/en/actions) or [DigitalOcean's Container Registry guide](https://docs.digitalocean.com/products/container-registry/).
