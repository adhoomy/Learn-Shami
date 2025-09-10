'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/landing">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Landing
            </Button>
          </Link>
          <div className="text-center">
            <img src="/logo.png" alt="Learn Shami Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-display text-black mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Our terms and conditions for using Learn Shami</p>
          </div>
        </div>

        {/* Terms Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-black">Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              By accessing and using Learn Shami, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Use License</h3>
              <p className="text-gray-700">
                Permission is granted to temporarily access Learn Shami for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose</li>
                <li>• Attempt to reverse engineer any software contained on Learn Shami</li>
                <li>• Remove any copyright or other proprietary notations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">User Responsibilities</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and complete information when creating your account</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Use the service for educational purposes only</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Respect other users and maintain appropriate behavior</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Intellectual Property</h3>
              <p className="text-gray-700">
                The Service and its original content, features, and functionality are and will remain the exclusive property of 
                Learn Shami and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Limitation of Liability</h3>
              <p className="text-gray-700">
                In no event shall Learn Shami, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Termination</h3>
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but 
                not limited to a breach of the Terms.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Changes to Terms</h3>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at 
                <Link href="/contact" className="text-primary-600 hover:underline"> our contact page</Link>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
