'use client';

import { Github, ArrowRight } from 'lucide-react';

interface InstallButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function InstallButton({ 
  size = 'md', 
  variant = 'primary' 
}: InstallButtonProps) {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'commitboy';
  const installUrl = `https://github.com/apps/${appName}/installations/new`;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
  };

  return (
    <a
      href={installUrl}
      className={`
        inline-flex items-center justify-center gap-2 
        font-semibold rounded-lg 
        transition-all transform hover:scale-105
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
    >
      <Github className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      <span>Install on GitHub</span>
      <ArrowRight className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
    </a>
  );
}