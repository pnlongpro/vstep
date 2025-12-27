# Frontend Environment Setup Guide

## Quick Setup

1. Copy the example environment file:
```bash
cd FE
cp .env.example .env.local
```

2. Update the values if needed:
```bash
# Edit .env.local with your preferred editor
nano .env.local
# or
code .env.local
```

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (without `/api` suffix) | `http://localhost:3000` | `https://api.vstep.edu.vn` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `http://localhost:3000` | `https://api.vstep.edu.vn` |
| `NEXTAUTH_URL` | Frontend application URL | `http://localhost:3001` | `https://vstep.edu.vn` |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | (generate new) | See below |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application display name | `"VSTEP AI Platform"` |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `http://localhost:3001` |

## Generating Secrets

### NextAuth Secret

Generate a secure secret for production:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Important:** Never commit your actual `.env.local` file. It's already in `.gitignore`.

## Environment-Specific Configuration

### Local Development

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-local-secret
```

### Staging

```env
NEXT_PUBLIC_API_URL=https://api-staging.vstep.edu.vn
NEXT_PUBLIC_WS_URL=https://api-staging.vstep.edu.vn
NEXTAUTH_URL=https://staging.vstep.edu.vn
NEXTAUTH_SECRET=your-staging-secret
```

### Production

```env
NEXT_PUBLIC_API_URL=https://api.vstep.edu.vn
NEXT_PUBLIC_WS_URL=https://api.vstep.edu.vn
NEXTAUTH_URL=https://vstep.edu.vn
NEXTAUTH_SECRET=your-production-secret
```

## Common Issues

### 1. API URL with `/api` suffix

❌ Wrong:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

✅ Correct:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The NestJS backend controllers already define their paths (e.g., `/auth/login`), so don't add an extra `/api` prefix.

### 2. CORS Issues

If you see CORS errors, ensure:
1. Backend CORS is configured to allow your frontend URL
2. `NEXTAUTH_URL` matches your actual frontend URL
3. Both URLs use the same protocol (http/https)

### 3. NextAuth Secret Issues

If you see session errors:
1. Ensure `NEXTAUTH_SECRET` is set
2. Use a strong, random secret in production
3. Never use the default example secret

## Verification

After setting up your environment:

1. Start the backend:
```bash
cd ../BE
npm run start:dev
```

2. Start the frontend:
```bash
cd FE
npm run dev
```

3. Verify the configuration:
```bash
# Check that environment variables are loaded
npm run dev
# You should see in the console or .next/cache:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_WS_URL
```

4. Test the login:
- Navigate to http://localhost:3001/login
- Open browser DevTools console
- You should see NextAuth debug logs showing the correct API URL

## Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive information
2. **Use strong secrets** - Generate unique secrets for each environment
3. **Rotate secrets regularly** - Especially after team member changes
4. **Use environment-specific values** - Don't use production secrets in development
5. **Document required variables** - Keep `.env.example` up to date

## Troubleshooting

### Variables Not Loading

If your environment variables aren't being loaded:

1. Ensure the file is named exactly `.env.local`
2. Restart the Next.js dev server
3. Check for syntax errors in the file
4. Verify no trailing spaces or comments on the same line

### Wrong API URL Being Used

If the app is using the wrong API URL:

1. Check if `.env.local` exists
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Restart the dev server
4. Clear Next.js cache: `rm -rf .next`
5. Check `next.config.js` for hardcoded values

### NextAuth Issues

If authentication isn't working:

1. Verify `NEXTAUTH_URL` matches your frontend URL
2. Ensure `NEXTAUTH_SECRET` is set
3. Check that backend CORS allows your frontend URL
4. Review browser console for detailed error messages

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [VSTEP Login Fix Documentation](../LOGIN_FIX_DOCUMENTATION.md)
