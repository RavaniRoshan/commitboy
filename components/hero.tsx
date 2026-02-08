'use client';

import { ArrowRight, Sparkles, Github } from 'lucide-react';

export default function Hero() {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'changelog-automator';
  const installUrl = `https://github.com/apps/${appName}/installations/new`;

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Now with AI-powered summaries</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
            Stop Writing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              CHANGELOG.md
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            Auto-generate changelogs from your commits. Push to main → changelog updates. 
            No manual work required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={installUrl}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              <Github className="w-5 h-5" />
              Add to GitHub (Free)
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <button
              onClick={() => {
                const demoSection = document.getElementById('demo');
                demoSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all border border-gray-700"
            >
              See Demo
            </button>
          </div>

          {/* Trust signal */}
          <p className="mt-6 text-gray-500 text-sm">
            Free for 50 commits/month · No credit card required
          </p>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-gray-900"
                  />
                ))}
              </div>
              <span className="text-sm">100+ developers using it</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-sm ml-2">Loved by solo devs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  );
}