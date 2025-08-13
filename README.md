# Learn Shami

A modern Next.js project built with TypeScript, Tailwind CSS v4, and shadcn/ui components.

## 🚀 Features

- **Next.js 15** - Latest version with App Router and Turbopack
- **TypeScript** - Full type safety and IntelliSense support
- **Tailwind CSS v4** - Utility-first CSS framework with latest features
- **shadcn/ui** - Beautiful, accessible components built with Radix UI
- **ESLint Disabled** - Faster development without linting overhead
- **App Router** - Modern Next.js routing system
- **Turbopack** - Fast bundler for development

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Package Manager**: npm

## 📁 Project Structure

```
learn-shami/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   └── ui/                # shadcn/ui components
│       ├── button.tsx     # Button component
│       └── card.tsx       # Card component
├── lib/                    # Utility functions
│   └── utils.ts           # shadcn/ui utilities
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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server

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

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Feel free to contribute to this project by:

1. Adding new components
2. Improving the design
3. Adding new features
4. Fixing bugs
5. Improving documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
