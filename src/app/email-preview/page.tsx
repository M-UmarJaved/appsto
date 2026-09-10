import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LicenseEmailPreviewDemo } from '@/components/email/LicenseEmailPreview';

export const metadata: Metadata = {
  title: 'Email Preview | Appsto',
  description: 'Preview of license delivery email template',
};

export default function EmailPreviewPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#723CFB] hover:text-[#5F27E5] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#060C17] mb-4">
            License Email Preview
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            This is what customers receive after purchasing a one-time license product.
            <br />
            <span className="text-sm text-slate-500 italic mt-2 block">
              (For demo purposes only - actual emails are generated dynamically)
            </span>
          </p>
        </div>

        {/* Email Preview Component */}
        <LicenseEmailPreviewDemo />

        {/* Technical Info */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-[#060C17] mb-4">
            📧 Email Delivery System
          </h2>
          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">When is this sent?</h3>
              <p className="text-sm">
                Immediately after a successful Paddle webhook confirms a completed transaction for a one-time purchase product.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What&apos;s included?</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Unique license token (APPSTO-XXXX-XXXX-XXXX format)</li>
                <li>Direct download link for the software</li>
                <li>Demo video/setup guide (if available)</li>
                <li>Step-by-step activation instructions</li>
                <li>Important notes about single-device activation</li>
                <li>Support contact information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Email Service:</h3>
              <p className="text-sm">
                Powered by Nodemailer with SMTP configuration. Supports HTML rendering with inline styles for compatibility across email clients.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Implementation:</h3>
              <p className="text-sm">
                Email template is generated in <code className="bg-slate-100 text-[#723CFB] px-2 py-1 rounded text-xs">src/lib/email.ts</code> using the <code className="bg-slate-100 text-[#723CFB] px-2 py-1 rounded text-xs">sendLicenseEmail()</code> function.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 italic">
                ⚠️ Note: This preview page is for development/demo purposes. In production, customers won&apos;t see this page—they&apos;ll receive the email directly in their inbox.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">🔧 Developer Resources</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              <strong className="text-slate-900">Email Component:</strong> <code className="bg-slate-100 text-slate-900 px-2 py-1 rounded text-xs">src/components/email/LicenseEmailPreview.tsx</code>
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-900">Email Service:</strong> <code className="bg-slate-100 text-slate-900 px-2 py-1 rounded text-xs">src/lib/email.ts</code>
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-900">Webhook Handler:</strong> <code className="bg-slate-100 text-slate-900 px-2 py-1 rounded text-xs">src/app/api/webhooks/paddle/route.ts</code>
            </p>
            <p className="text-slate-600 mt-4">
              <strong className="text-slate-900">Test Email:</strong> Run <code className="bg-slate-100 text-slate-900 px-2 py-1 rounded text-xs">node scripts/test-email.js</code> to send a test email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
