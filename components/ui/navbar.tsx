'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!session) return null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-xl font-bold hover:text-brand-accentLight transition-colors duration-200">
              ShamiLearn
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-brand-accentLight px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/lessons" 
                className="text-white hover:text-brand-accentLight px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
              >
                Lessons
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/review" 
                className="text-white hover:text-brand-accentLight px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
              >
                Review
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/profile" 
                className="text-white hover:text-brand-accentLight px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
              >
                Profile
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-brand-accent hover:bg-brand-accentLight text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-brand-accentLight p-2 rounded-md transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-primary border-t border-brand-accentLight">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="text-white hover:text-brand-accentLight block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/lessons" 
              className="text-white hover:text-brand-accentLight block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lessons
            </Link>
            <Link 
              href="/review" 
              className="text-white hover:text-brand-accentLight block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Review
            </Link>
            <Link 
              href="/profile" 
              className="text-white hover:text-brand-accentLight block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <div className="pt-4 pb-3 border-t border-brand-accentLight">
              <div className="flex items-center px-3">
                <User className="w-5 h-5 text-brand-accentLight mr-3" />
                <span className="text-white text-sm">{session.user?.email}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="mt-3 w-full text-left text-white hover:text-brand-accentLight block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
