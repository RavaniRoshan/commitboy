# Changelog Automator

<img width="1748" height="850" alt="image" src="https://github.com/user-attachments/assets/a263438c-b7c1-4426-ac21-cc1ac2d17853" />


Auto-generate CHANGELOG.md from your commits. Push to main → changelog updates. No manual work.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Built with](https://img.shields.io/badge/built%20with-Next.js%2014-black.svg)
![AI Powered](https://img.shields.io/badge/AI-Groq-green.svg)

## 🚀 What is this?

Changelog Automator is a GitHub App that uses AI (Groq's fast LLM inference) to automatically generate and update your CHANGELOG.md file whenever you push to your main branch.

**Key Features:**
- 🤖 AI-powered commit parsing and summarization
- 📝 Auto-generates beautiful Markdown changelogs
- 🔄 Updates on every push to main
- 🐦 Optional tweet summaries (Pro)
- 📊 Rate limiting with free tier
- ⚡ Built on Vercel for instant deployment

## 🎯 Perfect For

- Solo developers shipping OSS
- Side project maintainers
- Anyone tired of writing release notes manually

## 🛠️ Setup (2 Minutes)

### 1. Install the GitHub App

1. Click **"Add to GitHub"** on [our website](https://your-app-url.vercel.app)
2. Select the repositories you want to enable
3. Grant read/write permissions

### 2. That's It!

Push to your main branch and watch the magic happen. Your CHANGELOG.md will automatically update with:

- ✨ New features
- 🐛 Bug fixes  
- ⚠️ Breaking changes
- 📝 Other improvements

## 💰 Pricing

### Free Tier
- **50 commits/month**
- Auto-generated changelogs
- GitHub integration
- Basic AI summaries

### Pro - $9/month
- **Unlimited commits**
- No watermark
- Tweet-ready summaries
- Priority processing
- Priority support

## 🏗️ How It Works

```
GitHub Push Event
       ↓
Webhook Receiver (Vercel)
       ↓
AI Parses Commits (Groq)
       ↓
Generates Changelog
       ↓
Auto-commits to Repo
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Vercel Serverless Functions
- **AI**: Groq (Llama 3.3 70B Versatile)
- **Storage**: Vercel KV (Redis)
- **Payments**: Stripe (Phase 8)

## 📦 Installation (Self-Hosted)

If you prefer to host your own instance:

```bash
# Clone the repository
git clone https://github.com/yourusername/changelog-automator.git
cd changelog-automator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run locally
npm run dev
```

### Environment Variables

```env
# Required
GITHUB_TOKEN=ghp_your_github_token
GROQ_API_KEY=gsk_your_groq_api_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Optional (for Pro features)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
```

## 🔧 GitHub App Configuration

1. Go to [GitHub Developer Settings](https://github.com/settings/apps/new)
2. Create a new GitHub App:
   - **App name**: Changelog Automator
   - **Homepage URL**: Your app URL
   - **Callback URL**: `https://yourapp.vercel.app/install`
   - **Webhook URL**: `https://yourapp.vercel.app/api/webhook`
   
3. Set Permissions:
   - **Repository contents**: Read & Write
   - **Webhooks**: Read-only
   
4. Subscribe to Events:
   - Push

5. Save the App ID and Private Key to your environment variables

## 🧪 Testing

```bash
# Run local tests
npm test

# Test with a real repo
npm run test:local
```

## 📊 API Endpoints

- `GET /api/health` - Health check
- `POST /api/webhook` - GitHub webhook receiver
- `POST /api/github-install` - Save installation data
- `POST /api/stripe-checkout` - Create checkout session (Pro)

## 🚨 Troubleshooting

### Webhook Not Firing

1. Check webhook URL is correct in GitHub App settings
2. Verify `GITHUB_WEBHOOK_SECRET` matches
3. Check Vercel logs: `vercel logs`

### Changelog Not Updating

1. Verify GitHub token has repo write permissions
2. Check that commits aren't being filtered (trivial commits are skipped)
3. Look for error issues created in your repo

### Rate Limit Hit

- Free tier: 50 commits/month
- Counter resets at the start of each month
- Upgrade to Pro for unlimited

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Groq](https://groq.com)
- Hosted on [Vercel](https://vercel.com)

## 📞 Support

- 📧 Email: support@changelogautomator.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/changelog-automator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/changelog-automator/discussions)

---

**Stop writing changelogs. Start shipping.** 🚀
