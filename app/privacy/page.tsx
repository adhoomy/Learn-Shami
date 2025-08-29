'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl font-display text-black mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">How we protect and handle your data</p>
          </div>
        </div>

        {/* Privacy Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-black">Data Collection & Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Information We Collect</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Eye className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Account Information:</strong> Email address, username, and profile preferences</span>
                </li>
                <li className="flex items-start">
                  <Database className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Learning Data:</strong> Progress, quiz results, and review history</span>
                </li>
                <li className="flex items-start">
                  <Lock className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Usage Analytics:</strong> How you interact with lessons and features</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">How We Use Your Data</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Personalize your learning experience</li>
                <li>• Track your progress and provide insights</li>
                <li>• Improve our learning algorithms</li>
                <li>• Send important updates about your account</li>
                <li>• Provide customer support</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Data Protection</h3>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your personal information. 
                Your data is encrypted in transit and at rest, and we never share your personal information 
                with third parties without your explicit consent.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Your Rights</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Access your personal data</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of non-essential communications</li>
                <li>• Export your learning data</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at <Link href="/contact" className="text-primary-600 hover:underline">our contact page</Link>.
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
