# pAIN-less

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/qbawalat/pain-less/graphs/commit-activity)
[![CI/CD](https://github.com/qbawalat/pain-less/actions/workflows/ci.yml/badge.svg)](https://github.com/qbawalat/pain-less/actions/workflows/ci.yml)

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
SUPABASE_ANON_KEY=your_supabase_anon_key

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

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `OPENROUTER_API_KEY` | Openrouter.ai API key | Yes | - |
| `NODE_ENV` | Environment | No | development |

## Architecture

```
src/
├── components/     # React components
├── layouts/        # Astro layouts
├── pages/          # Astro pages
├── styles/         # Global styles
├── lib/            # Utility functions
├── types/          # TypeScript types
└── api/            # API endpoints
```

## Security

- All health data is encrypted at rest and in transit
- Regular security audits and penetration testing
- Rate limiting on API endpoints
- Secure authentication through Supabase
- GDPR compliance for health data
- Regular dependency updates
- Security headers implementation

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase credentials in `.env`
   - Check network connectivity
   - Ensure database is running

2. **AI Service Issues**
   - Verify Openrouter.ai API key
   - Check API rate limits
   - Verify internet connection

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify environment variables

## Contributing

We love your input! We want to make contributing to pAIN-less as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

### Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the docs/ with any necessary documentation
3. The PR will be merged once you have the sign-off of at least one other developer

## Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Changelog

### [1.0.0] - 2024-03-XX
- Initial release
- Basic health profile management
- AI-powered supplementation system
- Health calendar implementation
- Alert system

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.io) - Backend and authentication
- [Openrouter.ai](https://openrouter.ai) - AI model access
- [Astro](https://astro.build) - Web framework
- [React](https://reactjs.org) - UI library
- [Shadcn/ui](https://ui.shadcn.com) - UI components

## Contact

- Project Link: [https://github.com/qbawalat/pain-less](https://github.com/qbawalat/pain-less)
- Issue Tracker: [https://github.com/qbawalat/pain-less/issues](https://github.com/qbawalat/pain-less/issues)
- Documentation: [https://github.com/qbawalat/pain-less/docs](https://github.com/qbawalat/pain-less/docs)
