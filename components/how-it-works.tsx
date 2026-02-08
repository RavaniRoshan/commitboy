'use client';

import { Download, GitCommit, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Download,
    title: 'Install GitHub App',
    description: 'One-click install. Grant read/write access to your repositories.',
    color: 'bg-blue-600',
  },
  {
    number: 2,
    icon: GitCommit,
    title: 'Push to Main',
    description: 'We automatically parse your commits with AI when you push to the main branch.',
    color: 'bg-purple-600',
  },
  {
    number: 3,
    icon: FileText,
    title: 'Changelog Updates',
    description: 'CHANGELOG.md auto-commits to your repo with beautifully formatted release notes.',
    color: 'bg-green-600',
  },
];

const codeExample = `## 2024-01-15

### ✨ Features
- **api**: Add user authentication system (a1b2c3d)
- **ui**: New dark mode toggle (e4f5g6h)

### 🐛 Fixes  
- Resolve memory leak in data processing (i7j8k9l)

### 📝 Other
- Update dependencies to latest versions (m0n1o2p)`;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to never write a changelog again
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-800" />
              )}
              
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-colors">
                {/* Step number */}
                <div className={`${step.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-600">0{step.number}</span>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-500 text-sm ml-4">CHANGELOG.md</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="text-gray-300">
                  {codeExample.split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      {line.startsWith('##') ? (
                        <span className="text-purple-400">{line}</span>
                      ) : line.startsWith('###') ? (
                        <span className="text-blue-400">{line}</span>
                      ) : line.startsWith('-') ? (
                        <span>
                          <span className="text-gray-500">- </span>
                          <span className="text-yellow-400">{line.match(/\*\*(.*?)\*\*/)?.[0] || ''}</span>
                          <span className="text-gray-300">{line.replace(/\*\*(.*?)\*\*/, '').replace('- ', '')}</span>
                        </span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}