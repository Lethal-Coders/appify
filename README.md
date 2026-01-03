# Rehan - Website to Mobile App Generator

Transform any website into a native mobile app for iOS and Android with just a few clicks.

## Features

- 🌐 Convert any website into a mobile app
- 🔐 Secure authentication with Google OAuth
- 🎨 Custom app icons and splash screens
- 📱 Expo-based React Native apps
- ⬇️ Download ready-to-use app projects
- 💻 Modern Next.js 14 web interface

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication

### Backend
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Next.js API Routes** - Serverless functions

### Mobile App
- **Expo** - React Native framework
- **react-native-webview** - WebView component

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rehan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

4. Set up the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env` file

## How It Works

1. **Sign Up/Login** - Users authenticate using Google OAuth
2. **Create Project** - Enter website URL, app name, and upload optional icon/splash screen
3. **Generate App** - System generates an Expo React Native project with WebView
4. **Download** - Users download the generated project as a ZIP file
5. **Deploy** - Users can run the app locally or deploy using Expo EAS

## Project Structure

```
rehan/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   └── app-generator.ts  # App generation logic
├── prisma/               # Database schema
├── templates/            # Expo app templates
│   └── expo-app/         # Base Expo template
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Database Schema

- **User** - User accounts
- **Account** - OAuth accounts
- **Session** - User sessions
- **Project** - Mobile app projects
- **VerificationToken** - Email verification

## API Routes

- `POST /api/projects` - Create new project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/[id]` - Get project details
- `POST /api/projects/[id]/generate` - Generate mobile app

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

- Use a PostgreSQL provider (Supabase, Neon, Railway, etc.)
- Update `DATABASE_URL` in production environment variables

## Generated App Usage

After downloading the generated app:

1. Extract the ZIP file
2. Navigate to the directory
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npx expo start
```

5. Test on your device:
   - Install Expo Go app on your phone
   - Scan the QR code

6. Build for production:
```bash
npx expo build:android
npx expo build:ios
```

## Future Enhancements

- [ ] Custom color themes
- [ ] Push notifications support
- [ ] Offline mode configuration
- [ ] App store deployment automation
- [ ] Custom JavaScript injection
- [ ] Multiple page support
- [ ] Analytics integration

## License

MIT

## Support

For support, email support@rehan.app or open an issue on GitHub.
