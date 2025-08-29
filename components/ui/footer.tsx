'use client';

import Link from 'next/link';
import { BookOpen, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ];

  // Don't show footer on landing page for unauthenticated users
  if (!session) return null;

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display text-neutral-900">ShamiLearn</span>
            </div>
            <p className="text-neutral-600 max-w-md">
              Master the Shami dialect through interactive lessons, spaced repetition, and AI-powered learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-neutral-500">
              © {currentYear} ShamiLearn. All rights reserved.
            </p>
            <p className="text-sm text-neutral-500 flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for language learners</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
