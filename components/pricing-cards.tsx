'use client';

import { Check, Zap, Github } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for side projects and open source',
    features: [
      '50 commits per month',
      'Auto-generated changelogs',
      'GitHub integration',
      'Basic AI summaries',
      'Community support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/install',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For professional developers and teams',
    features: [
      'Unlimited commits',
      'No watermark',
      'Tweet-ready summaries',
      'Priority processing',
      'Priority support',
      'Custom templates (coming soon)',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/api/stripe-checkout',
    highlighted: true,
    badge: 'Most Popular',
  },
];

export default function PricingCards() {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'changelog-automator';

  return (
    <section id="pricing" className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-900/50 to-gray-800 border-2 border-blue-500'
                  : 'bg-gray-900 border border-gray-700'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? 'text-blue-400' : 'text-green-400'
                    }`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.name === 'Free' 
                  ? `https://github.com/apps/${appName}/installations/new`
                  : plan.ctaLink
                }
                className={`block w-full py-4 px-6 rounded-lg font-semibold text-center transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  {plan.cta}
                </span>
              </a>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Questions?{' '}
            <a href="mailto:support@changelogautomator.com" className="text-blue-400 hover:text-blue-300 underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}