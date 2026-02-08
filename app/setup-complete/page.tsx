'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, AlertCircle } from 'lucide-react';

function SetupCompleteContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const installationId = searchParams.get('installation_id');
    
    if (installationId) {
      // In a real app, you'd save this to your database
      console.log('Installation ID:', installationId);
      
      // Simulate saving to KV/database
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Setting Up...
              </h1>
              <p className="text-gray-400">
                We&apos;re configuring the GitHub App for your repositories.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-600/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                You&apos;re All Set! 🎉
              </h1>
              <p className="text-gray-400 mb-6">
                Changelog Automator is now installed. Push to your main branch and watch the magic happen!
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-500 mb-2">What&apos;s next?</p>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Make a commit to your repo</li>
                  <li>Push to the main branch</li>
                  <li>Watch CHANGELOG.md auto-update!</li>
                </ol>
              </div>

              <a
                href="/"
                className="inline-flex items-center justify-center w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
              </a>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-600/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Setup Failed
              </h1>
              <p className="text-gray-400 mb-6">
                We couldn&apos;t complete the installation. Please try again.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetupCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
            <p className="text-gray-400">Please wait while we complete the setup.</p>
          </div>
        </div>
      </div>
    }>
      <SetupCompleteContent />
    </Suspense>
  );
}