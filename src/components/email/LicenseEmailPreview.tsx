import { CheckCircle, Download, Play, Shield } from 'lucide-react';

interface LicenseEmailPreviewProps {
  productName: string;
  licenseToken: string;
  downloadUrl: string;
  demoVideoUrl?: string;
  userName?: string;
}

export default function LicenseEmailPreview({
  productName,
  licenseToken,
  downloadUrl,
  demoVideoUrl,
  userName = 'Valued Customer',
}: LicenseEmailPreviewProps) {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Email Client Header (for preview) */}
        <div className="bg-white rounded-t-lg px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">From: <span className="font-semibold">appsto.software</span></p>
              <p className="text-sm text-gray-600">Subject: <span className="font-semibold">Your {productName} License Key - Ready to Activate!</span></p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              SENT
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="bg-white shadow-xl rounded-b-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Purchase Successful! 🎉
            </h1>
            <p className="text-brand-100 text-lg">
              Your software is ready to download and activate
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <p className="text-gray-700 text-lg mb-6">
              Hi {userName},
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Thank you for purchasing <strong className="text-brand-600">{productName}</strong>! Your license has been generated and is ready to use.
            </p>

            {/* License Token Box */}
            <div className="bg-gradient-to-br from-brand-50 to-blue-50 border-2 border-brand-500 rounded-xl p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-brand-600" />
                <p className="text-sm font-bold text-brand-600 uppercase tracking-wide">Your License Token</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-4 border-2 border-brand-300 mb-4">
                <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                  {licenseToken}
                </p>
              </div>
              <p className="text-xs text-gray-600 italic">
                ⚠️ Keep this token secure. It can only be activated once.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <a
                href={downloadUrl}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold py-4 px-6 rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5" />
                Download Software
              </a>
              
              {demoVideoUrl && (
                <a
                  href={demoVideoUrl}
                  className="flex items-center justify-center gap-3 bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 transition-all shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="w-5 h-5" />
                  Watch Setup Guide
                </a>
              )}
            </div>

            {/* Activation Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Activation Instructions
              </h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span><strong>Download the software</strong> using the button above</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span><strong>Install the application</strong> on your device</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span><strong>Launch the app</strong> and select "Activate License"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span><strong>Enter your license token</strong> (copy-paste recommended)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <span><strong>Enjoy lifetime access!</strong> No internet required after activation</span>
                </li>
              </ol>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Important Notes
              </h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Your license is valid for <strong>one device only</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>The token can only be activated <strong>once</strong> and cannot be transferred</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Store this email safely - you'll need the token to reinstall</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Internet connection required for initial activation only</span>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-700 mb-4">
                Our support team is here to assist you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:support@appsto.software"
                  className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-2"
                >
                  📧 support@appsto.software
                </a>
                <a
                  href="https://appsto.software/support"
                  className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Visit Support Center
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-8 py-6 text-center border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              Thank you for choosing <strong>Appsto</strong>
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Professional software marketplace for desktop applications
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="https://appsto.software/privacy" className="hover:text-brand-600">Privacy Policy</a>
              <span>•</span>
              <a href="https://appsto.software/terms" className="hover:text-brand-600">Terms of Service</a>
              <span>•</span>
              <a href="https://appsto.software/refund-policy" className="hover:text-brand-600">Refund Policy</a>
              <span>•</span>
              <a href="https://appsto.software/support" className="hover:text-brand-600">Support</a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © 2026 appsto.software. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage component
export function LicenseEmailPreviewDemo() {
  return (
    <LicenseEmailPreview
      productName="ProEdit Studio"
      licenseToken="APPSTO-X7K9-M2P4-Q8W1"
      downloadUrl="https://appsto.software/downloads/proedit-studio"
      demoVideoUrl="https://www.youtube.com/watch?v=example"
      userName="John Doe"
    />
  );
}
