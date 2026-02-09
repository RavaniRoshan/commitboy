"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Github,
  Zap,
  Webhook,
  Sparkles,
  Shield,
  Cpu,
  ChevronDown,
  X,
} from "lucide-react";

type StatsPayload = {
  repos: number;
  stars: number;
  changelogs: number;
  recent: string[];
};

const messyCommits = [
  "fix: button thing broken again",
  "wip - don't merge",
  "chore: update npm deps",
  "feat:add auth but needs work",
  "Merge pull request #47 from xyz",
  "fix typo in README.md",
];

const cleanOutput = [
  { label: "Features", items: ["Add user authentication"] },
  { label: "Fixes", items: ["Fix button unresponsive on mobile"] },
  { label: "Documentation", items: ["Update dependencies"] },
];

const costStats = [
  { label: "min per release", value: 30, suffix: " min" },
  { label: "hours per year", value: 6, suffix: " hours" },
  { label: "consistency guarantee", value: 0, suffix: "%" },
];

const howItWorks = [
  {
    title: "GitHub webhook listens",
    description: "Push to main. We listen.",
    icon: Webhook,
    detail: "GitHub → Commitboy",
  },
  {
    title: "Claude reads your commits",
    description: "Your commits become data.",
    icon: Cpu,
    detail: "{ commits: [ ... ] }",
  },
  {
    title: "Perfect changelog appears",
    description: "Professional. Automatic. Deployed.",
    icon: Sparkles,
    detail: "CHANGELOG.md",
  },
];

const faqs = [
  {
    question: "Do I need conventional commits?",
    answer: "No. Commitboy cleans up whatever you throw at it.",
  },
  {
    question: "What if my commits are messy?",
    answer: "That’s the point. Commitboy rewrites them into a release-ready story.",
  },
  {
    question: "How fast is it?",
    answer: "0.2s average generation time once the webhook fires.",
  },
  {
    question: "Can I customize the format?",
    answer: "Not yet. We stay opinionated so your changelog stays sharp.",
  },
  {
    question: "Is my code secure?",
    answer: "GitHub tokens never leave Vercel. We process metadata only.",
  },
];

const statsFallback: StatsPayload = {
  repos: 48,
  stars: 312,
  changelogs: 1260,
  recent: [
    "Release 1.4.2 — “Authentication Cleanup”",
    "Release 0.9.0 — “Docs + Dependency Refresh”",
    "Release 2.1.0 — “Mobile Fix Pack”",
  ],
};

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || "commitboy";
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || "/docs";
  const repoUrl =
    process.env.NEXT_PUBLIC_REPO_URL ||
    "https://github.com/RavaniRoshan/commitboy";
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [stats, setStats] = useState<StatsPayload>(statsFallback);
  const [exitOpen, setExitOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [mobileFaqOpen, setMobileFaqOpen] = useState(false);
  const [recentIndex, setRecentIndex] = useState(0);

  const price = useMemo(() => {
    if (billing === "monthly") {
      return { label: "$9", cadence: "/mo", note: "Cancel anytime" };
    }
    return { label: "$86", cadence: "/yr", note: "20% off annually" };
  }, [billing]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    setMobileFaqOpen(media.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setMobileFaqOpen(event.matches);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const counterElements = document.querySelectorAll<HTMLElement>("[data-countup]");
    const counterSeen = new WeakSet<Element>();

    const animateCount = (el: HTMLElement) => {
      const end = Number(el.dataset.end || 0);
      const duration = Number(el.dataset.duration || 1200);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * end);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.classList.add("is-revealed");
          if (target.dataset.countup === "true" && !counterSeen.has(target)) {
            counterSeen.add(target);
            animateCount(target);
          }
          observer.unobserve(target);
        });
      },
      { threshold: 0.35 }
    );

    elements.forEach((el) => observer.observe(el));
    counterElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-parallel]");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("parallel-active");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) return;
        const data = (await response.json()) as StatsPayload;
        if (active) setStats(data);
      } catch {
        // Keep fallback.
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 1800000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentIndex((prev) => (prev + 1) % stats.recent.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [stats.recent.length]);

  useEffect(() => {
    const isDesktop = () => window.innerWidth >= 1024;
    const dismissed = sessionStorage.getItem("commitboy-exit");
    if (dismissed) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDesktop()) return;
      if (event.clientY <= 0) {
        setExitOpen(true);
        sessionStorage.setItem("commitboy-exit", "1");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className="min-h-screen text-white">
      <section className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="surface px-8 py-10 bg-grid">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-sm text-slate-300 uppercase tracking-[0.2em]">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Commitboy live demo
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
                Your changelog shouldn’t be a chore.
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
                Commitboy turns messy commits into professional changelogs. Automatically.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#transformation" className="cta-button">
                  See it in action <ArrowRight size={18} />
                </a>
              <a href={`https://github.com/apps/${appName}`} className="ghost-button">
                Install from GitHub <Github size={18} />
              </a>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-6">
                <div className="panel px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Messy commit</p>
                  <p className="mt-2 text-sm text-slate-200">❌ fix: button thing broken again</p>
                </div>
                <div className="panel px-5 py-4 glow-ring">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Commitboy output</p>
                  <p className="mt-2 text-sm text-emerald-200">✅ Fix button unresponsive on mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="transformation" className="py-20" data-parallel>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">The Transformation</p>
            <h2 className="text-3xl md:text-4xl">Messy commits → meaningful updates</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="panel p-6 md:sticky md:top-24 h-fit">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">
                Raw commits
              </p>
              <ul className="space-y-4 text-sm text-slate-300">
                {messyCommits.map((commit) => (
                  <li key={commit} className="messy-line">
                    ❌ {commit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="panel p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">
                  Commitboy changelog
                </p>
                <div className="space-y-5">
                  {cleanOutput.map((section) => (
                    <div key={section.label} data-reveal>
                      <p className="text-emerald-200 font-semibold">{section.label}</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-200">
                        {section.items.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="panel p-4" data-reveal>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Summary
                  </p>
                  <p className="mt-2 text-lg font-semibold">6 commits → 3 updates</p>
                </div>
                <div className="panel p-4" data-reveal>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Speed
                  </p>
                  <p className="mt-2 text-lg font-semibold text-emerald-200">
                    Generated in 0.2s
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-400" data-reveal>
                Scroll-driven comparison. You control the reveal. Commitboy keeps the story honest.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="surface px-8 py-10">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  The Real Cost
                </p>
                <h2 className="text-3xl md:text-4xl mt-3">Manual changelog writing costs</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {costStats.map((stat) => (
                  <div key={stat.label} className="panel p-6" data-reveal>
                    <p
                      className="text-3xl font-semibold text-white"
                      data-reveal
                      data-countup="true"
                      data-end={stat.value}
                      data-suffix={stat.suffix}
                      data-duration="1600"
                    >
                      0{stat.suffix}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                One missed release note and you look unprofessional. Commitboy removes the risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">How It Works</p>
            <h2 className="text-3xl md:text-4xl">From push to polished in three steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step) => (
              <div key={step.title} className="panel p-6" data-reveal>
                <step.icon className="text-sky-400 mb-6" size={28} />
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-300 mt-2">{step.description}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-6">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="surface px-8 py-10">
            <div className="flex flex-col gap-4 mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Social Proof (Inverted)
              </p>
              <h2 className="text-3xl md:text-4xl">Proof through action, not adjectives</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="stat-tile" data-reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Repos live</p>
                <p
                  className="text-3xl font-semibold mt-2"
                  data-reveal
                  data-countup="true"
                  data-end={stats.repos}
                  data-suffix=""
                  data-duration="1400"
                >
                  {stats.repos}
                </p>
              </div>
              <div className="stat-tile" data-reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">GitHub stars</p>
                <p
                  className="text-3xl font-semibold mt-2"
                  data-reveal
                  data-countup="true"
                  data-end={stats.stars}
                  data-suffix=""
                  data-duration="1400"
                >
                  {stats.stars}
                </p>
              </div>
              <div className="stat-tile" data-reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Changelogs generated
                </p>
                <p
                  className="text-3xl font-semibold mt-2"
                  data-reveal
                  data-countup="true"
                  data-end={stats.changelogs}
                  data-suffix=""
                  data-duration="1400"
                >
                  {stats.changelogs}
                </p>
              </div>
            </div>
            <div className="panel p-6" data-reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Recent changelogs
              </p>
              <p className="mt-4 text-lg text-slate-200">
                {stats.recent[recentIndex]}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Rotating live samples from the last 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pricing</p>
            <h2 className="text-3xl md:text-4xl">Honest pricing, no theater</h2>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <button
              className={`ghost-button ${billing === "monthly" ? "border-sky-400 text-white" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`ghost-button ${billing === "annual" ? "border-emerald-400 text-white" : ""}`}
              onClick={() => setBilling("annual")}
            >
              Annual (20% off)
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="panel p-8" data-reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Free</p>
              <p className="text-3xl font-semibold mt-3">$0</p>
              <p className="text-slate-400 mt-2">50 commits / month</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>Watermark included</li>
                <li>Perfect for hobby projects</li>
                <li>Setup in 2 minutes</li>
              </ul>
              <a
                href={`https://github.com/apps/${appName}`}
                className="cta-button mt-8"
              >
                Try free <ArrowRight size={18} />
              </a>
            </div>
            <div className="panel p-8 glow-ring" data-reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pro</p>
              <div className="flex items-end gap-2 mt-3">
                <p className="text-3xl font-semibold">{price.label}</p>
                <span className="text-slate-400">{price.cadence}</span>
              </div>
              <p className="text-slate-400 mt-2">Unlimited commits</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>No watermark</li>
                <li>Perfect for startups</li>
                <li>{price.note}</li>
              </ul>
              <a href={`/billing?plan=${billing}`} className="cta-button mt-8">
                Upgrade to Pro <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">FAQ</p>
            <h2 className="text-3xl md:text-4xl">Real answers to real objections</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => {
              const isOpen = mobileFaqOpen || faqOpen[index];
              return (
                <button
                  key={faq.question}
                  className="faq-item text-left"
                  onClick={() => toggleFaq(index)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      size={18}
                    />
                  </div>
                  {isOpen && <p className="text-sm text-slate-300 mt-3">{faq.answer}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="surface px-8 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Exit Paths</p>
              <h2 className="text-3xl md:text-4xl mt-3">
                Two ways out. No friction either way.
              </h2>
              <p className="text-slate-300 mt-4">
                Add the webhook or read the docs. Both paths respect your time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`https://github.com/apps/${appName}`} className="cta-button">
                Add webhook to a repo <Zap size={18} />
              </a>
              <a href={docsUrl} className="ghost-button">
                Read the docs <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm text-slate-400">
          <div>
            <p className="text-white font-semibold">Commitboy</p>
            <p className="mt-2 max-w-xs">
              Commits are chaos. Automation is peace. Ship changelogs without the drag.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={`https://github.com/apps/${appName}`} className="hover:text-white">
              GitHub App
            </a>
            <a href={repoUrl} className="hover:text-white">
              Source repo
            </a>
            <a href="mailto:support@commitboy.dev" className="hover:text-white">
              Support
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>© {new Date().getFullYear()} Commitboy</span>
          </div>
        </div>
      </footer>

      {exitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="exit-card w-full max-w-lg rounded-2xl p-8 text-white relative">
            <button
              className="absolute right-4 top-4 text-slate-300 hover:text-white"
              onClick={() => setExitOpen(false)}
              aria-label="Close popup"
              type="button"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 text-sm text-slate-300 uppercase tracking-[0.3em]">
              <Shield size={16} />
              Free tier reminder
            </div>
            <h3 className="text-2xl font-semibold mt-4">
              Thinking about it? We have a free tier. No credit card.
            </h3>
            <p className="text-slate-300 mt-3">
              Add the GitHub app, watch it clean a real release, and decide later.
            </p>
            <a
              href={`https://github.com/apps/${appName}`}
              className="cta-button mt-6"
            >
              Try Commitboy free <ArrowRight size={18} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
