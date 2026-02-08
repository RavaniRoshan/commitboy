import Hero from '@/components/hero';
import HowItWorks from '@/components/how-it-works';
import PricingCards from '@/components/pricing-cards';
import DemoSection from '@/components/demo-section';
import InstallButton from '@/components/install-button';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'changelog-automator';

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <Hero />

      {/* How It Works */}
      <HowItWorks />

      {/* Demo Section */}
      <DemoSection />

      {/* Pricing */}
      <PricingCards />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to stop writing changelogs?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of developers who&apos;ve automated their release notes. 
            Free for 50 commits/month.
          </p>
          <InstallButton size="lg" />
          <p className="mt-6 text-gray-500 text-sm">
            No credit card required · Setup takes 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Changelog Automator</h3>
              <p className="text-gray-400 mb-4 max-w-sm">
                Auto-generate changelogs from your commits. Built for solo devs shipping OSS and side projects.
              </p>
              <div className="flex gap-4">
                <a 
                  href={`https://github.com/apps/${appName}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:support@changelogautomator.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-gray-400 hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="mailto:support@changelogautomator.com" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Changelog Automator. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}