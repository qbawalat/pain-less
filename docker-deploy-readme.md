# Docker Deployment Guide for pAIn-less

This guide covers building and deploying the pAIn-less Astro application using Docker for DigitalOcean deployment.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git repository access
- Environment variables configured

### Build Commands

**For Development (develop branch):**

```powershell
.\scripts\build-docker.ps1 develop dev
```

**For Production (master/main branch):**

```powershell
.\scripts\build-docker.ps1 master prod
```

**Manual Build:**

```bash
# Development
docker build --build-arg NODE_ENV=development --build-arg BUILD_ENV=dev -t painless-app:dev-$(git rev-parse --short HEAD) .

# Production
docker build --build-arg NODE_ENV=production --build-arg BUILD_ENV=prod -t painless-app:prod-$(git rev-parse --short HEAD) .
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional Supabase (if using)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application (automatically set in Docker)
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
```

## Running the Application

### Local Development with Docker Compose

```bash
docker-compose up --build
```

### Manual Docker Run

```bash
# With environment file
docker run -p 8080:8080 --env-file .env.local painless-app:dev-abc123f

# With individual environment variables
docker run -p 8080:8080 \
  -e OPENROUTER_API_KEY=your_key \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e HOST=0.0.0.0 \
  painless-app:prod-abc123f
```

## DigitalOcean Deployment

### App Platform Deployment

1. Push your Docker image to a registry (Docker Hub, DigitalOcean Container Registry, etc.)
2. Create a new App in DigitalOcean App Platform
3. Configure the following:
   - **Source:** Docker Image
   - **Image:** `your-registry/painless-app:prod-abc123f`
   - **Port:** 8080
   - **Environment Variables:** Set OPENROUTER_API_KEY and others as needed

### Droplet Deployment

```bash
# On your DigitalOcean droplet
docker pull your-registry/painless-app:prod-abc123f
docker run -d \
  --name painless-app \
  --restart unless-stopped \
  -p 8080:8080 \
  -e OPENROUTER_API_KEY=your_key \
  your-registry/painless-app:prod-abc123f
```

## Image Tagging Strategy

The build script creates two tags for each build:

- **Version Tag:** `painless-app:dev-abc123f` or `painless-app:prod-abc123f`
  - Includes environment and commit SHA for precise version tracking
- **Environment Tag:** `painless-app:dev-latest` or `painless-app:prod-latest`
  - Always points to the latest build for that environment

## Security Features

- ✅ Non-root user execution
- ✅ Multi-stage build for minimal attack surface
- ✅ Proper signal handling with dumb-init
- ✅ Health checks implemented
- ✅ Vulnerability scanning with Trivy (optional)
- ✅ Secrets passed as environment variables (not in image)

## Health Checks

The container includes health checks that verify the application responds on port 8080:

- **Interval:** 30 seconds
- **Timeout:** 3 seconds
- **Retries:** 3
- **Start Period:** 5 seconds

## Troubleshooting

### Common Issues

**Build Fails:**

- Ensure Docker is running
- Check that you're in the project root directory
- Verify all dependencies in package.json are accessible

**App Won't Start:**

- Check that OPENROUTER_API_KEY is properly set
- Verify port 8080 is not already in use
- Check Docker logs: `docker logs container_name`

**Health Check Fails:**

- Ensure the app is listening on 0.0.0.0:8080
- Check application logs for startup errors
- Verify environment variables are correctly set

### Debugging Commands

```bash
# View container logs
docker logs painless-app

# Execute shell in running container
docker exec -it painless-app sh

# Inspect container configuration
docker inspect painless-app

# View image layers
docker history painless-app:prod-abc123f
```

## Performance Optimization

The Docker configuration includes several optimizations:

- **Multi-stage build:** Separates build and runtime environments
- **Alpine Linux:** Minimal base image for smaller size
- **Layer caching:** Optimized instruction order for better build caching
- **Production dependencies:** Only production npm packages in runtime image
- **Non-root execution:** Enhanced security without performance impact

## Monitoring

For production deployments, consider adding:

- Log aggregation (ELK stack, Fluentd, or DigitalOcean's monitoring)
- Application metrics (New Relic, DataDog, or custom metrics)
- Uptime monitoring (Pingdom, UptimeRobot, or StatusCake)
- Error tracking (Sentry, Bugsnag, or Rollbar)
