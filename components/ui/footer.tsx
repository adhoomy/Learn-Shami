'use client';

import Link from 'next/link';
import { BookOpen, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Footer() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <footer className="bg-brand-dark text-brand-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-brand-accent" />
              <span className="text-xl font-bold">ShamiLearn</span>
            </div>
            <p className="text-sm text-brand-background/80">
              Master Palestinian Arabic through interactive lessons and spaced repetition.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/lessons" className="text-brand-background/80 hover:text-brand-accentLight transition-colors duration-200">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/review" className="text-brand-background/80 hover:text-brand-accentLight transition-colors duration-200">
                  Review
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-brand-background/80 hover:text-brand-accentLight transition-colors duration-200">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <p className="text-sm text-brand-background/80">
              Made with <Heart className="w-4 h-4 inline text-brand-accent" /> for Arabic learners
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-brand-accentLight/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-brand-background/60">
              © 2024 ShamiLearn. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-brand-background/60 hover:text-brand-accentLight transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-brand-background/60 hover:text-brand-accentLight transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
