'use client';

import { Play, Pause, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="demo" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch how Changelog Automator transforms your commits into beautiful release notes
          </p>
        </div>

        {/* Demo container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            {/* Demo placeholder - would be replaced with actual GIF */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Play className="w-10 h-10 text-blue-400 ml-1" />
                </div>
                <p className="text-gray-400 mb-2">Demo GIF</p>
                <p className="text-gray-500 text-sm">30-second walkthrough</p>
                <p className="text-gray-600 text-xs mt-4">
                  (Replace /demo.gif with your actual demo)
                </p>
              </div>
            </div>

            {/* Demo controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="text-white">
                    <p className="font-medium">Product Demo</p>
                    <p className="text-sm text-gray-400">0:00 / 0:30</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Demo description */}
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-400 mb-2">2 min</div>
              <p className="text-gray-400 text-sm">Setup time</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-purple-400 mb-2">100%</div>
              <p className="text-gray-400 text-sm">Automated</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-400 mb-2">50+</div>
              <p className="text-gray-400 text-sm">Happy developers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}