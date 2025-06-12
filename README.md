# FlowBooks Associate

An AI-powered bookkeeping service landing page and application designed for solopreneurs and accountants, featuring complete user authentication, database management, and expense tracking capabilities.

## Features

### Landing Page
- **Modern Design**: Clean, professional interface with animated finance-themed background
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Dual Signup Flows**: 
  - Free Trial signup for immediate access
  - Early Access subscription with pricing tiers
- **Email Integration**: Automated confirmation emails and admin notifications

### User Management
- **Authentication**: Secure user registration and login via Supabase
- **Profile Management**: Comprehensive user profiles with business information
- **Account Types**: Solo mode for individuals, Accountant mode for multi-client management
- **Subscription Plans**: Monthly and annual billing options

### Database Integration
- **Supabase Backend**: Full-featured PostgreSQL database with Row Level Security
- **User Profiles**: Store business information, preferences, and subscription data
- **Expense Tracking**: Receipt management and bank transaction integration
- **Client Management**: For accountants managing multiple clients

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Shadcn/ui** component library

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** with Row Level Security policies
- **Express.js** server for API endpoints
- **Nodemailer** for email notifications

### Build Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd flowbooks-associate
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:

```bash
# Required for email notifications
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Optional: Supabase for full functionality
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Supabase Setup

For full functionality including user authentication and data persistence, set up Supabase:

### 1. Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings → API

### 2. Database Schema
Run the SQL schema from `SUPABASE_SETUP.md` in your Supabase SQL editor to create:
- User profiles table
- Receipts management
- Bank transactions
- Client management (for accountants)
- Row Level Security policies

### 3. Configure Authentication
- Set site URL in Authentication → Settings
- Customize email templates if needed
- Configure OAuth providers (optional)

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   ├── pages/          # Application pages
│   │   └── index.css       # Global styles
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route handlers
│   ├── email-service.ts   # Email notification service
│   └── storage.ts         # Data storage interface
├── shared/                # Shared types and schemas
└── supabase/             # Database migrations and types
```

## Key Components

### Landing Page (`client/src/pages/home.tsx`)
- Hero section with value proposition
- Feature highlights with animations
- Pricing comparison
- Dual call-to-action buttons

### Signup Forms
- **Free Trial** (`client/src/components/signup-form.tsx`): Quick signup with basic information
- **Subscription** (`client/src/components/subscription-form.tsx`): Complete signup with billing preferences

### Dashboard (`client/src/pages/dashboard.tsx`)
- User profile overview
- Quick action buttons
- Getting started checklist
- Statistics dashboard (ready for data integration)

### Authentication Hooks
- `useAuth()`: User authentication state and methods
- `useUserProfile()`: User profile data management

## Email Configuration

The application uses Gmail SMTP for email notifications:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password in Google Account settings
3. Add credentials to your `.env` file

Email templates include:
- Free trial confirmation
- Subscription confirmation
- Admin notifications for new signups

## Deployment

### Using Replit Deployments
1. Push your code to GitHub
2. Connect your repository to Replit
3. Configure environment variables in Replit Secrets
4. Deploy using the built-in deployment system

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables on your server
4. Set up domain and SSL certificates

## API Endpoints

- `POST /api/signup/trial` - Free trial registration
- `POST /api/signup/subscription` - Subscription signup
- Authentication and data management handled by Supabase

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks (if configured)

## Fallback Mode

If Supabase is not configured, the application operates in fallback mode:
- Basic signup forms submit to Express API endpoints
- Email notifications still work
- User authentication and data persistence are limited

For production use, Supabase setup is strongly recommended.

## Support

- View setup guides in `SUPABASE_SETUP.md`
- Check environment configuration in `.env.example`
- Review component documentation in source files

## License

This project is proprietary software for FlowBooks Associate.

---

For technical support or questions about setup, please refer to the documentation files or contact the development team.