# pAIN-less

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/qbawalat/pain-less/graphs/commit-activity)
[![Deployment](https://github.com/qbawalat/pain-less/actions/workflows/master-docker.yml/badge.svg)](https://github.com/qbawalat/pain-less/actions/workflows/master-docker.yml)
[![Pull Request](https://github.com/qbawalat/pain-less/actions/workflows/pull-request.yml/badge.svg)](https://github.com/qbawalat/pain-less/actions/workflows/pull-request.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Try%20Now-success)](https://pain-free-app-vvwnj.ondigitalocean.app/)

<div align="center">
  <br/>
  <p><em>AI-powered health and supplementation management web application</em></p>
</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
  - [Running Tests](#running-tests)
  - [Building for Production](#building-for-production)
  - [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Changelog](#changelog)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Overview

pAIN-less is a web application that helps users manage their health information and supplementation. The application uses artificial intelligence to provide personalized recommendations and detect potential supplement interactions. Please note that pAIN-less is not a replacement for professional medical care, and all recommendations, alerts, and suggestions should be treated as supplementary information requiring medical consultation.

### Key Benefits

- 🏥 Comprehensive health profile management
- 📅 Smart health calendar with AI-powered event tracking
- 💊 Intelligent supplementation recommendations
- ⚠️ Proactive health alerts and warnings
- 🔒 Secure and private health data storage

## Features

### Health Profile

- Medical history and injuries tracking
- Family medical history
- Supplement list management
- Medical test results
- Monthly update reminders

### Health Calendar

- Automatic event marking from profile
- Supplementation period visualization
- 95% accuracy in event marking

### AI-Powered Supplementation System

- Health data analysis
- Personalized recommendations
- Potential interaction detection
- AI confidence indicator
- Plan verification and acceptance process

### Health Alerts Panel

- Regular AI health state analysis
- Potential risk warnings
- Two-level alert system (informational/warning)

## Tech Stack

### Frontend

- Astro 5 for fast, efficient page generation
- React 19 for interactive components
- TypeScript 5 for static typing
- Tailwind 4 for styling
- Shadcn/ui for UI components

### Backend

- Supabase as Backend-as-a-Service
- PostgreSQL database
- Built-in Supabase authentication

### AI

- Openrouter.ai for AI model communication
- Access to various models (OpenAI, Anthropic, Google)

### Infrastructure

- GitHub Actions for CI/CD
- DigitalOcean for hosting
- Docker for containerization

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or later)
- Docker (v20.x or later)
- Git
- A code editor (VS Code recommended)
- A Supabase account
- An Openrouter.ai API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/qbawalat/pain-less.git
cd pain-less
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in the required environment variables in `.env`:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_SUPABASE_KEY

# Openrouter.ai
OPENROUTER_API_KEY=your_openrouter_api_key

# Other configurations
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Environment Variables

| Variable             | Description            | Required | Default     |
| -------------------- | ---------------------- | -------- | ----------- |
| `SUPABASE_URL`