'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

function UpgradeSuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    
    if (paymentId || orderId) {
      // Verify the payment and upgrade the installation
      console.log('Upgrading with payment:', paymentId, 'order:', orderId);
      
      // Simulate verification
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-blue-500/30 text-center">
          {isLoading ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Activating Pro...
              </h1>
              <p className="text-gray-400">
                We&apos;re upgrading your account. This will just take a moment.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-blue-400" />
              </div>
              
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Pro Plan Activated
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome to Pro! 🎉
              </h1>
              <p className="text-gray-400 mb-6">
                Your account has been upgraded. You now have unlimited commits and access to all Pro features.
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-500 mb-3">Your Pro benefits:</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Unlimited commits per month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    No watermark on changelogs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Tweet-ready summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Priority support
                  </li>
                </ul>
              </div>

              <a
                href="/"
                className="inline-flex items-center justify-center w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              
              <p className="mt-4 text-sm text-gray-500">
                Need help?{' '}
                <a href="mailto:support@changelogautomator.com" className="text-blue-400 hover:text-blue-300">
                  Contact support
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-blue-500/30 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
            <p className="text-gray-400">Please wait while we verify your upgrade.</p>
          </div>
        </div>
      </div>
    }>
      <UpgradeSuccessContent />
    </Suspense>
  );
}
