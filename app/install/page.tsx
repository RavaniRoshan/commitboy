'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Github } from 'lucide-react';

export default function InstallPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const installationId = searchParams.get('installation_id');
    const setupAction = searchParams.get('setup_action');
    
    if (!installationId) {
      // No installation ID, redirect to home
      router.push('/');
      return;
    }

    // Process the installation
    const processInstallation = async () => {
      try {
        // In a real implementation, this would save to KV/database
        console.log('Processing installation:', installationId);
        console.log('Setup action:', setupAction);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to success page
        router.push(`/setup-complete?installation_id=${installationId}`);
      } catch (error) {
        console.error('Error processing installation:', error);
        setIsProcessing(false);
      }
    };

    processInstallation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            ) : (
              <Github className="w-10 h-10 text-blue-400" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {isProcessing ? 'Installing...' : 'Processing Complete'}
          </h1>
          
          <p className="text-gray-400">
            {isProcessing 
              ? 'We\'re connecting your GitHub repositories. This will just take a moment.'
              : 'Installation processed successfully!'
            }
          </p>

          {isProcessing && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          You&apos;ll be redirected automatically once complete.
        </p>
      </div>
    </div>
  );
}