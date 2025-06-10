#!/bin/bash

# Build script for Docker images with branch-based tagging
# Usage: ./scripts/build-docker.sh [branch] [environment]

set -e

# Configuration
IMAGE_NAME="painless-app"
REGISTRY_PREFIX="" # Add your registry prefix if needed

# Get parameters
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}
ENVIRONMENT=${2:-"dev"}

# Get commit SHA (short)
COMMIT_SHA=$(git rev-parse --short HEAD)

# Determine environment based on branch if not specified
if [ "$BRANCH" = "master" ] || [ "$BRANCH" = "main" ]; then
    ENVIRONMENT="prod"
elif [ "$BRANCH" = "develop" ]; then
    ENVIRONMENT="dev"
fi

# Build tags
BASE_TAG="${REGISTRY_PREFIX}${IMAGE_NAME}"
VERSION_TAG="${BASE_TAG}:${ENVIRONMENT}-${COMMIT_SHA}"
ENV_TAG="${BASE_TAG}:${ENVIRONMENT}-latest"

echo "🏗️  Building Docker image..."
echo "📋 Branch: $BRANCH"
echo "🌍 Environment: $ENVIRONMENT"
echo "📝 Commit SHA: $COMMIT_SHA"
echo "🏷️  Tags: $VERSION_TAG, $ENV_TAG"

# Build arguments
BUILD_ARGS=""
if [ "$ENVIRONMENT" = "prod" ]; then
    BUILD_ARGS="--build-arg NODE_ENV=production --build-arg BUILD_ENV=prod"
else
    BUILD_ARGS="--build-arg NODE_ENV=development --build-arg BUILD_ENV=dev"
fi

# Build the image
docker build \
    $BUILD_ARGS \
    -t "$VERSION_TAG" \
    -t "$ENV_TAG" \
    .

echo "✅ Build completed successfully!"
echo "🏷️  Created tags:"
echo "   - $VERSION_TAG"
echo "   - $ENV_TAG"

# Optional: Scan for vulnerabilities
read -p "🔍 Run vulnerability scan? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔍 Scanning for vulnerabilities..."
    if command -v trivy &> /dev/null; then
        trivy image "$VERSION_TAG"
    elif command -v docker &> /dev/null && docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image "$VERSION_TAG" 2>/dev/null; then
        echo "✅ Vulnerability scan completed"
    else
        echo "⚠️  Trivy not found. Install it for vulnerability scanning: https://trivy.dev/"
    fi
fi

echo "🚀 Ready to deploy!"
echo "💡 Run: docker run -p 8080:8080 -e OPENROUTER_API_KEY=your_key $VERSION_TAG" 