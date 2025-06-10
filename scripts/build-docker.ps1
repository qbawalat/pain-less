# Build script for Docker images with branch-based tagging
# Usage: .\scripts\build-docker.ps1 [branch] [environment]

param(
    [string]$Branch = (git rev-parse --abbrev-ref HEAD),
    [string]$Environment = "dev"
)

# Configuration
$ImageName = "painless-app"
$RegistryPrefix = "" # Add your registry prefix if needed

# Get commit SHA (short)
$CommitSha = git rev-parse --short HEAD

# Determine environment based on branch if not specified
if ($Branch -eq "master" -or $Branch -eq "main") {
    $Environment = "prod"
} elseif ($Branch -eq "develop") {
    $Environment = "dev"
}

# Build tags
$BaseTag = "${RegistryPrefix}${ImageName}"
$VersionTag = "${BaseTag}:${Environment}-${CommitSha}"
$EnvTag = "${BaseTag}:${Environment}-latest"

Write-Host "🏗️  Building Docker image..." -ForegroundColor Blue
Write-Host "📋 Branch: $Branch" -ForegroundColor Gray
Write-Host "🌍 Environment: $Environment" -ForegroundColor Gray
Write-Host "📝 Commit SHA: $CommitSha" -ForegroundColor Gray
Write-Host "🏷️  Tags: $VersionTag, $EnvTag" -ForegroundColor Gray

# Build arguments
$BuildArgs = @()
if ($Environment -eq "prod") {
    $BuildArgs += "--build-arg", "NODE_ENV=production"
    $BuildArgs += "--build-arg", "BUILD_ENV=prod"
} else {
    $BuildArgs += "--build-arg", "NODE_ENV=development"
    $BuildArgs += "--build-arg", "BUILD_ENV=dev"
}

try {
    # Build the image
    $DockerArgs = @("build") + $BuildArgs + @("-t", $VersionTag, "-t", $EnvTag, ".")
    & docker @DockerArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
        Write-Host "🏷️  Created tags:" -ForegroundColor Green
        Write-Host "   - $VersionTag" -ForegroundColor Gray
        Write-Host "   - $EnvTag" -ForegroundColor Gray

        # Optional: Scan for vulnerabilities
        $ScanChoice = Read-Host "🔍 Run vulnerability scan? (y/N)"
        if ($ScanChoice -eq "y" -or $ScanChoice -eq "Y") {
            Write-Host "🔍 Scanning for vulnerabilities..." -ForegroundColor Yellow
            
            # Check if trivy is available
            $TrivyExists = Get-Command trivy -ErrorAction SilentlyContinue
            if ($TrivyExists) {
                trivy image $VersionTag
            } else {
                # Try running trivy via Docker
                try {
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image $VersionTag
                    Write-Host "✅ Vulnerability scan completed" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️  Trivy not found. Install it for vulnerability scanning: https://trivy.dev/" -ForegroundColor Yellow
                }
            }
        }

        Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
        Write-Host "💡 Run: docker run -p 8080:8080 -e OPENROUTER_API_KEY=your_key $VersionTag" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during build: $_" -ForegroundColor Red
    exit 1
} 