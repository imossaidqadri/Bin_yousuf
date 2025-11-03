# Deployment Configuration for Astro Islands

## Vercel Deployment Configuration

### vercel.json Configuration
```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "src/pages/**/*": {
      "maxDuration": 10,
      "memory": 1024
    }
  }
}
```

### Environment Variables for Production
```env
# Production Environment
NODE_ENV=production
VERCEL_ENV=production

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.binyousufgroup.com

# Analytics (if applicable)
NEXT_PUBLIC_UMAMI_ID=
NEXT_PUBLIC_UMAMI_SRC=

# Google Sheets API (Production)
GOOGLE_SHEET_ID=your_production_sheet_id
GOOGLE_PROJECT_ID=your_production_project_id
GOOGLE_PRIVATE_KEY_ID=your_production_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_production_private_key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_production_service_account@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_X509_CERT_URL=your_production_cert_url

# Security
CONTACT_NUMBER=+923360878079
```

## Server Configuration

### Static Asset Optimization
- Enable GZIP/Brotli compression
- Set appropriate cache headers for static assets
- Configure CDN for asset delivery
- Enable HTTP/2 for better performance

### Caching Strategy
```javascript
// Cache configuration for different asset types
{
  "html": {
    "cacheControl": "public, max-age=0, must-revalidate"
  },
  "js": {
    "cacheControl": "public, max-age=31536000, immutable"
  },
  "css": {
    "cacheControl": "public, max-age=31536000, immutable"
  },
  "images": {
    "cacheControl": "public, max-age=31536000, immutable"
  },
  "fonts": {
    "cacheControl": "public, max-age=31536000, immutable"
  }
}
```

## Build Command Configuration

### Vercel Build Settings
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "devCommand": "bun run dev",
  "framework": "astro"
}
```

### Astro Build Configuration
```javascript
// astro.config.mjs - Production optimized
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.binyousufgroup.com',
  
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  
  output: 'server',  // Server-side rendering for better performance
  adapter: vercel(),
  
  // Enable islands architecture
  islands: true,
  
  // Production optimizations
  build: {
    assets: 'assets',
    assetsPrefix: undefined,
    format: 'directory',  // Clean directory structure
    inlineStylesheets: 'auto',  // Balance between performance and compatibility
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            // Group assets by type
            if (assetInfo.name.endsWith('.css')) {
              return 'assets/css/[name].[hash][extname]';
            }
            if (assetInfo.name.endsWith('.js')) {
              return 'assets/js/[name].[hash][extname]';
            }
            // Images and other assets
            return 'assets/[name].[hash][extname]';
          },
          chunkFileNames: 'assets/js/chunks/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
        },
      },
      minify: 'terser',  // More aggressive minification for production
      cssMinify: 'esbuild',  // Optimized CSS minification
      sourcemap: false,  // Disable for production to reduce bundle size
    },
    ssr: {
      noExternal: ['gsap'],  // Include GSAP in server bundle for islands
      external: ['googleapis'],  // Don't bundle Google APIs
    },
  },
});
```

## Pre-deployment Health Checks

### 1. Dependency Validation
- [ ] All dependencies are production-ready
- [ ] No development-only dependencies in bundle
- [ ] License compliance verified
- [ ] Security vulnerabilities scanned

### 2. Performance Validation
- [ ] Bundle size targets met
- [ ] All islands properly code-split
- [ ] Critical resources prioritized
- [ ] Performance budgets respected

### 3. Security Validation
- [ ] Environment variables properly configured
- [ ] API keys secured
- [ ] Headers properly set
- [ ] Security scanning passed

### 4. Functional Validation
- [ ] All pages generate correctly
- [ ] Island functionality works
- [ ] Forms submit properly
- [ ] Analytics tracking active

## Deployment Pipeline Configuration

### CI/CD Pipeline Steps
1. Run tests (`bun run test`)
2. Lint code (`bun run lint`)
3. Type check (`bun run typecheck`)
4. Build project (`bun run build`)
5. Run security scans
6. Deploy to staging
7. Run integration tests
8. Deploy to production (if staging tests pass)

### Build Optimization Settings
```yaml
# .github/workflows/deploy.yml example
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
        env:
          NODE_ENV: production
          # Add other environment variables
      # Add deployment step here
```

## Monitoring Configuration

### Performance Monitoring
- [ ] Set up Core Web Vitals monitoring
- [ ] Configure error tracking
- [ ] Set up performance budgets
- [ ] Configure uptime monitoring

### Analytics Configuration
- [ ] Google Analytics (if used)
- [ ] Google Search Console verification
- [ ] Custom analytics tracking
- [ ] User behavior analytics

## Rollback Configuration

### Health Check Endpoints
- [ ] Add health check endpoint: `/api/health`
- [ ] Monitor build success metrics
- [ ] Set up alerting for failures
- [ ] Define rollback triggers

### Configuration Backup
- [ ] Backup current configuration
- [ ] Version control for config files
- [ ] Automated config validation
- [ ] Rollback procedure documentation

## Post-Deployment Verification

### 1. Immediate Checks (0-5 minutes)
- [ ] Site is accessible
- [ ] Main pages load correctly
- [ ] No critical errors in console
- [ ] Analytics tracking working

### 2. Extended Checks (5-30 minutes)
- [ ] All pages accessible
- [ ] Island functionality working
- [ ] Forms submitting correctly
- [ ] Performance metrics acceptable

### 3. Long-term Monitoring (30+ minutes)
- [ ] SEO indexing proceeding normally
- [ ] User traffic patterns normal
- [ ] Error rates acceptable
- [ ] Performance metrics stable

## Security Configuration

### Headers
- [ ] Strict transport security
- [ ] Content security policy
- [ ] X-Frame options
- [ ] X-Content-Type-Options

### SSL/TLS Configuration
- [ ] HTTPS enforced
- [ ] HSTS headers set
- [ ] Secure cookies
- [ ] TLS 1.2+ required

## Scaling Configuration

### Server Scaling
- [ ] Auto-scaling configured
- [ ] Load balancing active
- [ ] Database connection pooling
- [ ] Caching layer active

### Resource Allocation
- [ ] Memory allocation optimized
- [ ] CPU allocation appropriate
- [ ] Storage configured
- [ ] Network optimization

This configuration ensures optimal performance, security, and reliability for the Astro Islands implementation in production.