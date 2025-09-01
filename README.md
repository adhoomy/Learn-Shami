# ShamiLearn

**Learn Palestinian Arabic with flashcards, quizzes, and spaced repetition.**

A fullstack web application designed to teach Palestinian Arabic through interactive lessons, AI-generated audio, and scientifically-proven spaced repetition learning techniques.

## ✨ Features

- ✅ **User Authentication** - Secure login/registration with NextAuth + MongoDB
- ✅ **Interactive Lessons** - Flashcards with Arabic text, transliteration, and English translations
- ✅ **AI-Generated Audio** - High-quality pronunciation using OpenAI Text-to-Speech
- ✅ **Multiple Learning Modes** - Flashcards, quiz mode (multiple choice & typing)
- ✅ **Progress Tracking** - Individual user progress with visual progress bars
- ✅ **Learning Streaks** - 🔥 Streak tracking to maintain consistent learning habits
- ✅ **SM-2 Spaced Repetition** - Anki-style review system for optimal retention
- ✅ **Comprehensive Dashboard** - Stats showing items learned, reviews due, streaks, and lesson completion percentages
- ✅ **Responsive Design** - Beautiful, mobile-first interface that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js with MongoDB adapter
- **Database**: MongoDB Atlas
- **Audio**: OpenAI Text-to-Speech API
- **Deployment**: Vercel
- **UI/UX**: Framer Motion animations, shadcn/ui components

## 📚 Lessons

ShamiLearn includes multiple beginner-friendly lessons covering essential Palestinian Arabic vocabulary and phrases. Examples include:

- **Greetings** - Common daily greetings and responses
- **Introductions** - How to introduce yourself and others
- **Numbers** - Counting from 1-20 and beyond
- **Everyday Phrases** - Essential phrases for daily interactions
- **Family & People** - Family members and relationship terms

> **Note**: The app dynamically manages lesson content through the dashboard, so new lessons can be added without requiring README updates.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB instance)
- OpenAI API key (for audio generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shamilearn.git
   cd shamilearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_super_secret_key_at_least_32_characters
   NEXTAUTH_URL=http://localhost:3000
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to start learning!

## 🚀 Deployment

ShamiLearn is designed for easy deployment on modern platforms:

- **Frontend**: Deployed on [Vercel](https://vercel.com) for optimal performance and global CDN
- **Database**: MongoDB Atlas for reliable, scalable data storage
- **Audio**: OpenAI API for high-quality Arabic pronunciation

The application automatically handles environment variables and database connections in production.

## 👤 Demo User

Want to try ShamiLearn without creating an account? Use our demo credentials:

- **Email**: `demo@email.com`
- **Password**: `demo123`

> This demo account includes sample progress data to showcase the learning features.

## 📖 How It Works

1. **Sign up** for a free account or use the demo login
2. **Browse lessons** on the dashboard to see available content
3. **Study flashcards** with Arabic text, transliteration, and audio
4. **Take quizzes** to test your knowledge with multiple choice and typing exercises
5. **Review regularly** using the spaced repetition system for long-term retention
6. **Track progress** with visual indicators and learning streaks

## 🎯 Learning Methodology

ShamiLearn uses the scientifically-proven **SM-2 spaced repetition algorithm** (the same system used by Anki) to optimize your learning:

- Items you find easy are reviewed less frequently
- Items you find difficult are reviewed more often
- The system adapts to your learning pace automatically
- Maintains learning streaks to encourage consistent practice

## 🤝 Contributing

We welcome contributions to make ShamiLearn even better! Here are some ways you can help:

- 🐛 **Report bugs** or suggest improvements
- 📝 **Add new lessons** or improve existing content
- 🎨 **Enhance the UI/UX** with better designs or animations
- 🔊 **Improve audio quality** or add new pronunciation features
- 📚 **Write documentation** or help with translations
- ⚡ **Optimize performance** or add new learning features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Start your Palestinian Arabic learning journey today! 🇵🇸**