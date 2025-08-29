# Lean to Falasteen

Fullstack app to learn Palestinian Arabic with SM-2 spaced repetition.

## 🚀 Features

- **Next.js 15** - Latest version with App Router and Turbopack
- **TypeScript** - Full type safety and IntelliSense support
- **Tailwind CSS v4** - Utility-first CSS framework with latest features
- **shadcn/ui** - Beautiful, accessible components built with Radix UI
- **ESLint Disabled** - Faster development without linting overhead
- **App Router** - Modern Next.js routing system
- **Turbopack** - Fast bundler for development
- **Lessons with flashcards, audio, and quizzes**
- **Progress tracking + streaks**
- **Real SM-2 spaced repetition algorithm**
- **Auth system with register/login**
- **NextAuth.js** - Secure authentication with MongoDB adapter
- **MongoDB Integration** - Persistent user data and sessions

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Database**: MongoDB
- **Authentication**: NextAuth.js with MongoDB adapter
- **Package Manager**: npm

## 📁 Project Structure

```
learn-shami/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js API routes
│   ├── login/             # Login page
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page (protected)
├── components/             # Reusable components
│   ├── auth/              # Authentication components
│   │   ├── protected-route.tsx  # Route protection wrapper
│   │   ├── register-form.tsx    # User registration form
│   │   └── user-header.tsx      # User info display
│   ├── providers/         # Context providers
│   │   └── session-provider.tsx # NextAuth session provider
│   └── ui/                # shadcn/ui components
│       ├── button.tsx     # Button component
│       └── card.tsx       # Card component
├── lib/                    # Utility functions
│   ├── mongodb.ts         # MongoDB connection utilities
│   └── utils.ts           # shadcn/ui utilities
├── scripts/                # Database setup scripts
│   └── setup-users.js     # Initial user creation script
├── public/                 # Static assets
├── components.json         # shadcn/ui configuration
├── postcss.config.mjs      # PostCSS configuration for Tailwind CSS v4
├── tsconfig.json          # TypeScript configuration
└── next.config.ts         # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd learn-shami
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file
   MONGODB_URI=mongodb://localhost:27017/learn-shami
   MONGODB_DB=learn-shami
   NEXTAUTH_SECRET=your-super-secret-key-here-at-least-32-characters
   NEXTAUTH_URL=http://localhost:3000
   

   ```

4. Test MongoDB connection:
   ```bash
   npm run test-mongo
   ```

5. Set up initial users (includes demo user):
   ```bash
   npm run setup-users
   ```

6. Populate the database with lesson metadata (Lesson 1):
   ```bash
   npm run populate-lessons
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run test-mongo` - Test MongoDB connection
- `npm run setup-users` - Set up initial users in MongoDB
- `npm run populate-lessons` - Populate MongoDB with lesson data
- `npm run seed-lessons` - Seed Lesson 1 metadata from JSON
- `npm run setup-progress` - Create indexes and seed demo data (optional)

## 🔑 Demo User

- Email: `demo@email.com`
- Password: `demo123`

Log in to see sample streaks/stats and due reviews on the dashboard.

## 🖼️ Screenshots

Add screenshots/GIFs here showcasing:
- Dashboard with stats/streaks
- Lesson viewer with audio and progress
- Review flow (SM-2)

## 🎨 Adding More shadcn/ui Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

For example:
```bash
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

## 🎯 Key Benefits

- **Fast Development**: ESLint disabled for faster iteration
- **Modern Stack**: Latest versions of all technologies
- **Type Safety**: Full TypeScript support
- **Beautiful UI**: Professional-looking components out of the box
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built-in accessibility features with Radix UI

## 🔧 Configuration Files

- **`components.json`**: shadcn/ui configuration with New York style
- **`postcss.config.mjs`**: PostCSS configuration for Tailwind CSS v4
- **`tsconfig.json`**: TypeScript configuration with strict settings
- **`next.config.ts`**: Next.js configuration with Turbopack enabled

## 🌟 Why This Setup?

This project structure provides:

1. **Developer Experience**: Fast development with modern tools
2. **Performance**: Optimized builds with Turbopack
3. **Maintainability**: Type-safe code with TypeScript
4. **Design System**: Consistent UI components with shadcn/ui
5. **Flexibility**: Easy to extend and customize
6. **Data Persistence**: MongoDB integration for scalable data storage

## 🔐 Authentication

This project includes NextAuth.js authentication with MongoDB integration:

### Features
- **Credentials Provider**: Email + password authentication
- **User Registration**: Self-service account creation for learners
- **MongoDB Adapter**: Persistent user sessions and data
- **JWT Sessions**: Secure session management with cookies
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### User Management
- Users are stored in the `users` collection
- Passwords are hashed using bcrypt
- Role-based access control (admin, learner)
- Self-service registration for new learners
- Demo accounts available for testing

### Demo Accounts
- **Admin**: admin@example.com / password
- **Learner**: learner@example.com / password

## 🗄️ MongoDB Integration

This project includes MongoDB integration for storing lesson metadata and data:

### Database Structure
- **Collection**: `lessons`
- **Document Structure**: Contains lesson metadata (title, description, difficulty, tags, etc.)
- **CSV Files**: Stored in `lessons/` directory and loaded dynamically

### API Endpoints
- **`/api/lessons/[id]`**: Fetches lesson by ID from MongoDB and combines with CSV data

### Response Format
```json
{
  "lessonId": 1,
  "title": "Greetings",
  "description": "Learn common Palestinian greetings for daily interactions.",
  "difficulty": "Beginner",
  "tags": ["palestinian", "arabic", "greetings"],
  "totalItems": 20,
  "data": [...],
  "unit": 1,
  "order": 1,
  "estimatedTime": "5 minutes"
}
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

Feel free to contribute to this project by:

1. Adding new components
2. Improving the design
3. Adding new features
4. Fixing bugs
5. Improving documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
